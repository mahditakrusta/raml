"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sand-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
         <Link href="/" className="flex items-center gap-2 group">
  <img
    src="/logo.jpg"
    alt="رَمل"
    className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full shadow-lg group-hover:shadow-xl transition-shadow"
  />
  <div className="flex flex-col">
    <span className="text-xl md:text-2xl font-bold text-clay-800 tracking-tight">رَمل</span>
    <span className="text-[10px] md:text-xs text-earth-500 -mt-1">سفال و سرامیک دست‌ساز</span>
  </div>
</Link>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-earth-700 hover:text-clay-600 transition-colors font-medium text-sm">
              خانه
            </Link>
            <Link href="/products" className="text-earth-700 hover:text-clay-600 transition-colors font-medium text-sm">
              محصولات
            </Link>
            <Link href="/products?category=vases" className="text-earth-700 hover:text-clay-600 transition-colors font-medium text-sm">
              گلدان‌ها
            </Link>
            <Link href="/products?category=tableware" className="text-earth-700 hover:text-clay-600 transition-colors font-medium text-sm">
              ظروف سفره
            </Link>
            <Link href="/products?category=tea-sets" className="text-earth-700 hover:text-clay-600 transition-colors font-medium text-sm">
              ست چای‌خوری
            </Link>
          </nav>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-earth-700 hover:text-clay-600 transition-colors"
              aria-label="سبد خرید"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-clay-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-earth-700"
              aria-label="منو"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-sand-100 animate-fade-in">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-earth-700 hover:text-clay-600 transition-colors font-medium py-2 border-b border-sand-50">
              خانه
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-earth-700 hover:text-clay-600 transition-colors font-medium py-2 border-b border-sand-50">
              همه محصولات
            </Link>
            <Link href="/products?category=vases" onClick={() => setMobileMenuOpen(false)} className="text-earth-700 hover:text-clay-600 transition-colors font-medium py-2 border-b border-sand-50">
              گلدان‌ها
            </Link>
            <Link href="/products?category=tableware" onClick={() => setMobileMenuOpen(false)} className="text-earth-700 hover:text-clay-600 transition-colors font-medium py-2 border-b border-sand-50">
              ظروف سفره
            </Link>
            <Link href="/products?category=tea-sets" onClick={() => setMobileMenuOpen(false)} className="text-earth-700 hover:text-clay-600 transition-colors font-medium py-2">
              ست چای‌خوری
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
