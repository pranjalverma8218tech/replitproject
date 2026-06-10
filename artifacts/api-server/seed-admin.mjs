/**
 * Radhe Digital — Seed First Admin User
 * ──────────────────────────────────────
 * Run once after setting up the MySQL database:
 *
 *   DB_HOST=... DB_USER=... DB_PASSWORD=... DB_NAME=radhedigital \
 *   node seed-admin.mjs
 *
 * Or call the setup endpoint directly (only works when admin_users is empty):
 *
 *   curl -X POST https://your-api/api/auth/setup \
 *     -H "Content-Type: application/json" \
 *     -d '{"username":"admin","email":"admin@radhedigital.com","password":"YourSecurePassword"}'
 */

import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error("❌  Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME before running this script.");
  process.exit(1);
}

const USERNAME  = process.env.ADMIN_USERNAME  ?? "admin";
const EMAIL     = process.env.ADMIN_EMAIL     ?? "admin@radhedigital.com";
const PASSWORD  = process.env.ADMIN_PASSWORD  ?? "Radhe@2024";

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASSWORD ?? "",
  database: DB_NAME,
});

try {
  const [rows] = await pool.execute("SELECT COUNT(*) AS cnt FROM admin_users");
  const cnt = rows[0].cnt;
  if (cnt > 0) {
    console.log("ℹ️  Admin users already exist. Skipping seed.");
    process.exit(0);
  }

  const hash = await bcrypt.hash(PASSWORD, 12);
  await pool.execute(
    "INSERT INTO admin_users (username, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')",
    [USERNAME, EMAIL.toLowerCase(), hash]
  );
  console.log(`✅  Admin user created:`);
  console.log(`    Email   : ${EMAIL}`);
  console.log(`    Password: ${PASSWORD}`);
  console.log(`    Role    : super_admin`);
  console.log(`\n⚠️  Change the password immediately after first login.`);
} catch (err) {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}
