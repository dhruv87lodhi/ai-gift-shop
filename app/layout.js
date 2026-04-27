import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { ShortlistProvider } from "@/context/ShortlistContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
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
      className={`${inter.variable} ${outfit.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#fafafa] text-gray-900">
        <AuthProvider>
          <CartProvider>
            <ShortlistProvider>
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
            </ShortlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
