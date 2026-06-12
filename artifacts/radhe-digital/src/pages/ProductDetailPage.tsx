import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, ShoppingCart, Palette, ShoppingBag,
  Truck, Shield, Star, ArrowRight, Package, CheckCircle, Loader2
} from "lucide-react";
import { CATEGORY_MAP } from "@/data/products";
import { CATEGORY_DETAILS, type GalleryView } from "@/data/productDetails";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ProductOptionsModal } from "@/components/ProductOptionsModal";
import {
  useApiProducts, useApiProductsLoaded, getViewImages,
  type ApiProductData, type ApiProductImage
} from "@/hooks/useApiProducts";

/* ─── Gallery SVGs ─── */
function GallerySVG({
  slug, angle, color = "#e53e3e", active = false
}: {
  slug: string; angle: GalleryView["angle"]; color?: string; active?: boolean;
}) {
  const isLight = ["#ffffff", "#f5f5f5", "#FFFFFF"].includes(color);
  const textCol = isLight ? "#222" : "#fff";
  const bg = active ? "#1a1a1a" : "#141414";

  const label: Record<GalleryView["angle"], string> = {
    front: "FRONT", back: "BACK", left: "LEFT SIDE",
    right: "RIGHT SIDE", top: "TOP VIEW", detail: "CLOSE-UP",
    handle: "HANDLE", open: "OPEN VIEW"
  };

  const views: Partial<Record<string, Record<GalleryView["angle"], JSX.Element>>> = {
    "t-shirts": {
      front: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.92"/><rect x="82" y="98" width="36" height="28" rx="5" fill="white" opacity="0.1"/><text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">FRONT PRINT</text></>),
      back: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.92"/><rect x="72" y="88" width="56" height="44" rx="5" fill="white" opacity="0.1"/><text x="100" y="113" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">BACK PRINT AREA</text><path d="M94 62 Q100 59 106 62" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/></>),
      left: (<><path d="M90 55 L72 88 L86 94 L86 158 L114 158 L114 94 L128 88 L110 55 C106 57 96 57 90 55 Z" fill={color} opacity="0.9"/><text x="100" y="125" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">SIDE</text></>),
      right: (<><path d="M110 55 L128 88 L114 94 L114 158 L86 158 L86 94 L72 88 L90 55 C94 57 106 57 110 55 Z" fill={color} opacity="0.9"/><text x="100" y="125" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">SIDE</text></>),
      detail: (<><defs><pattern id="fabric" patternUnits="userSpaceOnUse" width="6" height="6"><line x1="0" y1="0" x2="6" y2="6" stroke={color} strokeWidth="0.4" opacity="0.6"/><line x1="6" y1="0" x2="0" y2="6" stroke={color} strokeWidth="0.4" opacity="0.3"/></pattern></defs><rect x="30" y="30" width="140" height="140" rx="8" fill="url(#fabric)"/><rect x="30" y="30" width="140" height="140" rx="8" fill={color} opacity="0.3"/><text x="100" y="98" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">FABRIC</text><text x="100" y="112" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.4">TEXTURE</text></>),
      top: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
      handle: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
      open: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
    },
    "mugs": {
      front: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/><rect x="64" y="97" width="52" height="18" rx="4" fill="white" opacity="0.15"/><text x="90" y="110" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">YOUR DESIGN</text></>),
      back: (<><rect x="60" y="62" width="88" height="100" rx="12" fill={color} opacity="0.85"/><path d="M60 85 Q34 85 34 108 Q34 131 60 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.6"/><rect x="72" y="115" width="40" height="12" rx="3" fill="white" opacity="0.12"/><text x="92" y="124" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">BACK SIDE</text></>),
      left: (<><ellipse cx="100" cy="112" rx="44" ry="50" fill={color} opacity="0.85"/><ellipse cx="100" cy="68" rx="44" ry="10" fill={color} opacity="0.5"/><ellipse cx="100" cy="68" rx="38" ry="7" fill="#1a1a1a" opacity="0.6"/><text x="100" y="116" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">SIDE</text></>),
      handle: (<><rect x="55" y="62" width="85" height="100" rx="12" fill={color} opacity="0.85"/><path d="M140 80 Q175 80 175 112 Q175 144 140 144" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9"/><path d="M140 80 Q175 80 175 112 Q175 144 140 144" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"/><text x="88" y="116" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">HANDLE SIDE</text></>),
      top: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/></>),
      detail: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/></>),
      right: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/></>),
      open: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/></>),
    },
    "caps": {
      front: (<><ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/><path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.9"/><path d="M42 120 Q26 119 24 112 Q22 104 42 118" fill={color} opacity="0.75"/><rect x="80" y="84" width="40" height="24" rx="5" fill="white" opacity="0.12"/><text x="100" y="99" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">LOGO</text><rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/></>),
      back: (<><ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/><path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.85"/><rect x="82" y="105" width="36" height="14" rx="4" fill="#222" opacity="0.7"/><text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">STRAP</text><rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/></>),
      left: (<><path d="M55 120 Q55 75 100 70 Q145 75 145 120 Z" fill={color} opacity="0.9"/><path d="M55 120 Q42 119 40 113" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/><ellipse cx="100" cy="128" rx="50" ry="8" fill="#222"/></>),
      top: (<><ellipse cx="100" cy="100" rx="65" ry="50" fill={color} opacity="0.85"/><ellipse cx="100" cy="100" rx="45" ry="30" fill={color} opacity="0.3"/><circle cx="100" cy="100" r="8" fill="white" opacity="0.2"/><text x="100" y="105" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">TOP</text></>),
      detail: (<><ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/><path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.9"/><rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/></>),
      right: (<><path d="M55 120 Q55 75 100 70 Q145 75 145 120 Z" fill={color} opacity="0.9"/><ellipse cx="100" cy="128" rx="50" ry="8" fill="#222"/></>),
      handle: (<></>),
      open: (<></>),
    },
    "pens": {
      front: (<><rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/><rect x="92" y="27" width="7" height="131" rx="3.5" fill="white" opacity="0.08"/><polygon points="90,160 110,160 100,182" fill="#aaa"/><polygon points="97,172 103,172 100,182" fill="#777"/><rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/><rect x="91" y="75" width="18" height="2" rx="1" fill="white" opacity="0.3"/><rect x="91" y="85" width="18" height="2" rx="1" fill="white" opacity="0.3"/><rect x="91" y="95" width="18" height="2" rx="1" fill="white" opacity="0.3"/></>),
      top: (<><circle cx="100" cy="100" r="55" fill={color} opacity="0.85"/><circle cx="100" cy="100" r="38" fill={color} opacity="0.4"/><circle cx="100" cy="100" r="10" fill="white" opacity="0.2"/><text x="100" y="105" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">TIP</text></>),
      left: (<><rect x="88" y="25" width="24" height="135" rx="12" fill={color} opacity="0.9"/><rect x="108" y="28" width="6" height="129" rx="3" fill="white" opacity="0.06"/><rect x="88" y="75" width="24" height="25" rx="4" fill="white" opacity="0.12"/><text x="100" y="91" textAnchor="middle" fill={textCol} fontSize="6" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">ENGRAVED</text><polygon points="88,160 112,160 100,182" fill="#aaa"/><rect x="88" y="22" width="24" height="14" rx="7" fill="#555"/></>),
      open: (<><rect x="56" y="120" width="88" height="60" rx="10" fill="#222" opacity="0.9"/><rect x="56" y="80" width="88" height="44" rx="10 10 0 0" fill={color} opacity="0.7"/><rect x="64" y="125" width="72" height="8" rx="4" fill={color} opacity="0.5"/><rect x="85" y="135" width="18" height="35" rx="9" fill={color} opacity="0.9"/><polygon points="85,170 103,170 94,182" fill="#aaa"/><text x="100" y="100" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">GIFT BOX</text></>),
      detail: (<><rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/><polygon points="90,160 110,160 100,182" fill="#aaa"/><rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/></>),
      back: (<><rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/><polygon points="90,160 110,160 100,182" fill="#aaa"/><rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/></>),
      right: (<><rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/><polygon points="90,160 110,160 100,182" fill="#aaa"/><rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/></>),
      handle: (<></>),
    },
    "badges": {
      front: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/><circle cx="100" cy="105" r="50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15"/><text x="100" y="98" textAnchor="middle" fill={textCol} fontSize="10" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">RADHE</text><text x="100" y="112" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">DIGITAL</text><circle cx="100" cy="57" r="6" fill="#444"/></>),
      back: (<><circle cx="100" cy="105" r="60" fill="#2a2a2a" opacity="0.95"/><circle cx="100" cy="105" r="50" fill="none" stroke="white" strokeWidth="1" opacity="0.1"/><rect x="82" y="88" width="36" height="6" rx="3" fill="#555"/><rect x="86" y="100" width="28" height="6" rx="3" fill="#444"/><text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">SAFETY PIN</text></>),
      detail: (<><circle cx="100" cy="100" r="65" fill={color} opacity="0.85"/><circle cx="100" cy="100" r="52" fill="none" stroke="white" strokeWidth="2" opacity="0.2"/><circle cx="100" cy="100" r="30" fill="white" opacity="0.08"/><text x="100" y="95" textAnchor="middle" fill={textCol} fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">YOUR</text><text x="100" y="111" textAnchor="middle" fill={textCol} fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">LOGO</text></>),
      open: (<><rect x="50" y="75" width="100" height="70" rx="10" fill="#1e293b" opacity="0.9"/><circle cx="100" cy="110" r="28" fill={color} opacity="0.9"/><text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">BADGE</text><rect x="80" y="145" width="40" height="4" rx="2" fill={color} opacity="0.4"/><text x="100" y="68" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">PINNED ON SHIRT</text></>),
      top: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      left: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      right: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      handle: (<></>),
    },
    "photo-frames": {
      front: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/><path d="M52 110 L78 80 L106 100 L126 74 L148 110 Z" fill={color} opacity="0.45"/><circle cx="76" cy="76" r="11" fill={color} opacity="0.4"/><text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="sans-serif">YOUR PHOTO</text></>),
      left: (<><rect x="70" y="40" width="18" height="120" rx="4" fill={color} opacity="0.85"/><rect x="88" y="52" width="70" height="96" rx="3" fill="#1a1a1a"/><path d="M88 110 L108 82 L128 100 L148 80 L158 110 Z" fill={color} opacity="0.4"/></>),
      back: (<><rect x="40" y="40" width="120" height="120" rx="8" fill="#2a2a2a" opacity="0.95"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#222"/><rect x="60" y="140" width="40" height="8" rx="4" fill="#333"/><rect x="85" y="52" width="30" height="50" rx="4" fill="#2e2e2e"/><text x="100" y="115" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="sans-serif">EASEL STAND</text></>),
      open: (<><rect x="52" y="55" width="96" height="90" rx="6" fill={color} opacity="0.7"/><rect x="62" y="65" width="76" height="70" rx="4" fill="#1a1a1a"/><path d="M62 108 L82 85 L100 100 L118 78 L138 108 Z" fill={color} opacity="0.4"/><rect x="62" y="145" width="76" height="4" rx="2" fill={color} opacity="0.3"/></>),
      top: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      detail: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      right: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      handle: (<></>),
    },
    "corporate-gifts": {
      open: (<><rect x="44" y="95" width="112" height="76" rx="8" fill={color} opacity="0.88"/><rect x="38" y="74" width="124" height="28" rx="6" fill={color}/><rect x="38" y="74" width="124" height="28" rx="6" fill="white" opacity="0.06"/><rect x="94" y="74" width="12" height="97" fill="white" opacity="0.15"/><path d="M100 74 Q80 57 72 47 Q64 37 74 35 Q84 33 100 74" fill={color} opacity="0.75"/><path d="M100 74 Q120 57 128 47 Q136 37 126 35 Q116 33 100 74" fill={color} opacity="0.75"/><rect x="52" y="105" width="38" height="30" rx="5" fill="white" opacity="0.08"/><rect x="110" y="105" width="38" height="14" rx="4" fill="white" opacity="0.08"/></>),
      front: (<><rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/><rect x="94" y="74" width="12" height="98" fill="white" opacity="0.12"/><path d="M100 74 Q80 57 72 47 Q64 37 74 35 Q84 33 100 74" fill={color} opacity="0.75"/><path d="M100 74 Q120 57 128 47 Q136 37 126 35 Q116 33 100 74" fill={color} opacity="0.75"/><text x="100" y="128" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">GIFT BOX</text></>),
      detail: (<><rect x="48" y="50" width="46" height="46" rx="6" fill={color} opacity="0.7"/><rect x="106" y="50" width="46" height="46" rx="6" fill="white" opacity="0.1"/><rect x="48" y="104" width="46" height="46" rx="6" fill="white" opacity="0.08"/><rect x="106" y="104" width="46" height="46" rx="6" fill={color} opacity="0.5"/><text x="71" y="77" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.6">MUG</text><text x="129" y="77" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">T-SHIRT</text><text x="71" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">CAP</text><text x="129" y="130" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.6">PEN</text></>),
      left: (<><rect x="70" y="74" width="60" height="98" rx="8" fill={color} opacity="0.85"/><rect x="94" y="74" width="12" height="98" fill="white" opacity="0.1"/></>),
      back: (<><rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/><rect x="94" y="74" width="12" height="98" fill="white" opacity="0.12"/></>),
      top: (<><rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/></>),
      right: (<><rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/></>),
      handle: (<></>),
    },
  };

  const viewGroup = views[slug] ?? views["t-shirts"]!;
  const svgContent = viewGroup?.[angle] ?? viewGroup?.["front"] ?? <rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.8"/>;

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" fill={bg}/>
      {svgContent}
      <text x="100" y="190" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="7" fontFamily="sans-serif" fontWeight="bold" letterSpacing="1">
        {label[angle]}
      </text>
    </svg>
  );
}

/* ─── Colour Dot ─── */
function ColorDot({ hex, border, name, active, onClick }: {
  hex: string; border?: boolean; name: string; active: boolean; onClick: () => void;
}) {
  const isWhite = ["#ffffff", "#f5f5f5", "#FFFFFF"].includes(hex);
  return (
    <button
      onClick={onClick}
      title={name}
      className={`relative w-11 h-11 rounded-full transition-all duration-200 flex-shrink-0 ${
        active
          ? "scale-110 ring-2 ring-[#C4962A] ring-offset-2 ring-offset-white shadow-[0_4px_16px_rgba(196,150,42,0.45)]"
          : "hover:scale-105 hover:shadow-md"
      }`}
      style={{
        backgroundColor: hex,
        border: (border || isWhite) ? "2px solid rgba(0,0,0,0.15)" : "2px solid transparent",
      }}
    >
      {active && (
        <span
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ background: "rgba(0,0,0,0.18)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
          </svg>
        </span>
      )}
    </button>
  );
}

/* ─── Related Product Card ─── */
function RelatedCard({ product, slug, catLabel, index }: {
  product: ApiProductData; slug: string; catLabel: string; index: number;
}) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => setLocation(`/categories/${slug}/${product.id}`)}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
      whileHover={{ y: -4 }}
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(196,150,42,0.18)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)"; }}
    >
      <div className="aspect-square overflow-hidden bg-[#141414] relative">
        <GallerySVG slug={slug} angle="front" />
        {product.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">{product.badge}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-gray-900 font-bold text-sm leading-snug mb-1">{product.name}</p>
        <p className="text-primary font-extrabold text-base">{product.priceLabel ?? `₹${product.price}`}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const [, setLocation] = useLocation();
  const categoryConfig = CATEGORY_MAP[slug ?? ""];
  const details = CATEGORY_DETAILS[slug ?? ""];

  const { addItemSilent } = useCart();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState(0);
  const [activeColor, setActiveColor] = useState(-1); // -1 = no color selected
  const [showModal, setShowModal] = useState(false);
  const apiProducts = useApiProducts();
  const loaded = useApiProductsLoaded();

  const product: ApiProductData | undefined = productId ? apiProducts[productId] : undefined;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <Loader2 size={48} className="animate-spin text-primary opacity-60 mb-4" />
        <p className="text-gray-400 text-sm">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900 px-4 text-center">
        <Package size={60} className="text-primary mb-6 opacity-50" />
        <h1 className="text-3xl font-extrabold mb-3">Product Not Found</h1>
        <p className="text-gray-500 mb-8">This product doesn't exist or has been removed.</p>
        <button onClick={() => setLocation(`/categories/${slug}`)} className="px-8 py-3 rounded-xl bg-primary text-white font-bold">
          Back to {categoryConfig?.label ?? "Products"}
        </button>
      </div>
    );
  }

  const categoryLabel = categoryConfig?.label ?? product.category ?? "Products";
  const galleryViews = details?.galleryViews ?? [{ label: "View", angle: "front" as const }];
  const related = Object.values(apiProducts)
    .filter(p => p.categorySlug === slug && p.id !== productId && p.status !== "Inactive")
    .slice(0, 4);

  const apiVariants = (product.variants ?? []).filter((v: any) => v.color?.trim());
  const hasVariants = apiVariants.length > 0;

  // Only resolve a selected variant when the user has explicitly clicked a color dot
  const selectedVariant = (hasVariants && activeColor >= 0)
    ? apiVariants[Math.min(activeColor, apiVariants.length - 1)]
    : null;

  const productLevelImages: ApiProductImage[] = getViewImages(product);

  // Build display gallery:
  //  • No color selected → always show product-level images
  //  • Color selected with images → per-view merge: prefer variant image, fall back to product image
  //  • Color selected with no images → fall back entirely to product-level images
  const realImages: ApiProductImage[] = (() => {
    if (!selectedVariant) return productLevelImages;
    const variantImgs = (selectedVariant.images ?? []).filter((i: ApiProductImage) => i.url);
    if (variantImgs.length === 0) return productLevelImages;
    const variantByView = new Map(variantImgs.map((i: ApiProductImage) => [i.view, i]));
    // Replace each product-level view with the variant version if available
    const merged = productLevelImages.map((img: ApiProductImage) => variantByView.get(img.view) ?? img);
    // Append any variant views that don't exist at the product level
    const productViews = new Set(productLevelImages.map((i: ApiProductImage) => i.view));
    const extras = variantImgs.filter((i: ApiProductImage) => !productViews.has(i.view));
    return [...merged, ...extras];
  })();

  const hasRealImages = realImages.length > 0;
  const activeRealImage = hasRealImages ? realImages[Math.min(activeView, realImages.length - 1)] : null;

  const selectedColorHex = (hasVariants && activeColor >= 0)
    ? (apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.hex ?? "#e53e3e")
    : (!hasVariants && activeColor >= 0)
      ? (details?.colors?.[activeColor]?.hex ?? "#e53e3e")
      : "#e53e3e";

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link href="/categories" className="hover:text-gray-700 transition-colors">Products</Link>
          <ChevronRight size={13} />
          <Link href={`/categories/${slug}`} className="hover:text-gray-700 transition-colors">{categoryLabel}</Link>
          <ChevronRight size={13} />
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT: Gallery ── */}
          <div className="space-y-3">
            <motion.div
              key={`${activeView}-${activeColor}-${hasRealImages}`}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square bg-[#141414] rounded-2xl overflow-hidden border border-gray-200"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
            >
              {activeRealImage
                ? <img src={activeRealImage.url} alt={`${product.name} – ${activeRealImage.label}`} className="w-full h-full object-cover" loading="lazy" />
                : <GallerySVG slug={slug ?? ""} angle={galleryViews[activeView]?.angle ?? "front"} color={selectedColorHex} active />
              }
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white shadow-lg">
                  {product.badge}
                </span>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white font-semibold backdrop-blur-sm">
                {hasRealImages ? (activeRealImage?.label ?? "View") : (galleryViews[activeView]?.label)}
              </div>
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
              {hasRealImages
                ? realImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveView(i)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 ${
                        activeView === i ? "ring-2 shadow-lg" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={activeView === i ? { borderColor: "#C4962A", boxShadow: "0 2px 12px rgba(196,150,42,0.25)" } : {}}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))
                : galleryViews.map((view, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveView(i)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 ${
                        activeView === i ? "ring-2 shadow-lg" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={activeView === i ? { borderColor: "#C4962A", boxShadow: "0 2px 12px rgba(196,150,42,0.25)" } : {}}
                    >
                      <GallerySVG slug={slug ?? ""} angle={view.angle} color={selectedColorHex} />
                    </button>
                  ))
              }
            </div>
          </div>

          {/* ── RIGHT: Overview ── */}
          <div className="space-y-6">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
                  {categoryLabel}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">{product.badge}</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-xs ml-2">4.8 · Verified reviews</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description ?? ""}</p>
            </div>

            <div className="flex items-end gap-3 py-4 border-y border-gray-200">
              <span className="text-primary font-extrabold text-3xl">
                {product.priceLabel ?? `₹${product.price}`}
              </span>
              <span className="text-gray-400 text-sm pb-1">per piece · inclusive of printing</span>
            </div>

            {(hasVariants || details?.colors) && (() => {
              const colorCount = hasVariants ? apiVariants.length : details!.colors.length;
              const selectedColorName = activeColor === -1
                ? null
                : hasVariants
                  ? (apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.color ?? null)
                  : (details!.colors[activeColor]?.name ?? null);
              const selectedHex = activeColor >= 0
                ? (hasVariants
                    ? (apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.hex ?? "#C4962A")
                    : (details!.colors[activeColor]?.hex ?? "#C4962A"))
                : null;
              return (
                <div className="space-y-3 py-1">
                  {/* ── Section heading ── */}
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="block w-1 h-5 rounded-full bg-[#C4962A] flex-shrink-0" />
                      <h3 className="text-sm font-extrabold tracking-wide uppercase text-gray-800">
                        Available Colors
                      </h3>
                      <span className="text-xs font-bold bg-[#C4962A]/10 text-[#C4962A] px-2 py-0.5 rounded-full">
                        {colorCount}
                      </span>
                    </div>
                    <div className="pl-[22px] min-h-[20px]">
                      {selectedColorName ? (
                        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0 border border-gray-200 inline-block"
                            style={{ backgroundColor: selectedHex ?? "#C4962A" }}
                          />
                          {selectedColorName}
                        </p>
                      ) : activeColor === -1 && hasVariants ? (
                        <p className="text-sm text-gray-500">Original product selected</p>
                      ) : (
                        <p className="text-sm text-gray-400">Choose your preferred colour</p>
                      )}
                    </div>
                  </div>

                  {/* ── Colour swatches — wrapping grid ── */}
                  <div className="flex flex-wrap gap-x-3 gap-y-4">

                    {/* "Original Product" option — only when API variants exist */}
                    {hasVariants && (
                      <button
                        onClick={() => { setActiveColor(-1); setActiveView(0); }}
                        title="View original product"
                        className="flex flex-col items-center gap-1.5 flex-shrink-0 focus:outline-none"
                      >
                        <div
                          className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            activeColor === -1
                              ? "border-[#C4962A] ring-2 ring-[#C4962A] ring-offset-2 ring-offset-white scale-110 shadow-[0_4px_16px_rgba(196,150,42,0.4)] bg-[#C4962A]/10"
                              : "border-gray-200 bg-gray-50 hover:scale-105 hover:border-gray-300"
                          }`}
                        >
                          {activeColor === -1 ? (
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                              <path d="M2 7.5L5.5 11L13 4" stroke="#C4962A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                              <rect x="2" y="2" width="5.5" height="5.5" rx="1.2" fill="#9ca3af"/>
                              <rect x="9.5" y="2" width="5.5" height="5.5" rx="1.2" fill="#9ca3af" opacity="0.6"/>
                              <rect x="2" y="9.5" width="5.5" height="5.5" rx="1.2" fill="#9ca3af" opacity="0.6"/>
                              <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1.2" fill="#9ca3af" opacity="0.3"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold text-center leading-tight w-[52px] break-words ${
                          activeColor === -1 ? "text-[#C4962A]" : "text-gray-400"
                        }`}>
                          Original
                        </span>
                      </button>
                    )}

                    {/* Colour dots */}
                    {hasVariants
                      ? apiVariants.map((v: any, i: number) => (
                          <div key={v.id ?? i} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <ColorDot
                              hex={v.hex}
                              border={v.hex === "#ffffff" || v.hex === "#f5f5f5" || v.hex === "#FFFFFF"}
                              name={v.color}
                              active={activeColor === i}
                              onClick={() => { setActiveColor(activeColor === i ? -1 : i); setActiveView(0); }}
                            />
                            <span className={`text-[10px] font-bold text-center leading-tight w-[52px] break-words ${
                              activeColor === i ? "text-[#C4962A]" : "text-gray-500"
                            }`}>
                              {v.color}
                            </span>
                          </div>
                        ))
                      : details!.colors.map((c, i) => (
                          <div key={c.name} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                            <ColorDot
                              hex={c.hex}
                              border={c.border}
                              name={c.name}
                              active={activeColor === i}
                              onClick={() => setActiveColor(i)}
                            />
                            <span className={`text-[10px] font-bold text-center leading-tight w-[52px] break-words ${
                              activeColor === i ? "text-[#C4962A]" : "text-gray-500"
                            }`}>
                              {c.name}
                            </span>
                          </div>
                        ))
                    }
                  </div>
                </div>
              );
            })()}

            {details?.sizes && details.sizes.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {details.sizes.map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-700 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🎨", label: "Printing", value: details?.printingType ?? "Custom Print" },
                { icon: "🧵", label: "Material", value: details?.material ?? "Premium Material" },
                { icon: "🚚", label: "Delivery", value: details?.deliveryTime ?? "3–5 business days" },
                { icon: "✅", label: "Quality", value: "100% Checked & Packed" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                    <p className="text-xs text-gray-700 font-semibold leading-tight mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield size={13} className="text-green-500" /> Secure Order
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={13} className="text-blue-500" /> Pan India Delivery
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={13} className="text-yellow-500" /> Quality Guaranteed
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all text-sm"
                >
                  <ShoppingBag size={17} /> Buy Now
                </motion.button>
                <motion.button
                  onClick={() => {
                    const apiVariantsNow = (product.variants ?? []).filter((v: any) => v.color?.trim());
                    const hasVar = apiVariantsNow.length > 0;
                    addItemSilent({
                      productId: product.id,
                      productName: product.name,
                      categorySlug: slug ?? "",
                      categoryLabel,
                      price: product.price,
                      priceLabel: product.priceLabel ?? `₹${product.price}`,
                      isCustomized: false,
                      quantity: 1,
                      customization: (hasVar && activeColor >= 0)
                        ? {
                            color: apiVariantsNow[Math.min(activeColor, apiVariantsNow.length - 1)]?.color,
                            colorHex: apiVariantsNow[Math.min(activeColor, apiVariantsNow.length - 1)]?.hex,
                          }
                        : undefined,
                    });
                    toast({
                      title: "Added to cart ✓",
                      description: `${product.name} — tap the cart icon to review your order.`,
                    });
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-gray-700 border border-gray-200 hover:border-[#C4962A] hover:text-[#C4962A] transition-all text-sm"
                >
                  <ShoppingCart size={17} /> Add to Cart
                </motion.button>
              </div>
              <motion.button
                onClick={() => setLocation(`/customize/${slug}`)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.3)" }}
              >
                <Palette size={17} /> Customize Now — Design Your Own
                <ArrowRight size={15} />
              </motion.button>
            </div>

            <p className="text-xs text-gray-400 text-center">No payment required upfront · Confirm your order via WhatsApp</p>
          </div>
        </div>
      </div>

      {showModal && (() => {
        // The exact image currently shown on the product page (respects active view +
        // selected variant). Falls back through product images to guarantee a URL.
        const originalImgUrl =
          activeRealImage?.url
          ?? productLevelImages[Math.min(activeView, Math.max(0, productLevelImages.length - 1))]?.url
          ?? productLevelImages[0]?.url;

        // One representative image URL per variant — prefer the angle currently active on
        // the page, fall back to the first image the variant has, then to the product image.
        const currentAngle = galleryViews[activeView]?.angle;
        const varImgUrls: (string | undefined)[] = apiVariants.map((v: any) => {
          const imgs = (v.images ?? []).filter((i: ApiProductImage) => i.url);
          if (imgs.length === 0) return originalImgUrl;
          const angleMatch = imgs.find((i: ApiProductImage) => i.view === currentAngle);
          return ((angleMatch ?? imgs[0]).url as string) ?? originalImgUrl;
        });

        return (
          <ProductOptionsModal
            product={product}
            categorySlug={slug ?? ""}
            categoryLabel={categoryLabel}
            variants={apiVariants.map((v: any) => ({
              id: v.id,
              color: v.color,
              hex: v.hex,
              border: v.hex === "#ffffff" || v.hex === "#f5f5f5" || v.hex === "#FFFFFF",
            }))}
            initialColorIndex={activeColor}
            originalImageUrl={originalImgUrl}
            variantImageUrls={varImgUrls}
            onClose={() => setShowModal(false)}
          />
        );
      })()}

      {/* Specifications */}
      {details?.specs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded-full" style={{ background: "#C4962A" }} />
            Product Specifications
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            {details.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 gap-2 px-4 py-3 ${i !== details.specs.length - 1 ? "border-b border-gray-100" : ""} ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <span className="text-gray-500 text-sm font-semibold">{spec.label}</span>
                <span className="text-gray-800 text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t py-14" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 100%)", borderColor: "rgba(196,150,42,0.15)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                <span className="w-1 h-6 rounded-full" style={{ background: "#C4962A" }} />
                More {categoryLabel}
              </h2>
              <Link href={`/categories/${slug}`}>
                <button className="flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: "#C4962A" }}>
                  View All <ArrowRight size={14} />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  slug={slug ?? ""}
                  catLabel={categoryLabel}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
