import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, asc, desc, sql } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        longDescription: products.longDescription,
        price: products.price,
        originalPrice: products.originalPrice,
        featured: products.featured,
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

    if (result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = result[0];

    // Get images
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder));

    // Get reviews
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(desc(reviews.createdAt));

    // Average rating
    const avgResult = await db
      .select({
        avg: sql<number>`ROUND(AVG(${reviews.rating}), 1)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, product.id));

    // Related products
    const related = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        originalPrice: products.originalPrice,
        inStock: products.inStock,
      })
      .from(products)
      .where(eq(products.categoryId, product.categoryId!))
      .limit(5);

    const relatedIds = related.filter((r) => r.id !== product.id).map((r) => r.id);
    const relatedImages = relatedIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(sql`${productImages.productId} IN ${relatedIds}`)
          .orderBy(asc(productImages.sortOrder))
      : [];

    const relatedImageMap = new Map<number, string>();
    for (const img of relatedImages) {
      if (!relatedImageMap.has(img.productId)) {
        relatedImageMap.set(img.productId, img.url);
      }
    }

    return NextResponse.json({
      ...product,
      images,
      reviews: productReviews,
      reviewAvg: avgResult[0]?.avg ? Number(avgResult[0].avg) : 0,
      reviewCount: Number(avgResult[0]?.count || 0),
      related: related
        .filter((r) => r.id !== product.id)
        .slice(0, 4)
        .map((r) => ({
          ...r,
          image: relatedImageMap.get(r.id) || "",
        })),
    });
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
