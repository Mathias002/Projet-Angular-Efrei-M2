# 📚 MangaCollection

Une application web moderne pour gérer et organiser votre collection de manga personnelle.

![Angular](https://img.shields.io/badge/Angular-20+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## 🎯 Présentation du projet

MangaCollection est une application full-stack permettant de cataloguer, organiser et suivre leur collection personnelle. L'application offre une interface fluide et responsive pour rechercher des mangas, créer des collections thématiques et gérer les volumes possédés.

### ✨ Fonctionnalités principales

- 📁 **Collections personnalisées** : Organisez vos manga par thèmes
- 📊 **Suivi des volumes** : Gérez les tomes que vous possédez
- 👤 **Gestion utilisateur** : Authentification sécurisée et profils personnalisés
- 📱 **Interface responsive** : Optimisée pour desktop et mobile
- 🎨 **Design moderne** : Interface utilisateur optimisé avec Tailwind CSS

### 🛠️ Stack technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | Angular | 20+ |
| **Backend** | NestJS | 11.0.10 |
| **Base de données** | MongoDB | 1.46.11 |
| **Langage** | TypeScript | Latest |
| **Styling** | Tailwind CSS | Latest |
| **API externe** | Jikan API | v4 |
| **Authentification** | JWT | - |

---

## 🚀 Backend - API NestJS + MongoDB

Le backend utilise NestJS avec MongoDB pour fournir une API RESTful robuste et sécurisée.

### 📂 Architecture backend

```
src/
├── auth/                 # Module d'authentification
│   ├── controllers       # Contrôleurs auth (login, register)
│   ├── services          # Services d'authentification JWT
│   ├── dto               # Data Transfer Objects
│   ├── JWT               # Strategie JWT
│   ├── decorator         # Protection des routes via le role
│   └── guards            # Guards et stratégies JWT
├── collections/          # Module de gestion des collections
│   ├── dto               # Data Transfer Objects
│   ├── schemas           # Schémas MongoDB (Collection)
│   ├── controllers       # CRUD collections et autres methodes
│   └── services          # Logique métier collections
├── mangas/               # Module de gestion des mangas
│   ├── dto               # Data Transfer Objects
│   ├── schemas           # Schémas MongoDB (MangaInfo)
│   ├── controllers       # Methode de récupération des mangas
│   └── services          # Logique métier mangas
└── users/                # Module de gestion des utilisateurs
    ├── dto               # Data Transfer Objects
    ├── schemas           # Schémas MongoDB (User)
    ├── controllers       # CRUD utilisateurs
    └── services          # Logique métier utilisateurs
```

### 🔐 Fonctionnalités backend

#### Authentification & Sécurité
- **JWT** pour l'authentification stateless
- **Hachage bcrypt** pour les mots de passe
- **Guards** pour la protection des routes
- **Rôles utilisateur** (admin, user)

#### API Endpoints

**Authentification**
- `POST /auth/register` - Inscription utilisateur
- `POST /auth/login` - Connexion utilisateur

**Manga**
- `GET /mangas` - Récupère tous les mangas disponibles sur l'API
- `POST /mangas/:id` - Récupère les détails d'un manga

**Collections**
- `GET /collections/user/:userId` - Collections d'un utilisateur
- `GET /collections/` - Toutes les Collections active
-  `GET /collections/:id` - Détails d'un collection
- `POST /collections` - Créer une collection
- `PUT /collections/:id` - Modifier une collection
- `DELETE /collections/:id` - Supprimer une collection
- `POST /collections/:id/add-manga` - Ajouter un manga
- `PUT /collections/:id/update-manga/:mangaId` - Modifier un manga
- `DELETE /collections/:id/delete-manga/:mangaId` - Supprimer un manga

**Administration**
- `GET /users` - Liste des utilisateurs
- `GET /users/:id` - Détails utilisateur
- `CREATE /users/:id` - Créer un utilisateur
- `DELETE /users/:id` - Supprimer utilisateur
- `PUT /users/:id` - Met à jour un utilisateur

### 🗄️ Modèles de données

**Utilisateur**
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string (hashed),
  role: 'user' | 'admin',
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date
}
```

**Collection**
```typescript
{
  _id: ObjectId,
  name: string,
  description?: string,
  userId: ObjectId,
  mangas: [{
    idManga: number,
    tomesPossedes: number[]
  }],
  createdAt: Date,
  updatedAt: Date,
  deletedAt?: Date
}
```

---

## 🎨 Frontend - Angular TypeScript

Le frontend Angular offre une interface utilisateur moderne et réactive avec une architecture DDD (Domain-Driven Design).

### 📂 Architecture frontend

```
src/app/
├── core/                        # Services core, intercepteurs globaux
├── features/               
│  ├── admin/                    # Module d'administration
│  │   ├── components/           # Gestion utilisateurs
│  │   ├── models/               # Interfaces admin
│  │   └── services/             # AdminService
│  ├── auth/                     # Module d'authentification
│  │   ├── components/           # Login, Register
│  │   ├── guards/               # Guards d'accès
│  │   ├── interceptors/         # Intercepteurs HTTP
│  │   ├── models/               # Interfaces utilisateur, payload Request et Response
│  │   └── services/             # AuthService
│  ├── collections/              # Module des collections
│  │   ├── components/           # CRUD collections, gestion manga
│  │   ├── models/               # Interfaces collection, Request, Response 
│  │   └── services/             # CollectionService
│  ├── mangas/                   # Module de gestion des mangas
│  │   ├── components/           # Liste, détails, modals
│  │   ├── models/               # Interfaces manga, Request, Response
│  │   └── services/             # MangaService (Jikan API)
│  └── profile/                  # Module profil utilisateur
│      ├── components/           # Gestion profil, préférences
│      ├── models/               # Interfaces profil, Request, Response
│      └── services/             # ProfileService
├── infrastructure/              # Config, providers techniques
└── shared/                      # Éléments partagés
    ├── components/              # Navbar, BackToTop, etc.
    ├── directives/              # Directives réutilisables
    ├── pipes/                   # Pipes utilitaires
    └── services/                # Services utilitaires

