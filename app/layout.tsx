import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "CullMate — AI Wedding Photo Culling",
  description:
    "AI culls thousands of wedding RAW photos into a client-ready gallery automatically. Built for solo and small-studio wedding photographers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col`}>
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
