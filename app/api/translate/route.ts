import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text, targetLang, defaultLocale } = await req.json();
  const apiKey = process.env.TRANSLATE_API_KEY || "";
  const url = "https://api-free.deepl.com/v2/translate";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        auth_key: apiKey,
        text: text,
        target_lang: targetLang,
        source_lang: defaultLocale,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResponse = await response.text();
    const data = textResponse ? JSON.parse(textResponse) : {};

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    return NextResponse.json(
      { error: "Error translating with DeepL" },
      { status: 500 }
    );
  }
}
