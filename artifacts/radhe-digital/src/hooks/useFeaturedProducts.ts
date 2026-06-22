import { useState, useEffect } from "react";

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export interface FeaturedProductData {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  badge: string;
  link: string;
  displayOrder: number;
}

let _cache: FeaturedProductData[] | null = null;
let _fetchPromise: Promise<FeaturedProductData[]> | null = null;
const _listeners: Set<() => void> = new Set();

function fetchFeatured(): Promise<FeaturedProductData[]> {
  if (_cache) return Promise.resolve(_cache);
  if (_fetchPromise) return _fetchPromise;
  _fetchPromise = fetch(`${BASE}/featured-products`)
    .then(r => (r.ok ? r.json() : []))
    .then((data: FeaturedProductData[]) => {
      _cache = data;
      _listeners.forEach(l => l());
      return data;
    })
    .catch(() => {
      _fetchPromise = null;
      return [];
    });
  return _fetchPromise;
}

export function invalidateFeaturedProductsCache() {
  _cache = null;
  _fetchPromise = null;
  _listeners.forEach(l => l());
}

export function useFeaturedProducts() {
  const [items, setItems] = useState<FeaturedProductData[]>(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    const refresh = () => {
      if (_cache) { setItems([..._cache]); setLoading(false); }
    };
    _listeners.add(refresh);

    if (!_cache) {
      fetchFeatured().then(d => { setItems(d); setLoading(false); });
    } else {
      setItems([..._cache]);
      setLoading(false);
    }
    return () => { _listeners.delete(refresh); };
  }, []);

  return { items, loading };
}
