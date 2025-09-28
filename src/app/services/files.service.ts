import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FirebaseService } from './firebase.service';

export interface FileUpload {
  file: File;
  path: string;
  metadata?: {
    contentType?: string;
    customMetadata?: { [key: string]: string };
  };
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  path: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
  uploadedBy: string;
  category: 'document' | 'image' | 'prescription' | 'report' | 'other';
  patientId?: string;
  appointmentId?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private readonly COLLECTION = 'files';

  constructor(private firebaseService: FirebaseService) {}

  // Uploader un fichier
  async uploadFile(
    fileUpload: FileUpload,
    onProgress?: (progress: number) => void
  ): Promise<UploadedFile> {
    try {
      // Uploader le fichier vers Firebase Storage
      const downloadUrl = await this.firebaseService.uploadFile(
        fileUpload.file,
        fileUpload.path,
        onProgress
      );

      // Créer l'enregistrement dans Firestore
      const uploadedFile: Omit<UploadedFile, 'id'> = {
        name: fileUpload.file.name,
        url: downloadUrl,
        path: fileUpload.path,
        size: fileUpload.file.size,
        contentType: fileUpload.file.type,
        uploadedAt: new Date(),
        uploadedBy: 'current-user-id', // À remplacer par l'ID de l'utilisateur connecté
        category: this.getFileCategory(fileUpload.file.type),
        description: ''
      };

      const fileId = await this.firebaseService.createDocument(this.COLLECTION, uploadedFile);

      return {
        id: fileId,
        ...uploadedFile
      };
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  // Uploader plusieurs fichiers
  async uploadMultipleFiles(
    fileUploads: FileUpload[],
    onProgress?: (overallProgress: number) => void
  ): Promise<UploadedFile[]> {
    const uploadedFiles: UploadedFile[] = [];
    let completed = 0;

    for (const fileUpload of fileUploads) {
      try {
        const uploadedFile = await this.uploadFile(fileUpload, (fileProgress) => {
          const overallProgressValue = ((completed + fileProgress) / fileUploads.length) * 100;
          if (onProgress) {
            onProgress(overallProgressValue);
          }
        });
        uploadedFiles.push(uploadedFile);
        completed++;
      } catch (error) {
        console.error(`Erreur lors de l'upload de ${fileUpload.file.name}:`, error);
        // Continuer avec les autres fichiers
      }
    }

    return uploadedFiles;
  }

  // Supprimer un fichier
  async deleteFile(fileId: string): Promise<void> {
    try {
      // Récupérer les informations du fichier
      const file = await this.firebaseService.getDocument<UploadedFile>(this.COLLECTION, fileId);
      if (!file) {
        throw new Error('Fichier non trouvé');
      }

      // Supprimer le fichier du Storage
      await this.firebaseService.deleteFile(file.path);

      // Supprimer l'enregistrement de Firestore
      await this.firebaseService.deleteDocument(this.COLLECTION, fileId);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  // Obtenir un fichier par ID
  async getFile(fileId: string): Promise<UploadedFile | null> {
    return await this.firebaseService.getDocument<UploadedFile>(this.COLLECTION, fileId);
  }

  // Obtenir tous les fichiers
  async getAllFiles(): Promise<UploadedFile[]> {
    return await this.firebaseService.getCollection<UploadedFile>(this.COLLECTION, {
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    });
  }

  // Obtenir les fichiers d'un patient
  async getPatientFiles(patientId: string): Promise<UploadedFile[]> {
    return await this.firebaseService.searchDocuments<UploadedFile>(
      this.COLLECTION,
      'patientId',
      '==',
      patientId,
      { orderBy: 'uploadedAt', orderDirection: 'desc' }
    );
  }

  // Obtenir les fichiers d'un rendez-vous
  async getAppointmentFiles(appointmentId: string): Promise<UploadedFile[]> {
    return await this.firebaseService.searchDocuments<UploadedFile>(
      this.COLLECTION,
      'appointmentId',
      '==',
      appointmentId,
      { orderBy: 'uploadedAt', orderDirection: 'desc' }
    );
  }

  // Obtenir les fichiers par catégorie
  async getFilesByCategory(category: UploadedFile['category']): Promise<UploadedFile[]> {
    return await this.firebaseService.searchDocuments<UploadedFile>(
      this.COLLECTION,
      'category',
      '==',
      category,
      { orderBy: 'uploadedAt', orderDirection: 'desc' }
    );
  }

  // Rechercher des fichiers
  async searchFiles(query: string): Promise<UploadedFile[]> {
    const files = await this.getAllFiles();
    const searchTerm = query.toLowerCase();
    
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm) ||
      file.description?.toLowerCase().includes(searchTerm) ||
      file.category.toLowerCase().includes(searchTerm)
    );
  }

  // Mettre à jour les métadonnées d'un fichier
  async updateFileMetadata(fileId: string, metadata: {
    description?: string;
    category?: UploadedFile['category'];
    patientId?: string;
    appointmentId?: string;
  }): Promise<void> {
    await this.firebaseService.updateDocument(this.COLLECTION, fileId, metadata);
  }

  // Obtenir l'URL de téléchargement
  async getDownloadUrl(fileId: string): Promise<string> {
    const file = await this.getFile(fileId);
    if (!file) {
      throw new Error('Fichier non trouvé');
    }
    return file.url;
  }

  // Générer un nom de fichier unique
  generateUniqueFileName(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${userId}_${timestamp}_${randomString}.${extension}`;
  }

  // Générer un chemin de fichier
  generateFilePath(category: UploadedFile['category'], fileName: string, patientId?: string): string {
    const basePath = `files/${category}`;
    if (patientId) {
      return `${basePath}/patients/${patientId}/${fileName}`;
    }
    return `${basePath}/${fileName}`;
  }

  // Valider le type de fichier
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // Valider la taille du fichier
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Obtenir la catégorie du fichier basée sur le type MIME
  private getFileCategory(contentType: string): UploadedFile['category'] {
    if (contentType.startsWith('image/')) {
      return 'image';
    } else if (contentType.includes('pdf') || contentType.includes('document')) {
      return 'document';
    } else if (contentType.includes('prescription') || contentType.includes('medical')) {
      return 'prescription';
    } else if (contentType.includes('report') || contentType.includes('analysis')) {
      return 'report';
    } else {
      return 'other';
    }
  }

  // Obtenir les statistiques des fichiers
  async getFileStats(): Promise<{
    total: number;
    totalSize: number;
    byCategory: { [key in UploadedFile['category']]: number };
    recentUploads: number;
  }> {
    const files = await this.getAllFiles();
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byCategory = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1;
      return acc;
    }, {} as { [key in UploadedFile['category']]: number });

    const recentUploads = files.filter(file => 
      file.uploadedAt >= lastWeek
    ).length;

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    return {
      total: files.length,
      totalSize,
      byCategory,
      recentUploads
    };
  }

  // Écouter les fichiers en temps réel
  listenToFiles(): Observable<UploadedFile[]> {
    return this.firebaseService.listenToCollection<UploadedFile>(this.COLLECTION, {
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    });
  }

  // Écouter les fichiers d'un patient en temps réel
  listenToPatientFiles(patientId: string): Observable<UploadedFile[]> {
    return this.firebaseService.listenToCollection<UploadedFile>(this.COLLECTION, {
      orderBy: 'uploadedAt',
      orderDirection: 'desc'
    }).pipe(
      map(files => files.filter(file => file.patientId === patientId))
    );
  }
}
