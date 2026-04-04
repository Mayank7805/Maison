# MAISON — Luxury Fashion E-Commerce

## Overview

Full-stack luxury fashion e-commerce platform for the MAISON brand. Brutally minimal editorial aesthetic.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/maison)
- **Backend**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT via httpOnly cookie (bcryptjs)
- **Payments**: Stripe (STRIPE_SECRET_KEY env var required)
- **State Management**: Zustand (cart, wishlist)
- **Charts**: Recharts (admin dashboard)
- **Validation**: Zod, drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── maison/              # React + Vite storefront (previewPath: /)
│   │   └── src/
│   │       ├── components/  # layout/, shop/, ui/
│   │       ├── pages/       # Home, Shop, ProductDetail, Cart, Checkout, Auth, Account, Admin, Lookbook
│   │       ├── store/       # Zustand stores (cart, user, wishlist)
│   │       └── lib/         # utils
│   └── api-server/          # Express API (previewPath: /api)
│       └── src/
│           ├── lib/         # auth.ts (JWT/bcrypt helpers)
│           └── routes/      # auth, products, categories, cart, orders, users, wishlist, reviews, admin, checkout
├── lib/
│   ├── api-spec/            # OpenAPI spec + Orval codegen config
│   ├── api-client-react/    # Generated React Query hooks
│   ├── api-zod/             # Generated Zod schemas
│   └── db/                  # Drizzle ORM schema + DB connection
│       └── src/schema/
│           ├── users.ts     # users, addresses
│           ├── categories.ts
│           ├── products.ts  # products, product_variants
│           ├── cart.ts      # carts, cart_items
│           ├── orders.ts    # orders, order_items
│           ├── wishlist.ts  # wishlist_items
│           ├── reviews.ts
│           └── coupons.ts
└── scripts/
    └── src/seed.ts          # Database seeder
```

## Auth Credentials (seeded)

- **Admin**: admin@maison.com / admin123
- **User 1**: sophie@example.com / user123
- **User 2**: emma@example.com / user123

## Coupon Codes (seeded)

- `MAISON10` — 10% off orders over $200
- `WELCOME20` — 20% off orders over $100
- `SAVE50` — $50 off orders over $300

## Pages

### Storefront
- `/` — Homepage (hero, categories, featured products, brand story, new arrivals, lookbook, testimonials, newsletter)
- `/shop` — All products with filters (category, price, sort)
- `/shop/:category` — Category-filtered products
- `/product/:slug` — Product detail (gallery, size selector, add to cart, reviews, related)
- `/lookbook` — Editorial lookbook
- `/about` — Brand story
- `/search` — Search results

### Auth
- `/login` — Sign in
- `/register` — Create account

### User Account
- `/account` — Dashboard (orders, wishlist, profile tabs)
- `/account/orders` — Order history
- `/account/orders/:id` — Order detail
- `/account/wishlist` — Wishlist
- `/account/profile` — Profile + address book

### Cart & Checkout
- `/cart` — Cart page
- `/checkout` — Multi-step checkout

### Admin (role: ADMIN required)
- `/admin` — Dashboard with KPIs + revenue chart
- `/admin/products` — Product CRUD
- `/admin/orders` — Order management with status updates
- `/admin/customers` — Customer list
- `/admin/categories` — Category management

## API Endpoints

- `GET /api/products` — List products (filter: category, minPrice, maxPrice, sort, featured)
- `GET /api/products/:slug` — Product detail + related
- `GET /api/categories` — All categories
- `GET /api/search?q=` — Product search
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login (sets httpOnly cookie)
- `GET /api/auth/me` — Current user
- `GET/POST /api/cart` — Cart operations
- `POST /api/orders` — Create order
- `GET/POST /api/wishlist` — Wishlist
- `GET /api/admin/*` — Admin-only endpoints

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (auto-provided by Replit)
- `JWT_SECRET` — JWT signing secret (set in production)
- `STRIPE_SECRET_KEY` — Stripe secret key (for payments)
- `VITE_STRIPE_PUBLIC_KEY` — Stripe publishable key (frontend)

## Commands

- `pnpm --filter @workspace/api-server run dev` — Start API server
- `pnpm --filter @workspace/maison run dev` — Start frontend
- `pnpm --filter @workspace/db run push` — Push DB schema
- `pnpm --filter @workspace/scripts run seed` — Seed database
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API types
