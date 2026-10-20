"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { formatNpr, getTotal, PRODUCT, PRODUCT_IMAGES } from "@/lib/product";

const benefits = [
  "Jacket, matching waistcoat & formal trousers",
  "Smart choice for weddings and formal occasions",
  "Measurement and fitting support available",
  "Careful stitching and polished finishing",
];

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const next = () => setActive((value) => (value + 1) % PRODUCT_IMAGES.length);
  const previous = () => setActive((value) => (value - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);

  return (
    <section id="order" className="bg-[#f4f1e9] py-20 lg:py-28" data-reveal>
      <div className="container-shell grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div className="reveal-from-left">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-[#dfe4e9] shadow-[0_30px_80px_rgba(11,28,53,.14)]">
            <Image src={PRODUCT_IMAGES[active].src} alt={PRODUCT_IMAGES[active].alt} fill sizes="(max-width:1024px) 100vw, 52vw" className="object-cover transition duration-700" priority={active === 0} />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#071426]/85 to-transparent p-5 pt-24 text-white">
              <p className="text-sm font-semibold">{String(active + 1).padStart(2, "0")} / {String(PRODUCT_IMAGES.length).padStart(2, "0")}</p>
              <div className="flex gap-2">
                <button onClick={previous} aria-label="Previous product image" className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur"><ChevronLeft size={18} /></button>
                <button onClick={next} aria-label="Next product image" className="grid size-11 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {PRODUCT_IMAGES.map((image, index) => (
              <button key={image.src} onClick={() => setActive(index)} aria-label={`Show image ${index + 1}`} className={`relative aspect-square overflow-hidden rounded-sm border-2 ${active === index ? "border-[#c79b4a]" : "border-transparent opacity-65"}`}>
                <Image src={image.src} alt="" fill sizes="100px" className="object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#637084]">Styled stock photography for presentation. Replace with actual product photographs before publishing.</p>
        </div>

        <div className="reveal-from-right lg:pl-8">
          <p className="eyebrow">Signature formalwear</p>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[.96] text-[#0b1c35] sm:text-6xl">{PRODUCT.name}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#526071]">A coordinated three-piece look designed to make important occasions feel effortless. Classic structure, refined detail, and styling flexibility in one complete set.</p>

          <div className="mt-7 space-y-3">
            {benefits.map((benefit) => <div key={benefit} className="flex items-start gap-3 text-sm font-semibold text-[#25344a]"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#d9b66f]/25 text-[#9a6a1c]"><Check size={13} strokeWidth={3} /></span>{benefit}</div>)}
          </div>

          <div className="mt-8 flex items-end gap-4 border-y border-[#0b1c35]/10 py-6">
            <div><p className="text-xs uppercase tracking-widest text-[#758093]">Offer price</p><p className="mt-1 font-display text-4xl font-bold text-[#0b1c35]">{formatNpr(PRODUCT.price)}</p></div>
            <div className="pb-1"><p className="text-sm text-[#8490a0] line-through">{formatNpr(PRODUCT.regularPrice)}</p><p className="text-xs font-extrabold uppercase tracking-wider text-[#9b6a1b]">Save 30%</p></div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#697587]">Quantity</p>
              <div className="flex h-12 items-center rounded-sm border border-[#ccd2da] bg-white">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center" aria-label="Decrease quantity"><Minus size={16} /></button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="grid size-12 place-items-center" aria-label="Increase quantity"><Plus size={16} /></button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-[#697587]">Total incl. delivery</p>
              <p className="mt-1 font-display text-3xl font-bold text-[#0b1c35]">{formatNpr(getTotal(quantity))}</p>
              <p className="text-xs text-[#697587]">Delivery {formatNpr(PRODUCT.deliveryFee)}</p>
            </div>
          </div>

          <Link href={`/checkout?quantity=${quantity}`} className="gold-button mt-7 w-full text-base">Purchase now <ChevronRight size={18} /></Link>
          <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#5d6979]">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#a77929]" /> Cash on delivery</span>
            <span className="flex items-center gap-2"><Truck size={16} className="text-[#a77929]" /> Delivery 10am–5pm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
