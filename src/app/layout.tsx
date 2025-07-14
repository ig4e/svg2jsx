import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: {
    default: "SVG to JSX Converter - Free Online Tool",
    template: "%s | SVG to JSX Converter",
  },
  description:
    "Free online tool to convert SVG code to React JSX components. Features SVGO optimization, TypeScript support, Prettier formatting, and instant preview. Perfect for React developers.",
  keywords: [
    "SVG to JSX",
    "SVG to React",
    "Convert SVG",
    "React components",
    "JSX converter",
    "SVG optimizer",
    "SVGO",
    "TypeScript",
    "React icons",
    "Frontend tools",
  ],
  authors: [{ name: "Ahmed Mohamed" }],
  creator: "Ahmed Mohamed",
  publisher: "Ahmed Mohamed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://svg2jsx.ahmedmohamed.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SVG to JSX Converter - Free Online Tool",
    description:
      "Free online tool to convert SVG code to React JSX components. Features SVGO optimization, TypeScript support, and Prettier formatting.",
    url: "https://svg2jsx.ahmedmohamed.dev",
    siteName: "SVG to JSX Converter",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SVG to JSX Converter Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG to JSX Converter - Free Online Tool",
    description:
      "Convert SVG code to React JSX components with SVGO optimization and TypeScript support.",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle", // Update with actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
  manifest: "/manifest.json",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <head>
        <link rel="canonical" href="https://svg2jsx.ahmedmohamed.dev" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
