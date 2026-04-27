import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ShortlistProvider } from "@/context/ShortlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AuraGifts - AI Gift Finder",
  description: "Find the perfect gift for any occasion with the help of AI.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#fafafa] text-gray-900">
        <CartProvider>
          <ShortlistProvider>
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
          </ShortlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
