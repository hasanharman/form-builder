import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { OpenPanelComponent } from "@openpanel/nextjs";

import "./globals.css";

import Header from "@/components/header";

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
  title: "Shadcn Form Builder",
  description: "Shadcn Form Builder",
  openGraph: {
    images: [
      {
        url: "https://form-builder-three-flame.vercel.app/meta.png",
        width: 600,
        height: 315,
      },
    ],
    type: "website",
    siteName: "Shadcn Form Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shadcn Form Builder",
    description: "Shadcn Form Builder",
    images: ["https://form-builder-three-flame.vercel.app/meta.png"],
    creator: "@strad3r",
  },
  keywords: ["form", "builder", "shadcn", "react"],
  themeColor: "#ffffff",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster />
          <Header />
          <main>{children}</main>
        </body>
      </html>
      <Analytics />
      <OpenPanelComponent
        clientId={process.env.NEXT_OPEN_PANEL_CLIENT_ID || ""}
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
      />
    </ViewTransitions>
  );
}
