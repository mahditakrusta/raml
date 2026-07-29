import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, asc, desc, sql, ilike } from "drizzle-orm";
import ProductsGrid from "@/components/ProductsGrid";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; sort?: string; search?: string }>;
}

async function getProducts(category?: string, sort?: string, search?: string) {
  let query = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      originalPrice: products.originalPrice,
      inStock: products.inStock,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      createdAt: products.createdAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id));

  if (category) {
    query = query.where(eq(categories.slug, category)) as typeof query;
  }
  if (search) {
    query = query.where(ilike(products.name, `%${search}%`)) as typeof query;
  }

  const orderBy =
    sort === "price-low" ? asc(products.price) :
    sort === "price-high" ? desc(products.price) :
    desc(products.createdAt);

  const result = await query.orderBy(orderBy);

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

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category;
  const sort = params.sort;
  const search = params.search;

  const [allProducts, cats] = await Promise.all([
    getProducts(category, sort, search),
    getCategories(),
  ]);

  const currentCategory = cats.find((c) => c.slug === category);

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-earth-950 to-earth-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
         <div className="relative h-[450px] w-full">
  <img
    src="https://raml-word.onrender.com/banner.jpg"
    alt="Products"
    className="h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
    <h1 className="text-5xl font-bold text-white">
      Our Collection
    </h1>
  </div>
</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1 className="text-3xl md:text-4xl font-bold">
            {currentCategory ? currentCategory.name : search ? `جستجو: ${search}` : "همه محصولات"}
          </h1>
          <p className="text-sand-300 mt-3 text-lg">
            {currentCategory?.description || "مجموعه کامل سفال و سرامیک دست‌ساز رَمل"}
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-sand-400">
            <span>{allProducts.length} محصول</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsGrid
          products={allProducts.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image,
            categoryName: p.categoryName ?? undefined,
            inStock: p.inStock ?? undefined,
          }))}
          categories={cats}
          currentCategory={category}
          currentSort={sort}
        />
      </div>
    </div>
  );
}
