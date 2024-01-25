# Get started

## Configure locally

### 1. Github & Environment variables

1. Delete the .git folder: `rm -rf .git`
2. Recreate the git folder: `git init`
3. Create a `.env.local` file at the root of the project and pase the content of the `.env.example` file
4. _Gitignore_ the `.env.local` file: `echo ".env.local" >> .gitignore`
5. Go to the [Github settings and create a new OAuth app](https://github.com/settings/developers)
6. Copy the `Client ID` and `Client Secret` and paste them into the `.env.local` file in the `GITHUB_ID` and `GITHUB_SECRET` fields.
7. First commit: `git add . && git commit -m "Initial commit" && git push origin main`

### 2. next.config.js

1. Modify the host of your assets manager if needed (by default: [cloudinary](https://cloudinary.com) — freemium) in the `next.config.js` file

### 3. Install dependencies

1. In terminal: `pnpm install`

### 4. Creation of the database (local)

1. In terminal: `CREATE DATABASE my_database;`
2. Check the creation of the database: `\l`
3. Modify the `PROJECT_NAME` environment variable in the `.env.local` file with the value of the database name `my_database`
4. Generate Prisma: `pnpm prisma generate`
5. Create a first migration: `pnpm prisma migrate dev --name init`

### 5. Modify all environment variables (URI etc.)

### 6. Deploy the project

---

## Lunch the project on local, and server

### Initialization of the project

1. Launch the project and go to the home page `/`
2. Create an admin account
3. Go to the `/admin` administration page and let's go ! 🤘

## ℹ️ Libraries used

- Typing: [typeScript](https://github.com/microsoft/TypeScript) & [zod](https://github.com/colinhacks/zod)
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
- Toasts: [sonner](https://github.com/emilkowalski/sonner)
- Animations: [framer-motion](https://github.com/framer/motion)
- Internationalization: [next-intl](https://next-intl-docs.vercel.app/docs/routing/navigation)
- Tooltips : [react-tooltip](https://github.com/ReactTooltip/react-tooltip)
- AI : [Vercel AI](https://vercel.com/ai)

## ℹ️ Services used :

- Database management: [Prisma](https://github.com/prisma/prisma) & `PostgreSQL`
- Deploy the project: [Vercel](https://vercel.com/)
- Email management: [Mailjet](https://www.mailjet.com/)
- Assets management: [Cloudinary](https://cloudinary.com/)

## 🎨 Todo for customizing the project :

- You can add or remove a new main static (or dynamic) page in `src/components/layout/header/Navbar.ts` for displaying it on the "Main Menu" in the header, and create the pages in `app/[locale]/`.
- Change de favicon in `app/favicon.ico`
- Change the robots.txt in `app/robots.txt` and put the correct url of sitemap.
- Update the sitemap (dynamicly generated) in `app/sitemap.ts`
