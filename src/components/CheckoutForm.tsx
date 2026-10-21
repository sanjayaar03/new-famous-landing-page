"use client";

import { CheckCircle2, LoaderCircle, LockKeyhole, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { formatNpr, getTotal, PRODUCT } from "@/lib/product";

type Fields = { fullName: string; phone: string; email: string; location: string };
const initial: Fields = { fullName: "", phone: "", email: "", location: "" };

export function CheckoutForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuantity = Math.min(10, Math.max(1, Number(params.get("quantity")) || 1));
  const [quantity, setQuantity] = useState(initialQuantity);
  const [fields, setFields] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const total = useMemo(() => getTotal(quantity), [quantity]);

  const update = (name: keyof Fields, value: string) => {
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  function validate() {
    const next: typeof errors = {};
    if (fields.fullName.trim().length < 2) next.fullName = "Please enter your full name.";
    if (!/^[+\d][\d\s()-]{6,}$/.test(fields.phone.trim())) next.phone = "Please enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Please enter a valid email address.";
    if (fields.location.trim().length < 5) next.location = "Please share your exact delivery location.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const response = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fields, quantity }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Order submission failed.");
      const query = new URLSearchParams({ orderId: result.order.orderId, product: result.order.productName, quantity: String(result.order.quantity), total: String(result.order.totalPrice) });
      router.push(`/thank-you?${query.toString()}`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-7 lg:grid-cols-[1fr_420px] lg:items-start">
      <section className="rounded-xl border border-[#dce1e7] bg-white p-6 shadow-[0_20px_60px_rgba(11,28,53,.06)] sm:p-8">
        <div className="flex items-center gap-3 border-b border-[#e6e9ed] pb-5"><span className="grid size-9 place-items-center rounded-full bg-[#0b1c35] text-sm font-bold text-white">1</span><div><h1 className="font-display text-3xl font-semibold text-[#0b1c35]">Delivery details</h1><p className="text-xs text-[#718096]">We’ll call you to confirm your order.</p></div></div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="fullName" value={fields.fullName} error={errors.fullName} onChange={update} placeholder="Your full name" autoComplete="name" />
          <Field label="Phone number" name="phone" value={fields.phone} error={errors.phone} onChange={update} placeholder="e.g. 98XXXXXXXX" autoComplete="tel" inputMode="tel" />
          <Field label="Email address" name="email" value={fields.email} error={errors.email} onChange={update} placeholder="you@example.com" autoComplete="email" inputMode="email" />
          <div className="sm:col-span-2"><label className="mb-2 block text-sm font-bold text-[#24354d]" htmlFor="location">Exact location</label><textarea id="location" rows={4} value={fields.location} onChange={(e) => update("location", e.target.value)} placeholder="Kindly share your exact location" autoComplete="street-address" className={`field resize-none ${errors.location ? "field-error" : ""}`} aria-invalid={!!errors.location} />{errors.location && <p className="mt-1 text-xs text-[#b42318]">{errors.location}</p>}</div>
        </div>
        <div className="mt-7 rounded-lg bg-[#f4f1e9] p-4 text-sm text-[#526071]"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-[#FBCC36]" size={20} /><p><strong className="text-[#1c2d44]">No online payment required.</strong><br />Pay in cash when your order is delivered.</p></div></div>
      </section>

      <aside className="rounded-xl bg-[#0b1c35] p-6 text-white shadow-[0_24px_70px_rgba(11,28,53,.2)] sm:p-7 lg:sticky lg:top-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#FBCC36]">Order summary</p><h2 className="mt-3 font-display text-3xl font-semibold">{PRODUCT.name}</h2>
        <div className="mt-6 space-y-4 border-y border-white/12 py-5 text-sm">
          <div className="flex items-center justify-between gap-4"><span className="text-white/58">Price per piece</span><strong>{formatNpr(PRODUCT.price)}</strong></div>
          <div className="flex items-center justify-between gap-4"><span className="text-white/58">Quantity</span><div className="flex items-center rounded border border-white/20"><button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center" aria-label="Decrease quantity"><Minus size={14} /></button><strong className="w-7 text-center">{quantity}</strong><button type="button" onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="grid size-9 place-items-center" aria-label="Increase quantity"><Plus size={14} /></button></div></div>
          <div className="flex items-center justify-between gap-4"><span className="text-white/58">Delivery fee</span><strong>{formatNpr(PRODUCT.deliveryFee)}</strong></div>
        </div>
        <div className="flex items-end justify-between py-5"><span className="text-sm text-white/65">Total to pay</span><strong className="font-display text-3xl text-[#FBCC36]">{formatNpr(total)}</strong></div>
        {apiError && <div role="alert" className="mb-4 rounded-md border border-red-300/30 bg-red-400/10 p-3 text-sm leading-5 text-red-100">{apiError}</div>}
        <button disabled={submitting} className="gold-button w-full disabled:cursor-not-allowed disabled:opacity-65">{submitting ? <><LoaderCircle className="animate-spin" size={18} /> Submitting Order...</> : <>Order now — Cash on Delivery</>}</button>
        <div className="mt-5 space-y-2 text-xs text-white/55"><p className="flex items-center gap-2"><LockKeyhole size={14} className="text-[#FBCC36]" /> Your information is sent securely.</p><p className="flex items-center gap-2"><Truck size={14} className="text-[#FBCC36]" /> Delivery window: 10am–5pm.</p><p className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#FBCC36]" /> Confirmation call before processing.</p></div>
      </aside>
    </form>
  );
}

function Field({ label, name, value, error, onChange, ...inputProps }: { label: string; name: keyof Fields; value: string; error?: string; onChange: (name: keyof Fields, value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange">) {
  return <div><label className="mb-2 block text-sm font-bold text-[#24354d]" htmlFor={name}>{label}</label><input id={name} name={name} value={value} onChange={(event) => onChange(name, event.target.value)} className={`field ${error ? "field-error" : ""}`} aria-invalid={!!error} {...inputProps} />{error && <p className="mt-1 text-xs text-[#b42318]">{error}</p>}</div>;
}