```

### 🔧 Outils et configuration

**Développement**
- **ESLint** : Analyse statique du code
- **Prettier** : Formatage automatique
- **TypeScript** : Typage statique strict
- **Angular CLI** : Outils de développement

**Styling**
- **Tailwind CSS** : Framework CSS utilitaire
- **Angular Material** : Composants UI (Paginator)
- **Design responsive** : Mobile friendly approach

### ⚡ Fonctionnalités frontend

#### Interface utilisateur
- **Navigation adaptative** : Menu différent selon l'état de connexion
- **Pagination intelligente** : Navigation optimisée dans les résultats
- **Modals interactives** : Création/édition avec validation
- **États de chargement** : Indicateurs visuels et gestion d'erreurs

#### Gestion d'état
- **Services réactifs** : Observables RxJS pour la réactivité
- **Cache intelligent** : Mise en cache des données des mangas
- **Intercepteurs HTTP** : Injection automatique des tokens JWT
- **Guards de navigation** : Protection des routes selon les permissions

#### Composants clés

**Authentification**
- `LoginComponent` : Formulaire de connexion avec validation
- `RegisterComponent` : Inscription avec confirmation mot de passe
- `AuthGuard` / `NoAuthGuard` : Protection des routes

**Manga**
- `MangaListComponent` : Grille des mangas
- `MangaDetailsModalComponent` : Détails partiel d'un manga
- `AddMangaToCollectionModalComponent` : Ajout à une collection

**Collections**
- `CollectionsComponent` : CRUD collections avec aperçu manga
- Modals de gestion des tomes possédés
- Affichage miniatures et statistiques

**Administration**
- `AdminComponent` : Interface de gestion des utilisateurs
- Protection contre suppression d'administrateurs
- Modals de confirmation pour actions critiques

**Partagés**
- `NavbarComponent` : Navigation adaptative avec menu utilisateur
- `BackToTopComponent` : Retour en haut de page animé

---

## 🌐 API Externe - Jikan (MyAnimeList)

L'application utilise l'API Jikan v4 pour récupérer les données des mangas depuis MyAnimeList.

### 🔗 Intégration Jikan API

**URL de base** : `https://api.jikan.moe/v4/`

**Endpoints utilisés**
- `GET /manga` - Recherche et liste des manga
- `GET /manga/{id}` - Détails d'un manga spécifique

