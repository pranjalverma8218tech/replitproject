import { Router } from "express";
import { dbConfigured, query, queryOne, DB_UNAVAILABLE } from "../db";

const router = Router();

function dbCheck(req: any, res: any, next: any) {
  if (!dbConfigured) return res.status(503).json(DB_UNAVAILABLE);
  next();
}

// GET /api/dashboard/stats
router.get("/stats", dbCheck, async (req, res) => {
  try {
    const [orderCount] = await query<{ c: number }>("SELECT COUNT(*) as c FROM orders");
    const [revenue]    = await query<{ r: number }>("SELECT COALESCE(SUM(total), 0) as r FROM orders WHERE status != 'Cancelled'");
    const [custCount]  = await query<{ c: number }>("SELECT COUNT(*) as c FROM customers");
    const [prodCount]  = await query<{ c: number }>("SELECT COUNT(*) as c FROM products WHERE status = 'Active'");
    const statusRows   = await query<{ status: string; cnt: number }>("SELECT status, COUNT(*) as cnt FROM orders GROUP BY status");
    const recentOrders = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5");

    // Build status map
    const statusBreakdown: Record<string, number> = {};
    for (const row of statusRows) {
      statusBreakdown[row.status] = Number(row.cnt);
    }

    res.json({
      totalOrders:   Number((orderCount as any).c),
      revenue:       Number((revenue as any).r),
      totalCustomers:Number((custCount as any).c),
      activeProducts:Number((prodCount as any).c),
      statusBreakdown,
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

export default router;
