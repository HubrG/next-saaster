import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { defaultLocale, locales, defaultLocaleAndLocales } =
      await req.json();

    if (!defaultLocale && !locales && !defaultLocaleAndLocales) {
      throw new Error(
        "Les paramètres 'defaultLocale' et 'locales' sont manquants"
      );
    }

    if (defaultLocale) {
      const loc = await prisma.appSettings.findFirst();
      return NextResponse.json(loc?.defaultLocale);
    }

    if (locales) {
      const loc = await prisma.internationalizationEnabledList.findMany();
      const localeCodes = loc.map((locale) => locale.code);
      return NextResponse.json(localeCodes);
    }
    if (defaultLocaleAndLocales) {
      const loc = await prisma.appSettings.findFirst({
        select: {
          defaultLocale: true,
        },
      });
      const locs = await prisma.internationalizationEnabledList.findMany({
        select: {
          code: true,
        },
      });
      const localeCodes = locs.map((locale) => locale.code);

      return NextResponse.json({
        defaultLocale: loc?.defaultLocale,
        locales: localeCodes,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
