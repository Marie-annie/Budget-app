import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Budgeting App",
  description: "A simple budgeting app to track your income and expenses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <main className="mx-auto">{children}</main>
      </body>
    </html>
  );
}