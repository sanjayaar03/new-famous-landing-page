"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  ["What is included in the three piece suit?", "The set includes a suit jacket, a matching waistcoat, and formal trousers."],
  ["Can I order using my own measurements?", "Custom measurement options may be available. Our team will contact you after your order to confirm your requirements."],
  ["Can I choose the colour and fabric?", "Available colours, fabrics, and designs depend on current stock and tailoring options. We will discuss the available choices during confirmation."],
  ["Is this suit suitable for weddings and parties?", "Yes. A three piece suit is a smart choice for weddings, receptions, engagement ceremonies, parties, and formal occasions."],
  ["How long does delivery take?", "Timing depends on your location and whether your suit is ready-made or requires custom stitching. We will confirm an estimated date by phone."],
  ["What is the delivery charge?", "The standard delivery charge shown here is NPR 120. If your location requires a different fee, we will confirm it before processing."],
  ["Can I request alterations?", "Please discuss alterations with our team when we call. Availability, charges, and timing depend on the required adjustment."],
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto mt-12 max-w-3xl border-t border-[#0b1c35]/15">
      {faqs.map(([question, answer], index) => (
        <div key={question} className="border-b border-[#0b1c35]/15">
          <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-6 py-6 text-left font-semibold text-[#142b4a]">
            <span>{question}</span><Plus className={`shrink-0 text-[#FBCC36] transition ${open === index ? "rotate-45" : ""}`} size={20} />
          </button>
          <div className={`grid transition-all duration-300 ${open === index ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-sm leading-7 text-[#637084]">{answer}</p></div>
        </div>
      ))}
    </div>
  );
}
