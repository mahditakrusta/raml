import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "رَمل | سفال و سرامیک دست‌ساز ایرانی",
  description: "فروشگاه آنلاین سفال و سرامیک دست‌ساز رَمل — گلدان، ظروف سفره، ست چای‌خوری و محصولات تزئینی با کیفیت عالی",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-sand-50 text-earth-900 antialiased font-sans min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
