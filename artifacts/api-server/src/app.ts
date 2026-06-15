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

  /* ── products.variants column ── */
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

  /* ── homepage_categories table ── */
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS homepage_categories (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        slug          VARCHAR(100)  NOT NULL UNIQUE,
        name          VARCHAR(200)  NOT NULL,
        name_hi       VARCHAR(200)  DEFAULT NULL,
        image_url     TEXT          DEFAULT NULL,
        display_order INT           NOT NULL DEFAULT 0,
        is_visible    TINYINT(1)    NOT NULL DEFAULT 1,
        created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    const cnt = await query<{ cnt: number }>(
      "SELECT COUNT(*) AS cnt FROM homepage_categories"
    );
    if (!cnt[0]?.cnt) {
      const defaults = [
        ["t-shirts",        "T-Shirts",        "टी-शर्ट",         1],
        ["mugs",            "Mugs",            "मग",              2],
        ["caps",            "Caps",            "कैप",             3],
        ["pens",            "Pens",            "पेन",             4],
        ["badges",          "Badges",          "बैज",             5],
        ["photo-frames",    "Photo Frames",    "फोटो फ्रेम",      6],
        ["corporate-gifts", "Corporate Gifts", "कॉर्पोरेट गिफ्ट", 7],
      ];
      for (const [slug, name, nameHi, ord] of defaults) {
        await execute(
          "INSERT IGNORE INTO homepage_categories (slug,name,name_hi,display_order) VALUES (?,?,?,?)",
          [slug, name, nameHi, ord]
        );
      }
      logger.info("Migration: seeded homepage_categories with 7 defaults");
    }
  } catch (err) {
    logger.warn({ err }, "homepage_categories migration failed (non-fatal)");
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
