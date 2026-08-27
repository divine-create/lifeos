import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeOS",
  description: "Your complete personal operating system",
};

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {session && session.user ? (
            <div className="flex h-screen overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-900">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-white relative">
                <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-8">
                  {children}
                </div>
              </main>
            </div>
          ) : (
            <main className="min-h-screen bg-white">
              {children}
            </main>
          )}
        </Providers>
      </body>
    </html>
  );
}
