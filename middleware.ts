import {
  defaultLocale,
  localePrefix,
  locales,
} from "@/src/lib/intl/navigation";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

// Middleware next-intl
const nextIntlMiddleware = createMiddleware({
  localePrefix,
  locales,
  defaultLocale,
});

// Middleware personnalisé qui encapsule next-intl
export async function middleware(req: NextRequest) {
  const URI = process.env.NEXT_URI;

  // Assurez-vous que l'URI de l'API est défini
  if (!URI) {
    console.error("NEXT_URI environment variable is not defined");
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Construction de l'URL de l'API
    const apiUrl = `${URI}/api/initialization`;

    // Effectuer l'appel à l'API
    const apiResponse = await fetch(apiUrl, {
      method: "POST", // ou 'POST', 'PUT', etc. selon les besoins
      headers: {
        // Ajoutez ici les en-têtes nécessaires
        "Content-Type": "application/json",
        // Autres en-têtes...
      },
      // body: JSON.stringify(data), // si nécessaire pour des requêtes POST/PUT
    });

    // Traiter la réponse de l'API
    if (!apiResponse.ok) {
      throw new Error(`API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    // Utiliser 'data' comme nécessaire
  } catch (error) {
    console.error("API request error:", error);
    // Gérer l'erreur
  }

  // Appliquer le middleware next-intl
  const response = nextIntlMiddleware(req);
  if (response) return response;

  // Suite de votre logique personnalisée, si nécessaire
  // ...

  // Continuer avec la réponse normale
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/(fr|en)/:path*"],
};
