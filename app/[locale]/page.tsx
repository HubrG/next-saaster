import { Link } from "@/src/lib/intl/navigation";
import { getTranslations } from "next-intl/server";
import { FirstConnexion } from "@/src/components/features/pages/index/FirstConnexion/FirstConnexion";
import { getNumberOfUsers } from "./server.actions";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/src/lib/next-auth/auth";

export default async function Home() {
  const t = await getTranslations("Index");
  const session = await getServerSession(authOptions);
  console.log(session)
  if (!session) {
    const numberOfUsers = await getNumberOfUsers();
    // If the database is empty, we create a first user who will be Admin with the github provider
    if (numberOfUsers === 0) {
      return (
        <main className="flex min-h-screen flex-col justify-center items-center  p-24">
          <FirstConnexion />
        </main>
      );
    }
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
      <FirstConnexion />
      <Link href="/admin">Admin</Link>
    </main>
  );
}
