import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ventana Sur 2026 · Información práctica",
  description: "Guía de información práctica para personas acreditadas en Ventana Sur 2026.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
