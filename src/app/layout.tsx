import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import BottomNav, { NavBar } from "@/components/BottomNav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kucing Jakarta",
  description: "Koleksi foto kucing Nadya di sekitar Jakarta",
  appleWebApp: { capable: true, title: "Kucing Jakarta", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f07b1d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <div className="mx-auto flex min-h-dvh max-w-md flex-col pb-[calc(4rem+env(safe-area-inset-bottom))]">
          {children}
        </div>
        <Suspense fallback={<NavBar pathname={null} />}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}
