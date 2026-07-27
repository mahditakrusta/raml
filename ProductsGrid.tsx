"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  categoryName?: string;
  inStock?: boolean;
}

interface Props {
  products: Product[];
  categories: Category[];
  currentCategory?: string;
  currentSort?: string;
}

export default function ProductsGrid({ products, categories, currentCategory, currentSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-sand-100">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter("category", null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !currentCategory
                ? "bg-clay-600 text-white shadow-md"
                : "bg-sand-50 text-earth-600 hover:bg-sand-100"
            }`}
          >
            همه
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter("category", cat.slug)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentCategory === cat.slug
                  ? "bg-clay-600 text-white shadow-md"
                  : "bg-sand-50 text-earth-600 hover:bg-sand-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={currentSort || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value === "newest" ? null : e.target.value)}
          className="px-4 py-2 rounded-xl border border-sand-200 text-sm text-earth-600 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 cursor-pointer"
        >
          <option value="newest">جدیدترین</option>
          <option value="price-low">ارزان‌ترین</option>
          <option value="price-high">گران‌ترین</option>
        </select>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto text-sand-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-xl font-bold text-earth-400 mb-2">محصولی یافت نشد</h3>
          <p className="text-earth-300">فیلترهای خود را تغییر دهید یا دسته‌بندی دیگری را انتخاب کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
