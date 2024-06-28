"use client";
import { Button } from "@/src/components/ui/button";

export const HeroSection = () => (
  <div className="hero   text-center py-20">
    <h1 className="text-5xl font-bold mb-4">
      Accélérez votre développement avec notre SaaS Boilerplate
    </h1>
    <p className="text-xl mb-8">
      Basé sur Next.js 14 et TypeScript, notre boilerplate vous fait gagner des
      centaines d'heures de développement.
    </p>
    <ul className="text-lg mb-8 list-disc list-inside">
      <li>Stack moderne: Next.js, TypeScript, Tailwind CSS</li>
      <li>Authentification avec NextAuth.js</li>
      <li>Gestion des données avec Prisma et PostgreSQL</li>
      <li>Déploiement facile sur Vercel</li>
      <li>Support pour les paiements avec Stripe</li>
      <li>Internationalisation avec next-intl</li>
    </ul>
    <Button className="bg-white text-blue-500 px-6 py-3 rounded-full">
      Commencez maintenant
    </Button>
  </div>
);
