import { getLocale } from "next-intl/server";
import { getAppSettings } from "../helpers/db/appSettings";

interface MetadataParams {
  title?: string;
  description?: string;
  url?: string;
  imgPath?: string;
  type?: string;
}

export const createMetadata = async ({
  title,
  type = "website",
  description,
  url,
  imgPath = "/img/header-home.webp",
}: MetadataParams) => {
  const local = await getLocale();
  const localeMap = {
    fr: "FR",
    en: "US",
    uk: "GB",
    es: "ES",
    de: "DE",
    it: "IT",
    pt: "PT",
    zh: "CN",
    ja: "JP",
  };
  const settings = (await getAppSettings()).data;
  if (!settings) {
    throw new Error("No settings found");
  }
  const imgURL = `${process.env.NEXT_PUBLIC_URI}${imgPath}`;
  //
  if (!title) {
    title = `${settings?.name} | ${settings?.baseline}`;
  } else {
    title = `${title} | ${settings?.name}`;
  }
  //
  if (!description) {
    description = `${settings?.description}`;
  }
  if (!url) {
    url = `${process.env.NEXT_PUBLIC_URI}/${local}`;
  }

  return {
    title: title,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_URI}`),
    description: description, // 170 caractères maximum
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title,
      type: type,
      description: description,
      url: url,
      siteName: `${process.env.NEXT_PUBLIC_APP_NAME}`,
      images: [
        {
          url: imgURL,
          width: 1800,
          height: 1600,
          alt: `${settings?.name ?? title}`,
        },
      ],
      locale: local + "_" + localeMap[local as keyof typeof localeMap],
    },
  };
};

export default createMetadata;
