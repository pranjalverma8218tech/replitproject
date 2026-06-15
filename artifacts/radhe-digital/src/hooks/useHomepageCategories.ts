import { useState, useEffect } from "react";

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export interface HomepageCategoryData {
  id: number;
  slug: string;
  name: string;
  nameHi: string | null;
  imageUrl: string | null;
  isVisible: number;
  displayOrder: number;
}

type RawCat = {
  id: number; slug: string; name: string; name_hi: string | null;
  image_url: string | null; is_visible: number; display_order: number;
};

function transform(r: RawCat): HomepageCategoryData {
  return { id: r.id, slug: r.slug, name: r.name, nameHi: r.name_hi, imageUrl: r.image_url, isVisible: r.is_visible, displayOrder: r.display_order };
}

let _cache: HomepageCategoryData[] | null = null;
let _fetchPromise: Promise<HomepageCategoryData[]> | null = null;
const _listeners: Set<() => void> = new Set();

function fetchCategories(): Promise<HomepageCategoryData[]> {
  if (_cache) return Promise.resolve(_cache);
  if (_fetchPromise) return _fetchPromise;
  _fetchPromise = fetch(`${BASE}/homepage-categories`)
    .then(r => (r.ok ? r.json() : []))
    .then((raw: RawCat[]) => {
      const data = raw.map(transform);
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

export function invalidateHomepageCategoriesCache() {
  _cache = null;
  _fetchPromise = null;
  _listeners.forEach(l => l());
}

export function useHomepageCategories() {
  const [categories, setCategories] = useState<HomepageCategoryData[]>(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    const refresh = () => {
      if (_cache) { setCategories([..._cache]); setLoading(false); }
    };
    _listeners.add(refresh);

    if (!_cache) {
      fetchCategories().then(d => { setCategories(d); setLoading(false); });
    } else {
      setCategories([..._cache]);
      setLoading(false);
    }
    return () => { _listeners.delete(refresh); };
  }, []);

  const categoryImages = Object.fromEntries(
    categories.map(c => [c.slug, c.imageUrl])
  ) as Record<string, string | null>;

  return { categories, categoryImages, loading };
}
