import "@/app/globals.css";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
import { ReactNode } from "react";
import { Playfair_Display, Caveat, Nunito } from "next/font/google";
import { getAppSettings } from "./[locale]/server.actions";
import { getLocale } from "next-intl/server";
import { Session } from "next-auth";
import SessProvider from "@/src/providers/SessionProvider";
import { cn } from "@/src/lib/utils";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/src/providers/ThemeProvider";

type Props = {
  children: ReactNode;
  session: Session;
};
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

export default async function RootLayout({ children, session }: Props) {
  
  const locale = await getLocale();
  const appSettings = await getAppSettings();
  if (!appSettings) {
    return null;
  } 

  console.log(appSettings)

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
            {appSettings.activeTopLoader && (
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
            )}
             <ThemeProvider attribute="class" defaultTheme={appSettings.defaultDarkMode ? "dark" : "light"} enableSystem>
            {children}
            </ThemeProvider>
          </body>
        </html>
      </ReactQueryClientProvider>
    </SessProvider>
  );
}
