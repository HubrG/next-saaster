import { Inter as FontSans } from "next/font/google";
import { cn } from "@/src/lib/utils";
import { Session } from "next-auth";
import SessProvider from "@/src/providers/SessionProvider";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
const ToastProvider = dynamic(
  () => import("@/src/components/layout/toastify/ToastProvider")
);

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function LocaleLayout(props: {
  children: React.ReactNode;
  session: Session;
  params: {
    locale: string;
  };
}) {
  const {
    children,
    session,
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
    <ReactQueryClientProvider>
      <html lang={locale}>
        <SessProvider session={session}>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
            suppressHydrationWarning={true}>
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
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem>
                  {children}
                </ThemeProvider>
              </ToastProvider>
              <ToastContainer />
            </NextIntlClientProvider>
          </body>
        </SessProvider>
      </html>
    </ReactQueryClientProvider>
  );
}
