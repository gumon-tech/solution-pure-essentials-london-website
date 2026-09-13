import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyBar from "@/components/StickyBar";
import { getNavMenus } from "@/lib/nav";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pure Essentials London",
  description:
    "Aesthetics and beauty treatments at 155 King's Cross Road, London WC1X 9BN.",
  metadataBase: new URL("https://pel.gumon.io"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${body.variable}`}
      // Lets Next.js switch smooth scrolling off during route changes (app/globals.css
      // turns it on), so a new page starts at its top instantly.
      data-scroll-behavior="smooth"
    >
      <body>
        <Header menus={getNavMenus()} />
        <main>{children}</main>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}
