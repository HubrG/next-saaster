import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, targetLang, defaultLocale } = await req.json();
  const apiKey = process.env.TRANSLATE_API_KEY || "";
  const url = "https://api-free.deepl.com/v2/translate";

  // Entourer les mots à ne pas traduire avec des balises <keep>
  const textWithKeepTags = text.replace(
    /(NextJS|boilerplate|Next|pricing|UI|UX|Next-Auth|Resend|Stripe|SEO|API)/g,
    "<keep>$1</keep>"
  );

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        auth_key: apiKey,
        text: textWithKeepTags,
        target_lang: targetLang,
        source_lang: defaultLocale,
        tag_handling: "xml", // Indiquer que nous utilisons des balises XML
        ignore_tags: "keep", // Indiquer à l'API de ne pas traduire le contenu des balises <keep>
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const textResponse = await response.text();
    const data = textResponse ? JSON.parse(textResponse) : {};

    // Retirer les balises <keep> du texte traduit
    if (
      data.translations &&
      data.translations[0] &&
      data.translations[0].text
    ) {
      data.translations[0].text = data.translations[0].text.replace(
        /<\/?keep>/g,
        ""
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    return NextResponse.json(
      { error: `Error translating with DeepL` },
      { status: 500 }
    );
  }
}
