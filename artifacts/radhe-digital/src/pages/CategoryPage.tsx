import React, { useState, useMemo } from "react";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, Palette, ChevronRight,
  X, ArrowRight, Package, ShoppingBag, Eye
} from "lucide-react";
import { CATEGORY_MAP, CATEGORIES, type Product } from "@/data/products";
import { ProductOptionsModal } from "@/components/ProductOptionsModal";

/* ─── SVG Product Illustrations ─── */
function ProductSVG({ slug, index }: { slug: string; index: number }) {
  const colors = ["#e53e3e", "#c53030", "#9b2c2c", "#e53e3e", "#c53030", "#9b2c2c", "#e53e3e", "#c53030"];
  const color = colors[index % colors.length];

  const map: Record<string, JSX.Element> = {
    "t-shirts": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.92"/>
        <rect x="84" y="95" width="32" height="24" rx="4" fill="white" opacity="0.12"/>
        <text x="100" y="111" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">PRINT</text>
      </svg>
    ),
    "mugs": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.88"/>
        <path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.9"/>
        <path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9"/>
        <rect x="64" y="97" width="52" height="16" rx="4" fill="white" opacity="0.18"/>
        <text x="90" y="108" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">RADHE</text>
      </svg>
    ),
    "caps": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <ellipse cx="100" cy="133" rx="68" ry="11" fill="#222"/>
        <path d="M42 122 Q42 70 100 66 Q158 70 158 122 Z" fill={color} opacity="0.9"/>
        <path d="M42 122 Q26 121 24 114 Q22 106 42 119" fill={color} opacity="0.75"/>
        <rect x="82" y="86" width="36" height="22" rx="5" fill="white" opacity="0.15"/>
        <text x="100" y="100" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">RD</text>
        <rect x="42" y="120" width="116" height="5" rx="2.5" fill="#333"/>
      </svg>
    ),
    "pens": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/>
        <rect x="92" y="27" width="7" height="131" rx="3.5" fill="white" opacity="0.1"/>
        <polygon points="90,160 110,160 100,180" fill="#aaa"/>
        <polygon points="97,171 103,171 100,180" fill="#777"/>
        <rect x="90" y="23" width="20" height="14" rx="7" fill="#555"/>
        <rect x="92" y="78" width="16" height="3" rx="1.5" fill="white" opacity="0.25"/>
        <rect x="92" y="90" width="16" height="3" rx="1.5" fill="white" opacity="0.25"/>
      </svg>
    ),
    "badges": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <rect x="48" y="68" width="104" height="82" rx="12" fill={color} opacity="0.9"/>
        <rect x="82" y="46" width="36" height="26" rx="5" fill="#888"/>
        <rect x="88" y="52" width="24" height="6" rx="3" fill="#666"/>
        <circle cx="100" cy="100" r="24" fill="white" opacity="0.12"/>
        <text x="100" y="96" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">RADHE</text>
        <text x="100" y="108" textAnchor="middle" fill="white" fontSize="7" fontFamily="sans-serif" opacity="0.6">DIGITAL</text>
      </svg>
    ),
    "photo-frames": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/>
        <rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/>
        <rect x="56" y="56" width="88" height="88" rx="3" fill="#222"/>
        <path d="M56 110 L80 82 L106 100 L126 76 L144 110 Z" fill={color} opacity="0.5"/>
        <circle cx="76" cy="78" r="10" fill={color} opacity="0.4"/>
      </svg>
    ),
    "corporate-gifts": (
      <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
        <rect width="200" height="200" fill="#141414"/>
        <rect x="44" y="100" width="112" height="76" rx="8" fill={color} opacity="0.9"/>
        <rect x="38" y="78" width="124" height="28" rx="6" fill={color}/>
        <rect x="38" y="78" width="124" height="28" rx="6" fill="white" opacity="0.08"/>
        <rect x="94" y="78" width="12" height="98" fill="white" opacity="0.2"/>
        <path d="M100 78 Q78 60 70 50 Q62 40 73 37 Q84 35 100 78" fill={color} opacity="0.8"/>
        <path d="M100 78 Q122 60 130 50 Q138 40 127 37 Q116 35 100 78" fill={color} opacity="0.8"/>
      </svg>
    ),
  };
  return map[slug] || map["t-shirts"];
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-primary text-white",
  "Popular": "bg-white/15 text-white",
  "Trending": "bg-yellow-500/80 text-black",
  "Premium": "bg-white text-black",
  "Bulk Deal": "bg-green-600/80 text-white",
  "Eco": "bg-green-500/80 text-white",
};

