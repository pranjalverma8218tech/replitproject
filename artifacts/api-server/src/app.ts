import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { dbConfigured, query, execute } from "./db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  if (!dbConfigured) return;
  try {
    const rows = await query<{ COLUMN_NAME: string }>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME   = 'products'
         AND COLUMN_NAME  = 'variants'`
    );
    if (rows.length === 0) {
      await execute(
        `ALTER TABLE products
         ADD COLUMN variants TEXT DEFAULT NULL
         COMMENT 'JSON array of color variant objects'
         AFTER images`
      );
      logger.info("Migration: added variants column to products table");
    }
  } catch (err) {
    logger.warn({ err }, "Migration check failed (non-fatal)");
  }
}

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const uploadsDir = path.resolve(__dirname, "../uploads");
app.use("/api/uploads", express.static(uploadsDir, { maxAge: "7d" }));

app.use("/api", router);

runMigrations().catch(err => logger.warn({ err }, "Migrations failed"));

export default app;
