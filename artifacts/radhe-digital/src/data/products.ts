export interface ProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface Category {
  slug: string;
  label: string;
  banner: string;
  description: string;
  color: string;
}

export const CATEGORY_NAME_TO_SLUG: Record<string, string> = {
  "T-Shirt Printing": "t-shirts",
  "Mug Printing": "mugs",
  "Cap Printing": "caps",
  "Pen Printing": "pens",
  "Badge Printing": "badges",
  "Photo Frame Printing": "photo-frames",
  "Corporate Gifts": "corporate-gifts",
  "Customized Products": "corporate-gifts",
  "Mobile Cover Printing": "corporate-gifts",
  "Other Products": "corporate-gifts",
};

export const CATEGORIES: Category[] = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    banner: "Custom Printed T-Shirts",
    description: "Bold, vibrant prints on premium cotton and dry-fit fabrics. Perfect for events, teams, uniforms, and brands.",
    color: "#e53e3e",
  },
  {
    slug: "mugs",
    label: "Mugs",
    banner: "Custom Printed Mugs",
    description: "Premium ceramic mugs for corporate gifting, personal keepsakes, and branded promotions.",
    color: "#e53e3e",
  },
  {
    slug: "caps",
    label: "Caps",
    banner: "Custom Printed & Embroidered Caps",
    description: "Embroidered or printed caps and hats that put your brand in front of everyone.",
    color: "#e53e3e",
  },
  {
    slug: "pens",
    label: "Pens",
    banner: "Custom Branded Pens",
    description: "Elegant branded pens for office giveaways, corporate kits, and promotional campaigns.",
    color: "#e53e3e",
  },
  {
    slug: "badges",
    label: "Badges",
    banner: "Custom Printed Badges",
    description: "Crisp, durable badges for events, schools, ID cards, conferences, and corporate identity.",
    color: "#e53e3e",
  },
  {
    slug: "photo-frames",
    label: "Photo Frames",
    banner: "Custom Photo Frames",
    description: "Personalised photo frames for gifting, home décor, corporate appreciation, and memories.",
    color: "#e53e3e",
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    banner: "Custom Corporate Gifts",
    description: "Curated branded merchandise sets for businesses, employee onboarding, and special occasions.",
    color: "#e53e3e",
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);
