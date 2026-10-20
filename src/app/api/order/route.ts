import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { sendOrderEmails } from "@/lib/email";
import { saveOrderToGoogleSheet } from "@/lib/googleSheets";
import { createOrder, orderInputSchema } from "@/lib/order";

export const runtime = "nodejs";

function normalizeOrigin(value: string | null | undefined) {
  if (!value) return null;
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(request: NextRequest) {
  const origins = new Set<string>();

  for (const configured of [process.env.FRONTEND_URL, process.env.NEXT_PUBLIC_SITE_URL]) {
    for (const value of configured?.split(",") || []) {
      const origin = normalizeOrigin(value);
      if (origin) origins.add(origin);
    }
  }

  origins.add(request.nextUrl.origin);

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || request.nextUrl.protocol.replace(":", "");
  const currentOrigin = normalizeOrigin(host ? `${protocol}://${host}` : null);
  if (currentOrigin) origins.add(currentOrigin);

  return origins;
}

export async function POST(request: NextRequest) {
  try {
    const origin = normalizeOrigin(request.headers.get("origin"));
    if (origin && !getAllowedOrigins(request).has(origin)) {
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
