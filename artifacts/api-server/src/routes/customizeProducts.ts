import { Router } from "express";
import { dbConfigured, query, queryOne, execute } from "../db";
import { lcpGetAll, lcpGetById, lcpCreate, lcpUpdate, lcpDelete } from "../store/localCustomizeProducts";

const router = Router();

const CATEGORY_TO_SLUG: Record<string, string> = {
  "T-Shirts":        "t-shirts",
  "Mugs":            "mugs",
  "Caps":            "caps",
  "Hoodies":         "hoodies",
  "Corporate Gifts": "corporate-gifts",
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
    colors: parseJson(row.colors),
    sizes:  parseJson(row.sizes),
  };
}

function deriveSlug(category: string): string {
  return CATEGORY_TO_SLUG[category] ?? "corporate-gifts";
}

// GET /api/customize-products
router.get("/", async (req, res) => {
  const { status, search, category } = req.query as Record<string, string>;

  if (!dbConfigured) {
    res.json(lcpGetAll({ status, search, category }));
    return;
  }

  try {
    let sql = "SELECT * FROM customize_products WHERE 1=1";
    const params: unknown[] = [];
    if (status && status !== "All") { sql += " AND status = ?"; params.push(status); }
    if (category && category !== "All") { sql += " AND category = ?"; params.push(category); }
    if (search) {
      sql += " AND (name LIKE ? OR category LIKE ? OR product_type LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    sql += " ORDER BY created_at DESC";
    const rows = await query<Record<string, unknown>>(sql, params);
    res.json(rows.map(hydrate));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// GET /api/customize-products/:id
router.get("/:id", async (req, res) => {
  if (!dbConfigured) {
    const p = lcpGetById(req.params.id);
    if (!p) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(p);
    return;
  }

  try {
    const row = await queryOne<Record<string, unknown>>(
      "SELECT * FROM customize_products WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!row) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(hydrate(row));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// POST /api/customize-products
router.post("/", async (req, res) => {
  const {
    name, productType, category, basePrice, description,
    frontImage, backImage, sideImage, colors, sizes, status,
  } = req.body as Record<string, any>;

  if (!name || !category || basePrice === undefined) {
    res.status(400).json({ error: "MISSING_FIELDS", message: "name, category, basePrice are required" });
    return;
  }

  const id = req.body.id ?? `CUS-${Date.now()}`;
  const categorySlug = deriveSlug(category);

  if (!dbConfigured) {
    const item = lcpCreate({
      id, name,
      productType: productType ?? "",
      category, categorySlug,
      basePrice: Number(basePrice),
      description: description ?? "",
      frontImage: frontImage ?? "",
      backImage: backImage ?? "",
      sideImage: sideImage ?? "",
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      status: status ?? "Active",
    });
    res.status(201).json(item);
    return;
  }

  try {
    await execute(
      `INSERT INTO customize_products
        (id, name, product_type, category, category_slug, base_price, description,
         front_image, back_image, side_image, colors, sizes, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name=VALUES(name), product_type=VALUES(product_type), category=VALUES(category),
        category_slug=VALUES(category_slug), base_price=VALUES(base_price),
        description=VALUES(description), front_image=VALUES(front_image),
        back_image=VALUES(back_image), side_image=VALUES(side_image),
        colors=VALUES(colors), sizes=VALUES(sizes), status=VALUES(status)`,
      [
        id, name, productType ?? "", category, categorySlug, Number(basePrice),
        description ?? "", frontImage ?? "", backImage ?? "", sideImage ?? "",
        toJson(colors ?? []), toJson(sizes ?? []), status ?? "Active",
      ]
    );
    const created = await queryOne<Record<string, unknown>>(
      "SELECT * FROM customize_products WHERE id = ?", [id]
    );
    res.status(201).json(hydrate(created!));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// PUT /api/customize-products/:id
router.put("/:id", async (req, res) => {
  const {
    name, productType, category, basePrice, description,
    frontImage, backImage, sideImage, colors, sizes, status,
  } = req.body as Record<string, any>;

  const categorySlug = deriveSlug(category ?? "");

  if (!dbConfigured) {
    const updated = lcpUpdate(req.params.id, {
      name, productType: productType ?? "",
      category, categorySlug,
      basePrice: Number(basePrice),
      description: description ?? "",
      frontImage: frontImage ?? "",
      backImage: backImage ?? "",
      sideImage: sideImage ?? "",
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      status: status ?? "Active",
    });
    if (!updated) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json(updated);
    return;
  }

  try {
    const result = await execute(
      `UPDATE customize_products SET
        name=?, product_type=?, category=?, category_slug=?, base_price=?,
        description=?, front_image=?, back_image=?, side_image=?,
        colors=?, sizes=?, status=?
       WHERE id=?`,
      [
        name, productType ?? "", category, categorySlug, Number(basePrice),
        description ?? "", frontImage ?? "", backImage ?? "", sideImage ?? "",
        toJson(colors ?? []), toJson(sizes ?? []), status ?? "Active",
        req.params.id,
      ]
    );
    if (result.affectedRows === 0) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    const updated = await queryOne<Record<string, unknown>>(
      "SELECT * FROM customize_products WHERE id = ?", [req.params.id]
    );
    res.json(hydrate(updated!));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// DELETE /api/customize-products/:id
router.delete("/:id", async (req, res) => {
  if (!dbConfigured) {
    const deleted = lcpDelete(req.params.id);
    if (!deleted) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json({ deleted: req.params.id });
    return;
  }

  try {
    const result = await execute("DELETE FROM customize_products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

export default router;
