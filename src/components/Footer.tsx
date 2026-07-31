import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-earth-950 text-earth-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 flex items-center justify-center">
                <span className="text-white text-lg font-bold">
                   {/* Logo */}
         <Link href="/" className="flex items-center gap-2 group">
  <img
  src="/logo.png"
  alt="رَمل"
  className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
/>
              </div>
              <span className="text-2xl font-bold text-white">رَمل</span>
            </div>
            <p className="text-earth-400 text-sm leading-relaxed">
              رَمل، برند سفال و سرامیک دست‌ساز ایرانی. هر قطعه با عشق و هنر ساخته شده تا زیبایی را به خانه شما بیاورد.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4">دسترسی سریع</h3>
            <ul className="space-y-2.5">
              <li><Link href="/products" className="text-earth-400 hover:text-clay-400 transition-colors text-sm">همه محصولات</Link></li>
              <li><Link href="/products?category=Flowerpot" className="text-earth-400 hover:text-clay-400 transition-colors text-sm">گلدان‌ها</Link></li>
              <li><Link href="/products?category=Bracelet" className="text-earth-400 hover:text-clay-400 transition-colors text-sm"> دستبند</Link></li>
              <li><Link href="/products?category=necklace" className="text-earth-400 hover:text-clay-400 transition-colors text-sm"> گردنبند</Link></li>
              <li><Link href="/products?category=decorative" className="text-earth-400 hover:text-clay-400 transition-colors text-sm">دکوراتیو</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-bold text-white mb-4">اطلاعات</h3>
            <ul className="space-y-2.5">
              <li><span className="text-earth-400 text-sm">درباره ما</span></li>
              <li><span className="text-earth-400 text-sm">تماس با ما</span></li>
              <li><span className="text-earth-400 text-sm">سوالات متداول</span></li>
              <li><span className="text-earth-400 text-sm">شرایط ارسال</span></li>
              <li><span className="text-earth-400 text-sm">قوانین و مقررات</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4">ارتباط با ما</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-earth-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <span>۰۲۱-۸۸۷۷۶۶۵۵</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-earth-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <span>info@raml.ir</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-earth-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span>تهران، خیابان ولیعصر، کوچه هنر، پلاک ۱۲</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-earth-800 mt-12 pt-8 text-center text-earth-500 text-sm">
          <p>© ۱۴۰۴ رَمل — سفال و سرامیک دست‌ساز. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
