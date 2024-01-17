# Get started

## Configure locally

### 1. .git

1. Delete the .git folder: `rm -rf .git`
2. Recreate the git folder: `git init`

### 2. .env

1. Create a `.env` file at the root of the project
2. Copy the contents of the `.env.example` file into the `.env` file and fill the fields

### 3. next.config.js

1. Modify the host of your asset manager (example: cloudinary) in the `next.config.js` file

### 4. Install dependencies

1. In terminal: `pnpm install`

### 5. Creation of the database (local)

1. In terminal: `CREATE DATABASE my_database;`
2. Check the creation of the database: `\l`
3. Modify the `PROJECT_NAME` environment variable in the `.env` file with the value of the database name `my_database`
4. Generate Prisma: `pnpm prisma generate`
5. Create a first migration: `pnpm prisma migrate dev --name init`

### 6. Modify all environment variables

### 7. Deploy the project

---

## Lunch the project on local, and server

### Initialization of the project

1. Launch the project and go to the home page `/`
2. Create an admin account
3. Edit project information (name, description, etc.)
4. Go to the `/admin` administration page
5. Change your API keys (Stripe, Mailjet, Google, etc...)

## ℹ️ Libraries used

- Typing: `TypeScript` & `zod`
- Date format : `day.js`
- Text editor: `Editor.js`
- Custom hooks: `react-use`
- Stores/Contexts: `Zustand`
- Upload/Upload management: `Filepond`
- UI/UX (sortable/drag&drop/masonry...): `Muuri`
- Cookie management: `js-cookie`
- Form management: `react-hook-form`
- Query management: `tanstack/react-query`
- Charts and graphs: `recharts`
- Icons: `lucide`
- PDF management (creation, modification, reading, downloading): `react-pdf`
- Toasts: `react-toastify`
- Animations: `framer-motion`

## ℹ️ Services used :

- Database management: `Prisma` & `PostgreSQL` 
- Deploy the project: `Vercel`
- Email management: `Mailjet`
- Assets management: `Cloudinary`
