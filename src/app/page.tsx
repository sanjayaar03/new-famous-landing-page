import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CheckCircle2, Headphones, Ruler, Scissors, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Header } from "@/components/Header";
import { MotionEnhancements } from "@/components/MotionEnhancements";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Faq } from "@/components/Faq";
import { formatNpr, PRODUCT } from "@/lib/product";

const benefits = [
  { icon: Sparkles, title: "Elegant presence", text: "A polished, coordinated look for the moments that deserve your best." },
  { icon: Scissors, title: "Complete three piece set", text: "Matching jacket, waistcoat, and formal trousers—ready to style together." },
  { icon: CalendarCheck, title: "Made for occasions", text: "Ideal for weddings, receptions, celebrations, and important meetings." },
  { icon: Ruler, title: "Fitting support", text: "Discuss custom measurements and alteration options with our tailoring team." },
];

const testimonials = [
  "The suit looked smart and elegant. I was happy with the overall stitching and finishing.",
  "I ordered a suit for a special occasion and liked the overall design and appearance.",
  "The three piece design is stylish and suitable for formal events. I enjoyed wearing it.",
];

export default function Home() {
  return (
    <main>
      <MotionEnhancements />
      <section className="relative min-h-[760px] overflow-hidden bg-[#08172b] text-white">
        <Header />
        <div className="absolute inset-0 opacity-55"><Image src="/images/tailor-burgundy-hero.png" alt="" fill priority sizes="100vw" className="object-cover object-[70%_center] sm:object-center" /></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,30,.98)_0%,rgba(5,15,30,.83)_43%,rgba(5,15,30,.15)_75%),linear-gradient(0deg,rgba(5,15,30,.8)_0%,transparent_40%)]" />
        <div className="container-shell relative z-10 flex min-h-[760px] items-center pt-24">
          <div className="hero-sequence max-w-2xl py-20">
            <p className="eyebrow">New Famous Tailor • Signature Collection</p>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[.9] sm:text-7xl lg:text-[6.4rem]">Dress smart.<br /><span className="text-[#d8b86c]">Arrive confident.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg">A refined three-piece suit for weddings, celebrations, and the professional moments that matter. One complete look, tailored around you.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/checkout?quantity=1" className="gold-button">Purchase now <ArrowRight size={18} /></Link>
              <a href="#order" className="outline-button">Explore the suit</a>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/15 pt-6 text-xs text-white/65">
              <span><strong className="mb-1 block text-sm text-white">3-piece</strong>Complete set</span>
              <span><strong className="mb-1 block text-sm text-white">30% off</strong>Limited offer</span>
              <span><strong className="mb-1 block text-sm text-white">COD</strong>Pay on delivery</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-5 shadow-sm" data-reveal>
        <div className="container-shell grid gap-4 sm:grid-cols-3">
          {[{ icon: ShieldCheck, t: "Cash on Delivery", s: "Pay when your order arrives" }, { icon: Truck, t: "Careful Delivery", s: "Orders delivered 10am–5pm" }, { icon: Headphones, t: "Personal Support", s: "Confirmation call from our team" }].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center justify-center gap-3 py-3 sm:border-r sm:last:border-0"><Icon className="text-[#b88939]" size={22} /><span><strong className="block text-sm text-[#142b4a]">{t}</strong><span className="text-xs text-[#738094]">{s}</span></span></div>
          ))}
        </div>
      </section>

      <ProductShowcase />

      <section className="bg-[#0b1c35] py-20 text-white lg:py-28" data-reveal>
        <div className="container-shell">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
            <div><p className="eyebrow">Why choose this suit</p><h2 className="section-title mt-4">Tailored for your<br />important moments.</h2></div>
            <p className="max-w-xl justify-self-end text-sm leading-7 text-white/62">Formalwear should help you feel ready, not overthink the details. This coordinated set gives you a strong foundation, with the flexibility to wear each piece your way.</p>
          </div>
          <div className="motion-card-grid mt-14 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="bg-[#102541] p-7 lg:min-h-64"><span className="font-display text-sm text-[#d8b86c]">0{index + 1}</span><Icon className="mt-8 text-[#d8b86c]" size={28} /><h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/58">{text}</p></article>
            ))}
          </div>
          <div className="mt-10 text-center"><Link href="/checkout?quantity=1" className="gold-button">Buy now for {formatNpr(PRODUCT.price)} <ArrowRight size={18} /></Link></div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28" data-reveal>
        <div className="container-shell">
          <div className="mx-auto max-w-2xl text-center"><p className="eyebrow">Customer impressions</p><h2 className="section-title mt-4">A look people remember.</h2><p className="mt-5 text-sm leading-6 text-[#697587]">Sample review copy supplied for layout preview. Replace with verified customer feedback and names before publishing.</p></div>
          <div className="motion-card-grid mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((quote, index) => (
              <figure key={quote} className="relative rounded-sm border border-[#0b1c35]/10 bg-[#faf9f6] p-7"><div className="font-display text-5xl leading-none text-[#c79b4a]">“</div><blockquote className="mt-4 font-display text-2xl leading-8 text-[#142b4a]">{quote}</blockquote><figcaption className="mt-7 border-t border-[#0b1c35]/10 pt-5 text-xs font-bold uppercase tracking-widest text-[#748094]">Sample customer {index + 1} • Unverified</figcaption></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f4f1e9] py-20 lg:py-28" data-reveal>
        <div className="container-shell"><div className="text-center"><p className="eyebrow">Good to know</p><h2 className="section-title mt-4">Frequently asked questions.</h2></div><Faq /></div>
      </section>

      <section className="final-cta relative overflow-hidden bg-[#071426] py-24 text-center text-white" data-reveal>
        <div className="absolute inset-0 opacity-15"><Image src="/images/jacket-lapel.png" alt="" fill sizes="100vw" className="object-cover" /></div>
        <div className="container-shell relative"><CheckCircle2 className="mx-auto text-[#d8b86c]" size={34} /><p className="eyebrow mt-6">Find your perfect fit</p><h2 className="mx-auto mt-4 max-w-4xl font-display text-5xl font-semibold leading-none sm:text-7xl">Make your next occasion look exceptional.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/65">Place your cash-on-delivery order today. Our sales representative will call to confirm your order and discuss fit, colour, and available options.</p><Link href="/checkout?quantity=1" className="gold-button mt-9">Order your suit <ArrowRight size={18} /></Link></div>
      </section>

      <footer className="bg-[#06101f] py-8 text-white/55"><div className="container-shell flex flex-col gap-3 text-center text-xs sm:flex-row sm:justify-between sm:text-left"><span>© {new Date().getFullYear()} New Famous Tailor</span><span>Perfect Fit. Timeless Style. • Cash on Delivery</span></div></footer>

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden"><Link href="/checkout?quantity=1" className="gold-button w-full shadow-2xl">Order now — {formatNpr(getTotalForOne())}</Link></div>
    </main>
  );
}

function getTotalForOne() {
  return PRODUCT.price + PRODUCT.deliveryFee;
}
