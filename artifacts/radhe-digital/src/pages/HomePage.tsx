import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Zap, Shield, Truck, Star, ChevronDown,
  Package, Clock, CheckCircle, Users, Sparkles, ChevronLeft,
  ChevronRight, Quote, Palette, Shirt, Coffee, HardHat, Pen,
  Award, Image, Gift, X, ZoomIn
} from "lucide-react";
import { useGallery, type GalleryImage } from "@/hooks/useGallery";
import { CATEGORIES } from "@/data/products";
import { useApiProducts, getFrontImage, type ApiProductData } from "@/hooks/useApiProducts";
import { useLanguage } from "@/context/LanguageContext";
import { useHomepageCategories } from "@/hooks/useHomepageCategories";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
const defaultLogoSrc = "/radhe-logo.png";

/* ─── Category Icons ─── */
const CAT_ICONS: Record<string, JSX.Element> = {
  "t-shirts": <Shirt size={18}/>, "mugs": <Coffee size={18}/>, "caps": <HardHat size={18}/>,
  "pens": <Pen size={18}/>, "badges": <Award size={18}/>, "photo-frames": <Image size={18}/>,
  "corporate-gifts": <Gift size={18}/>,
};

/* ─── Category Image ─── */
function CategoryImage({ slug, imageUrl }: { slug: string; imageUrl: string | null }) {
  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-[#1a1a1a] flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center" style={{ color: "rgba(255,255,255,0.15)" }}>
          {CAT_ICONS[slug] ?? <Image size={18}/>}
        </div>
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.1)" }}>No image uploaded</span>
      </div>
    );
  }
  return (
    <>
      <img
        src={imageUrl}
        alt={slug}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
        draggable={false}
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </>
  );
}

/* ─── ProductImage ─── */
function ProductImage({ product }: { product: ApiProductData | undefined }) {
  const imgUrl = getFrontImage(product);
  if (!imgUrl) {
    return (
      <div className="w-full h-full bg-[#f0f1f4] flex flex-col items-center justify-center gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center" style={{ color: "#9ca3af" }}>
          <Image size={18}/>
        </div>
        <span className="text-[10px] text-gray-400">No image</span>
      </div>
    );
  }
  return (
    <>
      <img
        src={imgUrl}
        alt={product?.name ?? "Product"}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
        draggable={false}
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"/>
    </>
  );
}

