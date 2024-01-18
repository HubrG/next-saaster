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

- Typing: [TypeScript](https://github.com/microsoft/TypeScript) & [zod](https://github.com/colinhacks/zod)
- Auth management: [next-auth](https://github.com/nextauthjs/next-auth)
- Date format : [day.js](https://github.com/iamkun/dayjs)
- Text editor: [editor.js](https://github.com/editor-js/awesome-editorjs)
- Custom hooks: [react-use](https://github.com/streamich/react-use)
- Stores/Contexts: [zustand](https://github.com/pmndrs/zustand)
- Upload/Upload management: [filepond](https://github.com/pqina/react-filepond)
- UI/UX (sortable/drag&drop/masonry...): [muuri](https://github.com/haltu/muuri)
- Cookie management: [js-cookie](https://www.npmjs.com/package/js-cookie)
- Form management: [react-hook-form](https://github.com/react-hook-form/react-hook-form)
- Query management: [tanstack/react-query](https://github.com/TanStack/query) 
- Charts and graphs: [recharts](https://github.com/recharts/recharts)
- Icons: [lucide icons](https://github.com/lucide-icons/lucide)
- PDF management (creation, updating, reading, downloading): [react-pdf](https://github.com/wojtekmaj/react-pdf)
- Toasts: [react-toastify](https://github.com/fkhadra/react-toastify#readme)
- Animations: [framer-motion](https://github.com/framer/motion)
- SEO: [next-seo]() 

## ℹ️ Services used :

- Database management: [Prisma](https://github.com/prisma/prisma) & `PostgreSQL`
- Deploy the project: [Vercel](https://vercel.com/)
- Email management: [Mailjet](https://www.mailjet.com/)
- Assets management: [Cloudinary](https://cloudinary.com/)
