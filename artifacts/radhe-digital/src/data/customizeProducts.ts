export interface CustomizeProduct {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  image: string;
  description: string;
  category: string;
  categorySlug: string;
  printPositions: { id: string; label: string; desc: string }[];
}

export interface CustomizeCategory {
  slug: string;
  label: string;
  description: string;
  products: CustomizeProduct[];
}

const TSHIRT_POSITIONS = [
  { id: "front", label: "Front", desc: "Print on the front" },
  { id: "back", label: "Back", desc: "Print on the back" },
  { id: "both", label: "Both Sides", desc: "Front & back designs" },
];

const MUG_POSITIONS = [
  { id: "front", label: "Front", desc: "Visible side when drinking" },
  { id: "back", label: "Back", desc: "Opposite side of handle" },
  { id: "both", label: "Wrap Around", desc: "Full 360° all-over print" },
];

const CAP_POSITIONS = [
  { id: "front", label: "Front Panel", desc: "Logo on the front panel" },
  { id: "side", label: "Side Panel", desc: "Print on left or right panel" },
  { id: "back", label: "Back Panel", desc: "Print above the strap" },
];

const HOODIE_POSITIONS = [
  { id: "front", label: "Front", desc: "Print on the front chest" },
  { id: "back", label: "Back", desc: "Full back print" },
  { id: "both", label: "Both Sides", desc: "Front & back designs" },
];

const GIFT_POSITIONS = [
  { id: "front", label: "Front", desc: "Logo or text on front" },
];

