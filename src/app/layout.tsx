import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "akaOSS — an open-source studio",
  description:
    "akaOSS is an open-source studio by Ieuan King: five projects, spanning a human-in-the-loop measurement family and a pair of developer tools.",
  metadataBase: new URL("https://www.akaoss.dev"),
  openGraph: {
    title: "akaOSS — an open-source studio",
    description:
      "Five open-source projects: a human-in-the-loop measurement family and a pair of developer tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased font-sans",
        sans.variable,
        mono.variable,
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
