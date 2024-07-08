import type { Metadata } from "next";
import { Inter } from "next/font/google";


import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOL vs NIFTY",
  description: "Just a fun app to compare sol vs nifty price action",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
