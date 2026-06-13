import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Zap, Shield, Truck, Star, ChevronDown,
  Package, Clock, CheckCircle, Users, Sparkles, ChevronLeft,
  ChevronRight, Quote, Palette, Shirt, Coffee, HardHat, Pen,
  Award, Image, Gift
} from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { useApiProducts, type ApiProductData } from "@/hooks/useApiProducts";
import { useLanguage } from "@/context/LanguageContext";
const logoSrc = "/radhe-logo.png";

/* ─── Category Product Photography ─── */
const CATEGORY_PHOTOS: Record<string, { src: string; alt: string }> = {
  "t-shirts": {
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Custom printed t-shirt",
  },
  "mugs": {
    src: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Premium branded coffee mug",
  },
  "caps": {
    src: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Custom embroidered cap",
  },
  "pens": {
    src: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Premium corporate branding pen",
  },
  "badges": {
    src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Professional custom badge",
  },
  "photo-frames": {
    src: "https://images.unsplash.com/photo-1513031640451-77ef0e87f0a2?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Premium printed photo frame",
  },
  "corporate-gifts": {
    src: "https://images.unsplash.com/photo-1563208723-7b1f4f34b8ef?auto=format&fit=crop&w=500&h=500&q=85",
    alt: "Luxury branded corporate gift set",
  },
};

