export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'doctor' | 'assistant' | 'admin';
  firstName: string;
  lastName: string;
  phone?: string;
  specialty?: string; // Pour les médecins
  createdAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  specialty?: string;
  bio?: string;
  avatar?: string;
}