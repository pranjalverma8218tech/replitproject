import mysql from "mysql2/promise";
import { logger } from "./lib/logger";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

export const dbConfigured = !!(DB_HOST && DB_USER && DB_PASSWORD !== undefined && DB_NAME);

let pool: mysql.Pool | null = null;

if (dbConfigured) {
  pool = mysql.createPool({
    host: DB_HOST!,
    port: Number(DB_PORT ?? 3306),
    user: DB_USER!,
    password: DB_PASSWORD!,
    database: DB_NAME!,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "+05:30",
  });
  logger.info({ host: DB_HOST, database: DB_NAME }, "MySQL pool created");
} else {
  logger.warn(
    "DB env vars not set (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME). Database routes will return 503."
  );
}

export async function query<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<mysql.ResultSetHeader> {
  if (!pool) throw new Error("DB_NOT_CONFIGURED");
  const [result] = await pool.execute(sql, params);
  return result as mysql.ResultSetHeader;
}

export const DB_UNAVAILABLE = {
  error: "DB_NOT_CONFIGURED",
  message:
    "Database not connected. Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME to connect your Hostinger MySQL database.",
};
