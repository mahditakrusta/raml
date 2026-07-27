"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import ReviewStars from "./ReviewStars";
import ProductCard from "./ProductCard";
import Link from "next/link";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

interface ProductImage {
  id: number;
  productId: number;
  url: string;
  alt: string | null;
  sortOrder: number | null;
}

interface Review {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  image: string;
  inStock?: boolean;
}

interface Props {
  product: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    longDescription: string | null;
    price: string;
    originalPrice: string | null;
    inStock: boolean | null;
    stockCount: number | null;
    material: string | null;
    dimensions: string | null;
    weight: string | null;
    categoryName: string | null;
    categorySlug: string | null;
  };
  images: ProductImage[];
  reviews: Review[];
  reviewStats: { avg: number; count: number };
  related: RelatedProduct[];
}

export default function ProductDetailClient({ product, images, reviews: productReviews, reviewStats, related }: Props) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [localReviews, setLocalReviews] = useState(productReviews);

  const price = parseInt(product.price);
  const originalPrice = product.originalPrice ? parseInt(product.originalPrice) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image: images[0]?.url || "",
      },
      quantity
    );
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.name || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: reviewForm.name,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setLocalReviews([{ ...newReview, createdAt: new Date().toISOString() }, ...localReviews]);
        setReviewForm({ name: "", rating: 5, comment: "" });
        setShowReviewForm(false);
      }
    } catch (e) {
      console.error(e);
    }
    setSubmittingReview(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-sand-100">
            {images.length > 0 && (
              <img
                src={images[selectedImage]?.url}
                alt={images[selectedImage]?.alt || product.name}
                className="w-full h-full object-cover animate-fade-in"
                key={selectedImage}
              />
            )}
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                {discount}% تخفیف
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-clay-600 shadow-md"
                      : "border-sand-100 hover:border-clay-300"
                  }`}
                >
                  <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:py-4">
          {product.categoryName && (
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="inline-block text-sm text-clay-600 font-medium mb-2 hover:text-clay-800 transition-colors"
            >
              {product.categoryName}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-clay-800 leading-relaxed">
            {product.name}
          </h1>

          {/* Rating */}
          {reviewStats.count > 0 && (
            <div className="flex items-center gap-3 mt-3">
              <ReviewStars rating={Math.round(reviewStats.avg)} size="md" />
              <span className="text-sm text-earth-500">
                {reviewStats.avg} از ۵ ({reviewStats.count} نظر)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-6 p-5 bg-white rounded-2xl border border-sand-100 shadow-sm">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-clay-700">{formatPrice(price)}</span>
              <span className="text-earth-400">تومان</span>
              {originalPrice && (
                <span className="text-lg text-earth-300 line-through mr-2">{formatPrice(originalPrice)}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="mt-2 text-sm text-green-600 font-medium">
                شما {formatPrice(originalPrice! - price)} تومان صرفه‌جویی می‌کنید
              </div>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="mt-6 text-earth-600 leading-relaxed">{product.description}</p>
          )}

          {/* Specs */}
          <div className="mt-6 space-y-3">
            {product.material && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-earth-400 w-20 flex-shrink-0">جنس:</span>
                <span className="text-earth-700 font-medium">{product.material}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-earth-400 w-20 flex-shrink-0">ابعاد:</span>
                <span className="text-earth-700 font-medium">{product.dimensions}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-earth-400 w-20 flex-shrink-0">وزن:</span>
                <span className="text-earth-700 font-medium">{product.weight}</span>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-sand-200 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-earth-600 hover:bg-sand-50 transition-colors text-lg font-bold"
              >
                −
              </button>
              <span className="px-6 py-3 text-lg font-bold text-earth-700 border-x border-sand-200 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-earth-600 hover:bg-sand-50 transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-3.5 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                product.inStock
                  ? "bg-gradient-to-l from-clay-600 to-clay-700 text-white hover:from-clay-700 hover:to-clay-800 shadow-lg shadow-clay-200/50 hover:shadow-xl hover:-translate-y-0.5"
                  : "bg-earth-200 text-earth-400 cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: "🎨", text: "دست‌ساز" },
              { icon: "📦", text: "بسته‌بندی مطمئن" },
              { icon: "🔄", text: "ضمانت بازگشت" },
            ].map((badge) => (
              <div key={badge.text} className="flex flex-col items-center gap-1.5 p-3 bg-sand-50 rounded-xl text-center">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-xs text-earth-500 font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description & Reviews */}
      <div className="mt-16">
        <div className="flex gap-1 bg-white rounded-t-2xl border border-b-0 border-sand-100 overflow-hidden">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${
              activeTab === "description"
                ? "text-clay-700 bg-clay-50 border-b-2 border-clay-600"
                : "text-earth-400 hover:text-earth-600"
            }`}
          >
            توضیحات محصول
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-4 font-bold text-sm transition-colors ${
              activeTab === "reviews"
                ? "text-clay-700 bg-clay-50 border-b-2 border-clay-600"
                : "text-earth-400 hover:text-earth-600"
            }`}
          >
            نظرات ({localReviews.length})
          </button>
        </div>

        <div className="bg-white rounded-b-2xl border border-t-0 border-sand-100 p-6 md:p-8 shadow-sm">
          {activeTab === "description" ? (
            <div className="prose prose-earth max-w-none">
              <p className="text-earth-600 leading-loose text-base whitespace-pre-line">
                {product.longDescription || product.description || "توضیحاتی موجود نیست."}
              </p>
            </div>
          ) : (
            <div>
              {/* Review Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-sand-100">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-clay-700">{reviewStats.avg || "—"}</div>
                    <div className="text-xs text-earth-400 mt-1">از ۵</div>
                  </div>
                  <div>
                    <ReviewStars rating={Math.round(reviewStats.avg)} size="lg" />
                    <p className="text-sm text-earth-400 mt-1">{reviewStats.count} نظر</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-clay-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-clay-700 transition-colors"
                >
                  ثبت نظر جدید
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-8 p-6 bg-sand-50 rounded-2xl animate-fade-in-up">
                  <h3 className="font-bold text-clay-800 mb-4">نظر خود را بنویسید</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="نام شما"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-earth-500">امتیاز:</span>
                      <div className="flex gap-1" dir="ltr">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`w-8 h-8 ${star <= reviewForm.rating ? "text-amber-400" : "text-sand-200"}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      placeholder="نظر شما..."
                      rows={4}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-clay-300 text-sm resize-none"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewForm.name || !reviewForm.comment}
                      className="bg-clay-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingReview ? "در حال ارسال..." : "ارسال نظر"}
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {localReviews.length === 0 ? (
                  <p className="text-center text-earth-400 py-8">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
                ) : (
                  localReviews.map((review) => (
                    <div key={review.id} className="flex gap-4 pb-6 border-b border-sand-50 last:border-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-clay-300 to-clay-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{review.authorName[0]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-clay-800 text-sm">{review.authorName}</h4>
                          <span className="text-xs text-earth-300">
                            {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <ReviewStars rating={review.rating} size="sm" />
                        {review.comment && (
                          <p className="text-earth-600 text-sm mt-2 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-clay-800 mb-8">محصولات مشابه</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
