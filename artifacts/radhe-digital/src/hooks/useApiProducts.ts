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
  name: string;
  description?: string;
  price: number;
  priceLabel?: string;
  badge?: string;
  tags?: string[];
  status?: "Active" | "Inactive";
  category?: string;
  categorySlug?: string;
  images?: ApiProductImage[];
  variants?: ApiProductVariant[];
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
}

let cache: Record<string, ApiProductData> | null = null;
let fetchPromise: Promise<void> | null = null;
let globalLoaded = false;
const mapListeners: Set<(map: Record<string, ApiProductData>) => void> = new Set();
const loadedListeners: Set<(v: boolean) => void> = new Set();

export function invalidateApiProductsCache() {
  cache = null;
  fetchPromise = null;
  globalLoaded = false;
}

function doFetch() {
  if (fetchPromise) return fetchPromise;
  fetchPromise = fetch("/api/products")
    .then(r => r.ok ? r.json() : [])
    .then((rows: ApiProductData[]) => {
      cache = Object.fromEntries(rows.map(r => [r.id, r]));
      globalLoaded = true;
      mapListeners.forEach(fn => fn(cache!));
      loadedListeners.forEach(fn => fn(true));
    })
    .catch(() => {
      cache = {};
      globalLoaded = true;
      mapListeners.forEach(fn => fn({}));
      loadedListeners.forEach(fn => fn(true));
    });
  return fetchPromise;
}

export function useApiProducts(): Record<string, ApiProductData> {
  const [map, setMap] = useState<Record<string, ApiProductData>>(cache ?? {});

  useEffect(() => {
    mapListeners.add(setMap);
    if (cache !== null) {
      setMap(cache);
    } else {
      doFetch();
    }
    return () => { mapListeners.delete(setMap); };
  }, []);

  return map;
}

export function useApiProductsLoaded(): boolean {
  const [loaded, setLoaded] = useState(globalLoaded);
  useEffect(() => {
    loadedListeners.add(setLoaded);
    if (globalLoaded) setLoaded(true);
    else doFetch();
    return () => { loadedListeners.delete(setLoaded); };
  }, []);
  return loaded;
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
