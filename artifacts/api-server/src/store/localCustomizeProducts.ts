import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../data/customize-products-local.json");

fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

export interface ColorVariant {
  color: string;
  hex: string;
  image: string;
}

export interface LocalCustomizeProduct {
  id: string;
  name: string;
  productType: string;
  category: string;
  categorySlug: string;
  basePrice: number;
  description: string;
  frontImage: string;
  backImage: string;
  sideImage: string;
  colors: string[];
  sizes: string[];
  colorVariants: ColorVariant[];
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

function readStore(): LocalCustomizeProduct[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as LocalCustomizeProduct[];
  } catch {
    return [];
  }
}

function writeStore(items: LocalCustomizeProduct[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function lcpGetAll(params?: { status?: string; search?: string; category?: string }): LocalCustomizeProduct[] {
  let items = readStore();
  if (params?.status && params.status !== "All") {
    items = items.filter(p => p.status === params.status);
  }
  if (params?.category && params.category !== "All") {
    items = items.filter(p => p.category === params.category);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q)
    );
  }
  return items.slice().reverse();
}

export function lcpGetById(id: string): LocalCustomizeProduct | null {
  return readStore().find(p => p.id === id) ?? null;
}

export function lcpCreate(data: Omit<LocalCustomizeProduct, "createdAt" | "updatedAt">): LocalCustomizeProduct {
  const items = readStore();
  const existing = items.findIndex(p => p.id === data.id);
  const now = new Date().toISOString();
  const item: LocalCustomizeProduct = { ...data, createdAt: now, updatedAt: now };
  if (existing >= 0) {
    items[existing] = { ...items[existing], ...item, updatedAt: now };
  } else {
    items.push(item);
  }
  writeStore(items);
  return item;
}

export function lcpUpdate(id: string, data: Partial<Omit<LocalCustomizeProduct, "id" | "createdAt">>): LocalCustomizeProduct | null {
  const items = readStore();
  const idx = items.findIndex(p => p.id === id);
  if (idx < 0) return null;
  items[idx] = { ...items[idx], ...data, id, updatedAt: new Date().toISOString() };
  writeStore(items);
  return items[idx];
}

export function lcpDelete(id: string): boolean {
  const items = readStore();
  const idx = items.findIndex(p => p.id === id);
  if (idx < 0) return false;
  items.splice(idx, 1);
  writeStore(items);
  return true;
}