### 📊 Paramètres de recherche supportés (Pas encore implémenté)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `q` | string | Recherche textuelle |
| `type` | enum | manga, novel, lightnovel, oneshot, doujin, manhwa, manhua |
| `status` | enum | publishing, complete, hiatus, discontinued, upcoming |
| `genres` | string | IDs des genres (séparés par virgules) |
| `genres_exclude` | string | IDs des genres à exclure |
| `order_by` | enum | title, start_date, score, popularity, etc. |
| `sort` | enum | asc, desc |
| `min_score` / `max_score` | number | Filtrage par note |
| `start_date` / `end_date` | date | Filtrage par dates de publication |
| `sfw` | boolean | Contenu tout public uniquement |

### 🚦 Gestion API

**Limitations**
- Rate limiting respecté (3 requêtes/seconde max)
- Gestion des erreurs 429 (trop de requêtes)
- Cache intelligent pour éviter les requêtes répétées

**Fiabilité**
- Détection automatique de l'indisponibilité API
- Interface dégradée en cas d'erreur
- Messages d'erreur utilisateur clairs
- Système de retry automatique

---

## 🔮 Axes d'amélioration et évolutions

### 📈 Améliorations techniques

**Backend**
- [ ] Mise en place de Redis pour la cache
- [ ] Tests unitaires et d'intégration (Jest)
- [ ] Documentation Swagger/OpenAPI
- [ ] Monitoring et métriques (Prometheus)
- [ ] Rate limiting par utilisateur

**Frontend**
- [ ] Tests unitaires (Jasmine/Karma)
- [ ] Tests end-to-end (Cypress)
- [ ] PWA (Progressive Web App)
- [ ] Internationalisation (i18n)
- [ ] Optimisation des performances (OnPush)
- [ ] Lazy loading des modules

### 🚀 Nouvelles fonctionnalités

**Expérience utilisateur**
- [ ] **Système de recommandations** basé sur les goûts
- [ ] **Partage de collections** entre utilisateurs
- [ ] **Wishlist** de manga à acquérir
- [ ] **Suivi de lecture** (chapitres lus, statut)
- [ ] **Statistiques** personnalisées (graphiques, tendances)
- [ ] **Import/Export** de collections
- [ ] **Recherche avancée** via les paramètres fourni par l'API Jikan

**Fonctionnalités sociales**
- [ ] **Profils publics** d'utilisateurs
- [ ] **Système d'amis** et abonnements
- [ ] **Commentaires et notes** personnels
- [ ] **Collections collaboratives**
- [ ] **Forum** de discussion par manga

**Intégrations**
- [ ] **API manga supplémentaires** (AniList, Kitsu)
- [ ] **Synchronisation** avec d'autres plateformes
- [ ] **Scan de codes-barres** pour ajout rapide

### 🛠️ Infrastructure

**Sécurité**
- [ ] **2FA** (authentification à deux facteurs)
- [ ] **Audit des permissions**
- [ ] **Chiffrement** des données sensibles
- [ ] **RGPD** compliance complète

---

## 🎯 Conclusion

MangaCollection fut un projet très instructif dans le cadre du module Angular proposé. J'ai appris à utiliser les Signals, les directives, les pipes, à construire un projet en suivant l'architecture DDD (Domain-Driven Design) et lier trois composants (Frontend - Backend - API Jikan) en une application finale fonctionnelle. 

J'ai apprécié travailler sur ce projet et compte le recommencer pour le rendre encore meilleure car la contrainte de temps m'a empêché de faire ce que je souhaitais vraiment réaliser.

### Points forts du projet

✅ **Architecture moderne** avec séparation claire frontend/backend  
✅ **Sécurité** avec authentification JWT et validation des données  
✅ **Interface intuitive** adaptée aux différents appareils  
✅ **Extensibilité** grâce à l'architecture modulaire  
✅ **Intégration API** fiable avec gestion d'erreurs avancée  

### Prochaines étapes

L'application dispose d'une base solide permettant l'ajout de nombreuses fonctionnalités avancées. Les axes d'amélioration identifiés permettront d'enrichir l'expérience utilisateur et de faire évoluer le projet vers une plateforme communautaire complète.

---

*Développé avec ❤️ par Mathias002 (◍•ᴗ•◍)*