/* ─── BestSellersCarousel ─── */
function BestSellersCarousel({ apiProducts }: { apiProducts: Record<string, ApiProductData> }) {
  const { t } = useLanguage();
  const tabs = CATEGORIES.map(c => c.label);
  const [active, setActive] = useState(0);
  const [scrollIdx, setScrollIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCategory = CATEGORIES[active];
  const products = Object.values(apiProducts ?? {}).filter(
    p => p.categorySlug === currentCategory?.slug && p.status !== "Inactive"
  );
  const [VISIBLE, setVISIBLE] = useState(() =>
    typeof window !== "undefined" ? (window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3) : 3
  );
  useEffect(() => {
    const update = () =>
      setVISIBLE(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  const maxScroll = Math.max(0, products.length - VISIBLE);

  useEffect(() => { setScrollIdx(0); }, [active]);

  const scroll = (dir: "left" | "right") => {
    setScrollIdx(i => dir === "left" ? Math.max(0, i - 1) : Math.min(maxScroll, i + 1));
  };

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 8) e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current ?? 0));
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      scroll(dx < 0 ? "right" : "left");
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
              active === i
                ? "text-white border-[#C4962A]"
                : "bg-white text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-700"
            }`}
            style={active === i ? { background: "linear-gradient(135deg,#C4962A,#A07820)", boxShadow: "0 2px 12px rgba(196,150,42,0.3)" } : {}}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        {scrollIdx > 0 && (
          <button onClick={() => scroll("left")} className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:text-[#C4962A] hover:border-[#C4962A] transition-all shadow-md">
            <ChevronLeft size={16}/>
          </button>
        )}
        {scrollIdx < maxScroll && (
          <button onClick={() => scroll("right")} className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 rounded-full bg-white border border-gray-200 items-center justify-center text-gray-600 hover:text-[#C4962A] hover:border-[#C4962A] transition-all shadow-md">
            <ChevronRight size={16}/>
          </button>
        )}
        <div
          ref={containerRef}
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex gap-5"
            animate={{ x: scrollIdx > 0 ? `calc(-${scrollIdx} * (100% / ${VISIBLE} + 5px / ${VISIBLE}))` : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {products.map((product, i) => {
              return (
                <motion.div
                  key={product.id}
                  className="group flex-shrink-0 bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{ width: `calc((100% - ${(VISIBLE-1)*20}px) / ${VISIBLE})`, boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}
                  whileHover={{ y: -5 }}
                  onClick={() => window.location.href = `/categories/${currentCategory.slug}/${product.id}`}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 30px rgba(196,150,42,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.3)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 14px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)"; }}
                >
                  <div className="aspect-square bg-[#f0f1f4] relative overflow-hidden">
                    <ProductImage product={product}/>
                    {product.badge && (
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">{product.badge}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 font-bold text-sm leading-tight mb-1">{product.name}</p>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-extrabold text-base">{product.priceLabel}</span>
                      <button
                        onClick={e => { e.stopPropagation(); window.location.href = `/customize/${currentCategory.slug}`; }}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg text-white bg-primary hover:bg-red-700 transition-colors"
                      >
                        {t.bestSellers.customize}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {maxScroll > 0 && (
        <div className="flex justify-center gap-2 mt-5">
          {[...Array(maxScroll + 1)].map((_, i) => (
            <button
              key={i}
              onClick={() => setScrollIdx(i)}
              className={`rounded-full transition-all duration-200 ${i === scrollIdx ? "w-5 h-2" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
              style={i === scrollIdx ? { background: "#C4962A" } : {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── GalleryLightbox ─── */
function GalleryLightbox({ images, index, onClose }: { images: GalleryImage[]; index: number; onClose: () => void }) {
  const [current, setCurrent] = useState(index);

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [prev, next, onClose]);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    touchStartX.current = null;
  };

  const img = images[current];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center"
        style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.92)" }}
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <X size={18}/>
        </button>

        {/* Prev */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
            className="absolute left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <ChevronLeft size={22}/>
          </button>
        )}

        {/* Image */}
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.22 }}
          className="relative max-w-4xl w-full mx-16 flex flex-col items-center"
          onClick={e => e.stopPropagation()}
        >
          <img
            src={img.imageUrl}
            alt={img.caption}
            className="max-h-[80vh] w-auto max-w-full object-contain"
            style={{ borderRadius: "16px", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
            draggable={false}
          />
          {img.caption && (
            <p className="mt-4 text-white/70 text-sm text-center px-4">{img.caption}</p>
          )}
          {images.length > 1 && (
            <p className="mt-2 text-white/40 text-xs">{current + 1} / {images.length}</p>
          )}
        </motion.div>

        {/* Next */}
        {images.length > 1 && (
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Next image"
            className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <ChevronRight size={22}/>
          </button>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className={`rounded-full transition-all ${i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── GallerySection ─── */
function GallerySection() {
  const { images, loading } = useGallery();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (loading) return null;
  if (images.length === 0) return null;

  // Build masonry-like layout: assign span classes for variety
  const spanClasses = ["", "row-span-2", "", "", "row-span-2", "", "row-span-2", "", "", "row-span-2"];
  const colSpanClasses = ["", "", "col-span-2", "", "", "", "", "col-span-2", "", ""];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #f8f9fc 0%, #f1f3f8 50%, #eef0f6 100%)" }}>
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0.35 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <pattern id="galleryDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#c4962a" fillOpacity="0.13"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#galleryDots)"/>
        </svg>
      </div>

      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(196,150,42,0.35) 30%, rgba(196,150,42,0.5) 50%, rgba(196,150,42,0.35) 70%, transparent 100%)" }}/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full"
              style={{ color: "#C4962A", border: "1px solid rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.07)" }}
            >
              <Award size={11}/> 500+ Projects Delivered
            </span>

            <h2 className="text-3xl sm:text-[2.6rem] font-extrabold mb-3 mt-2 text-gray-900" style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Our Recent Work
            </h2>
            <div className="flex justify-center mb-4">
              <div className="h-1 rounded-full w-16" style={{ background: "linear-gradient(90deg, rgba(196,150,42,0.5), #C4962A, rgba(196,150,42,0.5))" }}/>
            </div>
            <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
              A glimpse of the quality and creativity we deliver.
            </p>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gridAutoRows: "200px",
          }}
        >
          {images.map((img, i) => {
            const spanRow = i % 5 === 1 || i % 5 === 4 ? 2 : 1;
            const spanCol = i % 7 === 2 || i % 7 === 6 ? 2 : 1;
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 6) * 0.07, duration: 0.45 }}
                className="group relative overflow-hidden cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={img.caption ? `View: ${img.caption}` : `View gallery image ${i + 1}`}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxIdx(i); } }}
                style={{
                  gridRow: `span ${spanRow}`,
                  gridColumn: `span ${spanCol}`,
                  borderRadius: "18px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3, ease: "easeOut" } }}
                onClick={() => setLightboxIdx(i)}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.2), 0 4px 20px rgba(196,150,42,0.15)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                }}
              >
                {/* Image */}
                <img
                  src={img.imageUrl}
                  alt={img.caption || `Gallery ${i + 1}`}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ willChange: "transform" }}
                />

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, rgba(196,150,42,0.6) 0%, rgba(180,20,20,0.5) 100%)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    <ZoomIn size={18} className="text-white"/>
                  </div>
                  {img.caption && (
                    <p className="text-white text-xs font-semibold px-3 text-center leading-tight max-w-[150px]">{img.caption}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div
            className="inline-block rounded-3xl px-8 sm:px-14 py-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0e0e0e 0%, #1a0a0a 50%, #111 100%)",
              border: "1px solid rgba(196,150,42,0.2)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,150,42,0.12) 0%, transparent 65%)" }}/>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Ready to Print Your Design?
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                Join 10,000+ happy customers. Fast turnaround, no minimums.
              </p>
              <Link href="/customize">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base text-white btn-shine"
                  style={{
                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
                    boxShadow: "0 8px 28px rgba(220,38,38,0.45)",
                  }}
                >
                  <Sparkles size={18}/> Start Your Order <ArrowRight size={18}/>
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <GalleryLightbox
          images={images}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </section>
  );
}

/* ─── FAQItem ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200"
      style={{ borderColor: open ? "rgba(196,150,42,0.4)" : undefined }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className={`font-semibold text-base transition-colors ${open ? "" : "text-gray-800"}`}
          style={open ? { color: "#C4962A" } : {}}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 ml-4"
          style={{ color: open ? "#C4962A" : "#9ca3af" }}
        >
          <ChevronDown size={18}/>
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
              <p className="text-gray-600 leading-relaxed pt-4">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── HomePage ─── */
export default function HomePage() {
  const { t } = useLanguage();
  const { categoryImages } = useHomepageCategories();
  const apiProducts = useApiProducts();
  const featuredBySlug: Record<string, ApiProductData> = {};
  Object.values(apiProducts).forEach(p => {
    if (p.categorySlug && p.status !== "Inactive" && !featuredBySlug[p.categorySlug]) {
      featuredBySlug[p.categorySlug] = p;
    }
  });

  const { cmsData } = useHomepageCms();
  const { items: featuredItems } = useFeaturedProducts();

  const trustItems = cmsData?.trust?.map(i => i.text) ?? t.trust;

  const WHY_ICON_MAP: Record<string, JSX.Element> = {
    zap: <Zap size={22}/>, shield: <Shield size={22}/>, package: <Package size={22}/>,
    palette: <Palette size={22}/>, truck: <Truck size={22}/>, users: <Users size={22}/>,
    star: <Star size={22}/>, clock: <Clock size={22}/>, sparkles: <Sparkles size={22}/>,
    check: <CheckCircle size={22}/>, award: <Award size={22}/>,
  };
  const whyIcons = [<Zap size={22}/>, <Shield size={22}/>, <Truck size={22}/>, <Package size={22}/>, <Palette size={22}/>, <Users size={22}/>];
  const whyChooseUs = cmsData?.whyUs
    ? cmsData.whyUs.map(item => ({ title: item.title, desc: item.description, icon: WHY_ICON_MAP[item.iconName] ?? <Zap size={22}/> }))
    : t.why.items.map((item, i) => ({ ...item, icon: whyIcons[i] }));

  const STEP_ICON_MAP: Record<string, JSX.Element> = {
    sparkles: <Sparkles size={24}/>, palette: <Palette size={24}/>, clock: <Clock size={24}/>,
    check: <CheckCircle size={24}/>, package: <Package size={24}/>, truck: <Truck size={24}/>,
    zap: <Zap size={24}/>, star: <Star size={24}/>,
  };
  const stepIcons = [<Sparkles size={24}/>, <Palette size={24}/>, <Clock size={24}/>, <CheckCircle size={24}/>];
  const stepNums = ["01", "02", "03", "04"];
  const steps = cmsData?.steps
    ? cmsData.steps.map(s => ({ title: s.title, desc: s.description, icon: STEP_ICON_MAP[s.iconName] ?? <Sparkles size={24}/>, step: s.stepNumber }))
    : t.howItWorks.steps.map((s, i) => ({ ...s, icon: stepIcons[i], step: stepNums[i] }));

  const testimonials = cmsData?.testimonials ?? t.testimonials.items;

  const faqs = cmsData?.faqs?.map(f => ({ q: f.question, a: f.answer })) ?? t.faq.items;

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden sm:min-h-[85vh] flex items-center"
        style={{
          background: "linear-gradient(145deg, #0e0e0e 0%, #161010 25%, #1f0a0a 50%, #2a0d0d 70%, #1a1010 85%, #111111 100%)",
        }}
      >
        {/* Background depth layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Large red atmosphere */}
          <div className="absolute" style={{
            top: "-10%", right: "-5%", width: "65%", height: "90%",
            background: "radial-gradient(ellipse at center, rgba(180,20,20,0.22) 0%, rgba(120,10,10,0.12) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}/>
          {/* Gold accent top-left */}
          <div className="absolute" style={{
            top: "-5%", left: "0%", width: "45%", height: "60%",
            background: "radial-gradient(ellipse at center, rgba(196,150,42,0.1) 0%, transparent 65%)",
            filter: "blur(50px)",
          }}/>
          {/* Bottom deep red */}
          <div className="absolute" style={{
            bottom: "-10%", left: "30%", width: "50%", height: "60%",
            background: "radial-gradient(ellipse at center, rgba(150,10,10,0.18) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}/>
          {/* Subtle grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}/>
          {/* Subtle horizontal light line */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,150,42,0.25), transparent)" }}/>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

            {/* ── Left: Text Content ── */}
            <div className="flex-1 min-w-0 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="mb-7 inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-bold"
                style={{
                  border: "1px solid rgba(196,150,42,0.4)",
                  background: "rgba(196,150,42,0.08)",
                  color: "#D4A730",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 20px rgba(196,150,42,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <Zap size={14} className="fill-current"/> {cmsData?.hero?.tag ?? t.hero.tag}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[36px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.12] tracking-tight mb-2 text-white"
                style={{ letterSpacing: "-0.015em" }}
              >
                {cmsData?.hero?.line1 ?? t.hero.line1}{" "}
                <span style={{
                  background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{cmsData?.hero?.brand ?? t.hero.brand}</span>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
                className="text-[36px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.12] tracking-tight mb-6 text-white"
                style={{ letterSpacing: "-0.015em" }}
              >
                <span style={{
                  background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{cmsData?.hero?.line2 ?? t.hero.line2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg text-gray-300 font-normal mb-8 max-w-lg leading-[1.7]"
                style={{ color: "rgba(200,200,212,0.88)" }}
              >
                {cmsData?.hero?.subtitle ?? t.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link href="/customize">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-9 py-4 rounded-2xl font-extrabold text-lg text-white btn-shine"
                    style={{
                      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
                      boxShadow: "0 8px 32px rgba(220,38,38,0.5), 0 2px 8px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <Sparkles size={20}/> {cmsData?.hero?.btn1Text ?? t.hero.startDesigning} <ArrowRight size={20}/>
                  </motion.button>
                </Link>
                <Link href="/categories">
                  <motion.button
                    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      backdropFilter: "blur(12px)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    {cmsData?.hero?.btn2Text ?? t.hero.browseProducts} <ChevronRight size={18}/>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Glass stat pills */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-3"
              >
                {[
                  { icon: <Users size={15}/>, label: t.hero.customers },
                  { icon: <Star size={15} className="fill-yellow-400 text-yellow-400"/>, label: t.hero.rating },
                  { icon: <Truck size={15}/>, label: t.hero.delivery },
                ].map(item => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      color: "rgba(220,220,230,0.9)",
                    }}
                  >
                    <span style={{ color: "#D4A730" }}>{item.icon}</span>
                    {item.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Circular Brand Logo with spotlight ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
              className="flex-shrink-0 flex items-center justify-center w-full lg:w-auto order-1 lg:order-2"
              style={{ maxWidth: "400px" }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative flex items-center justify-center"
              >
                {/* Outer atmospheric glow */}
                <div className="absolute pointer-events-none" style={{
                  inset: "-40%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(220,38,38,0.3) 0%, rgba(196,150,42,0.12) 35%, transparent 65%)",
                  filter: "blur(40px)",
                }}/>
                {/* Mid spotlight ring */}
                <div className="absolute pointer-events-none" style={{
                  inset: "-18%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(220,38,38,0.2) 0%, rgba(196,150,42,0.08) 50%, transparent 70%)",
                  filter: "blur(20px)",
                }}/>
                {/* Accent ring */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-6%",
                    borderRadius: "50%",
                    border: "1px solid transparent",
                    background: "linear-gradient(#1a1a1a, #1a1a1a) padding-box, linear-gradient(135deg, rgba(196,150,42,0.35), transparent, rgba(220,38,38,0.2), transparent) border-box",
                  }}
                />
                {/* Logo image */}
                <div
                  className="relative z-10 w-52 h-52 sm:w-68 sm:h-68 lg:w-80 lg:h-80"
                  style={{
                    width: "clamp(200px, 28vw, 320px)",
                    height: "clamp(200px, 28vw, 320px)",
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 12px 60px rgba(0,0,0,0.8), 0 0 40px rgba(220,38,38,0.25), 0 0 80px rgba(196,150,42,0.1)",
                  }}
                >
                  <img
                    src={cmsData?.hero?.heroImageUrl || defaultLogoSrc}
                    alt="Radhe Digital"
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade into trust bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,5,5,0.6))",
        }}/>
      </section>

      {/* ── TRUST BAR ── */}
      <section
        className="py-4 overflow-hidden relative"
        style={{
          background: "linear-gradient(90deg, #0d0505 0%, #160808 50%, #0d0505 100%)",
          borderTop: "1px solid rgba(220,38,38,0.25)",
          borderBottom: "1px solid rgba(220,38,38,0.2)",
        }}
      >
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[...trustItems, ...trustItems].map((item, i) => (
            <div
              key={i}
              className="flex items-center px-8 text-sm font-bold whitespace-nowrap tracking-wide"
              style={{ color: "#D4A730" }}
            >
              {item}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(160deg, #f8f9fc 0%, #f1f3f8 50%, #eef0f6 100%)" }}>

        {/* Decorative background texture dots */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0.35 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: 0, left: 0 }}>
            <defs>
              <pattern id="catDots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="#c4962a" fillOpacity="0.13"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#catDots)"/>
          </svg>
        </div>

        {/* Large soft glow behind heading */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px]" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,150,42,0.09) 0%, transparent 70%)", borderRadius: "0 0 50% 50%" }}/>
        {/* Bottom accent glow */}
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)" }}/>

        {/* Top border accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(196,150,42,0.35) 30%, rgba(196,150,42,0.5) 50%, rgba(196,150,42,0.35) 70%, transparent 100%)" }}/>
        {/* Bottom border accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(209,213,219,0.7), transparent)" }}/>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section heading ── */}
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.22em] uppercase mb-4 px-4 py-1.5 rounded-full" style={{ color: "#C4962A", border: "1px solid rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.07)", letterSpacing: "0.2em" }}>
                <Sparkles size={11}/> {t.categories.badge}
              </span>
              <h2 className="text-3xl sm:text-[2.6rem] font-extrabold mb-3 mt-2 text-gray-900" style={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                {t.categories.title}
              </h2>
              {/* Gold underline accent */}
              <div className="flex justify-center mb-4">
                <div className="h-1 rounded-full w-16" style={{ background: "linear-gradient(90deg, rgba(196,150,42,0.5), #C4962A, rgba(196,150,42,0.5))" }}/>
              </div>
              <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">{t.categories.subtitle}</p>
            </motion.div>
          </div>

          {/* ── Category cards grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 sm:gap-5">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={`/categories/${cat.slug}`}>
                  <motion.div
                    className="group flex flex-col items-center text-center bg-white cursor-pointer"
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    style={{
                      border: "1px solid #e8e3dc",
                      borderRadius: "20px",
                      padding: "18px 14px 16px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12), 0 20px 50px rgba(196,150,42,0.12), 0 0 0 1px rgba(196,150,42,0.15)";
                      el.style.borderColor = "rgba(196,150,42,0.5)";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.08)";
                      el.style.borderColor = "#e8e3dc";
                    }}
                  >
                    {/* Image container with tinted bg + inner shadow */}
                    <div
                      className="w-full aspect-square rounded-[14px] overflow-hidden relative mb-3.5"
                      style={{
                        background: "linear-gradient(145deg, #f0f2f7 0%, #e8eaf2 100%)",
                        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.07)",
                      }}
                    >
                      <motion.div
                        className="w-full h-full"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <CategoryImage slug={cat.slug} imageUrl={categoryImages[cat.slug] ?? null}/>
                      </motion.div>
                    </div>

                    {/* Icon badge */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: "rgba(196,150,42,0.09)", color: "#C4962A" }}
                    >
                      {CAT_ICONS[cat.slug]}
                    </div>

                    {/* Category name */}
                    <h3 className="text-gray-900 font-bold text-[14px] sm:text-[15px] leading-snug tracking-tight">
                      {cat.label}
                    </h3>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ── Browse all CTA ── */}
          <div className="text-center mt-10">
            <Link href="/categories">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-9 py-3.5 rounded-xl font-bold text-sm transition-colors duration-200"
                style={{
                  color: "#C4962A",
                  border: "1.5px solid rgba(196,150,42,0.4)",
                  background: "rgba(196,150,42,0.04)",
                  boxShadow: "0 4px 18px rgba(196,150,42,0.1)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(196,150,42,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(196,150,42,0.04)"; }}
              >
                {t.categories.browseAll} <ArrowRight size={15}/>
              </motion.button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 section-warm relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-56" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,150,42,0.14) 0%, transparent 65%)", filter: "blur(55px)" }}/>
        <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96" style={{ background: "radial-gradient(circle at 100% 100%, rgba(220,38,38,0.05) 0%, transparent 65%)", filter: "blur(60px)" }}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.featured.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-2 text-gray-900">
              {t.featured.title}
            </h2>
            <div className="heading-gradient-bar"/>
            <p className="text-gray-500 text-base max-w-xl mx-auto mt-4">{t.featured.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.slice(0, 4).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <motion.div
                  className="group bg-white rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.32, ease: [0.34, 1.38, 0.64, 1] }}
                  style={{ border: "1px solid #e8e3dc", boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.09)" }}
                  onClick={() => { if (item.link) window.location.href = item.link; }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12), 0 24px 56px rgba(196,150,42,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.45)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.09)"; (e.currentTarget as HTMLElement).style.borderColor = "#e8e3dc"; }}
                >
                  <div className="aspect-square bg-[#f0f1f4] relative overflow-hidden">
                    {item.imageUrl ? (
                      <>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                          loading="lazy"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"/>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center" style={{ color: "#9ca3af" }}>
                          <Image size={20}/>
                        </div>
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                    {item.badge && (
                      <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-white">{item.badge}</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-gray-900 font-bold text-base mb-1 leading-snug">{item.name}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-extrabold text-lg">{item.price}</span>
                      <button
                        onClick={e => { e.stopPropagation(); window.location.href = item.link || "/categories"; }}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl text-white bg-primary hover:bg-red-700 transition-colors"
                      >
                        <Palette size={11}/> {t.nav.customize}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold border text-sm transition-all duration-200 hover:bg-white" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)" }}>
                {t.featured.viewAll} <ArrowRight size={15}/>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS CAROUSEL ── */}
      <section className="section-white py-14 relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-48" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.07) 0%, transparent 65%)", filter: "blur(50px)" }}/>
        <div className="pointer-events-none absolute bottom-0 left-0 w-96 h-96" style={{ background: "radial-gradient(circle at 0% 100%, rgba(196,150,42,0.06) 0%, transparent 65%)", filter: "blur(60px)" }}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.bestSellers.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-2 text-gray-900">
              {t.bestSellers.title}
            </h2>
            <div className="heading-gradient-bar"/>
            <p className="text-gray-500 text-base max-w-xl mx-auto mt-4">{t.bestSellers.subtitle}</p>
          </div>
          <BestSellersCarousel apiProducts={apiProducts}/>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-14" style={{ background: "linear-gradient(135deg,#0a0a0a 0%,#111111 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.why.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-white">
              {t.why.title} <span style={{ color: "#C4962A" }}>{t.why.highlight}</span>
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">{t.why.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="group flex items-start gap-5 p-6 rounded-2xl border border-white/8 bg-[#111] hover:border-[#C4962A]/35 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{ background: "rgba(196,150,42,0.12)", border: "1px solid rgba(196,150,42,0.25)", color: "#C4962A" }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1.5">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 section-warmer relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-56" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.07) 0%, transparent 65%)", filter: "blur(55px)" }}/>
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80" style={{ background: "radial-gradient(circle at 100% 100%, rgba(196,150,42,0.07) 0%, transparent 65%)", filter: "blur(55px)" }}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.howItWorks.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-2 text-gray-900">
              {t.howItWorks.title} <span style={{ color: "#C4962A" }}>{t.howItWorks.highlight}</span>
            </h2>
            <div className="heading-gradient-bar"/>
            <p className="text-gray-500 text-base max-w-xl mx-auto mt-4">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 pointer-events-none z-0" style={{ background: "linear-gradient(90deg,rgba(196,150,42,0.15),rgba(196,150,42,0.5),rgba(196,150,42,0.15))" }}/>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.4 }}
                className="relative z-10 card-elevated rounded-2xl p-7 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(196,150,42,0.1)", border: "2px solid rgba(196,150,42,0.35)", color: "#C4962A" }}
                >
                  {step.icon}
                </div>
                <span className="inline-block text-xs font-black tracking-widest mb-2" style={{ color: "#C4962A" }}>{step.step}</span>
                <h3 className="font-extrabold text-gray-900 text-base mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white btn-shine"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 6px 28px rgba(229,62,62,0.45)" }}
              >
                {t.howItWorks.startNow} <ArrowRight size={18}/>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 section-white relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px]" style={{ background: "radial-gradient(circle at 100% 0%, rgba(196,150,42,0.08) 0%, transparent 60%)", filter: "blur(60px)" }}/>
        <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px]" style={{ background: "radial-gradient(circle at 0% 100%, rgba(220,38,38,0.05) 0%, transparent 60%)", filter: "blur(60px)" }}/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.testimonials.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-2 text-gray-900">
              {t.testimonials.title}
            </h2>
            <div className="heading-gradient-bar"/>
            <div className="flex items-center justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400"/>)}
              <span className="text-gray-500 text-sm ml-2">{t.testimonials.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.4 }}
                className="group card-elevated rounded-2xl p-7 flex flex-col gap-4"
              >
                <Quote size={22} style={{ color: "#C4962A" }} className="opacity-70"/>
                <p className="text-gray-700 leading-relaxed text-sm italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  {(t as any).photoUrl ? (
                    <img
                      src={(t as any).photoUrl}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                      style={{ border: "2px solid rgba(196,150,42,0.35)" }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                      style={{ background: "rgba(196,150,42,0.12)", border: "2px solid rgba(196,150,42,0.25)", color: "#C4962A" }}
                    >
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <p className="text-gray-900 font-bold text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={11} className="text-yellow-400 fill-yellow-400"/>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 section-warm relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(196,150,42,0.11) 0%, transparent 65%)", filter: "blur(50px)" }}/>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.faq.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 mt-2 text-gray-900">
              {t.faq.title}
            </h2>
            <div className="heading-gradient-bar"/>
            <p className="text-gray-500 text-base mt-4">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <FAQItem q={faq.q} a={faq.a}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <GallerySection />

      {/* ── FINAL CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#080808 0%,#0f0a00 50%,#0a0a0a 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#C4962A 0%,transparent 70%)" }}/>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl" style={{ background: "radial-gradient(circle,#e53e3e 0%,transparent 70%)" }}/>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-5 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
            {cmsData?.cta?.badge ?? t.cta.badge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 text-white leading-tight">
            {cmsData?.cta?.title ?? t.cta.title}{" "}
            <span style={{ color: "#C4962A" }}>{cmsData?.cta?.highlight ?? t.cta.highlight}</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {cmsData?.cta?.subtitle ?? t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg text-white btn-shine"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 6px 28px rgba(229,62,62,0.5)" }}
              >
                {cmsData?.cta?.btn1Text ?? t.cta.startNow} <ArrowRight size={20}/>
              </motion.button>
            </Link>
            <a href={cmsData?.cta?.btn2Link ?? "https://wa.me/919319903380"} target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base border text-white hover:bg-white/5 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                {cmsData?.cta?.btn2Text ?? t.cta.whatsapp}
              </motion.button>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12">
            {(cmsData?.cta ? [cmsData.cta.point1, cmsData.cta.point2, cmsData.cta.point3].filter(Boolean) : t.cta.points).map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle size={14} style={{ color: "#C4962A" }}/> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
