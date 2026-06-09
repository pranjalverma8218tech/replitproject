import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, ShoppingCart, Palette, ShoppingBag,
  CheckCircle, Truck, Shield, Star, ArrowRight, Package
} from "lucide-react";
import { CATEGORY_MAP, CATEGORIES, type Product, type Category } from "@/data/products";
import { CATEGORY_DETAILS, type GalleryView } from "@/data/productDetails";
import { useCart } from "@/context/CartContext";

/* ─── Gallery SVGs (angle-specific per category) ─── */
function GallerySVG({
  slug, angle, color = "#e53e3e", active = false
}: {
  slug: string; angle: GalleryView["angle"]; color?: string; active?: boolean;
}) {
  const isLight = ["#ffffff", "#f5f5f5", "#ffffff"].includes(color);
  const textCol = isLight ? "#222" : "#fff";
  const borderCol = "rgba(255,255,255,0.08)";
  const bg = active ? "#1a1a1a" : "#141414";

  const label: Record<GalleryView["angle"], string> = {
    front: "FRONT", back: "BACK", left: "LEFT SIDE",
    right: "RIGHT SIDE", top: "TOP VIEW", detail: "CLOSE-UP",
    handle: "HANDLE", open: "OPEN VIEW"
  };

  const views: Partial<Record<string, Record<GalleryView["angle"], JSX.Element>>> = {
    "t-shirts": {
      front: (
        <>
          <path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.92"/>
          <rect x="82" y="98" width="36" height="28" rx="5" fill="white" opacity="0.1"/>
          <text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">FRONT PRINT</text>
        </>
      ),
      back: (
        <>
          <path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.92"/>
          <rect x="72" y="88" width="56" height="44" rx="5" fill="white" opacity="0.1"/>
          <text x="100" y="113" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">BACK PRINT AREA</text>
          <path d="M94 62 Q100 59 106 62" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      ),
      left: (
        <>
          <path d="M90 55 L72 88 L86 94 L86 158 L114 158 L114 94 L128 88 L110 55 C106 57 96 57 90 55 Z" fill={color} opacity="0.9"/>
          <text x="100" y="125" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">SIDE</text>
        </>
      ),
      right: (
        <>
          <path d="M110 55 L128 88 L114 94 L114 158 L86 158 L86 94 L72 88 L90 55 C94 57 106 57 110 55 Z" fill={color} opacity="0.9"/>
          <text x="100" y="125" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">SIDE</text>
        </>
      ),
      detail: (
        <>
          <defs>
            <pattern id="fabric" patternUnits="userSpaceOnUse" width="6" height="6">
              <line x1="0" y1="0" x2="6" y2="6" stroke={color} strokeWidth="0.4" opacity="0.6"/>
              <line x1="6" y1="0" x2="0" y2="6" stroke={color} strokeWidth="0.4" opacity="0.3"/>
            </pattern>
          </defs>
          <rect x="30" y="30" width="140" height="140" rx="8" fill="url(#fabric)"/>
          <rect x="30" y="30" width="140" height="140" rx="8" fill={color} opacity="0.3"/>
          <text x="100" y="98" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">FABRIC</text>
          <text x="100" y="112" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.4">TEXTURE</text>
        </>
      ),
      top: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
      handle: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
      open: (<><path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z" fill={color} opacity="0.88"/></>),
    },
    "mugs": {
      front: (
        <>
          <rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/>
          <path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
          <path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round"/>
          <rect x="64" y="97" width="52" height="18" rx="4" fill="white" opacity="0.15"/>
          <text x="90" y="110" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">YOUR DESIGN</text>
        </>
      ),
      back: (
        <>
          <rect x="60" y="62" width="88" height="100" rx="12" fill={color} opacity="0.85"/>
          <path d="M60 85 Q34 85 34 108 Q34 131 60 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.6"/>
          <rect x="72" y="115" width="40" height="12" rx="3" fill="white" opacity="0.12"/>
          <text x="92" y="124" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">BACK SIDE</text>
        </>
      ),
      left: (
        <>
          <ellipse cx="100" cy="112" rx="44" ry="50" fill={color} opacity="0.85"/>
          <ellipse cx="100" cy="68" rx="44" ry="10" fill={color} opacity="0.5"/>
          <ellipse cx="100" cy="68" rx="38" ry="7" fill="#1a1a1a" opacity="0.6"/>
          <text x="100" y="116" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">SIDE</text>
        </>
      ),
      handle: (
        <>
          <rect x="55" y="62" width="85" height="100" rx="12" fill={color} opacity="0.85"/>
          <path d="M140 80 Q175 80 175 112 Q175 144 140 144" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.9"/>
          <path d="M140 80 Q175 80 175 112 Q175 144 140 144" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round"/>
          <text x="88" y="116" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">HANDLE SIDE</text>
        </>
      ),
      top: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/></>),
      detail: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/><path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/></>),
      right: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/></>),
      open: (<><rect x="52" y="62" width="88" height="100" rx="12" fill={color} opacity="0.9"/></>),
    },
    "caps": {
      front: (
        <>
          <ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/>
          <path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.9"/>
          <path d="M42 120 Q26 119 24 112 Q22 104 42 118" fill={color} opacity="0.75"/>
          <rect x="80" y="84" width="40" height="24" rx="5" fill="white" opacity="0.12"/>
          <text x="100" y="99" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">LOGO</text>
          <rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/>
        </>
      ),
      back: (
        <>
          <ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/>
          <path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.85"/>
          <rect x="82" y="105" width="36" height="14" rx="4" fill="#222" opacity="0.7"/>
          <text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">STRAP</text>
          <rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/>
        </>
      ),
      left: (
        <>
          <path d="M55 120 Q55 75 100 70 Q145 75 145 120 Z" fill={color} opacity="0.9"/>
          <path d="M55 120 Q42 119 40 113" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"/>
          <ellipse cx="100" cy="128" rx="50" ry="8" fill="#222"/>
        </>
      ),
      top: (
        <>
          <ellipse cx="100" cy="100" rx="65" ry="50" fill={color} opacity="0.85"/>
          <ellipse cx="100" cy="100" rx="45" ry="30" fill={color} opacity="0.3"/>
          <circle cx="100" cy="100" r="8" fill="white" opacity="0.2"/>
          <text x="100" y="105" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">TOP</text>
        </>
      ),
      back_right: (<></>),
      detail: (<>
        <ellipse cx="100" cy="130" rx="68" ry="10" fill="#222"/>
        <path d="M42 120 Q42 70 100 66 Q158 70 158 120 Z" fill={color} opacity="0.9"/>
        <rect x="42" y="118" width="116" height="5" rx="2.5" fill="#333"/>
      </>),
      right: (<>
        <path d="M55 120 Q55 75 100 70 Q145 75 145 120 Z" fill={color} opacity="0.9"/>
        <ellipse cx="100" cy="128" rx="50" ry="8" fill="#222"/>
      </>),
      handle: (<></>),
      open: (<></>),
    },
    "pens": {
      front: (
        <>
          <rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/>
          <rect x="92" y="27" width="7" height="131" rx="3.5" fill="white" opacity="0.08"/>
          <polygon points="90,160 110,160 100,182" fill="#aaa"/>
          <polygon points="97,172 103,172 100,182" fill="#777"/>
          <rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/>
          <rect x="91" y="75" width="18" height="2" rx="1" fill="white" opacity="0.3"/>
          <rect x="91" y="85" width="18" height="2" rx="1" fill="white" opacity="0.3"/>
          <rect x="91" y="95" width="18" height="2" rx="1" fill="white" opacity="0.3"/>
        </>
      ),
      top: (
        <>
          <circle cx="100" cy="100" r="55" fill={color} opacity="0.85"/>
          <circle cx="100" cy="100" r="38" fill={color} opacity="0.4"/>
          <circle cx="100" cy="100" r="10" fill="white" opacity="0.2"/>
          <text x="100" y="105" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">TIP</text>
        </>
      ),
      left: (
        <>
          <rect x="88" y="25" width="24" height="135" rx="12" fill={color} opacity="0.9"/>
          <rect x="108" y="28" width="6" height="129" rx="3" fill="white" opacity="0.06"/>
          <rect x="88" y="75" width="24" height="25" rx="4" fill="white" opacity="0.12"/>
          <text x="100" y="91" textAnchor="middle" fill={textCol} fontSize="6" fontFamily="sans-serif" fontWeight="bold" opacity="0.6">ENGRAVED</text>
          <polygon points="88,160 112,160 100,182" fill="#aaa"/>
          <rect x="88" y="22" width="24" height="14" rx="7" fill="#555"/>
        </>
      ),
      open: (
        <>
          <rect x="56" y="120" width="88" height="60" rx="10" fill="#222" opacity="0.9"/>
          <rect x="56" y="80" width="88" height="44" rx="10 10 0 0" fill={color} opacity="0.7"/>
          <rect x="64" y="125" width="72" height="8" rx="4" fill={color} opacity="0.5"/>
          <rect x="85" y="135" width="18" height="35" rx="9" fill={color} opacity="0.9"/>
          <polygon points="85,170 103,170 94,182" fill="#aaa"/>
          <text x="100" y="100" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.5">GIFT BOX</text>
        </>
      ),
      detail: (<>
        <rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/>
        <polygon points="90,160 110,160 100,182" fill="#aaa"/>
        <rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/>
      </>),
      back: (<>
        <rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/>
        <polygon points="90,160 110,160 100,182" fill="#aaa"/>
        <rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/>
      </>),
      right: (<>
        <rect x="90" y="25" width="20" height="135" rx="10" fill={color} opacity="0.9"/>
        <polygon points="90,160 110,160 100,182" fill="#aaa"/>
        <rect x="90" y="22" width="20" height="14" rx="7" fill="#555"/>
      </>),
      handle: (<></>),
    },
    "badges": {
      front: (
        <>
          <circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/>
          <circle cx="100" cy="105" r="50" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15"/>
          <text x="100" y="98" textAnchor="middle" fill={textCol} fontSize="10" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">RADHE</text>
          <text x="100" y="112" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" opacity="0.5">DIGITAL</text>
          <circle cx="100" cy="57" r="6" fill="#444"/>
        </>
      ),
      back: (
        <>
          <circle cx="100" cy="105" r="60" fill="#2a2a2a" opacity="0.95"/>
          <circle cx="100" cy="105" r="50" fill="none" stroke="white" strokeWidth="1" opacity="0.1"/>
          <rect x="82" y="88" width="36" height="6" rx="3" fill="#555"/>
          <rect x="86" y="100" width="28" height="6" rx="3" fill="#444"/>
          <text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">SAFETY PIN</text>
        </>
      ),
      detail: (
        <>
          <circle cx="100" cy="100" r="65" fill={color} opacity="0.85"/>
          <circle cx="100" cy="100" r="52" fill="none" stroke="white" strokeWidth="2" opacity="0.2"/>
          <circle cx="100" cy="100" r="30" fill="white" opacity="0.08"/>
          <text x="100" y="95" textAnchor="middle" fill={textCol} fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">YOUR</text>
          <text x="100" y="111" textAnchor="middle" fill={textCol} fontSize="11" fontFamily="sans-serif" fontWeight="bold" opacity="0.8">LOGO</text>
        </>
      ),
      open: (
        <>
          <rect x="50" y="75" width="100" height="70" rx="10" fill="#1e293b" opacity="0.9"/>
          <circle cx="100" cy="110" r="28" fill={color} opacity="0.9"/>
          <text x="100" y="115" textAnchor="middle" fill={textCol} fontSize="9" fontFamily="sans-serif" fontWeight="bold" opacity="0.7">BADGE</text>
          <rect x="80" y="145" width="40" height="4" rx="2" fill={color} opacity="0.4"/>
          <text x="100" y="68" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">PINNED ON SHIRT</text>
        </>
      ),
      top: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      left: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      right: (<><circle cx="100" cy="105" r="60" fill={color} opacity="0.9"/></>),
      handle: (<></>),
    },
    "photo-frames": {
      front: (
        <>
          <rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/>
          <rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/>
          <path d="M52 110 L78 80 L106 100 L126 74 L148 110 Z" fill={color} opacity="0.45"/>
          <circle cx="76" cy="76" r="11" fill={color} opacity="0.4"/>
          <text x="100" y="125" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="sans-serif">YOUR PHOTO</text>
        </>
      ),
      left: (
        <>
          <rect x="70" y="40" width="18" height="120" rx="4" fill={color} opacity="0.85"/>
          <rect x="88" y="52" width="70" height="96" rx="3" fill="#1a1a1a"/>
          <path d="M88 110 L108 82 L128 100 L148 80 L158 110 Z" fill={color} opacity="0.4"/>
          <text x="120" y="125" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="sans-serif">PHOTO</text>
        </>
      ),
      back: (
        <>
          <rect x="40" y="40" width="120" height="120" rx="8" fill="#2a2a2a" opacity="0.95"/>
          <rect x="52" y="52" width="96" height="96" rx="4" fill="#222"/>
          <rect x="60" y="140" width="40" height="8" rx="4" fill="#333"/>
          <rect x="85" y="52" width="30" height="50" rx="4" fill="#2e2e2e"/>
          <text x="100" y="115" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="sans-serif">EASEL STAND</text>
        </>
      ),
      open: (
        <>
          <rect x="52" y="55" width="96" height="90" rx="6" fill={color} opacity="0.7"/>
          <rect x="62" y="65" width="76" height="70" rx="4" fill="#1a1a1a"/>
          <path d="M62 108 L82 85 L100 100 L118 78 L138 108 Z" fill={color} opacity="0.4"/>
          <rect x="62" y="145" width="76" height="4" rx="2" fill={color} opacity="0.3"/>
          <text x="100" y="130" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="sans-serif">ON DESK</text>
        </>
      ),
      top: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      detail: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      right: (<><rect x="40" y="40" width="120" height="120" rx="8" fill={color} opacity="0.85"/><rect x="52" y="52" width="96" height="96" rx="4" fill="#1a1a1a"/></>),
      handle: (<></>),
    },
    "corporate-gifts": {
      open: (
        <>
          <rect x="44" y="95" width="112" height="76" rx="8" fill={color} opacity="0.88"/>
          <rect x="38" y="74" width="124" height="28" rx="6" fill={color}/>
          <rect x="38" y="74" width="124" height="28" rx="6" fill="white" opacity="0.06"/>
          <rect x="94" y="74" width="12" height="97" fill="white" opacity="0.15"/>
          <path d="M100 74 Q80 57 72 47 Q64 37 74 35 Q84 33 100 74" fill={color} opacity="0.75"/>
          <path d="M100 74 Q120 57 128 47 Q136 37 126 35 Q116 33 100 74" fill={color} opacity="0.75"/>
          <rect x="52" y="105" width="38" height="30" rx="5" fill="white" opacity="0.08"/>
          <rect x="110" y="105" width="38" height="14" rx="4" fill="white" opacity="0.08"/>
          <rect x="110" y="124" width="38" height="8" rx="3" fill="white" opacity="0.06"/>
        </>
      ),
      front: (
        <>
          <rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/>
          <rect x="44" y="74" width="112" height="98" rx="8" fill="white" opacity="0.04"/>
          <rect x="94" y="74" width="12" height="98" fill="white" opacity="0.12"/>
          <path d="M100 74 Q80 57 72 47 Q64 37 74 35 Q84 33 100 74" fill={color} opacity="0.75"/>
          <path d="M100 74 Q120 57 128 47 Q136 37 126 35 Q116 33 100 74" fill={color} opacity="0.75"/>
          <text x="100" y="128" textAnchor="middle" fill={textCol} fontSize="8" fontFamily="sans-serif" fontWeight="bold" opacity="0.5">GIFT BOX</text>
        </>
      ),
      detail: (
        <>
          <rect x="48" y="50" width="46" height="46" rx="6" fill={color} opacity="0.7"/>
          <rect x="106" y="50" width="46" height="46" rx="6" fill="white" opacity="0.1"/>
          <rect x="48" y="104" width="46" height="46" rx="6" fill="white" opacity="0.08"/>
          <rect x="106" y="104" width="46" height="46" rx="6" fill={color} opacity="0.5"/>
          <text x="71" y="77" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.6">MUG</text>
          <text x="129" y="77" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">T-SHIRT</text>
          <text x="71" y="130" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="sans-serif">CAP</text>
          <text x="129" y="130" textAnchor="middle" fill={textCol} fontSize="7" fontFamily="sans-serif" opacity="0.6">PEN</text>
        </>
      ),
      left: (
        <>
          <rect x="70" y="74" width="60" height="98" rx="8" fill={color} opacity="0.85"/>
          <rect x="70" y="74" width="60" height="30" rx="8 8 0 0" fill="white" opacity="0.06"/>
          <rect x="94" y="74" width="12" height="98" fill="white" opacity="0.1"/>
        </>
      ),
      back: (<>
        <rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/>
        <rect x="94" y="74" width="12" height="98" fill="white" opacity="0.12"/>
      </>),
      top: (<>
        <rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/>
      </>),
      right: (<>
        <rect x="44" y="74" width="112" height="98" rx="8" fill={color} opacity="0.88"/>
      </>),
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
  return (
    <button
      onClick={onClick}
      title={name}
      className={`w-9 h-9 rounded-full transition-all duration-200 ${active ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-black" : "hover:scale-105"}`}
      style={{ backgroundColor: hex, border: border ? "2px solid rgba(255,255,255,0.3)" : "none" }}
    />
  );
}

