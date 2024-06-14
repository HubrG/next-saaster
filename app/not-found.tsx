// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

import { Link } from "@/src/lib/intl/navigation";
import createMetadata from "@/src/lib/metadatas";
import { Session } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";
import LocaleLayout from "./[locale]/layout";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "404",
  });
};
const Sess: Session = {
  user: {
    name: null,
    email: null,
    image: null,
    id: "",
    role: "USER", // ou un autre rôle approprié
    userId: "",
    customerId: "",
  },
  expires: "",
};

export default async function NotFound() {
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <LocaleLayout params={{ locale }} session={Sess}>
      <div className=" text-center flex items-center justify-center flex-col max-w-lg !-mt-96">
        <h2>Erreur 404</h2>
        <p>blabla</p>
        <Link href="/">Blalba</Link>
      </div>
    </LocaleLayout>
  );
}
