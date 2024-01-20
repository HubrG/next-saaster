import NextTopLoader from "nextjs-toploader";
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
        <NextTopLoader
          template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          color="#3d3d3d"
          initialPosition={0.08}
          crawlSpeed={200}
          height={2}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow={false}
        />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </ToastProvider>
    </NextIntlClientProvider>
  );
}
