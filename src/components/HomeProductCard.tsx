"use client";

import ProductCard from "./ProductCard";

interface HomeProductCardProps {
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

export default function HomeProductCard({ product }: HomeProductCardProps) {
  return <ProductCard product={product} />;
}
