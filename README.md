# Get started

## Configure locally

### 1. Github

1. Delete the .git folder: `rm -rf .git`
2. Recreate the git folder: `git init`
3. Create a `.env` file at the root of the project and pase the content of the `.env.example` file
4. _Gitignore_ the `.env` file: `echo ".env" >> .gitignore`
5. Go to the [Github settings and create a new OAuth app](https://github.com/settings/developers)
6. Copy the `Client ID` and `Client Secret` and paste them into the `.env` file in the `GITHUB_ID` and `GITHUB_SECRET` fields.
7. First commit: `git add . && git commit -m "Initial commit" && git push origin main`

### 2. next.config.js

1. Modify the host of your assets manager if needed (by default: [cloudinary](https://cloudinary.com) — freemium) in the `next.config.js` file

### 3. Install dependencies

1. In terminal: `pnpm install`

### 4. Creation of the database (local)

1. In terminal: `CREATE DATABASE my_database;`
2. Check the creation of the database: `\l`
3. Modify the `PROJECT_NAME` environment variable in the `.env` file with the value of the database name `my_database`
4. Generate Prisma: `pnpm prisma generate`
5. Create a first migration: `pnpm prisma migrate dev --name init`

### 5. Create accounts for these services and get the API keys :

1. Stripe (tuto)
2. Resend (tuto)
3. Google OAuth (tuto)
   ... That's all !

**⚠️ Note**: The project does not work without these keys. Don't hesitate to contact me if you need help.

### 6. Modify all environment variables

### 7. Deploy the project

**⚠️ Note**: Beware, the project is not yet ready for deployment. You must first modify the environment variables and the configuration files before deploy it.

---

## Lunch the project on local, and server

### Initialization of the project

1. Launch the project and go to the home page `/`
2. Create an admin account
3. Go to the `/admin` administration page and let's go ! 🤘

## ℹ️ Libraries used

- Typing: [typeScript](https://github.com/microsoft/TypeScript){:target="\_blank"} & [zod](https://github.com/colinhacks/zod){:target="\_blank"}
- Auth management: [next-auth](https://github.com/nextauthjs/next-auth){:target="\_blank"}
- Date format : [date-fns](https://github.com/date-fns/date-fns){:target="\_blank"}
- Text editor: [editor.js](https://github.com/editor-js/awesome-editorjs){:target="\_blank"}
- Custom hooks: [react-use](https://github.com/streamich/react-use){:target="\_blank"}
- Stores/Contexts: [zustand](https://github.com/pmndrs/zustand){:target="\_blank"}
- Upload/Upload management: [filepond](https://github.com/pqina/react-filepond){:target="\_blank"}
- Sortable DD: [react-easy-sort](https://github.com/ValentinH/react-easy-sort){:target="\_blank"}
- Cookie management: [js-cookie](https://www.npmjs.com/package/js-cookie){:target="\_blank"}
- Form management: [react-hook-form](https://github.com/react-hook-form/react-hook-form){:target="\_blank"}
- Query management: [tanstack/react-query](https://github.com/TanStack/query){:target="\_blank"}
- Charts and graphs: [recharts](https://github.com/recharts/recharts){:target="\_blank"}
- Icons: [lucide icons](https://github.com/lucide-icons/lucide){:target="\_blank"}
- PDF management (creation, updating, reading, downloading): [react-pdf](https://github.com/wojtekmaj/react-pdf){:target="\_blank"}
- Toasts: [sonner](https://github.com/emilkowalski/sonner){:target="\_blank"}
- Animations: [framer-motion](https://github.com/framer/motion){:target="\_blank"}
- Internationalization: [next-intl](https://next-intl-docs.vercel.app/docs/routing/navigation){:target="\_blank"}
- Tooltips : [react-tooltip](https://github.com/ReactTooltip/react-tooltip){:target="\_blank"}
- AI : [Vercel AI](https://vercel.com/ai){:target="\_blank"}
- UI : Tailwind, Aceternity, Shadcn

## ℹ️ Services used :

- Database management: [Prisma](https://github.com/prisma/prisma){:target="\_blank"} & `PostgreSQL`
- Deploy the project: [Vercel](https://vercel.com/){:target="\_blank"}
- Email management: [Resend](https://resend.com/overview){:target="\_blank"}, and [react-email](https://github.com/resend/react-email){:target="\_blank"} for templating
- Assets management: [Cloudinary](https://cloudinary.com/){:target="\_blank"}

## 🎨 Todo for customizing the project :

- You can add or remove a new main static (or dynamic) page in `src/components/layout/header/Navbar.ts` for displaying it on the "Main Menu" in the header, and create the pages in `app/[locale]/`.
- Change de favicon in `app/favicon.ico`
- Change the robots.txt in `app/robots.txt` and put the correct url of sitemap.
- Update the sitemap (dynamicly generated) in `app/sitemap.ts`

## Notes :

- User roles can be modified in the schema, and a function can verify the authorization in `src/functions/isUserRole.ts`
- The project is configured for a deployment on Vercel, but you can deploy it on any other platform.
