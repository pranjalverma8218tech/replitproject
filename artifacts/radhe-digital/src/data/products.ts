export interface ProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  badge?: string;
  tags: string[];
  images?: ProductImage[];
  features?: string[];
}

export interface Category {
  slug: string;
  label: string;
  banner: string;
  description: string;
  color: string;
  products: Product[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    banner: "Custom Printed T-Shirts",
    description: "Bold, vibrant prints on premium cotton and dry-fit fabrics. Perfect for events, teams, uniforms, and brands.",
    color: "#e53e3e",
    products: [
      { id: "ts-001", name: "Classic Round Neck Tee", price: 199, priceLabel: "₹199", description: "Soft pre-shrunk 100% cotton. Vivid DTG print that lasts wash after wash.", badge: "Best Seller", tags: ["cotton", "unisex", "casual"] },
      { id: "ts-002", name: "Premium Polo / Collar Tee", price: 349, priceLabel: "₹349", description: "Corporate-grade polo with embroidered or heat-press logo. Ideal for uniforms.", badge: "Popular", tags: ["collar", "corporate", "polo"] },
      { id: "ts-003", name: "Dry-Fit Sports Tee", price: 299, priceLabel: "₹299", description: "Moisture-wicking polyester fabric. Perfect for marathons, gyms, and sports events.", tags: ["sports", "dry-fit", "athletic"] },
      { id: "ts-004", name: "Oversized Drop-Shoulder Tee", price: 399, priceLabel: "₹399", description: "Trendy streetwear style. All-over print or chest print available.", badge: "Trending", tags: ["oversized", "streetwear", "unisex"] },
      { id: "ts-005", name: "Holi Special White Tee", price: 179, priceLabel: "₹179", description: "Pure white fabric optimised for vibrant colour splash designs for Holi.", tags: ["holi", "festival", "white"] },
      { id: "ts-006", name: "Sublimation Full-Print Tee", price: 449, priceLabel: "₹449", description: "Edge-to-edge all-over sublimation printing for bold, photographic designs.", badge: "Premium", tags: ["sublimation", "all-over", "premium"] },
      { id: "ts-007", name: "V-Neck Custom Tee", price: 229, priceLabel: "₹229", description: "Slim-fit V-neck with chest or back print. Great for casual and semi-formal wear.", tags: ["v-neck", "slim-fit", "casual"] },
      { id: "ts-008", name: "Bulk Event T-Shirt", price: 149, priceLabel: "From ₹149", description: "Budget-friendly bulk tees for college fests, NGOs, and corporate events. MOQ 50.", badge: "Bulk Deal", tags: ["bulk", "event", "budget"] },
    ],
  },
  {
    slug: "mugs",
    label: "Mugs",
    banner: "Custom Printed Mugs",
    description: "Premium ceramic mugs for corporate gifting, personal keepsakes, and branded promotions.",
    color: "#e53e3e",
    products: [
      { id: "mg-001", name: "Classic White Ceramic Mug (11oz)", price: 199, priceLabel: "₹199", description: "Dishwasher-safe ceramic with full-wrap photo-quality print. The everyday gift.", badge: "Best Seller", tags: ["ceramic", "11oz", "classic"] },
      { id: "mg-002", name: "Magic Colour-Change Mug", price: 299, priceLabel: "₹299", description: "Reveals your design when filled with a hot drink. Perfect surprise gift.", badge: "Popular", tags: ["magic", "heat-reveal", "gift"] },
      { id: "mg-003", name: "Large Latte Mug (15oz)", price: 249, priceLabel: "₹249", description: "Extra-large capacity with bold full-wrap print. Ideal for coffee lovers.", tags: ["large", "15oz", "latte"] },
      { id: "mg-004", name: "Travel Tumbler / Steel Bottle", price: 499, priceLabel: "₹499", description: "Double-walled stainless steel with laser-engraved or printed branding.", badge: "Premium", tags: ["travel", "steel", "tumbler"] },
      { id: "mg-005", name: "Heart Handle Mug", price: 249, priceLabel: "₹249", description: "Adorable heart-shaped handle mug. Perfect for anniversary and gifting.", tags: ["heart", "gifting", "romantic"] },
      { id: "mg-006", name: "Bulk Corporate Mugs", price: 149, priceLabel: "From ₹149", description: "Branded mugs with your company logo. MOQ 24 pieces. Great for onboarding kits.", badge: "Bulk Deal", tags: ["corporate", "bulk", "logo"] },
    ],
  },
  {
    slug: "caps",
    label: "Caps",
    banner: "Custom Printed & Embroidered Caps",
    description: "Embroidered or printed caps and hats that put your brand in front of everyone.",
    color: "#e53e3e",
    products: [
      { id: "cp-001", name: "Classic Snapback Cap", price: 349, priceLabel: "₹349", description: "Adjustable snapback with flat brim. Front panel embroidery or print available.", badge: "Best Seller", tags: ["snapback", "flatbrim", "unisex"] },
      { id: "cp-002", name: "Flexfit Structured Cap", price: 399, priceLabel: "₹399", description: "Premium fitted cap with stretch band. Ideal for corporate gifting and uniforms.", badge: "Popular", tags: ["flexfit", "fitted", "corporate"] },
      { id: "cp-003", name: "Dad Hat (Unstructured)", price: 299, priceLabel: "₹299", description: "Relaxed low-profile cap with curved brim. Casual and stylish brand wear.", tags: ["dad-hat", "casual", "unstructured"] },
      { id: "cp-004", name: "Trucker Mesh Cap", price: 279, priceLabel: "₹279", description: "Breathable mesh back with foam front panel. Great for outdoor and events.", tags: ["trucker", "mesh", "outdoor"] },
      { id: "cp-005", name: "Bucket Hat", price: 329, priceLabel: "₹329", description: "All-over printed bucket hat. Trendy and functional for festivals and summer events.", badge: "Trending", tags: ["bucket", "all-over", "festival"] },
      { id: "cp-006", name: "Embroidered Logo Cap", price: 449, priceLabel: "₹449", description: "High-definition thread embroidery of your logo. Durable and premium finish.", badge: "Premium", tags: ["embroidery", "premium", "logo"] },
    ],
  },
  {
    slug: "pens",
    label: "Pens",
    banner: "Custom Branded Pens",
    description: "Elegant branded pens for office giveaways, corporate kits, and promotional campaigns.",
    color: "#e53e3e",
    products: [
      { id: "pn-001", name: "Classic Ball Pen with Logo", price: 29, priceLabel: "₹29", description: "Smooth-writing ball pen with barrel imprint. Most popular promotional item.", badge: "Best Seller", tags: ["ballpen", "imprint", "promo"] },
      { id: "pn-002", name: "Executive Metal Pen", price: 149, priceLabel: "₹149", description: "Premium brushed metal pen with laser-engraved branding. Gift-box ready.", badge: "Premium", tags: ["metal", "laser", "executive"] },
      { id: "pn-003", name: "Stylus Touch Pen", price: 79, priceLabel: "₹79", description: "Dual-purpose pen with capacitive stylus tip. Great for tech-savvy giveaways.", tags: ["stylus", "touch", "tech"] },
      { id: "pn-004", name: "Eco Recycled Pen", price: 39, priceLabel: "₹39", description: "Made from recycled materials. Sustainable branding choice for green businesses.", badge: "Eco", tags: ["eco", "recycled", "sustainable"] },
      { id: "pn-005", name: "Gel Ink Pen with Imprint", price: 49, priceLabel: "₹49", description: "Smooth gel writing with vibrant ink. Barrel print or clip engraving available.", tags: ["gel", "smooth", "imprint"] },
      { id: "pn-006", name: "Pen Gift Set (3-Piece)", price: 399, priceLabel: "₹399", description: "Premium 3-pen set in a branded box. Perfect corporate gift or welcome kit.", badge: "Popular", tags: ["set", "giftbox", "corporate"] },
    ],
  },
  {
    slug: "badges",
    label: "Badges",
    banner: "Custom Printed Badges",
    description: "Crisp, durable badges for events, schools, ID cards, conferences, and corporate identity.",
    color: "#e53e3e",
    products: [
      { id: "bd-001", name: "Round Button Badge (58mm)", price: 19, priceLabel: "₹19", description: "Full-colour pin-back button badge. Ideal for events, elections, and promotions.", badge: "Best Seller", tags: ["round", "button", "pin"] },
      { id: "bd-002", name: "Rectangular Name Badge", price: 49, priceLabel: "₹49", description: "Professional name badges with metal pin or magnetic back for corporate use.", badge: "Popular", tags: ["name", "rectangle", "corporate"] },
      { id: "bd-003", name: "Metal Enamel Badge", price: 149, priceLabel: "₹149", description: "Die-cast metal badge with soft or hard enamel fill. Premium branded merchandise.", badge: "Premium", tags: ["metal", "enamel", "premium"] },
      { id: "bd-004", name: "School / College ID Badge", price: 39, priceLabel: "₹39", description: "Durable PVC ID card badge with lanyard hole. Bulk orders for schools and colleges.", tags: ["school", "ID", "PVC"] },
      { id: "bd-005", name: "Event Lanyard Badge", price: 59, priceLabel: "₹59", description: "Printed lanyard with attached badge holder. Complete event identity solution.", tags: ["lanyard", "event", "holder"] },
      { id: "bd-006", name: "Custom Logo Badge (Bulk)", price: 15, priceLabel: "From ₹15", description: "Minimum 100-piece custom logo badges for conferences, roadshows, and launches.", badge: "Bulk Deal", tags: ["bulk", "logo", "conference"] },
    ],
  },
  {
    slug: "photo-frames",
    label: "Photo Frames",
    banner: "Custom Photo Frames",
    description: "Personalised photo frames for gifting, home décor, corporate appreciation, and memories.",
    color: "#e53e3e",
    products: [
      { id: "pf-001", name: "Classic Wood Photo Frame (5×7)", price: 299, priceLabel: "₹299", description: "Natural wood frame with printed photo insert. A timeless personal gift.", badge: "Best Seller", tags: ["wood", "classic", "gifting"] },
      { id: "pf-002", name: "Collage Photo Frame (Multi-Photo)", price: 449, priceLabel: "₹449", description: "Display up to 6 photos in a single premium frame. Perfect for anniversaries.", badge: "Popular", tags: ["collage", "multi", "anniversary"] },
      { id: "pf-003", name: "Acrylic LED Photo Frame", price: 599, priceLabel: "₹599", description: "Clear acrylic frame with backlit LED glow. Stunning table display for any occasion.", badge: "Trending", tags: ["acrylic", "LED", "modern"] },
      { id: "pf-004", name: "Magnetic Fridge Photo Frame", price: 149, priceLabel: "₹149", description: "Fun magnetic frame for the fridge. Great promotional and gifting item.", tags: ["magnet", "fridge", "promo"] },
      { id: "pf-005", name: "Corporate Award Frame", price: 699, priceLabel: "₹699", description: "Premium matt-finish frame for certificates and appreciation awards.", badge: "Premium", tags: ["award", "corporate", "certificate"] },
      { id: "pf-006", name: "Personalised Birthday Frame", price: 349, priceLabel: "₹349", description: "Custom text + photo frame with name and date. Ideal birthday gift.", tags: ["birthday", "personalised", "gift"] },
    ],
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    banner: "Custom Corporate Gifts",
    description: "Curated branded merchandise sets for businesses, employee onboarding, and special occasions.",
    color: "#e53e3e",
    products: [
      { id: "cg-001", name: "Starter Welcome Kit", price: 799, priceLabel: "₹799", description: "Tee + mug + pen combo in a branded box. Perfect employee onboarding gift.", badge: "Best Seller", tags: ["kit", "welcome", "onboarding"] },
      { id: "cg-002", name: "Executive Gift Hamper", price: 1499, priceLabel: "₹1,499", description: "Premium hamper with metal pen, notebook, mug, and cap — all branded.", badge: "Premium", tags: ["executive", "hamper", "premium"] },
      { id: "cg-003", name: "Branded Notebook + Pen Set", price: 499, priceLabel: "₹499", description: "Hardcover notebook with custom logo cover and matching branded pen.", tags: ["notebook", "pen", "stationery"] },
      { id: "cg-004", name: "Client Appreciation Box", price: 999, priceLabel: "₹999", description: "Curated box of 4 branded items — ideal for client retention and Diwali gifting.", badge: "Popular", tags: ["appreciation", "client", "diwali"] },
      { id: "cg-005", name: "Tech Accessories Kit", price: 1199, priceLabel: "₹1,199", description: "USB hub, mouse pad, stylus pen — all branded. Great for WFH welcome packs.", badge: "Trending", tags: ["tech", "WFH", "accessories"] },
      { id: "cg-006", name: "Bulk Corporate Giveaway Set", price: 299, priceLabel: "From ₹299", description: "Budget-friendly branded set for 50+ employees. MOQ 25 sets. Mix & match items.", badge: "Bulk Deal", tags: ["bulk", "giveaway", "budget"] },
    ],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
);
