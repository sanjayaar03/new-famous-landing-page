export const PRODUCT = {
  name: "Premium Men's Three Piece Suit",
  brand: "New Famous Tailor",
  tagline: "Perfect Fit. Timeless Style.",
  regularPrice: 10000,
  price: 7000,
  deliveryFee: 120,
  currency: "NPR",
} as const;

export const PRODUCT_IMAGES = [
  { src: "/images/tailor-navy-front.png", alt: "Premium navy three piece suit by New Famous Tailor" },
  { src: "/images/tailor-burgundy-hero.png", alt: "Premium burgundy formal suit by New Famous Tailor" },
  { src: "/images/jacket-lapel.png", alt: "Close-up of formal suit jacket and lapel" },
  { src: "/images/waistcoat-detail.png", alt: "Three piece suit waistcoat and button detail" },
  { src: "/images/stitching-detail.png", alt: "Fine suit tailoring and stitching detail" },
] as const;

export const formatNpr = (amount: number) =>
  new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);

export const getTotal = (quantity: number) =>
  PRODUCT.price * quantity + PRODUCT.deliveryFee;
