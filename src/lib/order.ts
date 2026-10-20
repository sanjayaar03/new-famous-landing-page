import { z } from "zod";
import { PRODUCT, getTotal } from "./product";

export const orderInputSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(25).regex(/^[+\d][\d\s()-]+$/, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email address"),
  location: z.string().trim().min(5, "Please share your exact location").max(500),
  quantity: z.coerce.number().int().min(1).max(10),
});

export type OrderInput = z.infer<typeof orderInputSchema>;

export type Order = OrderInput & {
  orderId: string;
  dateTime: string;
  productName: string;
  pricePerPiece: number;
  deliveryFee: number;
  totalPrice: number;
  paymentMethod: "Cash On Delivery";
  orderStatus: "New Order";
  notes: string;
};

export function createOrder(input: OrderInput): Order {
  const orderId = `NFT-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const dateTime = new Intl.DateTimeFormat("en-NP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  }).format(new Date());

  return {
    ...input,
    orderId,
    dateTime,
    productName: PRODUCT.name,
    pricePerPiece: PRODUCT.price,
    deliveryFee: PRODUCT.deliveryFee,
    totalPrice: getTotal(input.quantity),
    paymentMethod: "Cash On Delivery",
    orderStatus: "New Order",
    notes: "",
  };
}
