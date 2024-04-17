import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      <head>
        <link rel="icon" type="image/vnd.microsoft.icon"
            sizes="32x32 48x48" href="favicon.ico" />

        <link rel="icon" sizes="128x128" href="favicon.icns" />

        <link rel="icon" href="favicon.png" type="image/x-icon" />
      </head>
      <body className={roboto.className}>
        {children}
      </body>
      <GoogleAnalytics gaId="G-PVN3072TQ6" />
    </html>
  );
}
