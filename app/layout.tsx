import type { Metadata } from "next";
import { Inter_Tight, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";
import "./globals.css";

const editorial = Inter_Tight({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-technical", display: "swap" });

export const metadata: Metadata = {
  title: "SCUDERIA / 01 — Built for Speed",
  description: "An independent cinematic study of speed, precision, and the Formula 1 machine. An interactive film controlled by your scroll.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" className={`${editorial.variable} ${mono.variable}`}><body>{children}</body></html>;
}
