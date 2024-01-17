# Débuter

## En local

### .git

1. Supprimer le dossier .git : `rm -rf .git`
2. Recréer le dossier git : `git init`

### Installer les dépendances

1. En terminal : `pnpm install`

### Gestion de la base de donnée <sub><sup>_(uniquement en local)_</sup></sub>

#### a) Création de la base de donnée (local)

1. En terminal : `CREATE DATABASE ma_base_de_donnees;`
2. Vérifier la création de la BDD : `\l`

#### b) Prisma (local)

1. Modifier la variable d'environnement `PROJECT_NAME` dans le fichier `.env` avec la valeur du nom de la BDD `ma_base_de_donnees`
2. Générer Prisma : `pnpm prisma generate`
3. Créer une première migration : `pnpm prisma migrate dev --name init`

#### c) Modifier toutes les variables d'environnements


### Deployer le projet

---

## Local, ou server

### Initialiser le projet

1. Lancer le projet et se rendre sur la page d'accueil `/`
2. Créer un compte admin
3. Modifier les informations du projet (nom, description, etc...)
4. Se rendre sur la page d'administration `/admin`
5. Modifier vos clés API (Stripe, Mailjet, Google, etc...)

## *Libraries* :

- Typage : `TypeScript` & `zod`
- Gestion des dates : `day.js`
- Éditeur de texte : `Editor.js`
- Hooks personnalisés : `react-use`
- Stores/Contexts : `Zustand`
- Upload/Gestion d'upload : `Filepond`
- UI/UX (sortable/drag&drop/masonry...) : `Muuri`
- Gestion des cookies : `js-cookie`
- Gestion des formulaires : `react-hook-form`
- Gestion des queries : `tanstack/react-query`
- Charts et graphiques : `recharts`
- Icones : `lucide`
- Gestion des PDF (création, modification, lecture, téléchargement) : `react-pdf`
- Toasts : `react-toastify`
- Animations : `framer-motion`

## *Services* : 

- Gestion de la BDD : `Prisma` & `PostgreSQL` & `supabase` 
- Déployer le projet : `Vercel`
- Gestion des emails : `Mailjet`


