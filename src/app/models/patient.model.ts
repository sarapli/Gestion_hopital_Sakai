export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
  insuranceInfo?: InsuranceInfo;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface MedicalHistory {
  allergies: string[];
  medications: string[];
  chronicConditions: string[];
  previousSurgeries: string[];
  familyHistory: string[];
  notes: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  validUntil: Date;
}
