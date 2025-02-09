import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "お問い合わせフォームのdemo",
  description: "Next.js + Honoで作成したお問い合わせフォームのデモサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-gray-50`}
        suppressHydrationWarning
      >
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
