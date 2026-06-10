import { Router } from "express";
import { dbConfigured, query, queryOne, execute, DB_UNAVAILABLE } from "../db";

const router = Router();

function dbCheck(req: any, res: any, next: any) {
  if (!dbConfigured) return res.status(503).json(DB_UNAVAILABLE);
  next();
}

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
    features:       parseJson(row.features),
    specifications: parseJson(row.specifications),
  };
}

// GET /api/products
router.get("/", dbCheck, async (req, res) => {
  try {
    const { status, search } = req.query as Record<string, string>;
    let sql = "SELECT * FROM products WHERE 1=1";
    const params: unknown[] = [];

    if (status && status !== "All") {
      sql += " AND status = ?";
      params.push(status);
    }
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
router.get("/:id", dbCheck, async (req, res) => {
  try {
    const row = await queryOne<Record<string, unknown>>(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [req.params.id]
    );
    if (!row) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(hydrate(row));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// POST /api/products
router.post("/", dbCheck, async (req, res) => {
  try {
    const {
      name, category, description, price, priceLabel, badge,
      tags, images, features, specifications, imageUrl, status, stock
    } = req.body as Record<string, any>;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "MISSING_FIELDS", message: "name, category, price are required" });
    }
    const id = req.body.id ?? `PRD-${Date.now()}`;
    await execute(
      `INSERT INTO products
        (id, name, category, description, price, price_label, badge, tags, images, features, specifications, image_url, status, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        name=VALUES(name), category=VALUES(category), description=VALUES(description),
        price=VALUES(price), price_label=VALUES(price_label), badge=VALUES(badge),
        tags=VALUES(tags), images=VALUES(images), features=VALUES(features),
        specifications=VALUES(specifications), image_url=VALUES(image_url),
        status=VALUES(status), stock=VALUES(stock)`,
      [
        id, name, category, description ?? null, price,
        priceLabel ?? null, badge ?? null,
        toJson(tags), toJson(images), toJson(features), toJson(specifications),
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
router.put("/:id", dbCheck, async (req, res) => {
  try {
    const {
      name, category, description, price, priceLabel, badge,
      tags, images, features, specifications, imageUrl, status, stock
    } = req.body as Record<string, any>;

    const result = await execute(
      `UPDATE products SET
        name=?, category=?, description=?, price=?, price_label=?, badge=?,
        tags=?, images=?, features=?, specifications=?, image_url=?, status=?, stock=?
       WHERE id=?`,
      [
        name, category, description ?? null, price,
        priceLabel ?? null, badge ?? null,
        toJson(tags), toJson(images), toJson(features), toJson(specifications),
        imageUrl ?? null, status, stock ?? 0, req.params.id
      ]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "NOT_FOUND" });
    const updated = await queryOne<Record<string, unknown>>("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json(hydrate(updated!));
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", dbCheck, async (req, res) => {
  try {
    const result = await execute("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

export default router;
