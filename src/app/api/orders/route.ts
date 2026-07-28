import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, postalCode, totalAmount, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const order = await db
      .insert(orders)
      .values({
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        postalCode: postalCode || null,
        totalAmount: String(totalAmount),
        status: "pending",
      })
      .returning();

    const orderItemsData = items.map((item: { productId: number; productName: string; quantity: number; price: number }) => ({
      orderId: order[0].id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: String(item.price),
    }));

    await db.insert(orderItems).values(orderItemsData);

    return NextResponse.json({ orderId: order[0].id, status: "success" });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
