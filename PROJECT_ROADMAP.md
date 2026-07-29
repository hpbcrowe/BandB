# BANDB Project Roadmap

#Make sure directory structure follows Next.js recommendations and the structure that has been followed on this project.

## Near-term feature improvements

1. Order detail page
   - Refactor the orders list (user and admin) into a summary view: order date, total charged, delivery status badge, and a "View Details" link per order.
   - Clicking "View Details" navigates to a dynamic route:
     - User side: `/dashboard/user/orders/[orderid]`
     - Admin side: `/dashboard/admin/orders/[orderid]`
   - Recent orders (summary) list shows:
     - Order date
     - Total charged
     - Delivery status badge
     - "View Details" link/button
   - View Details page shows:
     - Product thumbnail image for each item sold (alongside quantity, title, and price)
     - Full itemized cart contents (quantity, title, price, line total)
     - Charge ID and payment intent
     - Receipt link
     - Full shipping address
     - Payment status and refund status
     - Delivery status (with status timeline, see item 2)
     - Admin-only: status update control and cancel/refund action
     - User-only: "Cancel Order" action while status is "Not Processed"
   - New API endpoints needed:
     - `GET /api/user/orders/[orderid]` (ownership-checked)
     - `GET` handler added to `app/api/admin/orders/[orderid]/route.js` (alongside existing `PUT`)
   - Make order history easier to understand than a simple list.

2. Order status timeline
   - Displayed on the order detail page (`[orderid]` route from item 1), positioned below the order date/total header and above the itemized product list.
   - Add a progress view for: Placed → Processing → Shipped → Delivered.
     - Completed/current steps shown filled or checked; future steps greyed out.
   - Support canceled and refunded states clearly.
     - Replace the timeline with a distinct "Cancelled/Refunded" indicator instead of a partial/broken progress bar.
   - Not shown on the summary orders list — the list keeps just the status badge to stay scannable.

3. Wishlist / save-for-later
   - Reuses the existing `likes` array on the Product model and the existing `GET /api/user/product/like` endpoint (already returns all products liked by the current user) — no new like/unlike backend logic needed.
   - New dedicated page: `/dashboard/user/wishlist/page.js`, linked from the user dashboard nav alongside "Orders".
   - Displays liked products using the existing `ProductCard` component (image, title, price, Add to Cart) plus an unlike action to remove from the wishlist.
   - Add a wishlist button on product cards and product detail pages.
   - Allow users to save products without adding them to cart immediately.

4. User profile and address book
   - Let users update profile details and save multiple shipping addresses.
   - Improve checkout speed and reduce repetitive entry.

5. Product recommendations
   - Displayed on the product detail page (`app/product/[slug]/page.js`), filling the existing empty "Related Products" heading placeholder — positioned below the main product info/AddToCart and above the reviews section.
   - Not shown during checkout — keep the checkout steps focused on completing payment to avoid distraction/cart abandonment.
   - Query same-category or same-tag products (excluding the current product) and render them with the existing `ProductCard` component.
   - Add related products or “customers also bought” sections.
   - Increase upsell and cross-sell opportunities.

6. Search autocomplete
   - Improve search with instant suggestions while the user types.

7. Coupon/promo history
   - Show previously used coupons and applied discounts in the account area.

8. Better empty states
   - Add polished empty states for cart, orders, wishlist, and search results.

9. Guest checkout
   - `app/login/page.js` currently requires a NextAuth-authenticated account before checkout; there is no path through `components/cart/Step1.js`/`Step2.js`/`Step3.js` that skips account creation. Forcing sign-up is a common cause of cart abandonment.
   - Add a "Continue as guest" option at the start of checkout that collects email + shipping address without creating a `User` record.
   - `app/api/user/stripe/session/route.js` and the webhook handler (`app/api/webhook/route.js`) need to accept an order with no `userId` (make `userId` optional on `models/order.js`) and instead store the guest email directly on the order for receipt/lookup purposes.
   - Medium difficulty — mostly a checkout flow branch plus relaxing the `userId` requirement on `Order`.

10. Product variants (size/color/shade)
    - `models/product.js` currently has only single `color` and `brand` string fields — no way to model "same product, multiple options with separate stock," which is especially common for beauty/cosmetics (shade selection).
    - Add a `variants` array to the product schema (e.g., `{ label, sku, stock, priceAdjustment }`) and update `stock` tracking to be per-variant instead of per-product.
    - Update `components/product/ProductCreate.js` (admin) to manage variants, and product detail/cart pages to require a variant selection before "Add to Cart."
    - Medium-High difficulty — schema change plus UI updates across product creation, product detail, cart, and order line items.

