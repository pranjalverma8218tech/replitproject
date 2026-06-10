import { Router } from "express";
import { dbConfigured, query, queryOne, execute, DB_UNAVAILABLE } from "../db";

const router = Router();

function dbCheck(req: any, res: any, next: any) {
  if (!dbConfigured) return res.status(503).json(DB_UNAVAILABLE);
  next();
}

// GET /api/orders
router.get("/", dbCheck, async (req, res) => {
  try {
    const { status, whatsapp, search } = req.query as Record<string, string>;
    let sql = "SELECT * FROM orders WHERE 1=1";
    const params: unknown[] = [];

    if (status && status !== "All") {
      sql += " AND status = ?";
      params.push(status);
    }
    if (whatsapp === "true") {
      sql += " AND is_whatsapp = 1";
    }
    if (search) {
      sql += " AND (customer_name LIKE ? OR mobile LIKE ? OR product_name LIKE ? OR id LIKE ?)";
      const like = `%${search}%`;
      params.push(like, like, like, like);
    }
    sql += " ORDER BY created_at DESC";

    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// GET /api/orders/:id
router.get("/:id", dbCheck, async (req, res) => {
  try {
    const order = await queryOne("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (!order) return res.status(404).json({ error: "NOT_FOUND" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// POST /api/orders  — called from CartDrawer on WhatsApp checkout
router.post("/", dbCheck, async (req, res) => {
  try {
    const {
      customerName, mobile, productName, category,
      quantity, total, address, email, notes, isWhatsapp,
    } = req.body as Record<string, any>;

    if (!customerName || !mobile || !productName || !total) {
      return res.status(400).json({ error: "MISSING_FIELDS", message: "customerName, mobile, productName, total are required" });
    }

    const id = `ORD-${Date.now()}`;
    const today = new Date().toISOString().slice(0, 10);

    await execute(
      `INSERT INTO orders (id, customer_name, mobile, product_name, category, quantity, total, status, address, email, notes, is_whatsapp)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New Order', ?, ?, ?, ?)`,
      [id, customerName, mobile, productName, category ?? "", quantity ?? 1, total, address ?? "", email ?? null, notes ?? null, isWhatsapp ? 1 : 0]
    );

    // Upsert customer record
    await upsertCustomer({ customerName, mobile, email, productName, total, today });

    res.status(201).json({ id, status: "New Order" });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

// PATCH /api/orders/:id  — update status
router.patch("/:id", dbCheck, async (req, res) => {
  try {
    const { status } = req.body as { status: string };
    const validStatuses = ["New Order","Contacted","Design Received","In Production","Ready","Delivered","Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "INVALID_STATUS", validStatuses });
    }
    const result = await execute("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "NOT_FOUND" });
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ error: "DB_ERROR", message: (err as Error).message });
  }
});

async function upsertCustomer(data: {
  customerName: string; mobile: string; email?: string;
  productName: string; total: number; today: string;
}) {
  const existing = await queryOne<any>("SELECT * FROM customers WHERE mobile = ?", [data.mobile]);
  if (existing) {
    const products: string[] = JSON.parse(existing.ordered_products ?? "[]");
    if (!products.includes(data.productName)) products.push(data.productName);
    await execute(
      `UPDATE customers SET name = ?, email = COALESCE(?, email), total_orders = total_orders + 1,
       total_spent = total_spent + ?, ordered_products = ?, last_order_date = ? WHERE mobile = ?`,
      [data.customerName, data.email ?? null, data.total, JSON.stringify(products), data.today, data.mobile]
    );
  } else {
    const id = `CUS-${data.mobile}`;
    await execute(
      `INSERT INTO customers (id, name, mobile, email, total_orders, total_spent, ordered_products, last_order_date)
       VALUES (?, ?, ?, ?, 1, ?, ?, ?)`,
      [id, data.customerName, data.mobile, data.email ?? null, data.total, JSON.stringify([data.productName]), data.today]
    );
  }
}

export default router;
