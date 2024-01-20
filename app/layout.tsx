import "@/app/globals.css";
import { ReactQueryClientProvider } from "@/src/providers/ReactQueryClientProvider";
import { ReactNode } from "react";
import { Playfair_Display, Caveat, Nunito } from "next/font/google";
import { getAppSettings } from "./[locale]/server.actions";
import { getLocale } from "next-intl/server";
import { Session } from "next-auth";
import SessProvider from "@/src/providers/SessionProvider";
import { cn } from "@/src/lib/utils";

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
  const themeCss = await getAppSettings();
  return (
    <SessProvider session={session}>
      <ReactQueryClientProvider>
        <html
          lang={locale}
          suppressHydrationWarning={true}
          className={`${themeCss?.theme} ${sans.variable} ${serif.variable}  ${display.variable} font-sans`}>
          <body
            className={cn("min-h-screen bg-background font-sans antialiased")}
            suppressHydrationWarning={true}>
            {children}
          </body>
        </html>
      </ReactQueryClientProvider>
    </SessProvider>
  );
}
