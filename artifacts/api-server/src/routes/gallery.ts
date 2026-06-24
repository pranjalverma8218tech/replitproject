import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../lib/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_FILE = path.resolve(__dirname, "../../data/gallery-local.json");

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  createdAt: string;
}

function readLocal(): GalleryImage[] {
  try { return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8")); }
  catch { return []; }
}

function writeLocal(data: GalleryImage[]): void {
  fs.mkdirSync(path.dirname(LOCAL_FILE), { recursive: true });
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
}

const router = Router();

/* ── GET /gallery  (public) ── */
router.get("/", (_req, res) => {
  res.json(readLocal().sort((a, b) => a.displayOrder - b.displayOrder));
});

/* ── POST /gallery  (admin) ── */
router.post("/", requireAuth, (req, res) => {
  const { imageUrl, caption } = req.body as Partial<GalleryImage>;
  if (!imageUrl) { res.status(400).json({ error: "MISSING_FIELDS", message: "imageUrl is required" }); return; }
  const local = readLocal();
  const nextId = Math.max(0, ...local.map(p => p.id)) + 1;
  const nextOrder = Math.max(0, ...local.map(p => p.displayOrder)) + 1;
  const item: GalleryImage = {
    id: nextId,
    imageUrl,
    caption: caption ?? "",
    displayOrder: nextOrder,
    createdAt: new Date().toISOString(),
  };
  local.push(item);
  writeLocal(local);
  res.status(201).json(item);
});

/* ── PUT /gallery/:id  (admin) ── */
router.put("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const local = readLocal();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
  const allowed: Array<keyof GalleryImage> = ["imageUrl", "caption", "displayOrder"];
  const updates: Partial<GalleryImage> = {};
  for (const k of allowed) {
    if (k in req.body) (updates as Record<string, unknown>)[k] = req.body[k];
  }
  Object.assign(local[idx], updates);
  writeLocal(local);
  res.json(local[idx]);
});

/* ── DELETE /gallery/:id  (admin) ── */
router.delete("/:id", requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const local = readLocal();
  const idx = local.findIndex(p => p.id === id);
  if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
  local.splice(idx, 1);
  writeLocal(local);
  res.json({ deleted: id });
});

/* ── POST /gallery/reorder  (admin) ── */
router.post("/reorder", requireAuth, (req, res) => {
  const { orderedIds } = req.body as { orderedIds: number[] };
  if (!Array.isArray(orderedIds)) { res.status(400).json({ error: "INVALID" }); return; }
  const local = readLocal();
  orderedIds.forEach((id, idx) => {
    const item = local.find(p => p.id === id);
    if (item) item.displayOrder = idx + 1;
  });
  writeLocal(local);
  res.json(local.sort((a, b) => a.displayOrder - b.displayOrder));
});

export default router;
