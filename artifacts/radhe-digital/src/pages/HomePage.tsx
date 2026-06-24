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

/* ─── Hero Premium Showcase ─── */
function HeroPremiumShowcase() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    });
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full select-none"
      style={{ maxWidth: "500px" }}
      onMouseMove={handleMouse}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      {/* 3-D tilt wrapper */}
      <div style={{
        transform: `perspective(900px) rotateX(${tilt.y * -2.5}deg) rotateY(${tilt.x * 3.5}deg)`,
        transition: "transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
        borderRadius: "24px",
        overflow: "hidden",
        background: "linear-gradient(145deg,#0e0a0a,#150e0e)",
        border: "1px solid rgba(255,255,255,0.055)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 0 80px rgba(220,38,38,0.1), 0 0 40px rgba(196,150,42,0.06), inset 0 1px 0 rgba(255,255,255,0.04)",
        padding: "22px 18px 14px",
      }}>

        {/* Atmospheric glows */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-15%", right:"-5%", width:"55%", height:"65%",
            background:"radial-gradient(circle,rgba(220,38,38,0.24) 0%,transparent 68%)", filter:"blur(48px)" }}/>
          <div style={{ position:"absolute", bottom:"-5%", left:"2%", width:"45%", height:"50%",
            background:"radial-gradient(circle,rgba(196,150,42,0.13) 0%,transparent 65%)", filter:"blur(40px)" }}/>
          <div style={{ position:"absolute", top:"30%", left:"35%", width:"40%", height:"40%",
            background:"radial-gradient(circle,rgba(220,38,38,0.08) 0%,transparent 65%)", filter:"blur(30px)" }}/>
        </div>

        {/* SVG Composition */}
        <svg viewBox="0 0 460 370" xmlns="http://www.w3.org/2000/svg"
          style={{ width:"100%", height:"auto", position:"relative", zIndex:1, display:"block" }}>
          <defs>
            {/* Grid */}
            <pattern id="hGrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(255,255,255,0.022)" strokeWidth="0.8"/>
            </pattern>
            {/* Gradients */}
            <linearGradient id="gTS" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9f9f9"/><stop offset="100%" stopColor="#e0e0e0"/>
            </linearGradient>
            <linearGradient id="gTSSh" x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,0,0,0)" stopOpacity="0"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0.13)" stopOpacity="1"/>
            </linearGradient>
            <linearGradient id="gHD" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2c2c42"/><stop offset="100%" stopColor="#18182a"/>
            </linearGradient>
            <linearGradient id="gMG" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f2f2f2"/><stop offset="40%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#c2c2c2"/>
            </linearGradient>
            <linearGradient id="gCP" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#202020"/><stop offset="100%" stopColor="#0a0a0a"/>
            </linearGradient>
            <linearGradient id="gTB" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cbb89a"/><stop offset="100%" stopColor="#a89274"/>
            </linearGradient>
            <linearGradient id="gVC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#f5f0ea"/>
            </linearGradient>
            <linearGradient id="gPF" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1008"/><stop offset="100%" stopColor="#0c0602"/>
            </linearGradient>
            <linearGradient id="gPN" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#28284e"/><stop offset="48%" stopColor="#5c5c98"/>
              <stop offset="52%" stopColor="#5c5c98"/><stop offset="100%" stopColor="#18183a"/>
            </linearGradient>
            <linearGradient id="gPNT" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#888"/><stop offset="100%" stopColor="#444"/>
            </linearGradient>
            <linearGradient id="gPhP" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(220,38,38,0.07)"/>
              <stop offset="100%" stopColor="rgba(196,150,42,0.07)"/>
            </linearGradient>
            {/* Filters */}
            <filter id="fSh" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="5" stdDeviation="9" floodColor="#000" floodOpacity="0.55"/>
            </filter>
            <filter id="fGR" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#DC2626" floodOpacity="0.5"/>
            </filter>
            <filter id="fGG" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#C4962A" floodOpacity="0.55"/>
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="460" height="370" fill="url(#hGrid)"/>

          {/* ══ HOODIE — dark navy behind t-shirt ══ */}
          <g filter="url(#fSh)" opacity="0.82">
            <path d="M 161,88 L 135,78 L 115,82 L 108,136 L 156,146 L 158,98 Z" fill="url(#gHD)"/>
            <path d="M 299,88 L 325,78 L 345,82 L 352,136 L 304,146 L 302,98 Z" fill="url(#gHD)"/>
            <rect x="156" y="94" width="148" height="162" rx="2" fill="url(#gHD)"/>
            <path d="M 185,88 Q 230,70 275,88 Q 254,74 230,72 Q 206,74 185,88 Z" fill="#1a1a2e"/>
          </g>

          {/* ══ T-SHIRT — centre hero ══ */}
          <g filter="url(#fSh)">
            <path
              d="M 182,90 L 152,84 L 122,76 L 116,134 L 162,142 L 162,270 L 318,270 L 318,142 L 364,134 L 358,76 L 328,84 L 298,90 Q 286,124 230,127 Q 174,124 182,90 Z"
              fill="url(#gTS)"
            />
            <path
              d="M 182,90 L 152,84 L 122,76 L 116,134 L 162,142 L 162,270 L 318,270 L 318,142 L 364,134 L 358,76 L 328,84 L 298,90 Q 286,124 230,127 Q 174,124 182,90 Z"
              fill="url(#gTSSh)"
            />
            {/* Collar shadow */}
            <path d="M 182,90 Q 200,112 230,117 Q 260,112 298,90 Q 264,102 230,105 Q 196,102 182,90 Z" fill="rgba(0,0,0,0.09)"/>
            {/* Seam lines */}
            <line x1="162" y1="142" x2="162" y2="270" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
            <line x1="318" y1="142" x2="318" y2="270" stroke="rgba(0,0,0,0.06)" strokeWidth="1.5"/>
            {/* Sleeve highlight */}
            <path d="M 122,76 L 152,84 L 162,142 L 116,134 Z" fill="rgba(255,255,255,0.08)"/>
          </g>
          {/* Print area + logo */}
          <rect x="196" y="152" width="68" height="68" rx="4" fill="none"
            stroke="rgba(220,38,38,0.28)" strokeWidth="1.2" strokeDasharray="4,3"/>
          <circle cx="230" cy="184" r="26" fill="#DC2626" filter="url(#fGR)"/>
          <circle cx="230" cy="184" r="22" fill="#DC2626"/>
          <circle cx="230" cy="184" r="17" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
          <text x="230" y="189" textAnchor="middle" fill="white" fontSize="13"
            fontWeight="800" fontFamily="system-ui,sans-serif" letterSpacing="0.5">RD</text>

          {/* ══ MUG — right ══ */}
          <g transform="translate(348,90)" filter="url(#fSh)">
            <ellipse cx="40" cy="4" rx="40" ry="11" fill="#e0e0e0"/>
            <ellipse cx="40" cy="8" rx="33" ry="8.5" fill="rgba(180,180,180,0.35)"/>
            <path d="M 0,14 Q 0,0 8,0 L 72,0 Q 80,0 80,14 L 80,100 Q 80,114 72,114 L 8,114 Q 0,114 0,100 Z" fill="url(#gMG)"/>
            <path d="M 80,26 Q 108,26 108,56 Q 108,86 80,86" fill="none" stroke="#c8c8c8" strokeWidth="10" strokeLinecap="round"/>
            <path d="M 80,26 Q 100,26 100,56 Q 100,86 80,86" fill="none" stroke="#f0f0f0" strokeWidth="5.5" strokeLinecap="round"/>
            <rect x="11" y="28" width="58" height="55" rx="3" fill="rgba(235,235,235,0.5)"/>
            <circle cx="40" cy="58" r="20" fill="#DC2626"/>
            <text x="40" y="63" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="system-ui,sans-serif">RD</text>
            <line x1="19" y1="10" x2="19" y2="104" stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* ══ CAP — top right ══ */}
          <g transform="translate(292,6)" filter="url(#fSh)">
            <path d="M 8,57 Q 5,18 68,15 Q 131,18 155,57 L 132,58 Q 120,34 68,32 Q 16,34 8,57 Z" fill="url(#gCP)"/>
            <path d="M 8,57 Q 16,48 68,46 Q 120,48 132,58 Q 120,52 68,50 Q 16,52 8,57 Z" fill="rgba(0,0,0,0.45)"/>
            <path d="M 1,59 L 163,59 Q 163,70 153,70 L 1,70 Q -7,70 -7,64 Q -7,59 1,59 Z" fill="#141414"/>
            <path d="M 8,57 Q 16,52 68,50 Q 120,52 132,57" fill="none" stroke="rgba(196,150,42,0.5)" strokeWidth="2.5"/>
            <circle cx="68" cy="34" r="15" fill="#DC2626" filter="url(#fGR)"/>
            <circle cx="68" cy="34" r="12" fill="#DC2626"/>
            <text x="68" y="38" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="800" fontFamily="system-ui,sans-serif">RD</text>
          </g>

          {/* ══ TOTE BAG — left ══ */}
          <g transform="translate(12,72)" filter="url(#fSh)">
            <path d="M 23,30 Q 16,6 20,-3 Q 27,-14 40,-12 Q 53,-14 60,-3 Q 64,6 58,30" fill="none" stroke="#8a7050" strokeWidth="7.5" strokeLinecap="round"/>
            <path d="M 42,30 Q 35,6 39,-3 Q 46,-14 59,-12 Q 72,-14 79,-3 Q 83,6 77,30" fill="none" stroke="#8a7050" strokeWidth="7.5" strokeLinecap="round"/>
            <path d="M 3,43 L 0,158 Q 0,170 14,170 L 87,170 Q 100,170 100,158 L 97,43 Z" fill="url(#gTB)"/>
            <rect x="3" y="30" width="94" height="17" rx="2" fill="#b09878"/>
            <line x1="50" y1="47" x2="50" y2="170" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" strokeDasharray="5,4"/>
            <rect x="17" y="70" width="66" height="64" rx="4" fill="rgba(255,255,255,0.14)"/>
            <circle cx="50" cy="103" r="22" fill="#DC2626"/>
            <text x="50" y="108" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="system-ui,sans-serif">RD</text>
          </g>

          {/* ══ VISITING CARD — bottom left, angled ══ */}
          <g transform="translate(55,292) rotate(-7,72,41)" filter="url(#fSh)">
            <rect width="148" height="84" rx="7" fill="url(#gVC)"/>
            <rect x="0" y="0" width="52" height="84" rx="7" fill="#DC2626"/>
            <rect x="46" y="0" width="6" height="84" fill="#C81010"/>
            <circle cx="26" cy="34" r="17" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2"/>
            <text x="26" y="39" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="system-ui,sans-serif">RD</text>
            <text x="26" y="56" textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize="5" fontFamily="system-ui,sans-serif" letterSpacing="1">RADHE</text>
            <rect x="64" y="18" width="74" height="5.5" rx="2.5" fill="#1a1a1a"/>
            <rect x="64" y="28" width="54" height="4" rx="2" fill="#888"/>
            <line x1="64" y1="43" x2="136" y2="43" stroke="#ddd" strokeWidth="0.8"/>
            <rect x="64" y="50" width="66" height="3.5" rx="1.5" fill="#aaa"/>
            <rect x="64" y="58" width="50" height="3.5" rx="1.5" fill="#ccc"/>
            <rect x="64" y="66" width="56" height="3.5" rx="1.5" fill="#ccc"/>
          </g>

          {/* ══ PHOTO FRAME — bottom right, angled ══ */}
          <g transform="translate(313,282) rotate(7,60,48)" filter="url(#fSh)">
            <rect width="122" height="98" rx="5" fill="url(#gPF)"/>
            <rect x="9" y="8" width="104" height="72" rx="3" fill="#1e0e06"/>
            <rect x="13" y="11" width="96" height="66" rx="2" fill="#f5f1ec"/>
            <rect x="13" y="11" width="96" height="66" rx="2" fill="url(#gPhP)"/>
            <circle cx="61" cy="44" r="19" fill="#DC2626"/>
            <text x="61" y="49" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="system-ui,sans-serif">RD</text>
            <rect x="18" y="20" width="40" height="16" rx="2" fill="rgba(196,150,42,0.1)"/>
            <rect x="64" y="20" width="40" height="16" rx="2" fill="rgba(196,150,42,0.1)"/>
            <rect x="18" y="58" width="86" height="14" rx="2" fill="rgba(0,0,0,0.05)"/>
            <rect x="30" y="83" width="62" height="9" rx="2.5" fill="rgba(255,255,255,0.06)"/>
            <text x="61" y="91" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="6" fontFamily="system-ui,sans-serif" letterSpacing="1.5">PHOTO PRINT</text>
          </g>

          {/* ══ PEN — accent, diagonal ══ */}
          <g transform="translate(446,142) rotate(30)" filter="url(#fGG)">
            <rect x="10" y="2" width="3.5" height="92" rx="1.5" fill="rgba(196,150,42,0.88)"/>
            <rect x="0" y="0" width="14" height="118" rx="7" fill="url(#gPN)"/>
            <rect x="0" y="97" width="14" height="7" rx="1" fill="rgba(196,150,42,0.45)"/>
            <rect x="2" y="118" width="10" height="14" rx="2" fill="url(#gPNT)"/>
            <path d="M 3,132 L 7,145 L 11,132 Z" fill="#555"/>
            <text x="7" y="64" textAnchor="middle" fill="rgba(196,150,42,0.75)" fontSize="5.5" fontWeight="700" fontFamily="system-ui,sans-serif">RD</text>
          </g>

          {/* Floor shadows */}
          <ellipse cx="230" cy="278" rx="108" ry="9" fill="rgba(0,0,0,0.22)"/>
          <ellipse cx="395" cy="208" rx="44" ry="7" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="60" cy="246" rx="50" ry="6.5" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="387" cy="95" rx="36" ry="6" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="386" cy="377" rx="36" ry="5" fill="rgba(0,0,0,0.18)"/>
          <ellipse cx="90" cy="378" rx="42" ry="5" fill="rgba(0,0,0,0.18)"/>

          {/* Tagline strip */}
          <rect x="95" y="306" width="270" height="30" rx="15"
            fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.065)" strokeWidth="0.8"/>
          <text x="230" y="325" textAnchor="middle" fill="rgba(255,255,255,0.38)"
            fontSize="9" fontFamily="system-ui,sans-serif" letterSpacing="2.8" fontWeight="600">
            PRINT YOUR BRAND ON ANYTHING
          </text>
        </svg>

        {/* Product label strip */}
        <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"8px", paddingBottom:"2px", paddingLeft:"2px", paddingRight:"2px" }}>
          {["T-Shirt","Hoodie","Mug","Cap","Tote Bag","Card","Frame","Pen"].map(lbl => (
            <span key={lbl} style={{ fontSize:"8px", fontWeight:700, color:"rgba(255,255,255,0.22)",
              letterSpacing:"0.7px", textTransform:"uppercase" }}>
              {lbl}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

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

/* ─── GalleryScrollRow ─── */
function GalleryScrollRow({
  images,
  direction,
  durationSec,
  onOpen,
}: {
  images: GalleryImage[];
  direction: "left" | "right";
  durationSec: number;
  onOpen: (img: GalleryImage) => void;
}) {
  // Duplicate for seamless loop: track = [img×N, img×N]
  const track = [...images, ...images];

  return (
    <div
      className="gallery-row-wrap relative overflow-hidden py-2"
      style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)" }}
    >
      <div
        className={direction === "left" ? "gallery-track-left" : "gallery-track-right"}
        style={{
          display: "flex",
          gap: "16px",
          width: "max-content",
          animationDuration: `${durationSec}s`,
        }}
      >
        {track.map((img, i) => {
          const origIdx = images.findIndex(x => x.id === img.id);
          return (
            <div
              key={`${img.id}-${i}`}
              className="group relative flex-shrink-0 overflow-hidden cursor-pointer"
              style={{
                width: "clamp(200px, 22vw, 300px)",
                height: "clamp(150px, 16vw, 220px)",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
              onClick={() => onOpen(img)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(img); } }}
              role="button"
              tabIndex={origIdx === -1 ? -1 : 0}
              aria-label={img.caption ? `View: ${img.caption}` : "View gallery image"}
            >
              {/* Image */}
              <img
                src={img.imageUrl}
                alt={img.caption || "Gallery"}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Gradient base overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(196,150,42,0.45) 0%, rgba(180,20,20,0.4) 100%)" }}
              />

              {/* Shine sweep on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden"
                style={{ borderRadius: "20px" }}
              >
                <div
                  className="absolute top-0 bottom-0 w-20 -skew-x-12 group-hover:animate-[shine-sweep_0.7s_ease_forwards]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)", left: "-80px" }}
                />
              </div>

              {/* Zoom icon + caption on hover */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.25)" }}
                >
                  <ZoomIn size={16} className="text-white"/>
                </div>
              </div>

              {/* Caption bottom */}
              {img.caption && (
                <p className="absolute bottom-2 left-3 right-3 text-white/90 text-[11px] font-semibold leading-tight line-clamp-1 drop-shadow-md">
                  {img.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── GallerySkeletonRow ─── */
function GallerySkeletonRow() {
  return (
    <div className="relative overflow-hidden py-2" style={{ maskImage: "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)" }}>
      <div className="flex gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 rounded-[20px] animate-pulse"
            style={{
              width: "clamp(200px, 22vw, 300px)",
              height: "clamp(150px, 16vw, 220px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── GallerySection ─── */
function GallerySection() {
  const { images, loading } = useGallery();
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  // Build 3 row arrays — each starts from a different offset for visual variety
  const buildRow = (offset: number) => {
    if (images.length === 0) return [];
    const n = images.length;
    const rotated = [...images.slice(offset % n), ...images.slice(0, offset % n)];
    // Ensure minimum of 6 items per row for smooth scroll (repeat if needed)
    if (rotated.length < 6) {
      const times = Math.ceil(6 / rotated.length);
      return Array.from({ length: times }, () => rotated).flat().slice(0, 6);
    }
    return rotated;
  };

  const rows: Array<{ direction: "left" | "right"; duration: number; offset: number }> = [
    { direction: "left",  duration: 28, offset: 0 },
    { direction: "right", duration: 40, offset: 3 },
    { direction: "left",  duration: 34, offset: 6 },
  ];

  const lightboxImages = images;
  const lightboxIdx = lightboxImg ? lightboxImages.findIndex(x => x.id === lightboxImg.id) : -1;

  return (
    <section
      className="py-16 sm:py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #080808 0%, #0f0a00 40%, #0a0000 70%, #0a0a0a 100%)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, #C4962A 0%, transparent 70%)", filter: "blur(80px)" }}/>
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #DC2626 0%, transparent 70%)", filter: "blur(80px)" }}/>
      </div>

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,150,42,0.3) 30%, rgba(196,150,42,0.5) 50%, rgba(196,150,42,0.3) 70%, transparent)" }}/>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center"
        >
          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {[
              { icon: Award,       label: "500+ Projects Delivered" },
              { icon: Users,       label: "1000+ Happy Customers"   },
              { icon: CheckCircle, label: "High Quality Printing"   },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full"
                style={{
                  color: "#C4962A",
                  border: "1px solid rgba(196,150,42,0.28)",
                  background: "rgba(196,150,42,0.08)",
                  letterSpacing: "0.14em",
                }}
              >
                <Icon size={11}/> {label}
              </span>
            ))}
          </div>

          <h2
            className="text-3xl sm:text-[2.8rem] font-extrabold text-white mb-3"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.12 }}
          >
            Our Recent Work
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-[3px] w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, rgba(196,150,42,0.4), #C4962A, rgba(196,150,42,0.4))" }}/>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Premium custom printing — every order crafted with precision.
          </p>
        </motion.div>
      </div>

      {/* Scroll rows */}
      <div className="space-y-4 mb-12">
        {loading ? (
          <>
            <GallerySkeletonRow />
            <GallerySkeletonRow />
            <GallerySkeletonRow />
          </>
        ) : images.length === 0 ? (
          /* Empty state */
          <div className="max-w-lg mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 rounded-2xl text-center"
              style={{ border: "1px dashed rgba(196,150,42,0.2)", background: "rgba(196,150,42,0.03)" }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "rgba(196,150,42,0.1)", border: "1px solid rgba(196,150,42,0.2)" }}
              >
                <Image size={28} style={{ color: "#C4962A" }}/>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Gallery Coming Soon</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Our portfolio will appear here once images are added from the Admin Panel.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {rows.map((row, ri) => (
              <GalleryScrollRow
                key={ri}
                images={buildRow(row.offset)}
                direction={row.direction}
                durationSec={row.duration}
                onOpen={img => setLightboxImg(img)}
              />
            ))}
          </>
        )}
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative max-w-xl mx-auto px-4 text-center"
      >
        <p className="text-gray-500 text-xs mb-4 tracking-wide uppercase font-semibold">
          Loved by 10,000+ customers across India
        </p>
        <Link href="/customize">
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-sm text-white btn-shine"
            style={{
              background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
              boxShadow: "0 8px 28px rgba(220,38,38,0.45)",
            }}
          >
            <Sparkles size={16}/> Start Your Order <ArrowRight size={16}/>
          </motion.button>
        </Link>
      </motion.div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(196,150,42,0.2) 30%, rgba(196,150,42,0.35) 50%, rgba(196,150,42,0.2) 70%, transparent)" }}/>

      {/* Lightbox */}
      {lightboxIdx >= 0 && lightboxImg && (
        <GalleryLightbox
          images={lightboxImages}
          index={lightboxIdx}
          onClose={() => setLightboxImg(null)}
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
        className="relative sm:min-h-[88vh] flex items-center"
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

            {/* ── Right: Product Showcase ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex-shrink-0 flex items-center justify-center order-1 lg:order-2"
              style={{ width: "clamp(300px, 42vw, 480px)" }}
            >
              <HeroPremiumShowcase />
            </motion.div>

          </div>
        </div>

        {/* Bottom fade into trust bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,5,5,0.6))",
        }}/>
      </section>

      {/* ── GALLERY — directly below hero ── */}
      <GallerySection />

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
