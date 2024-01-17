import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/src/lib/utils";
import { Session } from "next-auth";
import Provider from "@/src/contexts/Provider";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "@/src/themes/ThemeProvider";
import dynamic from "next/dynamic";
import createMetadata from "@/src/lib/metadatas";
export const metadata = createMetadata({
  // Voir la configuration des métadonnées dans metadatas.ts
  // @/src/lib/metadatas
});

const ToastProvider = dynamic(
  () => import("@/src/components/layout/toastify/ToastProvider")
);

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout(props: {
  children: React.ReactNode;
  session: Session;
}) {
  const { children, session } = props;
  return (
    <html lang="en">
      <Provider session={session}>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
          suppressHydrationWarning={true}>
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
              {children}
            </ThemeProvider>
          </ToastProvider>
          <ToastContainer />
        </body>
      </Provider>
    </html>
  );
}
