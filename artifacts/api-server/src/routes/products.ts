import { Router } from "express";
import { dbConfigured, query, queryOne, execute, DB_UNAVAILABLE } from "../db";

const router = Router();

function dbCheck(req: any, res: any, next: any) {
  if (!dbConfigured) return res.status(503).json(DB_UNAVAILABLE);
  next();
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

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// POST /api/products
router.post("/", dbCheck, async (req, res) => {
  try {
    const { name, category, description, price, imageUrl, status, stock } = req.body as Record<string, any>;
    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "MISSING_FIELDS", message: "name, category, price are required" });
    }
    const id = `PRD-${Date.now()}`;
    await execute(
      `INSERT INTO products (id, name, category, description, price, image_url, status, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, category, description ?? null, price, imageUrl ?? null, status ?? "Active", stock ?? 0]
    );
    res.status(201).json({ id, name, category, description, price, imageUrl, status: status ?? "Active", stock: stock ?? 0 });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// PUT /api/products/:id
router.put("/:id", dbCheck, async (req, res) => {
  try {
    const { name, category, description, price, imageUrl, status, stock } = req.body as Record<string, any>;
    const result = await execute(
      `UPDATE products SET name = ?, category = ?, description = ?, price = ?, image_url = ?, status = ?, stock = ?
       WHERE id = ?`,
      [name, category, description ?? null, price, imageUrl ?? null, status, stock ?? 0, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ id: req.params.id, ...req.body });
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
