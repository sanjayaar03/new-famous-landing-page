import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/10">
      <div className="container-shell flex h-24 items-center justify-between">
        <Link
          href="/"
          className="relative block h-[82px] w-[166px] overflow-hidden rounded-md border border-[#d8b86c]/45 bg-[#102846] shadow-[0_0_28px_rgba(216,184,108,0.16)]"
          aria-label="New Famous Tailor home"
        >
          <Image
            src="/images/new-famous-tailor-logo-navy.png"
            alt="New Famous Tailor logo"
            fill
            sizes="166px"
            className="object-contain object-left [filter:brightness(1.22)_saturate(1.15)_contrast(1.05)]"
            priority
          />
        </Link>
        <Link href="/checkout?quantity=1" className="hidden rounded-sm border border-[#d8b86c]/70 px-5 py-2.5 text-sm font-bold text-[#ead69f] sm:block">Order now</Link>
      </div>
    </header>
  );
}
