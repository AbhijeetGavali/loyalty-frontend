import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers/Providers";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Regulars Club",
  description: "Digital loyalty cards for cafes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers><ErrorBoundary>{children}</ErrorBoundary></Providers>
      </body>
    </html>
  );
}
