import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, authorName, rating, comment } = body;

    if (!productId || !authorName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await db
      .insert(reviews)
      .values({
        productId,
        authorName,
        rating: Math.min(5, Math.max(1, rating)),
        comment: comment || null,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Review API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