/* ─── Related Product Card ─── */
function RelatedCard({ product, slug, catLabel, index }: {
  product: Product; slug: string; catLabel: string; index: number;
}) {
  const [, setLocation] = useLocation();
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => setLocation(`/categories/${slug}/${product.id}`)}
      className="group bg-[#111] border border-white/8 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 transition-all duration-300"
      whileHover={{ y: -4 }}
    >
      <div className="aspect-square overflow-hidden bg-[#0d0d0d] relative">
        <GallerySVG slug={slug} angle="front" />
        {product.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">{product.badge}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-white font-bold text-sm leading-snug mb-1">{product.name}</p>
        <p className="text-primary font-extrabold text-base">{product.priceLabel}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const [, setLocation] = useLocation();
  const { addItem, openCart } = useCart();

  const category = CATEGORY_MAP[slug ?? ""];
  const product = category?.products.find(p => p.id === productId);

  const details = CATEGORY_DETAILS[slug ?? ""];

  const [activeView, setActiveView] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [cartAdded, setCartAdded] = useState(false);

  if (!category || !product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4 text-center">
        <Package size={60} className="text-primary mb-6 opacity-50" />
        <h1 className="text-3xl font-extrabold mb-3">Product Not Found</h1>
        <p className="text-gray-400 mb-8">This product doesn't exist or has been removed.</p>
        <button onClick={() => setLocation(`/categories/${slug}`)} className="px-8 py-3 rounded-xl bg-primary text-white font-bold">
          Back to {category?.label ?? "Products"}
        </button>
      </div>
    );
  }

  const galleryViews = details?.galleryViews ?? [{ label: "View", angle: "front" as const }];
  const selectedColorHex = details?.colors[activeColor]?.hex ?? "#e53e3e";

  const related = category.products.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      categorySlug: slug ?? "",
      categoryLabel: category.label,
      price: product.price,
      priceLabel: product.priceLabel,
      isCustomized: false,
      quantity: 1,
    });
    setCartAdded(true);
    setTimeout(() => { setCartAdded(false); openCart(); }, 1500);
  };

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      categorySlug: slug ?? "",
      categoryLabel: category.label,
      price: product.price,
      priceLabel: product.priceLabel,
      isCustomized: false,
      quantity: 1,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Breadcrumb */}
      <div className="bg-[#0a0a0a] border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link href="/categories" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight size={13} />
          <Link href={`/categories/${slug}`} className="hover:text-white transition-colors">{category.label}</Link>
          <ChevronRight size={13} />
          <span className="text-white font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT: Gallery ── */}
          <div className="space-y-3">
            {/* Main image */}
            <motion.div
              key={`${activeView}-${activeColor}`}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/8"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}
            >
              <GallerySVG
                slug={slug ?? ""}
                angle={galleryViews[activeView]?.angle ?? "front"}
                color={selectedColorHex}
                active
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white shadow-lg">
                  {product.badge}
                </span>
              )}
              {/* View label */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white font-semibold backdrop-blur-sm">
                {galleryViews[activeView]?.label}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2">
              {galleryViews.map((view, i) => (
                <button
                  key={i}
                  onClick={() => setActiveView(i)}
                  className={`aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${
                    activeView === i
                      ? "border-primary ring-1 ring-primary shadow-lg shadow-primary/20"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <GallerySVG
                    slug={slug ?? ""}
                    angle={view.angle}
                    color={selectedColorHex}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Overview ── */}
          <div className="space-y-6">

            {/* Name + Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-[0.18em] uppercase text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
                  {category.label}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">{product.badge}</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">{product.name}</h1>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-500 text-xs ml-2">4.8 · Verified reviews</span>
              </div>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 py-4 border-y border-white/8">
              <span className="text-primary font-extrabold text-3xl">{product.priceLabel}</span>
              <span className="text-gray-500 text-sm pb-1">per piece · inclusive of printing</span>
            </div>

            {/* Color Selection */}
            {details?.colors && (
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-3">
                  Available Colors · <span className="text-white">{details.colors[activeColor].name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {details.colors.map((c, i) => (
                    <ColorDot
                      key={c.name}
                      hex={c.hex}
                      border={c.border}
                      name={c.name}
                      active={activeColor === i}
                      onClick={() => setActiveColor(i)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {details?.sizes && details.sizes.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-3">Available Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {details.sizes.map(s => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-white/6 border border-white/12 text-sm text-gray-300 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key info chips */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🎨", label: "Printing", value: details?.printingType ?? "Custom Print" },
                { icon: "🧵", label: "Material", value: details?.material ?? "Premium Material" },
                { icon: "🚚", label: "Delivery", value: details?.deliveryTime ?? "3–5 business days" },
                { icon: "✅", label: "Quality", value: "100% Checked & Packed" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-[#111] border border-white/8 rounded-xl">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-600">{item.label}</p>
                    <p className="text-xs text-gray-300 font-semibold leading-tight mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield size={13} className="text-green-400" /> Secure Order
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={13} className="text-blue-400" /> Pan India Delivery
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={13} className="text-yellow-400" /> Quality Guaranteed
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={handleBuyNow}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-black bg-white hover:bg-gray-100 transition-all text-sm"
                >
                  <ShoppingBag size={17} /> Buy Now
                </motion.button>
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white border border-white/20 hover:border-primary/50 hover:bg-primary/10 transition-all text-sm"
                >
                  {cartAdded ? <><CheckCircle size={17} className="text-green-400" /> Added!</> : <><ShoppingCart size={17} /> Add to Cart</>}
                </motion.button>
              </div>
              <motion.button
                onClick={() => setLocation(`/customize/${slug}`)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }}
              >
                <Palette size={17} /> Customize Now — Design Your Own
                <ArrowRight size={15} />
              </motion.button>
            </div>

            <p className="text-xs text-gray-600 text-center">No payment required upfront · Confirm your order via WhatsApp</p>
          </div>
        </div>
      </div>

      {/* ── Specifications ── */}
      {details?.specs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" />
            Product Specifications
          </h2>
          <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            {details.specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 gap-4 px-6 py-4 ${i !== details.specs.length - 1 ? "border-b border-white/6" : ""} ${i % 2 === 0 ? "bg-white/2" : ""}`}
              >
                <span className="text-gray-500 text-sm font-semibold">{spec.label}</span>
                <span className="text-white text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="bg-[#0a0a0a] border-t border-white/8 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                More {category.label}
              </h2>
              <Link href={`/categories/${slug}`}>
                <button className="flex items-center gap-1.5 text-sm text-primary hover:text-red-400 font-semibold transition-colors">
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
                  catLabel={category.label}
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
