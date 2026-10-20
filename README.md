# New Famous Tailor — Cash on Delivery Funnel

A production-ready Next.js App Router funnel for the **Premium Men's Three Piece Suit**. It includes a responsive product landing page, checkout, thank-you page, Google Sheets order storage, business notifications, and customer confirmation emails.

> The main hero and product-gallery images are the supplied New Famous Tailor photographs, converted to optimized PNG files. Supporting detail images remain stock placeholders and should be replaced with actual close-up photographs before publishing. The supplied testimonials are visibly marked as unverified placeholders on the page.

## Recommended stack

- **Next.js App Router + TypeScript** for the site and server API
- **Tailwind CSS** for the responsive interface
- **Zod** for server-side order validation
- **Google Sheets API** with a service account for order storage
- **Nodemailer + authenticated SMTP** for Gmail-compatible HTML emails
- **Vercel** for deployment

## How the order flow works

1. A shopper chooses a quantity on the landing page.
2. The quantity is passed to `/checkout` in the URL.
3. The checkout calculates the product subtotal, NPR 120 delivery fee, and total.
4. The form sends only customer details and quantity to `POST /api/order`.
5. The server validates all fields and recalculates pricing from trusted server constants. Browser-supplied prices are never trusted.
6. The server generates a unique order ID, Nepal date/time, `Cash On Delivery` payment method, and `New Order` status.
7. The order is appended to Google Sheets.
8. A professional notification email is sent to the business.
9. A confirmation email is sent to the customer.
10. Only after these steps succeed, the browser redirects to `/thank-you`.

If any required integration fails, the API returns an error and the customer stays on checkout. The failure is logged in the Vercel server logs without exposing credentials to the browser.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and add:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public website URL, e.g. `https://example.com` |
| `BUSINESS_EMAIL` | Inbox that receives new-order emails |
| `EMAIL_FROM` | Verified sender, e.g. `New Famous Tailor <you@gmail.com>` |
| `EMAIL_REPLY_TO` | Inbox customers reach when they reply to their confirmation |
| `BRAND_NAME` | Website/email brand name |
| `GOOGLE_SHEET_ID` | ID from the spreadsheet URL |
| `GOOGLE_SHEET_TAB_NAME` | Tab name, normally `Orders` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Google service-account email |
| `GOOGLE_PRIVATE_KEY` | Service-account private key, including escaped `\n` characters |
| `SMTP_HOST` | Gmail: `smtp.gmail.com` |
| `SMTP_PORT` | Gmail STARTTLS: `587`; SSL: `465` |
| `SMTP_USER` | Authenticated SMTP account |
| `SMTP_PASS` | Gmail App Password or provider SMTP password |
| `EMAIL_SERVICE_API_KEY` | Reserved for switching to an API email provider; not required by the SMTP implementation |
| `FRONTEND_URL` | Allowed production origin, e.g. `https://example.com` |

Never commit `.env.local`.

## Google Spreadsheet setup

1. Create a Google Spreadsheet and rename its first tab to **Orders**.
2. The API will create the header row automatically if row 1 is empty. You may also add these exact columns in row 1:

   `Order ID, Date & Time, Customer Name, Phone Number, Email Address, Exact Location, Product Name, Quantity, Price Per Piece, Delivery Fee, Total Price, Payment Method, Order Status, Notes`

3. Find the Sheet ID in this URL format:

   `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`

4. In Google Cloud Console, create or select a project.
5. Enable the **Google Sheets API**.
6. Create a service account and generate a JSON key.
7. Put its `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` into `GOOGLE_PRIVATE_KEY`.
8. Open the spreadsheet’s Share dialog and share it with the service-account email as **Editor**.
9. Put the Sheet ID and tab name in the environment variables.

The integration creates the `Orders` tab when needed and keeps it presentation-ready with a navy-and-gold header, alternating row colours, frozen headings, filters, fitted columns, NPR number formatting, and a colour-coded Order Status dropdown:

- New Order
- Order Confirmed
- Order Ongoing
- Delivered
- Cancelled

To configure manually in Google Sheets, select the Order Status column below the header, choose **Data → Data validation → Dropdown**, and add the five values. Add a filter with **Data → Create a filter**.

## Gmail SMTP setup

For Gmail:

1. Enable 2-Step Verification on the sending Google account.
2. Create a Google **App Password** for Mail.
3. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_USER` to the Gmail address.
4. Put the 16-character App Password in `SMTP_PASS`.
5. Use the authenticated Gmail address in `EMAIL_FROM` unless your account has a verified alias.

The business email receives customer, product, delivery, payment, and order-status details. The customer receives the order ID, product, quantity, total, COD payment method, and confirmation-call message.

## Test the complete order submission

1. Configure a test spreadsheet and SMTP credentials in `.env.local`.
2. Run `npm run dev`.
3. Open the landing page, change quantity, and click a purchase button.
4. Complete checkout with an email inbox you can access.
5. Confirm that:
   - a new row appears in the `Orders` tab;
   - the business inbox receives the new-order email;
   - the customer inbox receives the order confirmation;
   - the browser redirects to the thank-you page with the correct order details.
6. Check spam folders during initial SMTP testing.
7. Test an invalid email and blank location to verify validation.
8. Temporarily use an invalid SMTP password to confirm the checkout shows an error and does not redirect.

Production build check:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this project to a Git repository.
2. Import the repository in Vercel.
3. Keep the detected framework as **Next.js**.
4. Add every required environment variable in **Project Settings → Environment Variables**.
5. Set `NEXT_PUBLIC_SITE_URL` and `FRONTEND_URL` to the final `https://` domain.
6. Deploy, then submit a real test order and verify both email inboxes and the spreadsheet.

The `/api/order` route explicitly uses the Node.js runtime, which supports Nodemailer on Vercel.

## Editing product details

Update prices, product name, delivery fee, and image metadata in `src/lib/product.ts`. Marketing sections are in `src/app/page.tsx`; FAQs are in `src/components/Faq.tsx`.

Because the API calculates totals from `src/lib/product.ts`, update that file whenever the displayed offer changes.

## Important production notes

- Replace stock photography with actual product photos.
- Replace sample testimonials with verified reviews and customer permission.
- Confirm delivery areas and any location-based fee policy.
- Use an email provider with a verified sending domain for the best deliverability at scale.
- Treat customer order information as private and limit spreadsheet access.
