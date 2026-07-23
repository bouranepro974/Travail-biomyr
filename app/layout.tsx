import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

// Typographies officielles de la charte BIOMYR × VÉYÈR
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-title",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BIOMYR — Innover. Développer. Collaborer.",
  description:
    "Des solutions biotechnologiques pour une agriculture plus durable, plus résiliente et plus performante.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
