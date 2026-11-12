import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  // Optical sizing (opsz 14–32): the two largest type steps render in the
  // Display cut with no second font. See the type scale in globals.css.
  axes: ["opsz"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "akaOSS, research by Ieuan King",
  description:
    "Research on measuring AI that works alongside people: a perspective paper and a feed of reproducible experiments, scored by humans.",
  metadataBase: new URL("https://www.akaoss.dev"),
  openGraph: {
    title: "akaOSS, research by Ieuan King",
    description:
      "A perspective paper and a feed of reproducible experiments on human-in-the-loop AI.",
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
