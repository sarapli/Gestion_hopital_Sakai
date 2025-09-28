import { Injectable, signal } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset
} from '@angular/fire/auth';
import { 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User as AppUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<AppUser | null>(null);
  public user$ = this.userSubject.asObservable();
  public isAuthenticated = signal(false);
  public currentUser = signal<AppUser | null>(null);

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        const appUser = await this.getUserData(user.uid);
        this.userSubject.next(appUser);
        this.currentUser.set(appUser);
        this.isAuthenticated.set(true);
      } else {
        this.userSubject.next(null);
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
      }
    });
  }

  async signUp(email: string, password: string, userData: Partial<AppUser>): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour le profil Firebase
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Créer le document utilisateur dans Firestore
      const userDoc: AppUser = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || '',
        role: userData.role || 'assistant',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone,
        specialty: userData.specialty,
        createdAt: new Date(),
        isActive: true
      };

      await setDoc(doc(this.firestore, 'users', user.uid), userDoc);
      
      this.currentUser.set(userDoc);
      this.isAuthenticated.set(true);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour la dernière connexion
      await this.updateLastLogin(user.uid);
      
      const appUser = await this.getUserData(user.uid);
      this.currentUser.set(appUser);
      this.isAuthenticated.set(true);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  private async getUserData(uid: string): Promise<AppUser | null> {
    try {
      const userDoc = await getDoc(doc(this.firestore, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as AppUser;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }

  private async updateLastLogin(uid: string): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', uid), {
        lastLoginAt: new Date()
      }, { merge: true });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dernière connexion:', error);
    }
  }

  async updateUserProfile(uid: string, profileData: Partial<AppUser>): Promise<void> {
    try {
      await setDoc(doc(this.firestore, 'users', uid), profileData, { merge: true });
      
      // Mettre à jour l'utilisateur actuel
      const updatedUser = await this.getUserData(uid);
      this.currentUser.set(updatedUser);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'admin';
  }

  canAccess(requiredRole: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    
    const roleHierarchy = { admin: 3, doctor: 2, assistant: 1 };
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de réinitialisation:', error);
      throw error;
    }
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    try {
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      console.error('Erreur lors de la confirmation de réinitialisation:', error);
      throw error;
    }
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}