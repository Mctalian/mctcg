import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ weight: ["300", "400", "500", "700"], subsets: ["latin"]});

export const metadata: Metadata = {
  title: "PDeckF",
  description: "Generate your Pokémon TCG Live decklists as Official PDFs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
