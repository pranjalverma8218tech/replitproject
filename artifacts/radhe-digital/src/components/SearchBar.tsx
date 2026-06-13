import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Package } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useApiProducts, useApiProductsLoaded, getFrontImage, ApiProductData } from "@/hooks/useApiProducts";
import { useLanguage } from "@/context/LanguageContext";

const HINDI_TO_EN: Array<[RegExp, string[]]> = [
  [/टी.?शर्ट|टीशर्ट|t.?shirt/i,       ["t-shirt", "tee", "T-Shirt Printing"]],
  [/मग|mug/i,                          ["mug", "Mug Printing"]],
  [/कैप|टोपी|cap|hat/i,               ["cap", "Cap Printing"]],
  [/पेन|pen/i,                         ["pen", "Pen Printing"]],
  [/बैज|badge/i,                       ["badge", "Badge Printing"]],
  [/फोटो.?फ्रेम|photo.?frame/i,       ["photo", "frame", "Photo Frame"]],
  [/गिफ्ट|उपहार|gift|corporate/i,     ["gift", "corporate", "Corporate Gifts"]],
];

function getSearchTokens(query: string): string[] {
  const base = query.toLowerCase().trim();
  const tokens = [base];
  for (const [pattern, extras] of HINDI_TO_EN) {
    if (pattern.test(query)) tokens.push(...extras.map(e => e.toLowerCase()));
  }
  return tokens;
}

function scoreProduct(product: ApiProductData, tokens: string[]): number {
  const name     = (product.name        ?? "").toLowerCase();
  const cat      = (product.category    ?? "").toLowerCase();
  const slug     = (product.categorySlug ?? "").toLowerCase();
  const desc     = (product.description  ?? "").toLowerCase();
  const tags     = (product.tags         ?? []).join(" ").toLowerCase();
  const features = (product.features     ?? []).join(" ").toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (!token) continue;
    if (name.startsWith(token))          score += 10;
    else if (name.includes(token))       score += 6;
    if (cat.includes(token))             score += 5;
    if (slug.includes(token))            score += 4;
    if (tags.includes(token))            score += 3;
    if (desc.includes(token))            score += 2;
    if (features.includes(token))        score += 1;
  }
  return score;
}

interface Props {
  className?: string;
  mobileVariant?: boolean;
  onClose?: () => void;
}

export function SearchBar({ className = "", mobileVariant = false, onClose }: Props) {
  const [query, setQuery]           = useState("");
  const [debounced, setDebounced]   = useState("");
  const [open, setOpen]             = useState(false);
  const [, navigate]                = useLocation();
  const productsMap                 = useApiProducts();
  const loaded                      = useApiProductsLoaded();
  const { t }                       = useLanguage();
  const inputRef                    = useRef<HTMLInputElement>(null);
  const containerRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 280);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results = useCallback(() => {
    if (!debounced || debounced.length < 1) return [];
    const tokens  = getSearchTokens(debounced);
    const active  = Object.values(productsMap).filter(p => p.status !== "Inactive");
    return active
      .map(p => ({ product: p, score: scoreProduct(p, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ product }) => product);
  }, [debounced, productsMap])();

  const handleSelect = (p: ApiProductData) => {
    const slug = p.categorySlug ?? "categories";
    navigate(`/categories/${slug}/${p.id}`);
    setQuery("");
    setDebounced("");
    setOpen(false);
    onClose?.();
  };

  const handleClear = () => {
    setQuery("");
    setDebounced("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown = open && debounced.length > 0;
  const hasResults   = results.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* ── Search Input ── */}
      <div
        className="flex items-center rounded-xl transition-all duration-200"
        style={{
          background: mobileVariant ? "#f3f4f6" : "#f8f8f8",
          border: open
            ? "2px solid #DC2626"
            : "2px solid #e0e0e0",
          boxShadow: open
            ? "0 0 0 3px rgba(220,38,38,0.12)"
            : "0 1px 4px rgba(0,0,0,0.07)",
        }}
      >
        <Search
          size={18}
          className="ml-3 flex-shrink-0 transition-colors duration-200"
          style={{ color: open ? "#DC2626" : "#9ca3af" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoComplete="off"
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={e => {
            if (e.key === "Escape") { setOpen(false); inputRef.current?.blur(); }
            if (e.key === "Enter" && results.length > 0) handleSelect(results[0]);
          }}
          placeholder={t.nav.searchPlaceholder}
          className="flex-1 h-11 bg-transparent px-3 text-sm text-gray-800 placeholder-gray-400 outline-none min-w-0"
        />
        {query && (
          <button
            onClick={handleClear}
            className="mr-2 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-gray-200"
            style={{ color: "#9ca3af" }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Results Dropdown ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-[10000]"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e5e7eb",
              boxShadow: "0 20px 50px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.07)",
              minWidth: "320px",
            }}
          >
            {!loaded ? (
              <div className="px-4 py-5 text-center text-sm text-gray-400">
                {t.search.loading}
              </div>
            ) : hasResults ? (
              <>
                <div className="px-3 pt-3 pb-1">
                  <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-2">
                    {t.search.resultsFor} "{debounced}"
                  </p>
                </div>
                <ul className="px-2 pb-2">
                  {results.map(p => {
                    const img = getFrontImage(p);
                    return (
                      <li key={p.id}>
                        <button
                          onClick={() => handleSelect(p)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group"
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.05)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          {/* Product image */}
                          <div
                            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                            style={{ background: "#f3f4f6" }}
                          >
                            {img ? (
                              <img src={img} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package size={22} className="text-gray-300" />
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate group-hover:text-red-600 transition-colors">
                              {p.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">{p.category}</p>
                          </div>
                          {/* Price */}
                          <div className="flex-shrink-0 text-right">
                            <span className="text-sm font-black text-red-600">
                              {p.priceLabel ?? `₹${p.price}`}
                            </span>
                            {p.badge && (
                              <p className="text-[10px] text-gray-400 font-medium mt-0.5">{p.badge}</p>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div
                  className="px-4 py-2.5 border-t text-center"
                  style={{ borderColor: "#f3f4f6" }}
                >
                  <button
                    onClick={() => { navigate("/categories"); setOpen(false); onClose?.(); }}
                    className="text-xs font-bold text-red-600 hover:underline transition-colors"
                  >
                    {t.search.browseAll}
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 py-6 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: "#fef2f2" }}
                >
                  <Search size={20} className="text-red-400" />
                </div>
                <p className="text-sm font-bold text-gray-700">{t.search.noResults}</p>
                <p className="text-xs text-gray-400 mt-1">{t.search.tryKeywords}</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {["T-Shirts", "Mugs", "Caps", "Pens"].map(s => (
                    <button
                      key={s}
                      onClick={() => { setQuery(s); setDebounced(s.toLowerCase()); }}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors"
                      style={{ background: "#fef2f2", color: "#DC2626" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#DC2626"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#fef2f2"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
