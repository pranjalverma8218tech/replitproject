import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dbConfigured, query, queryOne, execute } from "../db";
import { requireAuth } from "../lib/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_FILE = path.resolve(__dirname, "../../data/homepage-categories-local.json");

interface HomeCategory {
  id: number;
  slug: string;
  name: string;
  name_hi: string | null;
  image_url: string | null;
  display_order: number;
  is_visible: number;
}

const DEFAULTS: HomeCategory[] = [
  { id: 1, slug: "t-shirts",        name: "T-Shirts",        name_hi: "टी-शर्ट",         image_url: null, display_order: 1, is_visible: 1 },
  { id: 2, slug: "mugs",            name: "Mugs",            name_hi: "मग",              image_url: null, display_order: 2, is_visible: 1 },
  { id: 3, slug: "caps",            name: "Caps",            name_hi: "कैप",             image_url: null, display_order: 3, is_visible: 1 },
  { id: 4, slug: "pens",            name: "Pens",            name_hi: "पेन",             image_url: null, display_order: 4, is_visible: 1 },
  { id: 5, slug: "badges",          name: "Badges",          name_hi: "बैज",             image_url: null, display_order: 5, is_visible: 1 },
  { id: 6, slug: "photo-frames",    name: "Photo Frames",    name_hi: "फोटो फ्रेम",      image_url: null, display_order: 6, is_visible: 1 },
  { id: 7, slug: "corporate-gifts", name: "Corporate Gifts", name_hi: "कॉर्पोरेट गिफ्ट", image_url: null, display_order: 7, is_visible: 1 },
];

function readLocal(): HomeCategory[] {
  try { return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")); }
  catch { return DEFAULTS.map(c => ({ ...c })); }
}

function writeLocal(data: HomeCategory[]): void {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
}

const router = Router();

/* ── GET /homepage-categories  (public) ── */
router.get("/", async (_req, res) => {
  if (!dbConfigured) {
    res.json(readLocal().filter(c => c.is_visible).sort((a, b) => a.display_order - b.display_order));
    return;
  }
  try {
    const rows = await query<HomeCategory>(
      "SELECT * FROM homepage_categories WHERE is_visible = 1 ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: String(err) });
  }
});

/* ── GET /homepage-categories/all  (admin) ── */
router.get("/all", requireAuth, async (_req, res) => {
  if (!dbConfigured) {
    res.json(readLocal().sort((a, b) => a.display_order - b.display_order));
    return;
  }
  try {
    const rows = await query<HomeCategory>(
      "SELECT * FROM homepage_categories ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: String(err) });
  }
});

/* ── POST /homepage-categories  (admin) ── */
router.post("/", requireAuth, async (req, res) => {
  const { slug, name, name_hi, image_url, display_order, is_visible } = req.body as Partial<HomeCategory>;
  if (!slug || !name) {
    res.status(400).json({ error: "MISSING_FIELDS", message: "slug and name are required" });
    return;
  }
  if (!dbConfigured) {
    const local = readLocal();
    const nextId = Math.max(0, ...local.map(c => c.id)) + 1;
    const nextOrder = display_order ?? Math.max(0, ...local.map(c => c.display_order)) + 1;
    const cat: HomeCategory = { id: nextId, slug, name, name_hi: name_hi ?? null, image_url: image_url ?? null, display_order: nextOrder, is_visible: is_visible ?? 1 };
    local.push(cat);
    writeLocal(local);
    res.status(201).json(cat);
    return;
  }
  try {
    const maxOrder = await queryOne<{ m: number }>("SELECT MAX(display_order) AS m FROM homepage_categories");
    const order = display_order ?? (maxOrder?.m ?? 0) + 1;
    const result = await execute(
      "INSERT INTO homepage_categories (slug, name, name_hi, image_url, display_order, is_visible) VALUES (?, ?, ?, ?, ?, ?)",
      [slug, name, name_hi ?? null, image_url ?? null, order, is_visible ?? 1]
    );
    const created = await queryOne<HomeCategory>("SELECT * FROM homepage_categories WHERE id = ?", [result.insertId]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: String(err) });
  }
});

/* ── PUT /homepage-categories/:id  (admin) ── */
router.put("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const allowed: Array<keyof HomeCategory> = ["name", "name_hi", "image_url", "display_order", "is_visible"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in req.body) updates[k] = req.body[k];
  }
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "NO_FIELDS", message: "No updatable fields provided" });
    return;
  }
  if (!dbConfigured) {
    const local = readLocal();
    const idx = local.findIndex(c => c.id === id);
    if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    Object.assign(local[idx], updates);
    writeLocal(local);
    res.json(local[idx]);
    return;
  }
  try {
    const setClauses = Object.keys(updates).map(k => `\`${k}\` = ?`).join(", ");
    await execute(`UPDATE homepage_categories SET ${setClauses} WHERE id = ?`, [...Object.values(updates), id]);
    const updated = await queryOne<HomeCategory>("SELECT * FROM homepage_categories WHERE id = ?", [id]);
    if (!updated) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: String(err) });
  }
});

/* ── DELETE /homepage-categories/:id  (admin) ── */
router.delete("/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!dbConfigured) {
    const local = readLocal();
    const idx = local.findIndex(c => c.id === id);
    if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    local.splice(idx, 1);
    writeLocal(local);
    res.json({ deleted: id });
    return;
  }
  try {
    await execute("DELETE FROM homepage_categories WHERE id = ?", [id]);
    res.json({ deleted: id });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: String(err) });
  }
});

export default router;
