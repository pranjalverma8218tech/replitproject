import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../lib/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_FILE = path.resolve(__dirname, "../../data/featured-products-local.json");

interface FeaturedProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  badge: string;
  link: string;
  displayOrder: number;
}

const DEFAULTS: FeaturedProduct[] = [
  { id: 1, name: "Custom T-Shirts",     description: "Bold, vibrant prints on premium cotton and dry-fit fabrics. Perfect for events, teams, and brands.", price: "₹299", imageUrl: null, badge: "Popular",     link: "/categories/t-shirts",     displayOrder: 1 },
  { id: 2, name: "Custom Mugs",         description: "Premium ceramic mugs for corporate gifting, personal keepsakes, and branded promotions.",              price: "₹199", imageUrl: null, badge: "Best Seller", link: "/categories/mugs",          displayOrder: 2 },
  { id: 3, name: "Printed Caps",        description: "Embroidered or printed caps that put your brand in front of everyone.",                               price: "₹349", imageUrl: null, badge: "Premium",    link: "/categories/caps",          displayOrder: 3 },
  { id: 4, name: "Corporate Gift Sets", description: "Curated branded merchandise for businesses, onboarding kits, and special occasions.",                 price: "₹999", imageUrl: null, badge: "New",        link: "/categories/corporate-gifts", displayOrder: 4 },
];

function readLocal(): FeaturedProduct[] {
  try { return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")); }
  catch { return DEFAULTS.map(p => ({ ...p })); }
}

function writeLocal(data: FeaturedProduct[]): void {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
}

const router = Router();

/* ── GET /featured-products  (public) ── */
router.get("/", (_req, res) => {
  res.json(readLocal().sort((a, b) => a.displayOrder - b.displayOrder));
});

/* ── POST /featured-products  (admin) ── */
router.post("/", requireAuth, (req, res) => {
  const { name, description, price, imageUrl, badge, link } = req.body as Partial<FeaturedProduct>;
  if (!name) { res.status(400).json({ error: "MISSING_FIELDS", message: "name is required" }); return; }
  const local = readLocal();
  const nextId = Math.max(0, ...local.map(p => p.id)) + 1;
  const nextOrder = Math.max(0, ...local.map(p => p.displayOrder)) + 1;
  const item: FeaturedProduct = {
    id: nextId,
    name,
    description: description ?? "",
    price: price ?? "",
    imageUrl: imageUrl ?? null,
    badge: badge ?? "",
    link: link ?? "",
    displayOrder: nextOrder,
  };
  local.push(item);
  writeLocal(local);
  res.status(201).json(item);
});

/* ── PUT /featured-products/:id  (admin) ── */
router.put("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const local = readLocal();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
  const allowed: Array<keyof FeaturedProduct> = ["name", "description", "price", "imageUrl", "badge", "link", "displayOrder"];
  const updates: Partial<FeaturedProduct> = {};
  for (const k of allowed) {
    if (k in req.body) (updates as Record<string, unknown>)[k] = req.body[k];
  }
  Object.assign(local[idx], updates);
  writeLocal(local);
  res.json(local[idx]);
});

/* ── DELETE /featured-products/:id  (admin) ── */
router.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const local = readLocal();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
  local.splice(idx, 1);
  writeLocal(local);
  res.json({ deleted: id });
});

export default router;
