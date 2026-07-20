# Archetype: E-commerce Store

## First Decision: Platform vs Custom

Before any stack talk, decide the build model. This is the fork that changes everything:

| Model | When | Trade-off |
|-------|------|-----------|
| **Shopify (hosted)** | Selling physical products, need to launch fast, ops (inventory, shipping, taxes) matter more than custom UX | Fastest to revenue; monthly fee + transaction cut; theme-level customization only |
| **Headless Shopify** (Storefront API + Next.js) | Shopify ops + fully custom storefront UX | Best of both; two systems to maintain; Shopify plan still required |
| **Custom** (Next.js + Supabase + Stripe) | Digital products, few SKUs, subscriptions, or the store IS the product (custom flows Shopify can't do) | Full control; you own cart, checkout edge cases, taxes, emails — real work |

Rule of thumb: physical products + standard catalog → Shopify or headless. Digital/services/subscriptions or deeply custom buying flow → custom.

## Default Stack Recommendation (custom build)

| Layer | Default | Alternative | When to Switch |
|-------|---------|-------------|----------------|
| Framework | Next.js 15 (App Router) | Astro + islands | Catalog is mostly static content |
| Language | TypeScript (strict) | — | Never compromise on this |
| Styling | Tailwind CSS v4 + shadcn/ui | — | Always |
| Database | Supabase (Postgres) | — | Products, orders, customers, inventory |
| Payments | Stripe Checkout | Stripe Payment Element | Need fully custom checkout UI |
| Search | Postgres FTS | Algolia | Catalog > ~5k products or faceted search |
| Email | Resend | — | Order confirmations, shipping updates |
| Images | Vercel Image Optimization + Supabase Storage | Cloudinary | Heavy transformations needed |
| Hosting | Vercel | — | — |

For headless Shopify: same frontend stack, replace Database/Payments rows with Shopify Storefront API + Shopify Checkout.

## Default Directory Structure (custom build)

```
src/
  app/
    (store)/                    # Public storefront
      page.tsx                  # Home (featured products, collections)
      products/
        page.tsx                # Catalog with filters
        [slug]/page.tsx         # Product detail (gallery, variants, add to cart)
      collections/[slug]/page.tsx
      cart/page.tsx             # Cart review
      checkout/
        page.tsx                # Redirect to Stripe Checkout (or custom form)
        success/page.tsx        # Order confirmation
      layout.tsx                # Store layout (header + cart drawer + footer)
    (account)/                  # Customer area — auth required
      account/
        page.tsx                # Profile
        orders/page.tsx         # Order history
        orders/[id]/page.tsx    # Order detail + tracking
    (admin)/                    # Store management — role-gated
      admin/
        products/page.tsx       # Product CRUD
        orders/page.tsx         # Order management (status, fulfillment)
        inventory/page.tsx      # Stock levels
    api/
      webhooks/stripe/route.ts  # Payment confirmation → create order
      cart/route.ts             # Cart mutations (if not using server actions)
  components/
    store/                      # ProductCard, VariantPicker, CartDrawer...
    admin/
    ui/                         # shadcn/ui primitives
  lib/
    supabase/                   # Clients + middleware
    stripe/                     # Checkout session creation, webhook verify
    cart.ts                     # Cart logic (cookie/session based)
```

## Core Data Model (custom build)

```
products (id, slug, name, description, status, created_at)
product_variants (id, product_id, sku, price_cents, currency, inventory_qty, attributes jsonb)
collections (id, slug, name) + product_collections (junction)
carts (id, user_id nullable, session_id, created_at)
cart_items (cart_id, variant_id, qty)
orders (id, user_id nullable, email, status, total_cents, stripe_payment_intent, shipping_address jsonb)
order_items (order_id, variant_id, qty, unit_price_cents)   -- price SNAPSHOT, never join to live price
```

Non-negotiables: money in integer cents, never float. Order items snapshot the price at purchase time. Inventory decremented inside the webhook handler (payment confirmed), not at add-to-cart.

## Common Patterns

### Cart
- Anonymous cart keyed by cookie session_id; merge into user cart on login.
- Cart mutations via Server Actions; cart drawer reads from a lightweight endpoint or server component.

### Checkout (Stripe)
1. "Checkout" → server creates Stripe Checkout Session from cart (line items, shipping options)
2. Redirect to Stripe-hosted page (handles cards, wallets, taxes via Stripe Tax)
3. Webhook `checkout.session.completed` → create order, decrement inventory, send confirmation email, clear cart
4. Success page reads order by session_id — NEVER creates the order client-side

### Guest checkout
Allow purchase without account (email only). Offer account creation post-purchase. Forcing signup before checkout kills conversion.

## Build Order

1. **Scaffolding**: create-next-app, Tailwind v4, shadcn/ui, Supabase project
2. **Data model**: products, variants, collections tables + seed data
3. **Catalog**: product listing with filters + product detail page with variant picker
4. **Cart**: session-based cart, add/remove/update, cart drawer
5. **Checkout**: Stripe Checkout session + webhook handler + order creation
6. **Order confirmation**: success page + confirmation email (Resend)
7. **Customer accounts**: auth (Supabase Auth), order history, address book
8. **Admin**: product CRUD, order list with status management, inventory
9. **Search & discovery**: search bar, collection pages, related products
10. **Polish**: loading/empty states, image optimization, mobile cart UX
11. **Pre-launch**: test full purchase flow with Stripe test cards, webhook retry handling, inventory race check
12. **Deploy**: Vercel, env vars, Stripe live keys, webhook endpoint registered

## Common Pitfalls

- **Floating-point money.** Integer cents everywhere. Format only at render.
- **Creating orders client-side.** The webhook is the source of truth — success page redirects can fail or be forged.
- **No webhook signature verification.** Always verify `stripe-signature`. And handle duplicate webhook deliveries idempotently (check if order for that payment_intent already exists).
- **Inventory race conditions.** Two buyers, one unit: decrement with a conditional update (`WHERE inventory_qty >= qty`), not read-then-write.
- **Forcing account creation before checkout.** Guest checkout first, account offer after.
- **Skipping taxes/shipping until "later".** Decide day one: Stripe Tax + flat shipping is the lazy correct default.
- **Rebuilding Shopify.** If you're implementing discount codes, abandoned-cart emails, and shipping-label printing by hand, you probably picked the wrong build model. Revisit the platform decision.

## Skills for Build Phase

| Skill | When |
|-------|------|
| `/frontend-design` | Storefront and product pages |
| `ui-styling` | shadcn/ui setup and customization |
| `/ui-ux-pro-max` | Design system, e-commerce UX guidelines |
| Shopify MCP tools | If Shopify/headless model: products, collections, orders management |

## See Also

- `knowledge/building-blocks/database-patterns.md` — schema and ORM decisions
- `knowledge/building-blocks/auth-patterns.md` — customer accounts (guest-first)
- `knowledge/building-blocks/deployment-patterns.md` — Vercel + webhook endpoints
- `knowledge/archetypes/saas-webapp.md` — if the store sells subscriptions, borrow its billing patterns