11. Recently viewed products
    - Track product slugs/IDs in `localStorage` as users browse product pages (no schema change needed).
    - Render a "Recently viewed" row on the shop/home page or product detail page using the existing `ProductCard` component.
    - Low difficulty — purely client-side, no new API endpoints required.

12. Returns & exchanges (RMA)
    - Currently `app/api/user/orders/refund/route.js` only supports full-order cancellation while `delivery_status === "Not Processed"` — there is no post-delivery return/exchange process.
    - Add a `returnRequest` sub-object to `models/order.js` (status: requested/approved/rejected/completed, reason, requested items).
    - User-side: a "Request Return" action on the order detail page (see item 1) once `delivery_status === "Delivered"`, within a return window (e.g., 30 days of delivery).
    - Admin-side: approve/reject return requests, trigger Stripe refund on approval.
    - Medium-High difficulty — new schema, new user + admin UI, and Stripe refund integration for partial/full returns.

## SEO & Discoverability

1. Sitemap and robots.txt
   - No `app/sitemap.js` or `app/robots.js` currently exists. Next.js has built-in support for both via file-based metadata routes.
   - `app/sitemap.js` should enumerate all product slugs (`models/product.js`) and category/tag pages dynamically from the database.
   - Low difficulty.

2. Structured data (JSON-LD)
   - `app/product/[slug]/page.js` already has `generateMetadata` for Open Graph tags but no `Product` schema markup (price, availability, rating).
   - Add a JSON-LD `<script type="application/ld+json">` block using existing product data (`price`, `stock`, `ratings` average) to improve search result rich snippets.
   - Low difficulty — purely additive to the existing product page.

## Analytics & Observability

