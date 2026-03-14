import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});


export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata: Metadata = {
  title: "おたよりボード - 小学校プリント管理",
  description: "小学校のプリントや行事をかんたんに管理できるWebアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${cormorant.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
