import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, zhCN } from "@clerk/localizations";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { type Locale } from "@/i18n/config";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evoke",
  description:
    "AI-powered code generation platform that turns your ideas into working applications instantly. Build, deploy, and scale with ease.",
};

const localeMap = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <ClerkProvider localization={localeMap[locale as Locale] ?? zhCN}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
