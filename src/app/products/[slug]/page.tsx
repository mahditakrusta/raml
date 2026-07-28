import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailClient from "@/components/ProductDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      longDescription: products.longDescription,
      price: products.price,
      originalPrice: products.originalPrice,
      inStock: products.inStock,
      stockCount: products.stockCount,
      material: products.material,
      dimensions: products.dimensions,
      weight: products.weight,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (result.length === 0) return null;
  return result[0];
}

async function getProductImages(productId: number) {
  return db.select().from(productImages).where(eq(productImages.productId, productId)).orderBy(asc(productImages.sortOrder));
}

async function getProductReviews(productId: number) {
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
}

async function getReviewStats(productId: number) {
  const result = await db
    .select({
      avg: sql<number>`ROUND(AVG(${reviews.rating}),1)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.productId, productId));
  return { avg: Number(result[0]?.avg || 0), count: Number(result[0]?.count || 0) };
}

async function getRelatedProducts(categoryId: number, currentId: number) {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      originalPrice: products.originalPrice,
      inStock: products.inStock,
    })
    .from(products)
    .where(eq(products.categoryId, categoryId))
    .limit(5);

  const filtered = result.filter((r) => r.id !== currentId).slice(0, 4);
  const ids = filtered.map((p) => p.id);
  const imgs = ids.length > 0
    ? await db.select().from(productImages).where(sql`${productImages.productId} IN ${ids}`).orderBy(asc(productImages.sortOrder))
    : [];

  const imgMap = new Map<number, string>();
  for (const img of imgs) { if (!imgMap.has(img.productId)) imgMap.set(img.productId, img.url); }

  return filtered.map((p) => ({ ...p, image: imgMap.get(p.id) || "" }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const [images, productReviews, stats, related] = await Promise.all([
    getProductImages(product.id),
    getProductReviews(product.id),
    getReviewStats(product.id),
    product.categoryId ? getRelatedProducts(product.categoryId, product.id) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-earth-400">
            <Link href="/" className="hover:text-clay-600 transition-colors">خانه</Link>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/products" className="hover:text-clay-600 transition-colors">محصولات</Link>
            {product.categoryName && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
                <Link href={`/products?category=${product.categorySlug}`} className="hover:text-clay-600 transition-colors">
                  {product.categoryName}
                </Link>
              </>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-earth-600 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          longDescription: product.longDescription,
          price: product.price,
          originalPrice: product.originalPrice,
          inStock: product.inStock,
          stockCount: product.stockCount,
          material: product.material,
          dimensions: product.dimensions,
          weight: product.weight,
          categoryName: product.categoryName,
          categorySlug: product.categorySlug,
        }}
        images={images}
        reviews={productReviews.map((r) => ({
          ...r,
          createdAt: r.createdAt.toISOString(),
        }))}
        reviewStats={stats}
        related={related.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          price: r.price,
          originalPrice: r.originalPrice,
          image: r.image,
          inStock: r.inStock ?? undefined,
        }))}
      />
    </div>
  );
}
