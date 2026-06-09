import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Upload, CheckCircle2, Palette, Type, Image as ImageIcon,
  Eye, ShoppingCart, MessageCircle, ArrowRight, X, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { CATEGORY_MAP, CATEGORIES } from "@/data/products";

const COLORS = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#111111" },
  { name: "Red", hex: "#e53e3e" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Grey", hex: "#9ca3af" },
  { name: "Royal Blue", hex: "#2563eb" },
  { name: "Bottle Green", hex: "#166534" },
  { name: "Yellow", hex: "#eab308" },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const POSITIONS = ["Front", "Back", "Both Sides", "Left Chest", "Sleeve"];

/* ─── Live Preview SVG ─── */
function LivePreview({
  color, text, uploadPreview, slug
}: { color: string; text: string; uploadPreview: string | null; slug: string }) {
  const isLight = ["#ffffff", "#eab308", "#9ca3af"].includes(color);
  const textColor = isLight ? "#111" : "#fff";
  const textOpacity = isLight ? 0.7 : 0.85;

  const shapes: Record<string, JSX.Element> = {
    "t-shirts": (
      <path d="M60 55 L38 88 L66 94 L66 158 L134 158 L134 94 L162 88 L140 55 L114 70 C108 73 92 73 86 70 Z"
        fill={color} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    ),
    "mugs": (
      <>
        <rect x="52" y="62" width="88" height="100" rx="12" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M140 85 Q166 85 166 108 Q166 131 140 131" stroke="rgba(255,255,255,0.4)" strokeWidth="8" fill="none" strokeLinecap="round" />
      </>
    ),
    "caps": (
      <>
        <path d="M42 122 Q42 70 100 66 Q158 70 158 122 Z" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M42 122 Q26 121 24 114 Q22 106 42 119" fill={color} opacity="0.8" />
      </>
    ),
    "default": (
      <rect x="50" y="50" width="100" height="100" rx="12" fill={color} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    ),
  };

  const shape = shapes[slug] || shapes["default"];
  const textY = slug === "mugs" ? 115 : slug === "caps" ? 105 : 115;
  const textX = 100;

  return (
    <div className="relative w-full aspect-square bg-[#0d0d0d] rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.5)" }}>
      <svg viewBox="0 0 200 200" className="w-4/5 h-4/5" fill="none">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#shadow)">{shape}</g>

        {/* Uploaded image overlay */}
        {uploadPreview && (
          <image href={uploadPreview} x="72" y="82" width="56" height="44" preserveAspectRatio="xMidYMid meet" opacity="0.85" />
        )}

        {/* Custom text overlay */}
        {text && !uploadPreview && (
          <text x={textX} y={textY} textAnchor="middle" fill={textColor} fontSize="10"
            fontFamily="sans-serif" fontWeight="bold" opacity={textOpacity}>
            {text.length > 18 ? text.slice(0, 18) + "…" : text}
          </text>
        )}
        {text && uploadPreview && (
          <text x={textX} y={textY + 16} textAnchor="middle" fill={textColor} fontSize="8"
            fontFamily="sans-serif" fontWeight="bold" opacity={textOpacity}>
            {text.length > 20 ? text.slice(0, 20) + "…" : text}
          </text>
        )}

        {/* Placeholder */}
        {!uploadPreview && !text && (
          <text x={textX} y={textY} textAnchor="middle" fill={textColor} fontSize="9"
            fontFamily="sans-serif" opacity="0.3">
            YOUR DESIGN HERE
          </text>
        )}
      </svg>

      {/* Live badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs text-white font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live Preview
      </div>
    </div>
  );
}

export default function CustomizePage() {
  const { addItem, openCart } = useCart();
  const [_, setLocation] = useLocation();

  // Read product/category from URL
  const searchParams = new URLSearchParams(window.location.search);
  const productIdParam = searchParams.get("product") ?? "";
  const categoryParam = searchParams.get("category") ?? "t-shirts";

  // Find product from data
  const category = CATEGORY_MAP[categoryParam] ?? CATEGORIES[0];
  const product = category.products.find(p => p.id === productIdParam) ?? category.products[0];

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [color, setColor] = useState("White");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [position, setPosition] = useState("Front");
  const [customText, setCustomText] = useState("");
  const [designDesc, setDesignDesc] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const colorHex = COLORS.find(c => c.name === color)?.hex ?? "#ffffff";
  const currentCategory = CATEGORY_MAP[selectedCategory] ?? CATEGORIES[0];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = ev => setUploadPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      categorySlug: currentCategory.slug,
      categoryLabel: currentCategory.label,
      price: product.price,
      priceLabel: product.priceLabel,
      isCustomized: true,
      quantity,
      customization: {
        color, size, quantity, position,
        customText: customText || undefined,
        designDesc: designDesc || undefined,
        uploadedFileName: uploadedFile?.name,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleWhatsApp = () => {
    const msg = `Hello Radhe Digital! I want to customize a product:\n\n*Product:* ${product.name}\n*Category:* ${currentCategory.label}\n*Color:* ${color}\n*Size:* ${size}\n*Quantity:* ${quantity}\n*Print Position:* ${position}\n${customText ? `*Custom Text:* ${customText}\n` : ""}${designDesc ? `*Design Notes:* ${designDesc}\n` : ""}${uploadedFile ? `*File:* ${uploadedFile.name} (will send on WhatsApp)\n` : ""}\n*Customer:* ${name || "-"}\n*Mobile:* ${mobile || "-"}\n*City:* ${city || "-"}`;
    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/8 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
              <Sparkles size={12} /> Design Studio
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Customize Your Order</h1>
          <p className="text-gray-400">Design your product, preview it live, then add to cart or send via WhatsApp.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ── LEFT: Live Preview ── */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-4">
              <LivePreview
                color={colorHex}
                text={customText}
                uploadPreview={uploadPreview}
                slug={selectedCategory}
              />

              {/* Product info summary */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold text-lg leading-snug">{product.name}</p>
                    <p className="text-gray-500 text-sm">{currentCategory.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-extrabold text-xl">{product.priceLabel}</p>
                    <p className="text-gray-600 text-xs">per piece</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                  <span className="px-2 py-1 bg-white/6 rounded-lg border border-white/8">Color: {color}</span>
                  <span className="px-2 py-1 bg-white/6 rounded-lg border border-white/8">Size: {size}</span>
                  <span className="px-2 py-1 bg-white/6 rounded-lg border border-white/8">Qty: {quantity}</span>
                  <span className="px-2 py-1 bg-white/6 rounded-lg border border-white/8">{position}</span>
                </div>
                <div className="border-t border-white/8 pt-3 flex justify-between font-bold">
                  <span className="text-gray-400 text-sm">Estimated Total</span>
                  <span className="text-primary">₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Info note */}
              <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-xs leading-relaxed">
                  Add to cart, then confirm your order via WhatsApp. No payment required upfront — we'll confirm details and share the payment link.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Configuration ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Step 1: Category & Product */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">1</span>
                Select Category & Product
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`py-2 px-3 rounded-xl text-sm font-semibold border transition-all duration-200 text-left ${
                      selectedCategory === cat.slug
                        ? "bg-primary/15 border-primary/50 text-primary"
                        : "bg-white/4 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Color */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">2</span>
                Choose Color
              </h2>
              <div className="flex flex-wrap gap-3">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className={`w-10 h-10 rounded-full transition-all duration-200 ${
                      color === c.name ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-[#111]" : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.hex, border: c.hex === "#ffffff" ? "1px solid rgba(255,255,255,0.2)" : "none" }}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-3">Selected: <span className="text-white font-semibold">{color}</span></p>
            </div>

            {/* Step 3: Size, Qty, Position */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">3</span>
                Size, Quantity & Position
              </h2>
              <div>
                <p className="text-gray-400 text-sm mb-3">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-12 h-10 rounded-xl text-sm font-bold border transition-all duration-200 ${
                        size === s ? "bg-primary text-white border-primary" : "bg-white/6 text-gray-300 border-white/12 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Quantity</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-lg transition-colors flex items-center justify-center">−</button>
                    <span className="w-12 text-center text-white font-bold text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-lg transition-colors flex items-center justify-center">+</button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Print Position</p>
                  <select
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-3 text-sm text-white outline-none focus:border-primary/50"
                  >
                    {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Upload Design */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">4</span>
                Upload Design / Logo
              </h2>

              {!uploadPreview ? (
                <label className="relative flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/4 transition-all duration-200">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Upload size={22} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">Drop your file here or click to browse</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, SVG, PDF — Max 10MB</p>
                  </div>
                  <input ref={fileRef} type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={handleFile} />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-white/12">
                  <img src={uploadPreview} alt="Uploaded design" className="w-full max-h-48 object-contain bg-[#0d0d0d] p-4" />
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-t border-white/8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-400" />
                      <span className="text-green-400 text-sm font-semibold truncate max-w-[200px]">{uploadedFile?.name}</span>
                    </div>
                    <button onClick={removeFile} className="text-gray-500 hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Custom text */}
              <div>
                <p className="text-gray-400 text-sm mb-2 flex items-center gap-1.5"><Type size={14} /> Custom Text (Optional)</p>
                <Input
                  type="text"
                  value={customText}
                  onChange={e => setCustomText(e.target.value)}
                  placeholder="e.g. Team Name, Slogan, Name..."
                  className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
                />
              </div>

              {/* Design notes */}
              <div>
                <p className="text-gray-400 text-sm mb-2">Design Notes (Optional)</p>
                <Textarea
                  value={designDesc}
                  onChange={e => setDesignDesc(e.target.value)}
                  placeholder="Describe colours, placement, fonts, or any special instructions..."
                  className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-20"
                />
              </div>
            </div>

            {/* Step 5: Contact (for WhatsApp) */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">5</span>
                Contact Details <span className="text-xs font-normal text-gray-500 ml-1">(for WhatsApp order only)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Full Name</p>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Kumar"
                    className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">WhatsApp Number</p>
                  <Input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 98765 43210" type="tel"
                    className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl" />
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-sm mb-2">City</p>
                  <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mathura"
                    className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add to Cart */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }}
              >
                {addedToCart ? (
                  <><CheckCircle2 size={20} /> Added to Cart! View Cart</>
                ) : (
                  <><ShoppingCart size={20} /> Add Customized Product to Cart</>
                )}
              </motion.button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm border border-white/15 hover:border-white/30 hover:bg-white/4 transition-all duration-200"
              >
                <MessageCircle size={18} className="text-green-400" />
                Or Send Inquiry via WhatsApp
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
