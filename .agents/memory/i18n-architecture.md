---
name: i18n translation architecture
description: EN↔HI translation system for Radhe Digital — centralized dict, hook usage, and known pitfalls.
---

## Translation file
`artifacts/radhe-digital/src/i18n/translations.ts` — one giant `as const` object with `en` and `hi` keys.

## Hook
`useLanguage()` from `@/context/LanguageContext` returns `{ lang, setLang, t }`.
All pages/components must import this — never hardcode English strings in JSX.

## Sections (as of completion)
- `nav`, `hero`, `trust`, `categories`, `featured`, `bestSellers`, `why`, `howItWorks`, `testimonials`, `faq`, `cta`
- `category` — CategoryPage strings (breadcrumb, sort, filter, count, CTA)
- `categoriesPage` — CategoriesPage banner + grid
- `product` — ProductDetailPage strings
- `customize` — CustomizePage step 1
- `customizeCat` — CustomizeCategoryPage strings
- `customizeProd` — CustomizeProductPage strings (including QuantitySelector via props)
- `modal` — ProductOptionsModal strings
- `notFound` — 404 page
- `cart`, `about`, `contact`, `footer`

## Critical pitfall
The `category` section intentionally has TWO differently-named keys for "products":
- `products: "Products"` — used for breadcrumb link ("Home / Products / T-Shirts")
- `productsLabel: "products"` — used for count display ("Showing 6 of 9 products")
Using the same key name for both causes a Vite duplicate-key warning and the last one silently wins.

## Component-level hooks
`ProductCard` (inside CategoryPage.tsx) and `QuantitySelector` (inside CustomizeProductPage.tsx) are top-level named functions — they can call `useLanguage()` directly. For QuantitySelector, translated strings are passed as props instead to keep it pure.

**Why:** Passing translated strings as props to QuantitySelector avoids the hook being called inside a non-component utility, keeping the component architecture clean.