1. Conversion/analytics tracking
   - No analytics is currently instrumented anywhere in the app.
   - Add Google Analytics 4 (or a privacy-focused alternative like Plausible/Vercel Analytics) via a script in `app/layout.js`.
   - Track key e-commerce events: product view, add-to-cart, checkout start, purchase complete (fire from the webhook handler `app/api/webhook/route.js` for purchase-complete since that's the authoritative order-creation point).
   - Low difficulty, but valuable as a prerequisite for measuring whether the other roadmap features (recommendations, wishlist, autocomplete) actually move the needle.

## Admin improvements

1. Admin sales dashboard
   - Add charts for revenue, recent orders, and top-selling products.

2. Inventory alerts
   - Extend the existing admin product list (`components/admin/ProductList.js`), which currently doesn't display stock at all — add a stock count/badge to each product card rather than building a separate low-stock-only page.
   - Highlight cards where stock is low (e.g., red border/badge if `stock <= 5`) and mark out-of-stock items (`stock === 0`) distinctly, while still showing all products for full inventory context.
   - Optional: add a "Low Stock" filter toggle on the same page so admins can narrow the view without losing context.
   - Add a units-sold filter (past month / 3 months / 6 months / year) to the same product list, showing how many units of each product sold in the selected window.
     - `Product.sold` is a lifetime running total with no time dimension, so this requires a new aggregation against the `Order` collection: sum `cartItems.quantity` grouped by `cartItems.product`, filtered by `Order.createdAt` within the selected range.
     - No schema changes needed — `Order.cartItems` already stores `product` ref, `quantity`, and orders already have `createdAt`.
     - New admin API endpoint, e.g. `GET /api/admin/product/sales?range=30d|90d|180d|365d`.
   - Add a low-stock summary/count alert to the admin dashboard placeholder (`app/dashboard/admin/page.js`) that links back to the product list.
   - Highlight low-stock products and allow quick restocking actions.

3. Review moderation
   - Centralized admin screen, not per-product: new page `/dashboard/admin/reviews/page.js` listing reviews flattened across all products (populated with product title/slug), rather than requiring admins to hide reviews from each individual product page.
     - New endpoint `GET /api/admin/reviews`, paginated, sortable/filterable by rating (lowest first), product, or hidden status.
   - Add a `hidden: Boolean` field (default `false`) to the `ratingSchema` in `models/product.js`, plus `PUT /api/admin/reviews/[reviewId]` to hide/unhide/delete a review.
   - `components/product/UserReviews.js` filters out `hidden` reviews on the public product page so moderation takes effect without deleting data.
   - Negative review alerting: no email service is currently wired up (only an unused transitive `nodemailer` dependency), so start with an in-app alert:
     - Flag ratings submitted with `rating <= 2` in `app/api/user/product/rating/route.js`.
     - Show a "⚠️ N new negative reviews" badge/count on the admin dashboard placeholder (`app/dashboard/admin/page.js`), linking to the reviews page filtered to flagged/unseen negative reviews.
     - Email notifications are a possible later enhancement once a mail provider is added to the stack.
   - Allow admins to approve, hide, or delete user reviews.

## Messaging & email

Recommended build order: item 1 (admin email alerts) first — introduces the email provider with the smallest blast radius. Item 2 (support messaging) next — build in-app, then wire in the email provider from item 1 for notifications. Item 3 (magic-link auth) last — riskiest since it touches the existing session/auth structure that's currently working reliably in production.

No dedicated email package (nodemailer, Resend, SendGrid, etc.) is currently a direct dependency — only present transitively. None of the below can be built without first choosing and wiring up an email provider.

1. Admin email alerts (low stock / negative reviews) — Low-Medium difficulty
   - Pick a transactional email provider (Resend is the easiest to integrate with Next.js).
   - Add a `utils/sendEmail.js` helper.
   - Call it from existing trigger points: the rating POST route (`app/api/user/product/rating/route.js`) for negative reviews (`rating <= 2`), and a stock-check after order webhook processing (`app/api/webhook/route.js`) for low inventory.
   - Purely additive — no schema or auth changes required.

2. Customer-to-admin messaging / support Q&A — Medium-High difficulty
   - No existing data model for this today; requires a new `Message`/`Ticket` model (sender, subject, body, status, replies).
   - New user-facing "Contact/Ask a Question" page + form.
   - New admin inbox page to view/reply to messages.
   - Build as in-app messaging first (reuses existing auth/dashboard patterns), then bolt on email notifications using the same provider from item 1.

3. Email verification / passwordless sign-in — Medium difficulty
   - NextAuth already supports this via `EmailProvider` (magic links) — mostly configuration, not custom code, once an email transport exists.
   - Add `EmailProvider` to `utils/authOptions.js` alongside the existing Google/Credentials providers.
   - Requires a database adapter (e.g. `MongoDBAdapter`) for NextAuth's `verification_tokens` collection — the app currently uses JWT-only sessions with no adapter, so this is a bigger structural change than it sounds.
   - Complexity comes from reconciling a DB adapter with the existing custom `role`-on-token logic in `utils/authOptions.js`.
   - Note: `models/user.js` already has an unused `resetCode`/`expiresAt` field, suggesting email-based password reset was planned but never wired up — could be revisited alongside this.

4. Order confirmation emails — Low difficulty once an email provider exists
   - `app/api/webhook/route.js` creates the `Order` record on `checkout.session.completed` but never sends a receipt/confirmation email — currently the only confirmation is the Stripe-hosted `receipt_url` field stored on the order.
   - Once the provider from item 1 is wired up, send a confirmation email (order summary, itemized products, shipping address, receipt link) immediately after the order is saved in the webhook handler.
   - Reuses the same `utils/sendEmail.js` helper introduced in item 1.

5. Abandoned cart recovery — Medium difficulty
   - No mechanism currently exists to follow up with users who added items to `context/cart.js` state but never completed checkout (cart state is client-side only, not persisted server-side).
   - Requires persisting in-progress carts server-side (e.g., a `Cart` model tied to `userId` or a session identifier for guests) so they can be queried after the fact.
   - Needs a scheduled job (Vercel Cron or similar) that finds carts inactive for N hours and sends a reminder email via the item 1 provider.
   - Higher complexity than other messaging items because it requires new server-side cart persistence, not just a notification trigger.

## Stripe production checklist

1. Configure Stripe webhook endpoint in the Stripe Dashboard.
   - Production URL should be: https://beautyandthebuckaroo.vercel.app/api/webhook

2. Subscribe the webhook endpoint to the event:
   - checkout.session.completed

3. Set the production webhook signing secret in Vercel environment variables.
   - Variable name: STRIPE_WEBHOOK_SECRET

4. Ensure the Stripe secret key used in production is the live secret key, not the test key.

5. Confirm the success URL in checkout uses the deployed domain, not localhost.
   - Example: https://beautyandthebuckaroo.vercel.app/dashboard/user/stripe/success

6. Verify that the production app can receive and process webhook events successfully.
   - Check Stripe Dashboard webhook delivery logs for 2xx responses.

7. Confirm that orders are created in the database after successful checkout.
   - Test a real purchase and verify that the order appears in the user dashboard.

8. Verify auth/session settings in production.
   - Make sure NEXTAUTH_SECRET and NEXTAUTH_URL are configured correctly in Vercel.

9. Monitor logs after deployment.
   - Watch for Stripe signature verification errors or missing user/session errors.

10. Tax by region (Stripe Tax)
    - `config.js` currently sets a single flat `STRIPE_TAX_RATE` applied to every order regardless of shipping address/region.
    - Enable [Stripe Tax](https://stripe.com/tax) on the checkout session created in `app/api/user/stripe/session/route.js` (`automatic_tax: { enabled: true }`) to calculate correct tax by shipping destination instead of a flat rate.
    - Low-Medium difficulty — mostly Stripe dashboard configuration plus a small change to the checkout session creation call.
