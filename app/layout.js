import "./globals.css";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "Aurako | অনলাইন শপ",
  description: "সহজ, দ্রুত ও নির্ভরযোগ্য অনলাইন শপিং — ক্যাশ অন ডেলিভারি সুবিধাসহ।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
