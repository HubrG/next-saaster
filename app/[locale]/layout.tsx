import { ThemeProvider } from "@/src/providers/ThemeProvider";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { Navbar } from "@/src/components/layout/header/Navbar";
import createMetadata  from "@/src/lib/metadatas";

export const generateMetadata = async () => {
  return createMetadata({
    // Voir la configuration des métadonnées dans metadatas.ts
    // @/src/lib/metadatas
  });
};


const ToastProvider = dynamic(() => import("@/src/providers/ToastProvider"));

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};
export default function LocaleLayout(props: Props) {
  const {
    children,
    params: { locale },
  } = props;

  // Show a 404 page if the locale is not supported
  const loc = useLocale();
  if (loc === undefined || loc !== locale) {
    notFound();
  }
  const messages = useMessages();
  //

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ToastProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