/* ─── Product Card ─── */
function ProductCard({ product, slug, categoryLabel, index }: {
  product: Product; slug: string; categoryLabel: string; index: number;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <ProductOptionsModal
          product={product}
          categorySlug={slug}
          categoryLabel={categoryLabel}
          onClose={() => setShowModal(false)}
        />
      )}
      <motion.div
        className="group bg-[#111] border border-white/8 rounded-2xl overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.4 }}
        whileHover={{ y: -5 }}
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(229,62,62,0.18)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)"; }}
      >
        {/* Image — click opens product detail */}
        <Link href={`/categories/${slug}/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-[#0d0d0d] cursor-pointer">
            <ProductSVG slug={slug} index={index} />
            {product.badge && (
              <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge] ?? "bg-primary text-white"}`}>
                {product.badge}
              </span>
            )}
            {/* Hover overlay → View Details */}
            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-black">
                <Eye size={13} /> View Details
              </span>
            </div>
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Title links to detail page */}
          <Link href={`/categories/${slug}/${product.id}`}>
            <h3 className="text-white font-bold text-base mb-1 leading-snug hover:text-primary transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-3">{product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-gray-500 border border-white/10">
                #{tag}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest block">Starting from</span>
              <span className="text-primary font-extrabold text-xl leading-none">{product.priceLabel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
              className="flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-gray-100 transition-all duration-200"
            >
              <ShoppingBag size={13} /> Buy
            </button>
            <Link href={`/categories/${slug}/${product.id}`}>
              <button className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold text-white border border-white/15 hover:border-white/30 transition-all duration-200">
                <Eye size={13} /> Details
              </button>
            </Link>
            <Link href={`/customize/${slug}`}>
              <button className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-red-700 transition-all duration-200">
                <Palette size={13} /> Custom
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ─── Main Page ─── */
export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const category = CATEGORY_MAP[slug];

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const allTags = useMemo(() => {
    if (!category) return [];
    return Array.from(new Set(category.products.flatMap(p => p.tags)));
  }, [category]);

  const filtered = useMemo(() => {
    if (!category) return [];
    let list = [...category.products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (activeTags.length > 0) {
      list = list.filter(p => activeTags.every(t => p.tags.includes(t)));
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [category, search, sortBy, activeTags]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setVisibleCount(6);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center px-4">
        <Package size={64} className="text-primary mb-6 opacity-60" />
        <h1 className="text-4xl font-extrabold mb-4">Category Not Found</h1>
        <p className="text-gray-400 mb-8">The category you're looking for doesn't exist.</p>
        <Link href="/categories">
          <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-colors">
            Browse All Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <section className="relative bg-[#0a0a0a] border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(229,62,62,0.1) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/categories" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-primary font-semibold">{category.label}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                {category.products.length} Products
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">{category.banner}</h1>
              <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{category.description}</p>
            </div>
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white text-sm whitespace-nowrap flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 18px rgba(229,62,62,0.35)" }}
              >
                <Palette size={16} /> Start Customizing <ArrowRight size={15} />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Quick Nav */}
      <section className="bg-[#0d0d0d] border-b border-white/8 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3 min-w-max">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                <button className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  cat.slug === slug ? "bg-primary text-white shadow-lg shadow-red-900/30" : "text-gray-400 hover:text-white hover:bg-white/8"
                }`}>
                  {cat.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search + Sort + Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(6); }}
              placeholder={`Search ${category.label.toLowerCase()}...`}
              className="w-full h-11 bg-[#111] border border-white/12 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <X size={15} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="h-11 bg-[#111] border border-white/12 rounded-xl px-4 text-sm text-gray-300 outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              filterOpen || activeTags.length > 0
                ? "bg-primary/15 border-primary/40 text-primary"
                : "bg-[#111] border-white/12 text-gray-300 hover:border-white/25 hover:text-white"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filter {activeTags.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{activeTags.length}</span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Filter by Tag</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                        activeTags.includes(tag) ? "bg-primary border-primary text-white" : "bg-transparent border-white/15 text-gray-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                  {activeTags.length > 0 && (
                    <button onClick={() => setActiveTags([])} className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:text-white transition-colors">
                      Clear all
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing <span className="text-white font-semibold">{visible.length}</span> of <span className="text-white font-semibold">{filtered.length}</span> products
          </p>
          {(search || activeTags.length > 0) && (
            <button onClick={() => { setSearch(""); setActiveTags([]); setVisibleCount(6); }} className="text-xs text-primary hover:text-red-400 transition-colors font-semibold">
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {visible.length === 0 ? (
          <div className="text-center py-24">
            <Package size={56} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No products match your search.</p>
            <button onClick={() => { setSearch(""); setActiveTags([]); }} className="mt-4 text-primary font-semibold hover:text-red-400 transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visible.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                slug={slug}
                categoryLabel={category.label}
                index={i}
              />
            ))}
          </div>
        )}

        {hasMore && (
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setVisibleCount(v => v + 6)}
              className="px-10 py-3.5 rounded-xl font-bold text-white border border-white/20 hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 text-sm"
            >
              Load More ({filtered.length - visibleCount} remaining)
            </motion.button>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#0a0a0a] border-t border-white/8 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Can't find what you need?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We do fully custom orders. Contact us on WhatsApp and our team will design the perfect product for you.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/customize">
            <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-red-700 transition-colors text-sm">
              Start Designing
            </button>
          </Link>
          <a href="https://wa.me/919319903380" target="_blank" rel="noopener noreferrer">
            <button className="px-8 py-3 rounded-xl border border-white/20 text-white font-bold hover:border-primary/50 hover:bg-primary/10 transition-all text-sm">
              WhatsApp Us
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
