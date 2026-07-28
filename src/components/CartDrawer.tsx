"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-full max-w-md bg-white z-50 shadow-2xl animate-slide-in-left flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand-100">
          <h2 className="text-xl font-bold text-clay-800">سبد خرید</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-sand-50 rounded-full transition-colors"
            aria-label="بستن"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-sand-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-earth-400 text-lg font-medium mb-2">سبد خرید شما خالی است</p>
              <p className="text-earth-300 text-sm mb-6">محصولات زیبای ما را مرور کنید</p>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="bg-clay-600 text-white px-6 py-2.5 rounded-lg hover:bg-clay-700 transition-colors font-medium"
              >
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-sand-50 rounded-xl animate-fade-in-up">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-sm font-bold text-clay-800 hover:text-clay-600 transition-colors block truncate"
                    >
                      {item.name}
                    </Link>
                    <p className="text-clay-600 font-bold text-sm mt-1">
                      {formatPrice(item.price)} تومان
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-md bg-white border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors text-earth-600"
                      >
                        −
                      </button>
                      <span className="text-sm font-bold text-earth-700 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-md bg-white border border-sand-200 flex items-center justify-center hover:bg-sand-100 transition-colors text-earth-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mr-auto p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        aria-label="حذف"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-sand-100 px-6 py-5 bg-sand-50/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-earth-600 font-medium">جمع کل</span>
              <span className="text-xl font-bold text-clay-800">{formatPrice(totalPrice)} تومان</span>
            </div>
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-gradient-to-l from-clay-600 to-clay-700 text-white text-center py-3.5 rounded-xl hover:from-clay-700 hover:to-clay-800 transition-all font-bold shadow-lg shadow-clay-200/50 hover:shadow-xl"
            >
              ادامه و تکمیل خرید
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="block w-full text-center py-2.5 text-earth-500 hover:text-clay-600 transition-colors text-sm font-medium mt-2"
            >
              ادامه خرید
            </button>
          </div>
        )}
      </div>
    </>
  );
}
