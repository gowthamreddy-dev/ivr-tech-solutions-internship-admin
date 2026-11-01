import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#030814",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "IVR Tech Solutions | Internship Offer Letter Generator & Admin Suite",
  description:
    "Official corporate document automation suite for IVR Tech Solutions Private Limited. Generate sequential offer letters, sync Google Forms responses, export PDF and DOCX.",
  icons: {
    icon: "/images/ivr-official-logo.png",
    shortcut: "/images/ivr-official-logo.png",
    apple: "/images/ivr-official-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-navy-950 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
