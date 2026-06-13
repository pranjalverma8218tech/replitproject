---
name: Mobile responsiveness patterns
description: Overflow fixes and responsive patterns for radhe-digital. Use when debugging mobile layout issues.
---

## Rule: overflow-x must be on html AND body
`overflow-x: hidden` only on an inner div does NOT prevent browser-level horizontal scroll. Must set it on both `html` and `body` in index.css.

**Why:** Browser scroll is controlled at the document level. A div with overflow-x:hidden clips content visually but the document can still scroll if a child element extends beyond the viewport.

**How to apply:** In `@layer base` in index.css, set `html, body { overflow-x: hidden; max-width: 100%; }`.

## Rule: Carousel scroll arrows must not extend outside container on mobile
BestSellersCarousel uses `absolute -translate-x-4` / `translate-x-4` on navigation arrows, pushing them 16px outside the container. On desktop this is fine (global overflow hidden catches it), but on mobile these are the PRIMARY horizontal scroll cause.

**Fix:** Use `hidden sm:flex` on the arrow buttons so they're hidden on mobile. On mobile, dot pagination is used instead.

## Rule: Navbar layout at 320px needs compact sizing
On 320px phones (288px usable after 32px padding), the full-size navbar overflows:
- Logo badge: `w-8 h-8 sm:w-10 sm:h-10`
- Brand name: `text-sm sm:text-xl`
- Subtitle "Custom Printing Studio": `hidden sm:block`
- Logo gap: `gap-2 sm:gap-3`
- Lang switcher buttons: `px-2 py-1.5 minWidth:30px` (down from px-3/36px)
- Mobile action buttons: `w-9 h-9` (down from w-10)
- Navbar height: `h-14 sm:h-20` matching App.tsx `pt-[58px] sm:pt-[82px]`

## Rule: WhatsApp tooltip should go UP not LEFT
`right-full mr-4` puts the tooltip to the LEFT of the button — it goes off-screen on narrow phones. Use `bottom-full mb-3 left-1/2 -translate-x-1/2` so it appears ABOVE the button.

## Rule: BestSellersCarousel VISIBLE count must be responsive
Hardcoded `VISIBLE=3` renders 3 tiny ~107px cards on mobile (360px screen). Use a responsive useState with resize listener:
```js
const [VISIBLE, setVISIBLE] = useState(() =>
  window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3
);
```

## Rule: Hero min-h should not apply on mobile
`min-h-[92vh]` on the hero section creates a large empty dark area on mobile in flex-col layout (content is shorter than 92vh). Use `sm:min-h-[92vh]` to only apply on tablet+. Also reduce `py-20` to `py-12 sm:py-20` for compact mobile spacing.
