import { prisma } from "@/src/lib/prisma";
import { Link } from "@/src/lib/intl/navigation";
import { getTranslations } from "next-intl/server";
import { FirstConnexion } from "@/src/components/features/pages/index/FirstConnexion/FirstConnexion";
import { signOut } from "next-auth/react";

export default async function Home() {
  const t = await getTranslations("Index");
  // signOut()
  // If the database is empty, we create a first user who will be ADMIN
  const users = await prisma.user.findMany();
  const isTableEmpty = users.length === 0;
  if (isTableEmpty) {
    return (
      <main className="flex min-h-screen flex-col justify-center items-center  p-24">
        <h1 className="font-bold">{t("first-connexion")}</h1>
        <FirstConnexion />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <h1 className="font-mono font-bold">{t("title")}</h1>
      <Link href="/" locale="en">
        In english
      </Link>
      <Link href="/" locale="fr">
        En français
      </Link>
    </main>
  );
}
