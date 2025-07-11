import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { NavigationServer } from "@/components/navigation-server";
import { getCurrentUserSafe } from "@/server/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js PPR Demo",
  description: "Demonstrating Partial Pre-rendering with tRPC and TanStack Query",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getCurrentUserSafe();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <Providers initialUser={initialUser}>
          <div className="min-h-screen">
            <div className="max-w-7xl mx-auto p-4">
              <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-1">
                  <NavigationServer initialUser={initialUser} />
                </div>
                <div className="lg:col-span-3">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
