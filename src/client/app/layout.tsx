import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import theme from '../theme';

import "./globals.css";

const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"]});

export const metadata: Metadata = {
  title: "McTCG",
  description: "A suite of tools for Pokemon TCG players and collectors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className} style={{ maxHeight: "100vh", overflow: "auto"}}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
      <GoogleAnalytics gaId="G-PVN3072TQ6" />
    </html>
  );
}
