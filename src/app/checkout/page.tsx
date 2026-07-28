"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const shippingCost = totalPrice >= 500000 ? 0 : 45000;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          city: form.city,
          address: form.address,
          postalCode: form.postalCode,
          totalAmount: grandTotal,
          items: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        setStep("success");
        clearCart();
      }
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-clay-800 mb-3">سفارش شما ثبت شد!</h1>
          <p className="text-earth-500 mb-2">
            شماره سفارش: <span className="font-bold text-clay-700" dir="ltr">#{orderId}</span>
          </p>
          <p className="text-earth-400 text-sm mb-8">
            تأییدیه سفارش به ایمیل شما ارسال خواهد شد. از خرید شما متشکریم!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/products"
              className="bg-clay-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-clay-700 transition-colors"
            >
              ادامه خرید
            </Link>
            <Link
              href="/"
              className="bg-sand-100 text-earth-600 px-6 py-3 rounded-xl font-bold hover:bg-sand-200 transition-colors"
            >
              بازگشت به خانه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto text-sand-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-earth-400 mb-3">سبد خرید شما خالی است</h2>
          <Link
            href="/products"
            className="inline-block bg-clay-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-clay-700 transition-colors"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-clay-800">تکمیل سفارش</h1>
          <p className="text-earth-400 text-sm mt-1">اطلاعات خود را وارد کنید</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-sand-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-clay-800 mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-clay-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                اطلاعات خریدار
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-earth-600 mb-1.5">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                    placeholder="مثلاً: مریم احمدی"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-600 mb-1.5">شماره موبایل *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-600 mb-1.5">ایمیل *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>

              <h2 className="text-lg font-bold text-clay-800 mb-6 mt-8 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-clay-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                آدرس ارسال
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-earth-600 mb-1.5">شهر *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                    placeholder="تهران"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-600 mb-1.5">کد پستی</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                    placeholder="۱۲۳۴۵۶۷۸۹۰"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-earth-600 mb-1.5">آدرس کامل *</label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm resize-none"
                  placeholder="خیابان، کوچه، پلاک، واحد"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-l from-clay-600 to-clay-700 text-white py-4 rounded-xl font-bold text-lg hover:from-clay-700 hover:to-clay-800 transition-all shadow-lg shadow-clay-200/50 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    ثبت سفارش — {formatPrice(grandTotal)} تومان
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-sand-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-clay-800 mb-4">خلاصه سفارش</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-clay-800 truncate">{item.name}</p>
                      <p className="text-xs text-earth-400 mt-0.5">{item.quantity} عدد</p>
                      <p className="text-sm font-bold text-clay-600 mt-1">{formatPrice(item.price * item.quantity)} تومان</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-sand-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-earth-500">جمع محصولات</span>
                  <span className="text-earth-700 font-medium">{formatPrice(totalPrice)} تومان</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-earth-500">هزینه ارسال</span>
                  <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : "text-earth-700"}`}>
                    {shippingCost === 0 ? "رایگان" : `${formatPrice(shippingCost)} تومان`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-earth-300">خرید بالای ۵۰۰,۰۰۰ تومان = ارسال رایگان</p>
                )}
                <div className="border-t border-sand-100 pt-3 flex justify-between">
                  <span className="font-bold text-clay-800">مجموع</span>
                  <span className="text-xl font-bold text-clay-700">{formatPrice(grandTotal)} تومان</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
