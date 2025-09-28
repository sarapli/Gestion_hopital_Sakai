# Essaie Sakai - Projet Angular

Un projet Angular moderne avec toutes les dépendances essentielles pour le développement d'applications web.

## 🚀 Fonctionnalités

- **Angular 17** - Framework principal
- **PrimeNG** - Composants UI complets
- **Angular Material** - Composants Material Design
- **Bootstrap 5** - Framework CSS
- **Chart.js** - Graphiques et visualisations
- **ngx-toastr** - Notifications toast
- **ngx-spinner** - Indicateurs de chargement
- **ngx-pagination** - Pagination
- **ngx-quill** - Éditeur de texte riche
- **Socket.io** - Communication temps réel
- **Moment.js** - Manipulation des dates
- **Lodash** - Utilitaires JavaScript
- **UUID** - Génération d'identifiants uniques

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/          # Composants Angular
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── dashboard/
│   ├── services/            # Services Angular
│   │   ├── api.service.ts
│   │   ├── auth.service.ts
│   │   └── notification.service.ts
│   ├── models/              # Modèles TypeScript
│   │   ├── user.model.ts
│   │   └── api-response.model.ts
│   ├── guards/              # Guards de routage
│   ├── interceptors/        # Intercepteurs HTTP
│   ├── pipes/               # Pipes personnalisés
│   ├── directives/          # Directives personnalisées
│   ├── app.component.*
│   ├── app.module.ts
│   └── app-routing.module.ts
├── assets/                  # Ressources statiques
│   ├── images/
│   └── icons/
├── environments/            # Configuration d'environnement
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss
```

## 🛠️ Installation

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement :**
   ```bash
   npm start
   ```

3. **Ouvrir l'application :**
   Naviguez vers `http://localhost:4200`

## 📦 Scripts disponibles

- `npm start` - Démarre le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run watch` - Compile en mode watch
- `npm test` - Lance les tests unitaires
- `npm run e2e` - Lance les tests end-to-end

## 🎨 Composants inclus

### Composants de base
- **Header** - Barre de navigation principale
- **Footer** - Pied de page
- **Sidebar** - Menu de navigation latéral
- **Dashboard** - Tableau de bord avec statistiques

### Services
- **ApiService** - Service pour les appels API
- **AuthService** - Gestion de l'authentification
- **NotificationService** - Gestion des notifications

## 🔧 Configuration

### Variables d'environnement
- `environment.ts` - Configuration de développement
- `environment.prod.ts` - Configuration de production

### Thème
Le projet utilise PrimeNG avec le thème Saga Blue par défaut. Vous pouvez changer le thème dans `angular.json`.

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🌐 Internationalisation

Le projet est configuré pour le français par défaut. Les traductions PrimeNG sont configurées dans `app.component.ts`.

## 🚀 Déploiement

1. **Build de production :**
   ```bash
   npm run build
   ```

2. **Les fichiers de production sont dans le dossier `dist/`**

## 📝 Notes

- Assurez-vous d'avoir Node.js 18+ installé
- Le projet utilise TypeScript strict mode
- Tous les composants utilisent SCSS pour le styling
- Les services sont injectables et peuvent être utilisés dans toute l'application

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
