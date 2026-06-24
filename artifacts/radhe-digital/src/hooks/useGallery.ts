import { useState, useEffect, useRef } from "react";

export interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  visible: boolean;
  createdAt: string;
}

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

let _cache: GalleryImage[] | null = null;
type Listener = () => void;
const _listeners: Set<Listener> = new Set();

function notify() { _listeners.forEach(fn => fn()); }

export function invalidateGalleryCache() {
  _cache = null;
  notify();
}

async function fetchGallery(): Promise<GalleryImage[]> {
  const res = await fetch(`${BASE}/gallery`);
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return (await res.json()) as GalleryImage[];
}

export function useGallery() {
  // All hooks declared at top level in fixed order
  const [images, setImages] = useState<GalleryImage[]>(_cache ?? []);
  const [loading, setLoading] = useState(!_cache);
  const mounted = useRef(false);

  // Load function — stable reference not needed, called inside effects
  const doLoad = () => {
    setLoading(true);
    fetchGallery()
      .then(data => {
        const sorted = data.sort((a, b) => a.displayOrder - b.displayOrder);
        _cache = sorted;
        setImages(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Subscribe to cache invalidations — re-fetch when cache is cleared
  useEffect(() => {
    const onInvalidate = () => {
      if (_cache === null) doLoad();
      else setImages([..._cache]);
    };
    _listeners.add(onInvalidate);
    return () => { _listeners.delete(onInvalidate); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load on mount
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    if (_cache) { setImages(_cache); setLoading(false); return; }
    doLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { images, loading };
}
