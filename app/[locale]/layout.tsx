import { Navbar } from "@/src/components/layout/header/Navbar";
import createMetadata from "@/src/lib/metadatas";
import { NextIntlClientProvider, useLocale, useMessages } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import "react-toastify/dist/ReactToastify.css";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
  });
};

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};
const locales = ["en", "fr"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export default function LocaleLayout(props: Props) {
  const {
    children,
    params: { locale },
  } = props;
  unstable_setRequestLocale(locale);

  // Show a 404 page if the locale is not supported
  const loc = useLocale();

  const messages = useMessages();
  //

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar />
      <main>{children}</main>
    </NextIntlClientProvider>
  );
}
