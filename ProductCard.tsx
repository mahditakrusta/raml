"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    originalPrice?: string | null;
    image: string;
    categoryName?: string;
    inStock?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const price = parseInt(product.price);
  const originalPrice = product.originalPrice ? parseInt(product.originalPrice) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-sand-100/50">
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="product-image w-full h-full object-cover transition-transform duration-700"
        />
        <div className="product-overlay absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300" />
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% تخفیف
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-earth-800 text-white px-4 py-2 rounded-lg font-bold text-sm">ناموجود</span>
          </div>
        )}
      </Link>

      <div className="p-4">
        {product.categoryName && (
          <span className="text-xs text-earth-400 font-medium">{product.categoryName}</span>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-clay-800 mt-1 text-sm leading-relaxed hover:text-clay-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-clay-700 text-lg">{formatPrice(price)}</span>
            <span className="text-xs text-earth-400">تومان</span>
            {originalPrice && (
              <span className="text-xs text-earth-300 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {product.inStock !== false && (
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem({
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price,
                  image: product.image,
                });
              }}
              className="w-9 h-9 rounded-xl bg-clay-50 text-clay-600 flex items-center justify-center hover:bg-clay-600 hover:text-white transition-all duration-300 group-hover:scale-110"
              aria-label="افزودن به سبد"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
