import { Router } from "express";
import { dbConfigured, query, DB_UNAVAILABLE } from "../db";

const router = Router();

function dbCheck(req: any, res: any, next: any) {
  if (!dbConfigured) return res.status(503).json(DB_UNAVAILABLE);
  next();
}

// GET /api/customers
router.get("/", dbCheck, async (req, res) => {
  try {
    const { search } = req.query as Record<string, string>;
    let sql = "SELECT * FROM customers WHERE 1=1";
    const params: unknown[] = [];

    if (search) {
      sql += " AND (name LIKE ? OR mobile LIKE ? OR email LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like);
    }
    sql += " ORDER BY last_order_date DESC, created_at DESC";

    const rows = await query<any>(sql, params);

    // Parse ordered_products JSON column
    const customers = rows.map(r => ({
      ...r,
      orderedProducts: (() => {
        try { return JSON.parse(r.ordered_products ?? "[]"); }
        catch { return []; }
      })(),
    }));

    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

export default router;
