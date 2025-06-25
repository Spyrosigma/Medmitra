import HeaderAuth from "@/components/layout/header-auth";
import { ClientAuthHandler } from "@/components/layout/client-auth-handler";
import { Geist } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MedMitra",
  description: "MedMitra is a platform for medical professionals to connect with patients and provide medical services.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.className}`} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientAuthHandler />
          <main className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/80">
            <nav className="w-full flex justify-center py-2 px-2 sm:px-6 flex-shrink-0">
              <HeaderAuth />
            </nav>
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </main>
        <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
