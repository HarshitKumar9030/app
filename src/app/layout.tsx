import type { Metadata } from "next";
import { Major_Mono_Display, Comic_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";

const comicSans = Comic_Neue({
  variable: "--font-comic-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const majorMono = Major_Mono_Display({
  variable: "--font-major-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Forge",
  description: "Forge is a simple deployment CLI tool, which helps you to automate and manage deployments for various tech stacks like nextjs, flask, nodejs etc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comicSans.variable} overflow-x-hidden ${comicSans.className} ${majorMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />

      </body>
    </html>
  );
}
