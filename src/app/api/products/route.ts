import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, desc, asc, sql, ilike, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const conditions = [];

    if (category) {
      conditions.push(eq(categories.slug, category));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (featured === "true") {
      conditions.push(eq(products.featured, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Sort
    const orderBy = sort === "price-low" ? asc(products.price) :
                    sort === "price-high" ? desc(products.price) :
                    desc(products.createdAt);

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        featured: products.featured,
        inStock: products.inStock,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderBy);

    // Get first image for each product
    const productIds = result.map((p) => p.id);
    const images = productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(sql`${productImages.productId} IN ${productIds}`)
          .orderBy(asc(productImages.sortOrder))
      : [];

    // Get review counts/averages
    const reviewStats = productIds.length > 0
      ? await db
          .select({
            productId: reviews.productId,
            avgRating: sql<number>`ROUND(AVG(${reviews.rating}), 1)`,
            count: sql<number>`COUNT(*)`,
          })
          .from(reviews)
          .where(sql`${reviews.productId} IN ${productIds}`)
          .groupBy(reviews.productId)
      : [];

    const imageMap = new Map<number, string>();
    for (const img of images) {
      if (!imageMap.has(img.productId)) {
        imageMap.set(img.productId, img.url);
      }
    }

    const reviewMap = new Map<number, { avgRating: number; count: number }>();
    for (const rs of reviewStats) {
      reviewMap.set(rs.productId, { avgRating: Number(rs.avgRating), count: Number(rs.count) });
    }

    const enriched = result.map((p) => ({
      ...p,
      image: imageMap.get(p.id) || "",
      reviewAvg: reviewMap.get(p.id)?.avgRating || 0,
      reviewCount: reviewMap.get(p.id)?.count || 0,
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
