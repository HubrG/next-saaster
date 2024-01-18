import Image from "next/image";
// import { useTranslations } from "next-intl";
import { Link } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";

export default function Home() {

    const t = useTranslations('Index');

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
