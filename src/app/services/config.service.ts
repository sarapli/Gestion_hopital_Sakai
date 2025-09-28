import { Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';

export interface AppConfig {
  // Configuration générale
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
  
  // Configuration des rendez-vous
  appointmentSettings: {
    defaultDuration: number; // en minutes
    maxAdvanceBooking: number; // en jours
    minAdvanceBooking: number; // en heures
    workingHours: {
      start: string; // format HH:mm
      end: string; // format HH:mm
    };
    workingDays: number[]; // 0 = dimanche, 1 = lundi, etc.
  };

  // Configuration des notifications
  notificationSettings: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    reminderTime: number; // en minutes avant le rendez-vous
  };

  // Configuration des fichiers
  fileSettings: {
    maxFileSize: number; // en MB
    allowedTypes: string[];
    maxFilesPerUpload: number;
  };

  // Configuration de sécurité
  securitySettings: {
    sessionTimeout: number; // en minutes
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
  };

  // Configuration des thèmes
  themeSettings: {
    defaultTheme: 'light' | 'dark' | 'medical';
    availableThemes: string[];
    customColors: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };

  // Configuration des fonctionnalités
  features: {
    videoConsultation: boolean;
    onlinePayment: boolean;
    documentGeneration: boolean;
    analytics: boolean;
    multiLanguage: boolean;
  };

  // Configuration des intégrations
  integrations: {
    paymentGateway: {
      enabled: boolean;
      provider: 'stripe' | 'paypal' | 'none';
      publicKey?: string;
    };
    emailService: {
      enabled: boolean;
      provider: 'sendgrid' | 'mailgun' | 'smtp';
      apiKey?: string;
    };
    smsService: {
      enabled: boolean;
      provider: 'twilio' | 'nexmo' | 'none';
      apiKey?: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly CONFIG_COLLECTION = 'app_config';
  private readonly CONFIG_DOC_ID = 'main';

  public config = signal<AppConfig>(this.getDefaultConfig());
  public isLoading = signal(false);

  constructor(private firebaseService: FirebaseService) {
    this.loadConfig();
  }

  // Charger la configuration depuis Firebase
  async loadConfig(): Promise<void> {
    this.isLoading.set(true);
    try {
      const config = await this.firebaseService.getDocument<AppConfig>(
        this.CONFIG_COLLECTION, 
        this.CONFIG_DOC_ID
      );
      
      if (config) {
        this.config.set({ ...this.getDefaultConfig(), ...config });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      // Utiliser la configuration par défaut en cas d'erreur
    } finally {
      this.isLoading.set(false);
    }
  }

  // Sauvegarder la configuration
  async saveConfig(config: Partial<AppConfig>): Promise<void> {
    try {
      const currentConfig = this.config();
      const updatedConfig = { ...currentConfig, ...config };
      
      await this.firebaseService.updateDocument(
        this.CONFIG_COLLECTION, 
        this.CONFIG_DOC_ID, 
        updatedConfig
      );
      
      this.config.set(updatedConfig);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la configuration:', error);
      throw error;
    }
  }

  // Obtenir une valeur de configuration spécifique
  getConfigValue<T>(path: string): T | undefined {
    const config = this.config();
    return this.getNestedValue(config, path);
  }

  // Mettre à jour une valeur de configuration spécifique
  async updateConfigValue<T>(path: string, value: T): Promise<void> {
    const currentConfig = this.config();
    const updatedConfig = this.setNestedValue(currentConfig, path, value);
    await this.saveConfig(updatedConfig);
  }

  // Configuration par défaut
  private getDefaultConfig(): AppConfig {
    return {
      appName: 'Sakai-NG Gestion Hôpital',
      version: '1.0.0',
      environment: 'development',
      
      appointmentSettings: {
        defaultDuration: 30,
        maxAdvanceBooking: 90,
        minAdvanceBooking: 2,
        workingHours: {
          start: '08:00',
          end: '18:00'
        },
        workingDays: [1, 2, 3, 4, 5] // Lundi à Vendredi
      },

      notificationSettings: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        reminderTime: 30
      },

      fileSettings: {
        maxFileSize: 10, // 10 MB
        allowedTypes: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        maxFilesPerUpload: 5
      },

      securitySettings: {
        sessionTimeout: 480, // 8 heures
        maxLoginAttempts: 5,
        passwordMinLength: 8,
        requireEmailVerification: true
      },

      themeSettings: {
        defaultTheme: 'medical',
        availableThemes: ['light', 'dark', 'medical'],
        customColors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#F59E0B'
        }
      },

      features: {
        videoConsultation: true,
        onlinePayment: true,
        documentGeneration: true,
        analytics: true,
        multiLanguage: false
      },

      integrations: {
        paymentGateway: {
          enabled: false,
          provider: 'none'
        },
        emailService: {
          enabled: true,
          provider: 'smtp'
        },
        smsService: {
          enabled: false,
          provider: 'none'
        }
      }
    };
  }

  // Obtenir une valeur imbriquée dans un objet
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Définir une valeur imbriquée dans un objet
  private setNestedValue(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  }

  // Méthodes utilitaires
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config().features[feature];
  }

  getWorkingHours(): { start: string; end: string } {
    return this.config().appointmentSettings.workingHours;
  }

  getWorkingDays(): number[] {
    return this.config().appointmentSettings.workingDays;
  }

  getMaxFileSize(): number {
    return this.config().fileSettings.maxFileSize;
  }

  getAllowedFileTypes(): string[] {
    return this.config().fileSettings.allowedTypes;
  }

  isWorkingDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return this.getWorkingDays().includes(dayOfWeek);
  }

  isWorkingHour(time: Date): boolean {
    const timeString = time.toTimeString().slice(0, 5);
    const { start, end } = this.getWorkingHours();
    return timeString >= start && timeString <= end;
  }

  // Réinitialiser la configuration
  async resetConfig(): Promise<void> {
    await this.saveConfig(this.getDefaultConfig());
  }
}
