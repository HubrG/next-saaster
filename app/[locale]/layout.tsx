import { Navbar } from "@/app/[locale]/@layout/header/Navbar";
import { TopLoader } from "@/app/[locale]/@layout/header/TopLoader";
import { Init } from "@/app/[locale]/@layout/init";
import { Loader } from "@/src/components/ui/@fairysaas/loader";
import { getSaasSettings } from "@/src/helpers/db/saasSettings.action";
import { authOptions } from "@/src/lib/next-auth/auth";
import { cn } from "@/src/lib/utils";
import { NextIntlProvider } from "@/src/providers/NextIntlProvider";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
import SessProvider from "@/src/providers/SessionProvider";
import { ThemeProvider } from "@/src/providers/ThemeProvider";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { Caveat, Playfair_Display, Rethink_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { getAppSettings } from "../../src/helpers/db/appSettings.action";
import Footer from "./@layout/footer/Footer";

const sans = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  adjustFontFallback: false,
});
const serif = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});
const display = Caveat({ subsets: ["latin"], variable: "--font-display" });

type Props = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
  session: Session;
};
const fetchSession = async () => {
  return await getServerSession(authOptions);
};
export default async function LocaleLayout(props: Props) {
  const {
    children,
    params: { locale },
  } = props;

  const [session, appSettings, saasSettings] = await Promise.all([
    fetchSession(),
    getAppSettings(),
    getSaasSettings(),
  ]);
  if (!appSettings.data || !saasSettings.data) {
    return <Loader />;
  }

  return (
    <ReactQueryClientProvider>
      <SessProvider session={session as Session}>
        <html
          lang={locale}
          suppressHydrationWarning={true}
          className={`${appSettings.data.theme} radius-${
            appSettings.data.roundedCorner
          } ${sans.variable} ${serif.variable}  ${display.variable} font-sans ${
            appSettings.data.activeDarkMode && "dark"
          }`}>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <body
            className={cn("min-h-screen bg-background font-sans antialiased")}>
            <NextIntlProvider>
              <Init
                appSettings={appSettings.data}
                saasSettings={saasSettings.data}
              />
              <Toaster
                richColors={true}
                position="bottom-right"
                closeButton={true}
              />
              {appSettings.data.activeTopLoader && <TopLoader />}

              <ThemeProvider
                disableTransitionOnChange={false}
                attribute="class"
                defaultTheme={
                  appSettings.data.defaultDarkMode
                    ? "dark"
                    : appSettings.data.defaultLightMode
                    ? "light"
                    : "system"
                }
                enableSystem={appSettings.data.activeDarkMode ?? false}>
                <Navbar settings={appSettings.data} />
                <main>{children}</main>
                <Footer />
              </ThemeProvider>
            </NextIntlProvider>
          </body>
        </html>
      </SessProvider>
    </ReactQueryClientProvider>
  );
}
