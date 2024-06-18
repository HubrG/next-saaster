import { Card } from "@/src/components/ui/card";
import { Link } from "@/src/lib/intl/navigation";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const t = useTranslations("NotFound");
  return (
    <div className="flex  flex-col items-center justify-center h-screen">
      <Card>
        <h1 className="text-3xl">{t("erreur-404")}</h1>
        <p>{t("page-not-found")}</p>
        <Link href="/">{t("back-link")}</Link>
      </Card>
    </div>
  );
}
