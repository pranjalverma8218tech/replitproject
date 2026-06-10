import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.resolve(__dirname, "../data/products-local.json");

fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

export interface LocalProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface LocalProductSpec {
  label: string;
  value: string;
}

export interface LocalProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  priceLabel?: string;
  badge?: string;
  tags?: string[];
  images?: LocalProductImage[];
  features?: string[];
  specifications?: LocalProductSpec[];
  imageUrl?: string;
  status: "Active" | "Inactive";
  stock: number;
  createdAt: string;
  updatedAt: string;
}

function readStore(): LocalProduct[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as LocalProduct[];
  } catch {
    return [];
  }
}

function writeStore(products: LocalProduct[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

export function localGetAll(params?: { status?: string; search?: string }): LocalProduct[] {
  let products = readStore();
  if (params?.status && params.status !== "All") {
    products = products.filter(p => p.status === params.status);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    products = products.filter(
      p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }
  return products.slice().reverse();
}

export function localGetById(id: string): LocalProduct | null {
  return readStore().find(p => p.id === id) ?? null;
}

export function localCreate(data: Omit<LocalProduct, "createdAt" | "updatedAt">): LocalProduct {
  const products = readStore();
  const existing = products.findIndex(p => p.id === data.id);
  const now = new Date().toISOString();
  const product: LocalProduct = { ...data, createdAt: now, updatedAt: now };
  if (existing >= 0) {
    products[existing] = { ...products[existing], ...product, updatedAt: now };
  } else {
    products.push(product);
  }
  writeStore(products);
  return product;
}

export function localUpdate(id: string, data: Partial<Omit<LocalProduct, "id" | "createdAt">>): LocalProduct | null {
  const products = readStore();
  const idx = products.findIndex(p => p.id === id);
  if (idx < 0) return null;
  products[idx] = { ...products[idx], ...data, id, updatedAt: new Date().toISOString() };
  writeStore(products);
  return products[idx];
}

export function localDelete(id: string): boolean {
  const products = readStore();
  const idx = products.findIndex(p => p.id === id);
  if (idx < 0) return false;
  products.splice(idx, 1);
  writeStore(products);
  return true;
}
