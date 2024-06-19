export async function translateTextWithDeepL(
  text: string,
  targetLang: string,
  defaultLocale: string
) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLang, defaultLocale }),
    });

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    return text;
  }
}
