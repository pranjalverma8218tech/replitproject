import { Router } from "express";
import bcrypt from "bcryptjs";
import { query, execute, queryOne, dbConfigured, DB_UNAVAILABLE } from "../db";
import { signToken, verifyToken, requireAuth } from "../lib/auth";

const router = Router();

interface AdminUserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: number;
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  if (!dbConfigured) {
    res.status(503).json(DB_UNAVAILABLE);
    return;
  }
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "MISSING_FIELDS", message: "Email and password are required." });
    return;
  }
  try {
    const user = await queryOne<AdminUserRow>(
      "SELECT id, username, email, password_hash, role, is_active FROM admin_users WHERE email = ? LIMIT 1",
      [email.trim().toLowerCase()]
    );
    if (!user || !user.is_active) {
      res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password." });
      return;
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password." });
      return;
    }
    await execute(
      "UPDATE admin_users SET last_login = NOW() WHERE id = ?",
      [user.id]
    );
    const token = signToken({ id: user.id, email: user.email, username: user.username, role: user.role });
    res.json({ token, user: { id: user.id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "SERVER_ERROR", message: "Login failed." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const header = req.headers.authorization!;
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    res.json({ user: payload });
  } catch {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid token." });
  }
});

// POST /api/auth/logout  (stateless — client drops token; server acks)
router.post("/logout", (_req, res) => {
  res.json({ ok: true });
});

// POST /api/auth/setup  — first-run only: create the first super_admin
router.post("/setup", async (req, res) => {
  if (!dbConfigured) {
    res.status(503).json(DB_UNAVAILABLE);
    return;
  }
  try {
    const existing = await queryOne<{ cnt: number }>(
      "SELECT COUNT(*) AS cnt FROM admin_users"
    );
    if (existing && existing.cnt > 0) {
      res.status(409).json({ error: "ALREADY_SETUP", message: "Admin users already exist. Use /login instead." });
      return;
    }
    const { username, email, password } = req.body as { username?: string; email?: string; password?: string };
    if (!username || !email || !password) {
      res.status(400).json({ error: "MISSING_FIELDS", message: "username, email and password are required." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ error: "WEAK_PASSWORD", message: "Password must be at least 8 characters." });
      return;
    }
    const hash = await bcrypt.hash(password, 12);
    await execute(
      "INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')",
      [username.trim(), email.trim().toLowerCase(), hash]
    );
    res.status(201).json({ ok: true, message: "Super admin created. You can now log in." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Setup failed.";
    res.status(500).json({ error: "SERVER_ERROR", message: msg });
  }
});

export default router;
