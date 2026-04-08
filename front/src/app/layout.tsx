import "./globals.css";
import { cn } from "@/shared/lib/utils";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

export const metadata = { 
  title: "SubGuard | Home",
  description: "",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
