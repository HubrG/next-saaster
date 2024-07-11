import { getInternationalizationDictionaries } from "@/src/helpers/db/internationalization.action";
import { chosenSecret } from "@/src/helpers/functions/verifySecretRequest";
import { handleError } from "@/src/lib/error-handling/handleError";
import { env } from "@/src/lib/zodEnv";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { text, targetLang, defaultl } = await req.json();
  const apiKey = env.TRANSLATE_API_KEY || "";
  const url = "https://api-free.deepl.com/v2/translate";

  // Entourer les mots à ne pas traduire avec des balises <keep>
  const glossary = await getInternationalizationDictionaries({
    secret: chosenSecret(),
  });

  if (handleError(glossary).error) {
    return NextResponse.json(
      { error: "Error getting internationalization dictionaries" },
      { status: 500 }
    );
  }

  // On formate le texte pour ajouter les balises <keep> autour des mots à ne pas traduire
  const textWithKeepTags = text.replace(
    new RegExp(
      glossary.data?.success
        ?.map((dict) => dict.word)
        .filter((word) => word)
        .join("|") || "",
      "gi"
    ),
    "<keep>$&</keep>"
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
        source_lang: defaultl,
        tag_handling: "xml",
        ignore_tags: "keep",
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
