// ─── Customize Products API Hook ─────────────────────────────────────────────
// Single source of truth: fetches from /api/customize-products
// Used by CustomizePage, CustomizeCategoryPage, CustomizeProductPage

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

// ─── Print positions per category (UI config, not stored in DB) ───────────────
export const PRINT_POSITIONS: Record<string, { id: string; label: string; desc: string }[]> = {
  "t-shirts": [
    { id: "front", label: "Front",      desc: "Print on the front" },
    { id: "back",  label: "Back",       desc: "Print on the back" },
    { id: "both",  label: "Both Sides", desc: "Front & back designs" },
  ],
  "mugs": [
    { id: "front", label: "Front",        desc: "Visible side when drinking" },
    { id: "back",  label: "Back",         desc: "Opposite side of handle" },
    { id: "both",  label: "Wrap Around",  desc: "Full 360° all-over print" },
  ],
  "caps": [
    { id: "front", label: "Front Panel", desc: "Logo on the front panel" },
    { id: "side",  label: "Side Panel",  desc: "Print on left or right panel" },
    { id: "back",  label: "Back Panel",  desc: "Print above the strap" },
  ],
  "hoodies": [
    { id: "front", label: "Front",      desc: "Print on the front chest" },
    { id: "back",  label: "Back",       desc: "Full back print" },
    { id: "both",  label: "Both Sides", desc: "Front & back designs" },
  ],
  "corporate-gifts": [
    { id: "front", label: "Front", desc: "Logo or text on front" },
  ],
};

const DEFAULT_POSITIONS = [{ id: "front", label: "Front", desc: "Logo or text on front" }];

// ─── Category display metadata (UI config, icons live in the pages) ───────────
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "t-shirts":        "Plain base t-shirts ready for your custom print",
  "mugs":            "Premium plain mugs for stunning photo & logo prints",
  "caps":            "Plain caps ready for embroidery or print customization",
  "hoodies":         "Premium plain hoodies for bold custom designs",
  "corporate-gifts": "Branded corporate gifting products for businesses",
};

// ─── Shared product shape used across all pages ───────────────────────────────
export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  image: string;
  description: string;
  category: string;
  categorySlug: string;
  colors: string[];
  sizes: string[];
  printPositions: { id: string; label: string; desc: string }[];
  status: string;
}

export interface CatalogCategory {
  slug: string;
  label: string;
  description: string;
  productCount: number;
  products: CatalogProduct[];
}

// ─── Transform API response → CatalogProduct ─────────────────────────────────
function transform(p: Record<string, unknown>): CatalogProduct {
  const basePrice = Number(p.basePrice ?? p.base_price ?? 0);
  const catSlug   = String(p.categorySlug ?? p.category_slug ?? "");
  const image     = String(p.frontImage ?? p.front_image ?? p.sideImage ?? p.side_image ?? p.backImage ?? p.back_image ?? "");
  return {
    id:             String(p.id),
    slug:           String(p.id),           // product ID is used as URL slug
    name:           String(p.name ?? ""),
    price:          basePrice,
    priceLabel:     `₹${basePrice.toLocaleString("en-IN")}`,
    image,
    description:    String(p.description ?? ""),
    category:       String(p.category ?? ""),
    categorySlug:   catSlug,
    colors:         Array.isArray(p.colors) ? p.colors as string[] : [],
    sizes:          Array.isArray(p.sizes)  ? p.sizes  as string[] : [],
    printPositions: PRINT_POSITIONS[catSlug] ?? DEFAULT_POSITIONS,
    status:         String(p.status ?? "Active"),
  };
}

// ─── Raw fetch helpers ────────────────────────────────────────────────────────
async function fetchAll(params?: { status?: string }): Promise<CatalogProduct[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  const q = qs.toString();
  const res = await fetch(`${BASE}/customize-products${q ? `?${q}` : ""}`);
  if (!res.ok) throw new Error("Failed to load customization products");
  const data: unknown[] = await res.json();
  return (data as Record<string, unknown>[]).map(transform);
}

async function fetchOne(id: string): Promise<CatalogProduct> {
  const res = await fetch(`${BASE}/customize-products/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Product not found");
  return transform(await res.json() as Record<string, unknown>);
}

// ─── Category order ───────────────────────────────────────────────────────────
const CAT_ORDER = ["t-shirts", "mugs", "caps", "hoodies", "corporate-gifts"];

function groupByCategory(products: CatalogProduct[]): CatalogCategory[] {
  const map = new Map<string, CatalogProduct[]>();
  for (const p of products) {
    if (!map.has(p.categorySlug)) map.set(p.categorySlug, []);
    map.get(p.categorySlug)!.push(p);
  }
  const slugs = [
    ...CAT_ORDER.filter(s => map.has(s)),
    ...[...map.keys()].filter(s => !CAT_ORDER.includes(s)),
  ];
  return slugs.map(slug => {
    const prods = map.get(slug)!;
    return {
      slug,
      label:        prods[0].category,
      description:  CATEGORY_DESCRIPTIONS[slug] ?? "",
      productCount: prods.length,
      products:     prods,
    };
  });
}

// ─── React hooks ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

/** All active categories with their products — for /customize */
export function useCustomizeCategories() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    fetchAll({ status: "Active" })
      .then(data => setCategories(groupByCategory(data)))
      .catch(err  => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

/** Products inside one category — for /customize/:category */
export function useCustomizeCategoryProducts(categorySlug: string) {
  const [products,      setProducts]      = useState<CatalogProduct[]>([]);
  const [categoryLabel, setCategoryLabel] = useState("");
  const [description,   setDescription]  = useState("");
  const [loading,       setLoading]      = useState(true);
  const [error,         setError]        = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;
    setLoading(true);
    setError(null);
    fetchAll({ status: "Active" })
      .then(data => {
        const filtered = data.filter(p => p.categorySlug === categorySlug);
        setProducts(filtered);
        if (filtered.length > 0) {
          setCategoryLabel(filtered[0].category);
          setDescription(CATEGORY_DESCRIPTIONS[categorySlug] ?? "");
        } else {
          setError("Category not found or has no active products.");
        }
      })
      .catch(err  => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return { products, categoryLabel, description, loading, error };
}

/** Single product by its ID — for /customize/:category/:productSlug */
export function useCustomizeProduct(categorySlug: string, productId: string) {
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    setError(null);
    fetchOne(productId)
      .then(p => {
        if (p.status !== "Active") throw new Error("This product is no longer available.");
        setProduct(p);
      })
      .catch(err  => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [categorySlug, productId]);

  return { product, loading, error };
}
