import { Router } from "express";
import { dbConfigured, query, queryOne, execute, DB_UNAVAILABLE } from "../db";
import {
  localGetAll, localGetById, localCreate, localUpdate, localDelete,
  type LocalProduct
} from "../store/localProducts";

const router = Router();

const CATEGORY_TO_SLUG: Record<string, string> = {
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

function parseJson(val: unknown): unknown {
  if (typeof val !== "string" || !val) return val ?? null;
  try { return JSON.parse(val); } catch { return val; }
}

function toJson(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "string") return val;
  return JSON.stringify(val);
}

function hydrate(row: Record<string, unknown>) {
  return {
    ...row,
    tags:           parseJson(row.tags),
    images:         parseJson(row.images),
    variants:       parseJson(row.variants),
    features:       parseJson(row.features),
    specifications: parseJson(row.specifications),
  };
}

function deriveSlug(category: string, explicitSlug?: string): string {
  if (explicitSlug) return explicitSlug;
  return CATEGORY_TO_SLUG[category] ?? "corporate-gifts";
}

// GET /api/products
router.get("/", async (req, res) => {
  const { status, search } = req.query as Record<string, string>;

  if (!dbConfigured) {
    res.json(localGetAll({ status, search }));
    return;
  }

  try {
    let sql = "SELECT * FROM products WHERE 1=1";
    const params: unknown[] = [];
    if (status && status !== "All") { sql += " AND status = ?"; params.push(status); }
    if (search) {
      sql += " AND (name LIKE ? OR category LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like);
    }
    sql += " ORDER BY created_at DESC";
    const rows = await query<Record<string, unknown>>(sql, params);
    res.json(rows.map(hydrate));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  if (!dbConfigured) {
    const p = localGetById(req.params.id);
    if (!p) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(p);
    return;
  }

  try {
    const row = await queryOne<Record<string, unknown>>(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!row) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(hydrate(row));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  const {
    name, category, description, price, priceLabel, badge,
    tags, images, variants, features, specifications, imageUrl, status, stock
  } = req.body as Record<string, any>;

  if (!name || !category || price === undefined) {
    res.status(400).json({ error: "MISSING_FIELDS", message: "name, category, price are required" });
    return;
  }
  const id = req.body.id ?? `PRD-${Date.now()}`;
  const categorySlug = deriveSlug(category, req.body.categorySlug);

  if (!dbConfigured) {
    const product = localCreate({
      id, name, category, categorySlug,
      description: description ?? undefined,
      price: Number(price), priceLabel: priceLabel ?? undefined,
      badge: badge ?? undefined,
      tags: Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      images: images ?? [],
      variants: variants ?? [],
      features: features ?? [],
      specifications: specifications ?? [],
      imageUrl: imageUrl ?? undefined,
      status: status ?? "Active",
      stock: stock ?? 0,
    });
    res.status(201).json(product);
    return;
  }

  try {
    await execute(
      `INSERT INTO products
        (id, name, category, category_slug, description, price, price_label, badge, tags, images, variants, features, specifications, image_url, status, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name=VALUES(name), category=VALUES(category), category_slug=VALUES(category_slug),
        description=VALUES(description), price=VALUES(price), price_label=VALUES(price_label),
        badge=VALUES(badge), tags=VALUES(tags), images=VALUES(images), variants=VALUES(variants),
        features=VALUES(features), specifications=VALUES(specifications),
        image_url=VALUES(image_url), status=VALUES(status), stock=VALUES(stock)`,
      [
        id, name, category, categorySlug, description ?? null, price,
        priceLabel ?? null, badge ?? null,
        toJson(tags), toJson(images), toJson(variants ?? []),
        toJson(features), toJson(specifications),
        imageUrl ?? null, status ?? "Active", stock ?? 0
      ]
    );
    const created = await queryOne<Record<string, unknown>>("SELECT * FROM products WHERE id = ?", [id]);
    res.status(201).json(hydrate(created!));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  const {
    name, category, description, price, priceLabel, badge,
    tags, images, variants, features, specifications, imageUrl, status, stock
  } = req.body as Record<string, any>;

  const categorySlug = deriveSlug(category, req.body.categorySlug);

  if (!dbConfigured) {
    const updated = localUpdate(req.params.id, {
      name, category, categorySlug,
      description: description ?? undefined,
      price: Number(price), priceLabel: priceLabel ?? undefined,
      badge: badge ?? undefined,
      tags: Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []),
      images: images ?? [],
      variants: variants ?? [],
      features: features ?? [],
      specifications: specifications ?? [],
      imageUrl: imageUrl ?? undefined,
      status: status ?? "Active",
      stock: stock ?? 0,
    });
    if (!updated) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(updated);
    return;
  }

  try {
    const result = await execute(
      `UPDATE products SET
        name=?, category=?, category_slug=?, description=?, price=?, price_label=?, badge=?,
        tags=?, images=?, variants=?, features=?, specifications=?, image_url=?, status=?, stock=?
       WHERE id=?`,
      [
        name, category, categorySlug, description ?? null, price,
        priceLabel ?? null, badge ?? null,
        toJson(tags), toJson(images), toJson(variants ?? []),
        toJson(features), toJson(specifications),
        imageUrl ?? null, status, stock ?? 0, req.params.id
      ]
    );
    if (result.affectedRows === 0) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    const updated = await queryOne<Record<string, unknown>>("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json(hydrate(updated!));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  if (!dbConfigured) {
    const deleted = localDelete(req.params.id);
    if (!deleted) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json({ deleted: req.params.id });
    return;
  }

  try {
    const result = await execute("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

export default router;
