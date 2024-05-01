export async function translateTextWithDeepL(
  text: string,
  targetLang: string,
  defaultLocale: string
) {
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
    return data.translations[0].text;
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    return text;
  }
}
