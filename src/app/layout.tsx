'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { GlobalAlert } from "@/components/GlobalAlert";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { applyTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    applyTheme();
  }, [applyTheme]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <html lang="id">
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        {children}
        <GlobalAlert />
      </body>
    </html>
  );
}
