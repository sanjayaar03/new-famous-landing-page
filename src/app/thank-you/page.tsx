import { Suspense } from "react";
import { ThankYouDetails } from "@/components/ThankYouDetails";

export default function ThankYouPage() {
  return <main className="grid min-h-screen place-items-center bg-[#0b1c35] bg-[radial-gradient(circle_at_top,#1c3d65,transparent_55%)] px-4 py-14"><Suspense fallback={<div className="text-white/70">Loading order…</div>}><ThankYouDetails /></Suspense></main>;
}
