import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  variable: "--font-malayalam",
  subsets: ["malayalam"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "CRE | Moral School Registration",
  description: "Register for CRE | Moral School (Summerise)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoMalayalam.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
