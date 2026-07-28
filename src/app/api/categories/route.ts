import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

export async function GET() {
  try {
    const result = await db.select().from(categories);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
