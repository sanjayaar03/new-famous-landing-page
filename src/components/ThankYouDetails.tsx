"use client";

import Link from "next/link";
import { Check, Home, PhoneCall } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { formatNpr, PRODUCT } from "@/lib/product";

export function ThankYouDetails() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "Confirmed";
  const product = params.get("product") || PRODUCT.name;
  const quantity = Math.max(1, Number(params.get("quantity")) || 1);
  const total = Number(params.get("total")) || PRODUCT.price * quantity + PRODUCT.deliveryFee;
  return (
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 text-center shadow-[0_25px_80px_rgba(11,28,53,.12)] sm:p-10">
      <div className="mx-auto grid size-20 place-items-center rounded-full bg-[#eaf5ee] text-[#237a44]"><Check size={38} strokeWidth={2.5} /></div>
      <p className="eyebrow mt-7">Order received</p><h1 className="mt-3 font-display text-5xl font-semibold leading-none text-[#0b1c35] sm:text-6xl">Thank you for your order!</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#687588]">We have received your order successfully. A confirmation email is on its way to you.</p>
      <div className="mt-8 rounded-lg bg-[#f5f3ed] p-5 text-left sm:p-6"><div className="mb-4 flex items-center justify-between border-b border-[#0b1c35]/10 pb-4"><span className="text-xs font-bold uppercase tracking-wider text-[#7a8493]">Order ID</span><strong className="text-sm text-[#0b1c35]">{orderId}</strong></div>{[["Product ordered", product], ["Quantity", quantity], ["Total price", formatNpr(total)], ["Payment method", "Cash On Delivery"]].map(([label, value]) => <div key={label} className="flex items-start justify-between gap-5 py-2 text-sm"><span className="text-[#718096]">{label}</span><strong className="text-right text-[#1e3048]">{value}</strong></div>)}</div>
      <div className="mt-6 flex gap-3 rounded-lg border border-[#d8b86c]/30 bg-[#fffaf0] p-4 text-left"><PhoneCall className="mt-0.5 shrink-0 text-[#a67827]" size={21} /><p className="text-sm font-semibold leading-6 text-[#4e4432]">Our sales representative will call you soon to confirm your order.</p></div>
      <Link href="/" className="gold-button mt-8 w-full sm:w-auto"><Home size={17} /> Back to home</Link>
    </div>
  );
}
