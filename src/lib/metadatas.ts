import { getLocale } from "next-intl/server";
import { getAppSettings } from "../helpers/db/appSettings.action";
import { env } from "./zodEnv";

export interface MetadataParams {
  title: string;
  description?: string;
  type?:
    | "website"
    | "article"
    | "book"
    | "profile"
    | "video.movie"
    | "video.episode"
    | "video.tv_show"
    | "video.other"
    | "music.song"
    | "music.album"
    | "music.playlist"
    | "music.radio_station";
  url?: string;
  imgPath?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  authors?: string[];
  twitterCreator?: string;
}

export const createMetadata = async ({
  title,
  type = "website",
  description = "",
  url = "",
  tags = [],
  publishedTime,
  modifiedTime,
  section,
  authors,
  twitterCreator,
  imgPath = "/img/header-home.webp",
}: MetadataParams) => {
  const local = await getLocale();
  const settings = (await getAppSettings()).data;
  if (!settings) {
    throw new Error("No settings found");
  }
  const imgURL = `${env.NEXT_PUBLIC_URI}${imgPath}`;
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
    url = `${env.NEXT_PUBLIC_URI}/${local}`;
  }

  return {
    title,
    metadataBase: new URL(`${env.NEXT_PUBLIC_URI}`),
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      type,
      description,
      url,
      publishedTime,
      modifiedTime,
      tags,
      section,
      siteName: settings?.name ?? "",
      images: [
        {
          url: imgURL,
          width: 1200,
          height: 630,
          alt: `${settings?.name ?? title}`,
        },
      ],
      authors,
      locale: local + "_" + local.toUpperCase(),
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      creator: twitterCreator,
      images: [
        {
          url: imgURL,
          width: 1200,
          height: 630,
          alt: `${settings?.name ?? title}`,
        },
      ],
    },
  };
};

export default createMetadata;