export const CUSTOMIZE_CATEGORIES: CustomizeCategory[] = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    description: "Plain base t-shirts ready for your custom print",
    products: [
      {
        slug: "plain-round-neck",
        name: "Plain Round Neck T-Shirt",
        price: 199,
        priceLabel: "₹199",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
        description: "Classic round neck plain t-shirt. Comfortable 180 GSM cotton.",
        category: "T-Shirts",
        categorySlug: "t-shirts",
        printPositions: TSHIRT_POSITIONS,
      },
      {
        slug: "plain-polo",
        name: "Plain Polo T-Shirt",
        price: 249,
        priceLabel: "₹249",
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
        description: "Premium polo t-shirt with collar. 200 GSM pique cotton.",
        category: "T-Shirts",
        categorySlug: "t-shirts",
        printPositions: TSHIRT_POSITIONS,
      },
      {
        slug: "plain-oversized",
        name: "Plain Oversized T-Shirt",
        price: 279,
        priceLabel: "₹279",
        image: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=600&q=80",
        description: "Trendy oversized drop-shoulder t-shirt. 220 GSM boxy fit.",
        category: "T-Shirts",
        categorySlug: "t-shirts",
        printPositions: TSHIRT_POSITIONS,
      },
      {
        slug: "plain-v-neck",
        name: "Plain V-Neck T-Shirt",
        price: 219,
        priceLabel: "₹219",
        image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600&q=80",
        description: "Slim-fit v-neck t-shirt. 180 GSM combed cotton.",
        category: "T-Shirts",
        categorySlug: "t-shirts",
        printPositions: TSHIRT_POSITIONS,
      },
    ],
  },
  {
    slug: "mugs",
    label: "Mugs",
    description: "Premium plain mugs for stunning photo & logo prints",
    products: [
      {
        slug: "plain-ceramic-mug",
        name: "Plain White Ceramic Mug",
        price: 199,
        priceLabel: "₹199",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
        description: "Classic 330ml white ceramic mug. Perfect for vibrant full-color prints.",
        category: "Mugs",
        categorySlug: "mugs",
        printPositions: MUG_POSITIONS,
      },
      {
        slug: "magic-color-mug",
        name: "Plain Magic Color-Changing Mug",
        price: 299,
        priceLabel: "₹299",
        image: "https://images.unsplash.com/photo-1534353341046-3b65e7e43861?w=600&q=80",
        description: "Heat-sensitive magic mug — design appears when filled with hot liquid.",
        category: "Mugs",
        categorySlug: "mugs",
        printPositions: MUG_POSITIONS,
      },
      {
        slug: "travel-mug",
        name: "Plain Travel Mug",
        price: 349,
        priceLabel: "₹349",
        image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&q=80",
        description: "Stainless steel insulated travel mug. 450ml, keeps drinks hot/cold.",
        category: "Mugs",
        categorySlug: "mugs",
        printPositions: MUG_POSITIONS,
      },
      {
        slug: "two-tone-mug",
        name: "Plain Two-Tone Mug",
        price: 249,
        priceLabel: "₹249",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80",
        description: "Stylish two-tone ceramic mug with colored handle & interior. 330ml.",
        category: "Mugs",
        categorySlug: "mugs",
        printPositions: MUG_POSITIONS,
      },
    ],
  },
  {
    slug: "caps",
    label: "Caps",
    description: "Plain caps ready for embroidery or print customization",
    products: [
      {
        slug: "plain-baseball-cap",
        name: "Plain Baseball Cap",
        price: 179,
        priceLabel: "₹179",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
        description: "Classic 6-panel baseball cap with curved brim. Adjustable strap.",
        category: "Caps",
        categorySlug: "caps",
        printPositions: CAP_POSITIONS,
      },
      {
        slug: "plain-snapback",
        name: "Plain Snapback Cap",
        price: 199,
        priceLabel: "₹199",
        image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&q=80",
        description: "Flat-brim snapback cap with structured front panel. One size fits all.",
        category: "Caps",
        categorySlug: "caps",
        printPositions: CAP_POSITIONS,
      },
      {
        slug: "plain-dad-cap",
        name: "Plain Dad Cap",
        price: 169,
        priceLabel: "₹169",
        image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80",
        description: "Soft unstructured dad cap with curved brim. Comfortable all-day wear.",
        category: "Caps",
        categorySlug: "caps",
        printPositions: CAP_POSITIONS,
      },
      {
        slug: "plain-trucker-cap",
        name: "Plain Trucker Cap",
        price: 189,
        priceLabel: "₹189",
        image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=80",
        description: "Mesh back trucker cap for breathable all-day comfort.",
        category: "Caps",
        categorySlug: "caps",
        printPositions: CAP_POSITIONS,
      },
    ],
  },
  {
    slug: "hoodies",
    label: "Hoodies",
    description: "Premium plain hoodies for bold custom designs",
    products: [
      {
        slug: "plain-pullover-hoodie",
        name: "Plain Pullover Hoodie",
        price: 549,
        priceLabel: "₹549",
        image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
        description: "Premium 320 GSM fleece pullover hoodie with kangaroo pocket.",
        category: "Hoodies",
        categorySlug: "hoodies",
        printPositions: HOODIE_POSITIONS,
      },
      {
        slug: "plain-zip-hoodie",
        name: "Plain Zip-Up Hoodie",
        price: 599,
        priceLabel: "₹599",
        image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&q=80",
        description: "Full-zip hoodie with side pockets. 300 GSM brushed fleece interior.",
        category: "Hoodies",
        categorySlug: "hoodies",
        printPositions: HOODIE_POSITIONS,
      },
      {
        slug: "plain-fleece-hoodie",
        name: "Plain Fleece Hoodie",
        price: 499,
        priceLabel: "₹499",
        image: "https://images.unsplash.com/photo-1571945192075-8e7b61e7900f?w=600&q=80",
        description: "Soft lightweight fleece hoodie. Great for everyday casual wear.",
        category: "Hoodies",
        categorySlug: "hoodies",
        printPositions: HOODIE_POSITIONS,
      },
    ],
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    description: "Branded corporate gifting products for businesses",
    products: [
      {
        slug: "plain-notebook",
        name: "Plain Hardcover Notebook",
        price: 199,
        priceLabel: "₹199",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80",
        description: "A5 hardcover ruled notebook with 200 pages. Ideal for logo branding.",
        category: "Corporate Gifts",
        categorySlug: "corporate-gifts",
        printPositions: GIFT_POSITIONS,
      },
      {
        slug: "plain-pen-set",
        name: "Plain Metal Pen Set (5 pcs)",
        price: 149,
        priceLabel: "₹149",
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600&q=80",
        description: "Set of 5 premium metal ballpoint pens. Engraving or printing available.",
        category: "Corporate Gifts",
        categorySlug: "corporate-gifts",
        printPositions: GIFT_POSITIONS,
      },
      {
        slug: "mug-coaster-set",
        name: "Mug + Coaster Gift Set",
        price: 449,
        priceLabel: "₹449",
        image: "https://images.unsplash.com/photo-1563208723-7b1f4f34b8ef?w=600&q=80",
        description: "Branded mug with matching printed coaster. Beautifully gift-boxed.",
        category: "Corporate Gifts",
        categorySlug: "corporate-gifts",
        printPositions: GIFT_POSITIONS,
      },
      {
        slug: "plain-keychain-set",
        name: "Plain Keychain Set (10 pcs)",
        price: 299,
        priceLabel: "₹299",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
        description: "Set of 10 metal keychains. Custom logo engraving or UV print.",
        category: "Corporate Gifts",
        categorySlug: "corporate-gifts",
        printPositions: GIFT_POSITIONS,
      },
    ],
  },
];

export function getCategoryBySlug(slug: string): CustomizeCategory | undefined {
  return CUSTOMIZE_CATEGORIES.find(c => c.slug === slug);
}

export function getProductBySlug(categorySlug: string, productSlug: string): CustomizeProduct | undefined {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.products.find(p => p.slug === productSlug);
}
