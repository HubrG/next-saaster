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
2. En CLI : `pnpm prisma generate`
3. Puis : `pnpm prisma migrate dev --name init`

### Deployer le projet

---

## Local, ou server

### Initialiser le projet

1. Lancer le projet et se rendre sur la page d'accueil `/` 
2. Créer un compte admin
3. Se rendre sur la page d'administration `/admin`
4. Modifier vos clés API (Stripe, Mailjet, Google, etc...)