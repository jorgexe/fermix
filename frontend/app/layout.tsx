import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fermix - Exoplanet Classification",
  description: "ML-powered exoplanet candidate classification using NASA Kepler data",
  icons: {
    icon: '/fermix_logo.png',
    apple: '/fermix_logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
