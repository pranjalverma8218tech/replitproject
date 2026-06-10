import { useState, useEffect } from "react";

export interface ApiProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface ApiProductData {
  id: string;
  images?: ApiProductImage[];
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  priceLabel?: string;
  badge?: string;
  tags?: string[];
}

let cache: Record<string, ApiProductData> | null = null;
let fetchPromise: Promise<void> | null = null;

export function useApiProducts(): Record<string, ApiProductData> {
  const [map, setMap] = useState<Record<string, ApiProductData>>(cache ?? {});

  useEffect(() => {
    if (cache !== null) { setMap(cache); return; }
    if (!fetchPromise) {
      fetchPromise = fetch("/api/products")
        .then(r => r.ok ? r.json() : [])
        .then((rows: ApiProductData[]) => {
          cache = Object.fromEntries(rows.map(r => [r.id, r]));
          setMap(cache);
        })
        .catch(() => { cache = {}; setMap({}); });
    } else {
      fetchPromise.then(() => { if (cache) setMap(cache); });
    }
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
