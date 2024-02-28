import { Index } from "@/app/[locale]/dashboard/components/Index";
import { DivFullScreenGradient } from "@/src/components/ui/layout-elements/gradient-background";
import createMetadata from "@/src/lib/metadatas";
export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
    title: "Dashboard",
  });
};

export default async function Dashboard() {
  return (
    <>
      <DivFullScreenGradient gradient="gradient-to-tl" />
      <div className="dashboard user-interface">
      <Index />
      </div>
    </>
  );
}
