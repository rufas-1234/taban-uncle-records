import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taban Uncle Records",
  description: "A cultural recording studio for South Sudanese music, photography, videography, and creative production in Juba.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-[#101010] text-[#F3F0EA] antialiased">
        <div className="min-h-screen bg-[#101010] text-[#F3F0EA]">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
