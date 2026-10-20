import nodemailer from "nodemailer";
import type { Order } from "./order";
import { formatNpr } from "./product";

const esc = (value: string | number) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char] || char);

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}

function createTransport() {
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  return nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
    auth: {
      user: required("SMTP_USER"),
      pass: required("SMTP_PASS").replace(/\s+/g, ""),
    },
  });
}

const row = (label: string, value: string | number, strong = false) => `<tr><td style="padding:9px 0;color:#718096;font-size:13px;border-bottom:1px solid #edf0f4">${esc(label)}</td><td style="padding:9px 0;text-align:right;color:#12233d;font-size:13px;${strong ? "font-weight:800" : "font-weight:600"};border-bottom:1px solid #edf0f4">${esc(value)}</td></tr>`;

function shell(content: string, brand: string) {
  return `<!doctype html><html><body style="margin:0;background:#eef1f5;font-family:Arial,sans-serif;color:#12233d"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;background:#eef1f5"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:white;border-radius:10px;overflow:hidden;box-shadow:0 10px 35px rgba(12,28,52,.1)"><tr><td style="background:#0b1c35;padding:28px;text-align:center;color:white"><div style="font-family:Georgia,serif;font-size:27px;font-weight:bold">${esc(brand)}</div><div style="color:#d9b66f;font-size:10px;letter-spacing:2px;margin-top:6px;text-transform:uppercase">Perfect Fit. Timeless Style.</div></td></tr><tr><td style="padding:32px 28px">${content}</td></tr><tr><td style="padding:20px 28px;background:#f7f6f2;text-align:center;color:#718096;font-size:11px">This email was sent securely by ${esc(brand)}.</td></tr></table></td></tr></table></body></html>`;
}

export async function sendOrderEmails(order: Order) {
  const brand = process.env.BRAND_NAME || "New Famous Tailor";
  const transport = createTransport();
  const from = process.env.EMAIL_FROM || `${brand} <${required("SMTP_USER")}>`;
  const replyTo = process.env.EMAIL_REPLY_TO || required("SMTP_USER");

  const businessHtml = shell(`
    <div style="display:inline-block;padding:7px 11px;background:#fff3d6;color:#8b621a;border-radius:999px;font-size:11px;font-weight:bold">NEW ORDER</div>
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:18px 0 8px">A new product order has arrived.</h1>
    <p style="margin:0 0 24px;color:#718096;font-size:14px">Order ${esc(order.orderId)} • ${esc(order.dateTime)}</p>
    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#b17f2e;margin:25px 0 8px">Customer details</h2>
    <table width="100%" cellspacing="0">${row("Customer", order.fullName)}${row("Phone", order.phone)}${row("Email", order.email)}${row("Location", order.location)}</table>
    <h2 style="font-size:13px;text-transform:uppercase;letter-spacing:1.5px;color:#b17f2e;margin:25px 0 8px">Order details</h2>
    <table width="100%" cellspacing="0">${row("Product", order.productName)}${row("Quantity", order.quantity)}${row("Price per piece", formatNpr(order.pricePerPiece))}${row("Delivery", formatNpr(order.deliveryFee))}${row("Total", formatNpr(order.totalPrice), true)}${row("Payment", order.paymentMethod)}${row("Status", order.orderStatus)}</table>
    <div style="margin-top:25px;padding:17px;background:#0b1c35;color:white;border-left:4px solid #d9b66f;border-radius:4px;font-size:14px;font-weight:bold">Please call the customer soon to confirm this order.</div>
  `, brand);

  const customerHtml = shell(`
    <div style="text-align:center"><div style="display:inline-block;width:48px;height:48px;line-height:48px;border-radius:50%;background:#eaf5ee;color:#217a44;font-size:25px">✓</div><h1 style="font-family:Georgia,serif;font-size:34px;line-height:1.1;margin:18px 0 10px">Thank you, ${esc(order.fullName)}!</h1><p style="color:#718096;font-size:14px;line-height:1.7;margin:0 auto 26px;max-width:430px">We have received your order successfully. Our sales representative will call you soon to confirm your order.</p></div>
    <div style="background:#f7f6f2;padding:20px;border-radius:7px"><div style="font-size:12px;color:#718096">ORDER ID</div><div style="font-weight:800;margin-top:3px">${esc(order.orderId)}</div><table width="100%" cellspacing="0" style="margin-top:12px">${row("Product", order.productName)}${row("Quantity", order.quantity)}${row("Delivery", formatNpr(order.deliveryFee))}${row("Total price", formatNpr(order.totalPrice), true)}${row("Payment method", order.paymentMethod)}</table></div>
    <p style="margin:24px 0 0;color:#526071;font-size:13px;line-height:1.7">Need help? Reply to this email and our team will assist you.<br><br>Thank you,<br><strong>${esc(brand)}</strong></p>
  `, brand);

  const businessText = [
    `New order received: ${order.orderId}`,
    `Customer: ${order.fullName}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `Location: ${order.location}`,
    `Product: ${order.productName}`,
    `Quantity: ${order.quantity}`,
    `Total: ${formatNpr(order.totalPrice)}`,
    `Payment: ${order.paymentMethod}`,
    "Please call the customer to confirm this order.",
  ].join("\n");
  const customerText = [
    `Thank you, ${order.fullName}!`,
    `We have received your order ${order.orderId}.`,
    `Product: ${order.productName}`,
    `Quantity: ${order.quantity}`,
    `Delivery: ${formatNpr(order.deliveryFee)}`,
    `Total: ${formatNpr(order.totalPrice)}`,
    `Payment: ${order.paymentMethod}`,
    "Our sales representative will call you soon to confirm your order.",
  ].join("\n");

  await Promise.all([
    transport.sendMail({
      from,
      to: required("BUSINESS_EMAIL"),
      replyTo: order.email,
      subject: `New order received - ${order.orderId}`,
      text: businessText,
      html: businessHtml,
    }),
    transport.sendMail({
      from,
      to: order.email,
      replyTo,
      subject: `Order confirmation - ${order.orderId} | ${brand}`,
      text: customerText,
      html: customerHtml,
    }),
  ]);
}

export async function verifyEmailService() {
  await createTransport().verify();
}
