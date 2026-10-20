import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { sendOrderEmails } from "@/lib/email";
import { saveOrderToGoogleSheet } from "@/lib/googleSheets";
import { createOrder, orderInputSchema } from "@/lib/order";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const allowedOrigin = process.env.FRONTEND_URL;
    const origin = request.headers.get("origin");
    if (allowedOrigin && origin && new URL(origin).origin !== new URL(allowedOrigin).origin) {
      return NextResponse.json({ success: false, error: "Request origin is not allowed." }, { status: 403 });
    }

    const json = await request.json();
    const input = orderInputSchema.parse(json);
    const order = createOrder(input);

    await saveOrderToGoogleSheet(order);
    await sendOrderEmails(order);

    return NextResponse.json({
      success: true,
      order: { orderId: order.orderId, productName: order.productName, quantity: order.quantity, totalPrice: order.totalPrice },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Please check the form and try again.", fields: error.flatten().fieldErrors }, { status: 400 });
    }
    console.error("Order submission failed:", error);
    return NextResponse.json({ success: false, error: "We could not complete your order. Please try again or contact us directly." }, { status: 500 });
  }
}
