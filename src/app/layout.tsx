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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 min-h-screen transition-colors duration-200`}>
        <Providers>
          {session ? (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto pt-16 md:pt-8 p-4 md:p-8 bg-gray-50 dark:bg-zinc-950">
                {children}
              </main>
            </div>
          ) : (
            <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">{children}</main>
          )}
        </Providers>
      </body>
    </html>
  );
}
