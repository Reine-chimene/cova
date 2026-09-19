# COVA Task Manager

Application web full-stack de gestion de tâches, réalisée dans le cadre d’un test technique COVA.

**Dépôt :** https://github.com/Reine-chimene/cova

---

## Présentation

COVA Task Manager permet à chaque utilisateur de s’inscrire, de se connecter via JWT, puis de gérer ses propres tâches (création, consultation, modification, suppression, filtrage et recherche). L’interface est en **français**.

---

## Fonctionnalités

### Authentification
- Inscription (`POST /api/auth/register`)
- Connexion avec émission d’un JWT (`POST /api/auth/login`)
- Stockage du token côté client (`localStorage`, clé `taskmanager_token`)
- Routes frontend protégées (`/dashboard`)

### Tâches
- Liste des tâches de l’utilisateur connecté
- Création, modification et suppression de tâches
- Statuts : `TODO`, `IN_PROGRESS`, `DONE`
- Filtrage par statut (`GET /api/tasks?status=TODO`)
- Recherche client par titre et description
- Gestion des erreurs API (401, 400, 404, réseau, etc.)

### Sécurité des données
- Un utilisateur **ne voit et ne modifie que ses propres tâches**
- Les opérations `PUT` / `DELETE` utilisent `findByIdAndUser` côté backend
- Mots de passe hashés avec **BCrypt**

---

## Technologies

| Couche | Stack |
|--------|--------|
| Backend | Java 21, Spring Boot 4.1.1, Spring Security, Spring Data JPA, JWT (JJWT 0.12.6), MySQL |
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS 4, React Router |
| Base de données | MySQL 8.0 (Docker Compose) |
| Build / tests | Maven Wrapper (`./mvnw`), Vitest (smoke test frontend) |

---

## Architecture

```
┌─────────────────────┐
│  Frontend React     │  frontend/  (Vite, port dev par défaut 3020)
│  /login /register   │
│  /dashboard         │
└──────────┬──────────┘
           │  HTTP REST + JWT (Authorization: Bearer …)
           │  En dev : proxy Vite /api → localhost:8080
           ▼
┌─────────────────────┐
│  API Spring Boot    │  src/main/java  (port 8080)
│  /api/auth/*        │
│  /api/tasks/*       │
└──────────┬──────────┘
           │  Spring Data JPA / Hibernate
           ▼
┌─────────────────────┐
│  MySQL 8            │  docker-compose.yml (port 3306)
│  base taskmanager   │
└─────────────────────┘
```

---

## Structure du projet

Le backend est à la **racine** du dépôt ; le frontend est dans `frontend/`.

```
cova-taskmanager/
├── docker-compose.yml          # MySQL local
├── pom.xml
├── mvnw / mvnw.cmd
├── src/
│   ├── main/java/com/cova/taskmanager/
│   │   ├── controller/         # AuthController, TaskController
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/           # JWT, SecurityConfig, filtres
│   │   └── exception/
│   ├── main/resources/
│   │   └── application.yml
│   └── test/java/              # 19 tests JUnit
└── frontend/
    ├── src/
    │   ├── pages/              # Login, Register, Dashboard
    │   ├── components/
    │   ├── services/           # api, auth, tasks
    │   └── ...
    ├── vite.config.ts
    ├── package.json
    └── .env.example
```

---

## Prérequis

- **JDK 21**
- **Maven** (ou utilisation du wrapper `./mvnw`)
- **Node.js** 20+ et **npm**
- **Docker** et **Docker Compose** (pour MySQL)

---

## Installation

### 1. Cloner le dépôt

```bash
git clone git@github.com:Reine-chimene/cova.git
cd cova
```

### 2. MySQL avec Docker Compose

```bash
docker compose up -d
```

Paramètres utilisés par le projet (développement local) :

| Paramètre | Valeur |
|-----------|--------|
| Hôte | `localhost` |
| Port | `3306` |
| Base | `taskmanager` |
| Utilisateur | `taskmanager` |
| Mot de passe | `taskmanager` |
| Conteneur | `taskmanager-mysql` |

Ces identifiants sont alignés avec `src/main/resources/application.yml` et `docker-compose.yml`.

### 3. Backend

Aucune installation Maven globale requise si vous utilisez le wrapper :