function CategoryImage({ slug }: { slug: string }) {
  const data = CATEGORY_PHOTOS[slug] ?? CATEGORY_PHOTOS["t-shirts"];
  return (
    <>
      <img
        src={data.src}
        alt={data.alt}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        loading="lazy"
        draggable={false}
        style={{ willChange: "transform" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </>
  );
}

const CAT_ICONS: Record<string, JSX.Element> = {
  "t-shirts": <Shirt size={18}/>, "mugs": <Coffee size={18}/>, "caps": <HardHat size={18}/>,
  "pens": <Pen size={18}/>, "badges": <Award size={18}/>, "photo-frames": <Image size={18}/>,
  "corporate-gifts": <Gift size={18}/>,
};

/* ─── BestSellersCarousel ─── */
function BestSellersCarousel() {
  const { t } = useLanguage();
  const tabs = CATEGORIES.map(c => c.label);
  const [active, setActive] = useState(0);
  const [scrollIdx, setScrollIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCategory = CATEGORIES[active];
  const products = currentCategory?.products ?? [];
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
                  <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                    <CategoryImage slug={currentCategory.slug}/>
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
  const apiProducts = useApiProducts();
  const featuredBySlug: Record<string, ApiProductData> = {};
  Object.values(apiProducts).forEach(p => {
    if (p.categorySlug && p.status !== "Inactive" && !featuredBySlug[p.categorySlug]) {
      featuredBySlug[p.categorySlug] = p;
    }
  });

  const trustItems = t.trust;

  const whyIcons = [<Zap size={22}/>, <Shield size={22}/>, <Truck size={22}/>, <Package size={22}/>, <Palette size={22}/>, <Users size={22}/>];
  const whyChooseUs = t.why.items.map((item, i) => ({ ...item, icon: whyIcons[i] }));

  const stepIcons = [<Sparkles size={24}/>, <Palette size={24}/>, <Clock size={24}/>, <CheckCircle size={24}/>];
  const stepNums = ["01", "02", "03", "04"];
  const steps = t.howItWorks.steps.map((s, i) => ({ ...s, icon: stepIcons[i], step: stepNums[i] }));

  const testimonials = t.testimonials.items;

  const faqs = t.faq.items;

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden sm:min-h-[92vh] flex items-center"
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
                <Zap size={14} className="fill-current"/> {t.hero.tag}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                className="text-[36px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.12] tracking-tight mb-2 text-white"
                style={{ letterSpacing: "-0.015em" }}
              >
                {t.hero.line1}{" "}
                <span style={{
                  background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{t.hero.brand}</span>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}
                className="text-[36px] sm:text-[46px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.12] tracking-tight mb-6 text-white"
                style={{ letterSpacing: "-0.015em" }}
              >
                <span style={{
                  background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 40%, #D97706 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{t.hero.line2}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base sm:text-lg text-gray-300 font-normal mb-8 max-w-lg leading-[1.7]"
                style={{ color: "rgba(200,200,212,0.88)" }}
              >
                {t.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link href="/customize">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-9 py-4 rounded-2xl font-extrabold text-lg text-white"
                    style={{
                      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
                      boxShadow: "0 8px 32px rgba(220,38,38,0.5), 0 2px 8px rgba(220,38,38,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}
                  >
                    <Sparkles size={20}/> {t.hero.startDesigning} <ArrowRight size={20}/>
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
                    {t.hero.browseProducts} <ChevronRight size={18}/>
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
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
                {/* Rotating accent ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute pointer-events-none"
                  style={{
                    inset: "-6%",
                    borderRadius: "50%",
                    border: "1px solid transparent",
                    background: "linear-gradient(#1a1a1a, #1a1a1a) padding-box, linear-gradient(135deg, rgba(196,150,42,0.6), transparent, rgba(220,38,38,0.4), transparent) border-box",
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
                    src={logoSrc}
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
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.categories.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.categories.title}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">{t.categories.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/categories/${cat.slug}`}>
                  <motion.div
                    className="group flex flex-col items-center text-center p-5 bg-white border border-gray-100 rounded-2xl cursor-pointer transition-all duration-300"
                    whileHover={{ y: -6 }}
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 32px rgba(196,150,42,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.35)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)"; }}
                  >
                    <div className="w-full aspect-square rounded-xl overflow-hidden relative mb-3">
                      <CategoryImage slug={cat.slug}/>
                    </div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: "rgba(196,150,42,0.1)", color: "#C4962A" }}>
                      {CAT_ICONS[cat.slug]}
                    </div>
                    <h3 className="text-gray-900 font-bold text-sm leading-tight">{cat.label}</h3>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/categories">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold border text-sm transition-all duration-200 hover:bg-gray-50" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)" }}>
                {t.categories.browseAll} <ArrowRight size={15}/>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.featured.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.featured.title}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">{t.featured.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.slice(0, 4).map((cat, i) => {
              const product = featuredBySlug[cat.slug];
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                    whileHover={{ y: -6 }}
                    style={{ boxShadow: "0 2px 14px rgba(0,0,0,0.07)" }}
                    onClick={() => window.location.href = product ? `/categories/${cat.slug}/${product.id}` : `/categories/${cat.slug}`}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(196,150,42,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.3)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 14px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)"; }}
                  >
                    <div className="aspect-square bg-[#1a1a1a] relative overflow-hidden">
                      <CategoryImage slug={cat.slug}/>
                      {product?.badge && (
                        <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-white">{product.badge}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#C4962A" }}>{cat.label}</span>
                      <h3 className="text-gray-900 font-bold text-base mt-0.5 mb-1 leading-snug">{product?.name ?? cat.label}</h3>
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product?.description ?? cat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-extrabold text-lg">
                          {product ? (product.priceLabel ?? `₹${product.price}`) : t.categoriesPage.view}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); window.location.href = `/customize/${cat.slug}`; }}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-xl text-white bg-primary hover:bg-red-700 transition-colors"
                        >
                          <Palette size={11}/> {t.nav.customize}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/categories">
              <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold border text-sm transition-all duration-200 hover:bg-white" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)" }}>
                {t.featured.viewAll} <ArrowRight size={15}/>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS CAROUSEL ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.bestSellers.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.bestSellers.title}
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">{t.bestSellers.subtitle}</p>
          </div>
          <BestSellersCarousel/>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg,#0a0a0a 0%,#111111 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
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
      <section className="py-20 bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.howItWorks.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.howItWorks.title} <span style={{ color: "#C4962A" }}>{t.howItWorks.highlight}</span>
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-0.5 pointer-events-none z-0" style={{ background: "linear-gradient(90deg,rgba(196,150,42,0.15),rgba(196,150,42,0.5),rgba(196,150,42,0.15))" }}/>
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative z-10 bg-white border border-gray-100 rounded-2xl p-7 text-center"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
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

          <div className="text-center mt-12">
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }}
              >
                {t.howItWorks.startNow} <ArrowRight size={18}/>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.testimonials.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.testimonials.title}
            </h2>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400"/>)}
              <span className="text-gray-500 text-sm ml-2">{t.testimonials.rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white border border-gray-100 rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 36px rgba(196,150,42,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)"; }}
              >
                <Quote size={22} style={{ color: "#C4962A" }} className="opacity-70"/>
                <p className="text-gray-700 leading-relaxed text-sm italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                    style={{ background: "rgba(196,150,42,0.12)", border: "2px solid rgba(196,150,42,0.25)", color: "#C4962A" }}
                  >
                    {t.initials}
                  </div>
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
      <section className="py-20 bg-[#f7f7f5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {t.faq.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 mt-2 text-gray-900">
              {t.faq.title}
            </h2>
            <p className="text-gray-500 text-base">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <FAQItem q={faq.q} a={faq.a}/>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#080808 0%,#0f0a00 50%,#0a0a0a 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(circle,#C4962A 0%,transparent 70%)" }}/>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl" style={{ background: "radial-gradient(circle,#e53e3e 0%,transparent 70%)" }}/>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-5 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
            {t.cta.badge}
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-5 text-white leading-tight">
            {t.cta.title}{" "}
            <span style={{ color: "#C4962A" }}>{t.cta.highlight}</span>
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-lg text-white"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 6px 28px rgba(229,62,62,0.4)" }}
              >
                {t.cta.startNow} <ArrowRight size={20}/>
              </motion.button>
            </Link>
            <a href="https://wa.me/919319903380" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base border text-white hover:bg-white/5 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.2)" }}
              >
                {t.cta.whatsapp}
              </motion.button>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12">
            {t.cta.points.map(item => (
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
