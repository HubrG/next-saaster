import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { text, targetLang, defaultLocale } = req.body;
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
        // source_lang: defaultLocale,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    res.status(500).json({ error: "Error translating with DeepL" });
  }
}