```bash
./mvnw test
```

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optionnel en dev (voir ci-dessous)
```

---

## Configuration

### Backend — JWT

Dans `application.yml` :

```yaml
jwt:
  secret: ${JWT_SECRET:development-secret-change-this-in-production-must-be-long-enough}
  expiration: 86400000   # 24 h en millisecondes
```

En production, définir une variable d’environnement **`JWT_SECRET`** (longueur suffisante pour HS256, ≥ 32 caractères).

### Frontend — URL de l’API

Fichier `frontend/.env.example` :

```env
VITE_API_URL=http://localhost:8080
```

- **Développement recommandé :** laisser `VITE_API_URL` vide dans `frontend/.env` pour utiliser le **proxy Vite** (`/api` → `http://localhost:8080`), configuré dans `frontend/vite.config.ts`.
- **Build / preview avec API distante :** renseigner `VITE_API_URL=http://localhost:8080` (nécessite que le backend autorise les requêtes cross-origin si le frontend n’est pas servi via le même proxy).

Le fichier `frontend/.env` est **ignoré par Git** ; ne pas committer de secrets.

---

## Lancement

### Terminal 1 — Base de données

```bash
docker compose up -d
```

### Terminal 2 — API

```bash
./mvnw spring-boot:run
```

API disponible sur **http://localhost:8080**

### Terminal 3 — Interface

```bash
cd frontend
npm run dev
```

Vite affiche l’URL locale (port par défaut configuré **3020**, avec bascule automatique si le port est occupé). Ouvrir l’URL indiquée dans le terminal (ex. `http://localhost:3020`).

---

## Tests

### Backend (19 tests)

```bash
./mvnw test
```

Couverture principale : JWT, authentification, CRUD tâches, isolation par utilisateur.

### Frontend

```bash
cd frontend
npm run build          # compilation TypeScript + build Vite
npx vitest run src/smoke.test.tsx   # test smoke (optionnel)
```

Scripts npm disponibles : `dev`, `build`, `lint` (oxlint), `preview`.

---

## API — Endpoints principaux

Base URL : `http://localhost:8080`

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/register` | Non | Inscription |
| POST | `/api/auth/login` | Non | Connexion → JWT |
| GET | `/api/tasks` | Oui | Liste des tâches (query optionnelle `?status=TODO`) |
| POST | `/api/tasks` | Oui | Création |
| PUT | `/api/tasks/{id}` | Oui | Modification |
| DELETE | `/api/tasks/{id}` | Oui | Suppression |

### Authentification JWT

1. `POST /api/auth/login` avec `{ "email", "password" }`
2. Réponse : `{ "accessToken", "tokenType": "Bearer", "email" }`
3. Requêtes protégées : en-tête `Authorization: Bearer <accessToken>`

Routes publiques : `POST /api/auth/register`, `POST /api/auth/login`.  
Routes protégées : `/api/tasks/**`.

---

## Choix techniques

- **JWT stateless** + filtre `OncePerRequestFilter` pour l’API REST
- **DTOs** côté API (pas d’exposition directe des entités JPA)
- **BCrypt** pour les mots de passe
- **Proxy Vite** en dev pour éviter les problèmes CORS sans modifier le backend
- **Couche services** frontend centralisée (`api.ts`, `authService.ts`, `taskService.ts`)
- **Tests d’intégration** backend avec MockMvc et MySQL réel (Docker)

---

## Captures d’écran

Aucune capture d’écran n’est incluse dans le dépôt à ce stade. Vous pouvez en ajouter dans un dossier `docs/screenshots/` et les référencer ici si nécessaire.

---

## Sécurité — notes pour le recruteur

- Les identifiants MySQL du **docker-compose** et `application.yml` sont des **valeurs de développement local** uniquement.
- Ne pas utiliser le secret JWT par défaut en production : définir `JWT_SECRET`.
- Le dépôt ignore `frontend/.env`, `node_modules/`, `target/`, et les artefacts de build.

---

## Auteur

**Reine Chimene**  
GitHub : [@Reine-chimene](https://github.com/Reine-chimene)

---

## Licence

Projet réalisé dans le cadre d’un test technique. Usage et licence à préciser selon les consignes du recruteur.
