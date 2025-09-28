import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp
} from '@angular/fire/firestore';
import { 
  Storage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable,
  percentage
} from '@angular/fire/storage';
import { 
  Messaging, 
  getToken, 
  onMessage 
} from '@angular/fire/messaging';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Interfaces pour les données
export interface FirestoreDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

export interface PaginationOptions {
  limit?: number;
  startAfter?: any;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private messagingToken = new BehaviorSubject<string | null>(null);

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private messaging: Messaging
  ) {
    this.initializeMessaging();
  }

  // ===== FIRESTORE OPERATIONS =====

  // Créer un document
  async createDocument<T extends FirestoreDocument>(
    collectionName: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.firestore, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erreur lors de la création du document dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Mettre à jour un document
  async updateDocument<T extends FirestoreDocument>(
    collectionName: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du document ${id} dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Supprimer un document
  async deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Erreur lors de la suppression du document ${id} dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Obtenir un document par ID
  async getDocument<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(this.firestore, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du document ${id} dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Obtenir tous les documents d'une collection
  async getCollection<T>(
    collectionName: string, 
    options?: PaginationOptions
  ): Promise<T[]> {
    try {
      let q = query(collection(this.firestore, collectionName));
      
      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }
      
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }
      
      if (options?.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Erreur lors de la récupération de la collection ${collectionName}:`, error);
      throw error;
    }
  }

  // Rechercher des documents avec des critères
  async searchDocuments<T>(
    collectionName: string,
    field: string,
    operator: any,
    value: any,
    options?: PaginationOptions
  ): Promise<T[]> {
    try {
      let q = query(
        collection(this.firestore, collectionName),
        where(field, operator, value)
      );
      
      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }
      
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.error(`Erreur lors de la recherche dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Écouter les changements en temps réel
  listenToCollection<T>(
    collectionName: string,
    options?: PaginationOptions
  ): Observable<T[]> {
    return new Observable(observer => {
      let q = query(collection(this.firestore, collectionName));
      
      if (options?.orderBy) {
        q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'));
      }
      
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        observer.next(documents);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  // Écouter un document spécifique
  listenToDocument<T>(collectionName: string, id: string): Observable<T | null> {
    return new Observable(observer => {
      const docRef = doc(this.firestore, collectionName, id);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          observer.next({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          observer.next(null);
        }
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  // Opérations par lot
  async batchWrite(operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id?: string;
    data?: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);
      
      operations.forEach(op => {
        switch (op.type) {
          case 'create':
            const docRef = doc(collection(this.firestore, op.collection));
            batch.set(docRef, {
              ...op.data,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
            break;
          case 'update':
            if (op.id) {
              const updateRef = doc(this.firestore, op.collection, op.id);
              batch.update(updateRef, {
                ...op.data,
                updatedAt: serverTimestamp()
              });
            }
            break;
          case 'delete':
            if (op.id) {
              const deleteRef = doc(this.firestore, op.collection, op.id);
              batch.delete(deleteRef);
            }
            break;
        }
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Erreur lors de l\'opération par lot:', error);
      throw error;
    }
  }

  // ===== STORAGE OPERATIONS =====

  // Uploader un fichier
  async uploadFile(
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const fileRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      if (onProgress) {
        percentage(uploadTask).subscribe(progress => {
          onProgress(progress.progress * 100);
        });
      }
      
      const snapshot = await uploadTask;
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  // Supprimer un fichier
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  // Obtenir l'URL de téléchargement
  async getDownloadUrl(path: string): Promise<string> {
    try {
      const fileRef = ref(this.storage, path);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'URL:', error);
      throw error;
    }
  }

  // ===== MESSAGING OPERATIONS =====

  private async initializeMessaging(): Promise<void> {
    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'your-vapid-key' // Remplacez par votre clé VAPID
      });
      this.messagingToken.next(token);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la messagerie:', error);
    }
  }

  // Obtenir le token de messagerie
  getMessagingToken(): Observable<string | null> {
    return this.messagingToken.asObservable();
  }

  // Écouter les messages en temps réel
  onMessage(): Observable<any> {
    return new Observable(observer => {
      const unsubscribe = onMessage(this.messaging, (payload) => {
        observer.next(payload);
      });
      return () => unsubscribe();
    });
  }

  // ===== UTILITAIRES =====

  // Convertir Timestamp en Date
  timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
  }

  // Convertir Date en Timestamp
  dateToTimestamp(date: Date): Timestamp {
    return Timestamp.fromDate(date);
  }

  // Générer un ID unique
  generateId(): string {
    return doc(collection(this.firestore, '_')).id;
  }
}
