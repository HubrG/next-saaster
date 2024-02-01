import { Navbar } from "@/src/components/layout/header/Navbar";
import { Init } from "@/src/components/layout/init";
import createMetadata from "@/src/lib/metadatas";
import { cn } from "@/src/lib/utils";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
import SessProvider from "@/src/providers/SessionProvider";
import { Session } from "next-auth";
import { Caveat, Nunito, Playfair_Display } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";
import { getAppSettings } from "./server.actions";

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
  session: Session;
};

export default async function LocaleLayout(props: Props) {
  const {
    children,
    params: { locale },
  } = props;

  const appSettings = await getAppSettings();

  return (
    <SessProvider session={props.session}>
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
            <Init settings={appSettings}>
              <Navbar />
              <main>{children}</main>
            </Init>
          </body>
        </html>
      </ReactQueryClientProvider>
    </SessProvider>
  );
}
