import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
import Link from "next/link";
import HomeProductCard from "@/components/HomeProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      originalPrice: products.originalPrice,
      inStock: products.inStock,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(8);

  const ids = result.map((p) => p.id);
  const images = ids.length > 0
    ? await db.select().from(productImages).where(sql`${productImages.productId} IN ${ids}`).orderBy(asc(productImages.sortOrder))
    : [];

  const reviewStats = ids.length > 0
    ? await db.select({ productId: reviews.productId, avg: sql<number>`ROUND(AVG(${reviews.rating}),1)`, count: sql<number>`COUNT(*)` }).from(reviews).where(sql`${reviews.productId} IN ${ids}`).groupBy(reviews.productId)
    : [];

  const imgMap = new Map<number, string>();
  for (const img of images) { if (!imgMap.has(img.productId)) imgMap.set(img.productId, img.url); }

  const revMap = new Map<number, { avg: number; count: number }>();
  for (const r of reviewStats) { revMap.set(r.productId, { avg: Number(r.avg), count: Number(r.count) }); }

  return result.map((p) => ({
    ...p,
    image: imgMap.get(p.id) || "",
    reviewAvg: revMap.get(p.id)?.avg || 0,
    reviewCount: revMap.get(p.id)?.count || 0,
  }));
}

async function getCategories() {
  return db.select().from(categories);
}

export default async function HomePage() {
  const [featuredProducts, cats] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://postimg.cc/tYjN973T"
            alt="سفالگری دست‌ساز"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-earth-950/80 via-earth-950/50 to-earth-950/20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 bg-clay-400 rounded-full animate-pulse" />
              <span className="text-sand-100 text-sm font-medium">دست‌ساز با عشق</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
              هنر سفال ایرانی
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-clay-300 to-sand-300">در دستان شما</span>
            </h1>
            <p className="text-sand-200 text-lg mt-6 leading-relaxed max-w-md animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
              هر قطعه روایتگر داستانی از هنر کهن ایرانی است. سفال و سرامیک دست‌ساز با کیفیت بی‌نظیر.
            </p>
            <div className="flex flex-wrap gap-4 mt-8 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
              <Link
                href="/products"
                className="bg-gradient-to-l from-clay-600 to-clay-700 text-white px-8 py-3.5 rounded-xl font-bold hover:from-clay-700 hover:to-clay-800 transition-all shadow-lg shadow-clay-900/30 hover:shadow-xl hover:-translate-y-0.5"
              >
                مشاهده محصولات
              </Link>
              <Link
                href="/products?category=vases"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                گلدان‌ها
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-xs">اسکرول کنید</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-sand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🎨", title: "صد در صد دست‌ساز", desc: "ساخته شده توسط هنرمندان" },
              { icon: "🚚", title: "ارسال رایگان", desc: "خرید بالای ۵۰۰ هزار تومان" },
              { icon: "🔄", title: "ضمانت بازگشت", desc: "۷ روز ضمانت بازگشت کالا" },
              { icon: "💎", title: "کیفیت تضمینی", desc: "مواد اولیه مرغوب" },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <h3 className="font-bold text-clay-800 text-sm">{badge.title}</h3>
                  <p className="text-earth-400 text-xs mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {cats.length > 0 && (
        <section className="py-20 bg-sand-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-clay-800">دسته‌بندی محصولات</h2>
              <p className="text-earth-400 mt-3 max-w-lg mx-auto">مجموعه‌ای از زیباترین سفال و سرامیک‌های دست‌ساز ایرانی</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {cats.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/5] shadow-md hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={cat.image || ""}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-5">
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p className="text-white/70 text-sm mt-1 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center gap-1 text-clay-300 text-sm mt-3 font-medium group-hover:gap-2 transition-all">
                      <span>مشاهده</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-clay-800">محصولات ویژه</h2>
                <p className="text-earth-400 mt-3">منتخبی از بهترین آثار هنرمندان ما</p>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-clay-600 hover:text-clay-800 font-medium transition-colors group"
              >
                <span>مشاهده همه</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                    categoryName: product.categoryName ?? undefined,
                    inStock: product.inStock ?? undefined,
                  }}
                />
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-clay-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-clay-700 transition-colors"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/37328159/pexels-photo-37328159.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
            alt="کارگاه سفالگری"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-earth-950/70" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">هنر در هر لمس</h2>
          <p className="text-sand-200 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            هر قطعه سفال ما توسط هنرمندان با تجربه و با استفاده از تکنیک‌های سنتی ایرانی ساخته می‌شود.
            از خاک تا شاهکار، مسیری پر از عشق و هنر.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-clay-800 px-8 py-3.5 rounded-xl font-bold hover:bg-sand-100 transition-all shadow-lg hover:-translate-y-0.5"
          >
            کشف مجموعه
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-clay-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-clay-800 mb-3">از جدیدترین محصولات باخبر شوید</h2>
          <p className="text-earth-400 mb-8">با عضویت در خبرنامه، از تخفیف‌ها و محصولات جدید مطلع شوید.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="flex-1 px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
              dir="ltr"
            />
            <button className="bg-clay-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-clay-700 transition-colors whitespace-nowrap text-sm">
              عضویت
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
