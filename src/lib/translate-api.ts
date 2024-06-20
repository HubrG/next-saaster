import { getAppSettings } from "../helpers/db/appSettings.action";

export async function translateTextWithDeepL(text: string, targetLang: string) {
  try {
    const appSettings = (await getAppSettings()).data;
    if (!appSettings) {
      throw new Error("No app settings found");
    }
    const enabled = appSettings?.activeAutoTranslate;
    const sourceLang = appSettings.defaultLocale;

    if (!enabled) {
      console.log("Auto translate is disabled");
      return text;
    }
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLang, defaultl: sourceLang }),
    });

    const data = await response.json();
    if (data.translations && data.translations.length > 0) {
      return data.translations[0].text;
    } else {
      throw new Error("No translations found");
    }
  } catch (error) {
    console.error("Error translating with DeepL:", error);
    return text;
  }
}
