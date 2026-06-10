import { useState, useEffect } from "react";

export interface ApiProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface ApiProductVariant {
  id: string;
  color: string;
  hex: string;
  images: ApiProductImage[];
  stock?: number;
  priceAdjustment?: number;
}

export interface ApiProductData {
  id: string;
  images?: ApiProductImage[];
  variants?: ApiProductVariant[];
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  priceLabel?: string;
  badge?: string;
  tags?: string[];
}

let cache: Record<string, ApiProductData> | null = null;
let fetchPromise: Promise<void> | null = null;
const listeners: Set<(map: Record<string, ApiProductData>) => void> = new Set();

export function invalidateApiProductsCache() {
  cache = null;
  fetchPromise = null;
}

function doFetch() {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/products")
    .then(r => r.ok ? r.json() : [])
    .then((rows: ApiProductData[]) => {
      cache = Object.fromEntries(rows.map(r => [r.id, r]));
      listeners.forEach(fn => fn(cache!));
    })
    .catch(() => {
      cache = {};
      listeners.forEach(fn => fn({}));
    });
  return fetchPromise;
}

export function useApiProducts(): Record<string, ApiProductData> {
  const [map, setMap] = useState<Record<string, ApiProductData>>(cache ?? {});

  useEffect(() => {
    listeners.add(setMap);
    if (cache !== null) {
      setMap(cache);
    } else {
      doFetch();
    }
    return () => { listeners.delete(setMap); };
  }, []);

  return map;
}

export function getFrontImage(data: ApiProductData | undefined): string | null {
  if (!data?.images?.length) return null;
  return data.images.find(i => i.view === "front" && i.url)?.url
    ?? data.images.find(i => i.url)?.url
    ?? null;
}

export function getViewImages(data: ApiProductData | undefined): ApiProductImage[] {
  return (data?.images ?? []).filter(i => i.url);
}
