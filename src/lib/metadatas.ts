// metadata.ts
const projectName = "NextSaater";
const projectBaseline = "Begin a SaaS project with Next.js, Prisma, and Stripe";
const projectDescription = "Begin a SaaS project with Next.js, Prisma, and Stripe"

const titleBase = `${projectName} | ${projectBaseline}`;
const descBase =
  `${projectName} ${projectDescription}`;

interface MetadataParams {
  title?: string;
  description?: string;
  url?: string;
  imgPath?: string;
  type?: string;
}

export const createMetadata = ({
  title = titleBase,
  type = "website",
  description = descBase,
  url = process.env.NEXT_PUBLIC_URI,
  imgPath = "/img/header-home.webp",
}: MetadataParams) => {
  const imgURL = `${process.env.NEXT_PUBLIC_URI}${imgPath}`;

  return {
    title: title,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_URI}`),
    description: description, // 170 caractères maximum
    alternates: {
      canonical: url, // URL Canonique, pour éviter les "duplicate content"
    },
    openGraph: {
      title: title,
      type: type,
      description: description,
      url: url,
      siteName: `${projectName}`,
      images: [
        {
          url: imgURL,
          width: 1800,
          height: 1600,
          alt: `${projectName}`,
        },
      ],
      locale: "fr_FR",
    },
  };
};

export default createMetadata;
