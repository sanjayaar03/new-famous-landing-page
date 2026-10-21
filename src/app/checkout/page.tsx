import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f7] pb-16">
      <header className="bg-[#0b1c35] py-2 text-white">
        <div className="container-shell flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft size={16} /> Back
          </Link>
          <Link
            href="/"
            className="relative block h-16 w-[130px] overflow-hidden rounded-md border border-[#d8b86c]/40 bg-[#102846] shadow-[0_0_22px_rgba(216,184,108,0.14)]"
            aria-label="New Famous Tailor home"
          >
            <Image
              src="/images/new-famous-tailor-logo-navy.png"
              alt="New Famous Tailor logo"
              fill
              sizes="130px"
              className="object-contain [filter:brightness(1.22)_saturate(1.15)_contrast(1.05)]"
              priority
            />
          </Link>
          <span className="w-12" />
        </div>
      </header>
      <div className="container-shell pt-10"><div className="mb-8 text-center"><p className="eyebrow">Cash on delivery</p><h1 className="mt-3 font-display text-4xl font-semibold text-[#0b1c35] sm:text-5xl">Complete your order</h1><p className="mt-2 text-sm text-[#718096]">It only takes a minute. No card required.</p></div><Suspense fallback={<div className="py-24 text-center text-[#718096]">Loading checkout…</div>}><CheckoutForm /></Suspense></div>
    </main>
  );
}
