import "@/app/globals.css";
import { Init } from "@/src/components/layout/init";
import { cn } from "@/src/lib/utils";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
import SessProvider from "@/src/providers/SessionProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { Session } from "next-auth";
import { getLocale } from "next-intl/server";
import { Caveat, Nunito, Playfair_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { getAppSettings } from "./[locale]/server.actions";

const sans = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});
const display = Caveat({ subsets: ["latin"], variable: "--font-display" });
const locales = ["en", "fr"];

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
interface IntProps {
  session: Session;
  children: React.ReactNode
}
export default async function RootLayout({ children, session }: Readonly<IntProps>) {
  // unstable_setRequestLocale(locale);
  const locale = await getLocale();
  const appSettings = await getAppSettings();
  //
  return (
    <SessProvider session={session}>
      <ReactQueryClientProvider>
        <html
          lang={locale}
          suppressHydrationWarning={true}
          className={`${appSettings.theme} radius-${appSettings.roundedCorner} ${sans.variable} ${serif.variable}  ${display.variable} font-sans`}>
          <body
            className={cn("min-h-screen bg-background font-sans antialiased")}
            suppressHydrationWarning={true}>
            <Toaster richColors={true} closeButton={true} />
            {appSettings.activeTopLoader && (
              <NextTopLoader
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                initialPosition={0.08}
                crawlSpeed={200}
                height={2}
                crawl={true}
                showSpinner={true}
                easing="ease"
                speed={200}
                shadow={false}
              />
            )}
            <ThemeProvider
              attribute="class"
              defaultTheme={appSettings.defaultDarkMode ? "dark" : "system"}
              enableSystem>
              <Suspense fallback={<></>}>
                <Init settings={appSettings} />
                {children}
              </Suspense>
            </ThemeProvider>
          </body>
        </html>
      </ReactQueryClientProvider>
    </SessProvider>
  );
}
