import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10">
      <div className="container-shell flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-white" aria-label="New Famous Tailor home">
          <span className="relative h-[66px] w-[76px] shrink-0 sm:h-[74px] sm:w-[86px]">
            <Image src="/images/nft-logo.png" alt="New Famous Tailor logo" fill sizes="86px" className="object-contain" priority />
          </span>
          <span>
            <span className="block font-display text-[1.35rem] font-bold leading-none sm:text-[1.75rem]">New Famous Tailor</span>
            <span className="mt-1.5 block text-[8px] font-bold uppercase tracking-[.2em] text-[#d8b86c] sm:text-[9px] sm:tracking-[.24em]">Perfect Fit. Timeless Style.</span>
          </span>
        </Link>
        <Link href="/checkout?quantity=1" className="hidden rounded-sm border border-[#d8b86c]/70 px-5 py-2.5 text-sm font-bold text-[#ead69f] sm:block">Order now</Link>
      </div>
    </header>
  );
}
