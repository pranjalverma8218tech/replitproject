import React, { useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  Upload, CheckCircle2, ShoppingCart, MessageCircle,
  X, ArrowLeft, Shirt, Coffee, HardHat, Pen, Award, Image as ImageIcon, Gift
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";

/* ─── Constants ─── */
const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type TShirtSize = typeof T_SHIRT_SIZES[number];

const TSHIRT_COLORS = [
  { name: "White",  hex: "#ffffff", border: true },
  { name: "Black",  hex: "#111111" },
  { name: "Red",    hex: "#e53e3e" },
  { name: "Blue",   hex: "#2563eb" },
  { name: "Yellow", hex: "#eab308" },
];

const GENDER_OPTIONS = ["Men", "Women", "Unisex"] as const;
type Gender = typeof GENDER_OPTIONS[number];

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  price: number;
  priceLabel: string;
}> = {
  "t-shirts":        { label: "T-Shirt",        icon: Shirt,      color: "#e53e3e", price: 199, priceLabel: "₹199" },
  "mugs":            { label: "Mug",             icon: Coffee,     color: "#f6ad55", price: 249, priceLabel: "₹249" },
  "caps":            { label: "Cap",             icon: HardHat,    color: "#4299e1", price: 179, priceLabel: "₹179" },
  "pens":            { label: "Pen",             icon: Pen,        color: "#68d391", price: 49,  priceLabel: "₹49"  },
  "badges":          { label: "Badge",           icon: Award,      color: "#f6e05e", price: 29,  priceLabel: "₹29"  },
  "photo-frames":    { label: "Photo Frame",     icon: ImageIcon,  color: "#b794f4", price: 299, priceLabel: "₹299" },
  "corporate-gifts": { label: "Corporate Gift",  icon: Gift,       color: "#fc8181", price: 499, priceLabel: "₹499" },
};

type Tab = "upload" | "request";

/* ─── Step badge ─── */
function Step({ n }: { n: number }) {
  return (
    <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center flex-shrink-0">
      {n}
    </span>
  );
}

export default function CustomizeProductPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();

  const meta = CATEGORY_META[category ?? ""] ?? CATEGORY_META["t-shirts"];
  const Icon = meta.icon;
  const isTShirt = category === "t-shirts";

  const { addItem, openCart } = useCart();

  /* ── Tab ── */
  const [tab, setTab] = useState<Tab>("upload");

  /* ── T-Shirt specific ── */
  const [gender, setGender] = useState<Gender>("Unisex");
  const [color, setColor] = useState("Black");
  const [customColor, setCustomColor] = useState("");
  const [sizeQty, setSizeQty] = useState<Record<TShirtSize, number>>({
    S: 0, M: 0, L: 0, XL: 0, XXL: 0,
  });
  const totalQty = Object.values(sizeQty).reduce((a, b) => a + b, 0);

  const setSizeAmount = (size: TShirtSize, val: string) => {
    const n = Math.max(0, parseInt(val) || 0);
    setSizeQty(prev => ({ ...prev, [size]: n }));
  };

  /* ── Non-T-Shirt quantity ── */
  const [quantity, setQuantity] = useState(1);

  /* ── Upload tab state ── */
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const designRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ── Request tab state ── */
  const [customText, setCustomText] = useState("");
  const [requirements, setRequirements] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ── File handlers ── */
  const handleDesignFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDesignFile(file);
    const reader = new FileReader();
    reader.onload = ev => setDesignPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoFile(file);
  };
  const removeDesign = () => {
    setDesignFile(null); setDesignPreview(null);
    if (designRef.current) designRef.current.value = "";
  };
  const removeLogo = () => {
    setLogoFile(null);
    if (logoRef.current) logoRef.current.value = "";
  };

  /* ── Order summary string for WhatsApp / Cart ── */
  const sizeBreakdown = T_SHIRT_SIZES
    .filter(s => sizeQty[s] > 0)
    .map(s => `${s}×${sizeQty[s]}`)
    .join(", ");

  const effectiveQty = isTShirt ? totalQty : quantity;

  /* ── Add to Cart ── */
  const handleAddToCart = () => {
    addItem({
      productId: `${category}-custom`,
      productName: `Custom ${meta.label}`,
      categorySlug: category ?? "",
      categoryLabel: meta.label,
      price: meta.price,
      priceLabel: meta.priceLabel,
      isCustomized: true,
      quantity: effectiveQty || 1,
      customization: {
        color: isTShirt ? color : undefined,
        size: isTShirt ? sizeBreakdown : undefined,
        quantity: effectiveQty || 1,
        uploadedFileName: designFile?.name,
        designDesc: undefined,
      },
    });
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); openCart(); }, 1500);
  };

  /* ── Submit Request (WhatsApp) ── */
  const handleSubmitRequest = () => {
    const colorLabel = color === "Custom" ? `Custom (${customColor || "to be discussed"})` : color;
    const lines = [
      `Hello Radhe Digital! I'd like to request a custom design.`,
      ``,
      `*Product:* ${meta.label}`,
      isTShirt ? `*Gender:* ${gender}` : "",
      isTShirt ? `*Color:* ${colorLabel}` : "",
      isTShirt
        ? T_SHIRT_SIZES.filter(s => sizeQty[s] > 0).map(s => `*${s}:* ${sizeQty[s]} pcs`).join("\n")
        : `*Quantity:* ${quantity}`,
      isTShirt ? `*Total Quantity:* ${totalQty} T-Shirts` : "",
      customText    ? `*Custom Text:* ${customText}` : "",
      requirements  ? `*Design Requirements:* ${requirements}` : "",
      instructions  ? `*Special Instructions:* ${instructions}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(lines)}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  /* ─── step counter helper for T-shirt vs others ─── */
  // T-shirt shared steps: 1=Gender, 2=Color, 3=Sizes
  // Upload specific starts at 4 (T-shirt) or 1 (others)
  // Request specific starts at 4 (T-shirt) or 1 (others)
  const uploadStepStart = isTShirt ? 4 : 1;
  const requestStepStart = isTShirt ? 4 : 1;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/8 py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setLocation("/customize")}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Categories
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
            >
              <Icon size={22} style={{ color: meta.color }} />
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-gray-500">Customize</span>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{meta.label}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#111] border border-white/8 rounded-2xl p-1.5">
          {(["upload", "request"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "upload" ? <><Upload size={14} /> Upload Existing Design</> : <><MessageCircle size={14} /> Request Design Creation</>}
            </button>
          ))}
        </div>

        {/* ── T-Shirt shared options (gender, color, sizes) ── */}
        {isTShirt && (
          <>
            {/* Step 1: Gender */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={1} /> Gender Type
              </h2>
              <div className="flex gap-3">
                {GENDER_OPTIONS.map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      gender === g
                        ? "bg-primary text-white border-primary"
                        : "bg-white/6 text-gray-300 border-white/12 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Color */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={2} /> T-Shirt Color
              </h2>
              <div className="flex flex-wrap gap-3 mb-3">
                {TSHIRT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    title={c.name}
                    className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                      color === c.name ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-[#111]" : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: c.hex,
                      border: c.border ? "2px solid rgba(255,255,255,0.25)" : "none",
                    }}
                  >
                    {color === c.name && (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-xs font-black"
                        style={{ color: c.name === "White" || c.name === "Yellow" ? "#111" : "#fff" }}
                      >✓</span>
                    )}
                  </button>
                ))}
                {/* Custom color button */}
                <button
                  onClick={() => setColor("Custom")}
                  className={`px-4 h-10 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    color === "Custom"
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/6 border-white/15 text-gray-400 hover:text-white hover:border-white/25"
                  }`}
                >
                  + Custom
                </button>
              </div>
              <p className="text-gray-500 text-xs">
                Selected: <span className="text-white font-semibold">{color}</span>
              </p>
              {color === "Custom" && (
                <div className="mt-3">
                  <Input
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    placeholder="Describe your color (e.g. Sky Blue, Maroon, Olive Green...)"
                    className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
                  />
                </div>
              )}
            </div>

            {/* Step 3: Size + Quantity table */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <Step n={3} /> Size &amp; Quantity
              </h2>
              <p className="text-gray-500 text-xs mb-5 ml-8">Enter how many pieces you need per size. Leave blank if not required.</p>

              <div className="space-y-2">
                {/* Header row */}
                <div className="grid grid-cols-2 gap-3 px-1 mb-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity (pcs)</span>
                </div>
                {T_SHIRT_SIZES.map(s => (
                  <div
                    key={s}
                    className={`grid grid-cols-2 gap-3 items-center px-4 py-3 rounded-xl border transition-colors ${
                      sizeQty[s] > 0
                        ? "bg-primary/8 border-primary/30"
                        : "bg-white/4 border-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black border ${
                          sizeQty[s] > 0
                            ? "bg-primary text-white border-primary"
                            : "bg-white/8 text-gray-300 border-white/12"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={sizeQty[s] === 0 ? "" : sizeQty[s]}
                      onChange={e => setSizeAmount(s, e.target.value)}
                      placeholder="0"
                      className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-3 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-xl border ${
                totalQty > 0 ? "bg-primary/10 border-primary/30" : "bg-white/4 border-white/8"
              }`}>
                <span className="text-sm font-semibold text-gray-300">Total T-Shirts</span>
                <span className={`text-xl font-extrabold ${totalQty > 0 ? "text-primary" : "text-gray-600"}`}>
                  {totalQty}
                </span>
              </div>
              {totalQty >= 10 && (
                <p className="text-yellow-400 text-xs mt-2 text-center">🎉 Bulk order — we'll offer you a special price!</p>
              )}
            </div>
          </>
        )}

        {/* ── Upload Tab content ── */}
        {tab === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Upload Design */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={uploadStepStart} /> Upload Your Design
              </h2>
              {!designPreview ? (
                <label className="relative flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/4 transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Upload size={20} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm">Tap to upload your design image</p>
                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, SVG, PDF — Max 10 MB</p>
                  </div>
                  <input
                    ref={designRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".png,.jpg,.jpeg,.svg,.pdf"
                    onChange={handleDesignFile}
                  />
                </label>
              ) : (
                <div className="rounded-xl overflow-hidden border border-white/12">
                  <img src={designPreview} alt="Design" className="w-full max-h-44 object-contain bg-[#0d0d0d] p-4" />
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-t border-white/8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-green-400" />
                      <span className="text-green-400 text-sm font-semibold truncate max-w-[200px]">{designFile?.name}</span>
                    </div>
                    <button onClick={removeDesign} className="text-gray-500 hover:text-red-400 transition-colors"><X size={15} /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Logo */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <Step n={uploadStepStart + 1} />
                Upload Your Logo <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <p className="text-gray-500 text-xs mb-4 ml-8">If your design needs a separate logo file, upload it here.</p>
              {!logoFile ? (
                <label className="relative flex items-center gap-3 py-4 px-5 border border-dashed border-white/12 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-primary/4 transition-all duration-200">
                  <Upload size={16} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">Tap to upload logo (PNG, SVG)</span>
                  <input ref={logoRef} type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".png,.jpg,.jpeg,.svg" onChange={handleLogoFile} />
                </label>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-white/12 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold truncate max-w-[220px]">{logoFile.name}</span>
                  </div>
                  <button onClick={removeLogo} className="text-gray-500 hover:text-red-400 transition-colors"><X size={15} /></button>
                </div>
              )}
            </div>

            {/* Quantity (non-T-shirt only) */}
            {!isTShirt && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Step n={uploadStepStart + 2} /> Select Quantity
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">−</button>
                  <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">+</button>
                  <span className="text-gray-500 text-sm ml-1">pieces</span>
                </div>
                {quantity >= 10 && <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>}
              </div>
            )}

            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }}
            >
              {addedToCart
                ? <><CheckCircle2 size={20} /> Added to Cart!</>
                : <><ShoppingCart size={20} /> Add to Cart {isTShirt && totalQty > 0 ? `(${totalQty} pcs)` : ""}</>
              }
            </motion.button>
            <p className="text-center text-gray-600 text-xs">After adding to cart, confirm your order via WhatsApp. No upfront payment required.</p>
          </motion.div>
        )}

        {/* ── Request Tab content ── */}
        {tab === "request" && (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Custom Text */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={requestStepStart} /> Custom Text
              </h2>
              <Input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. Team Name, Company Name, Slogan..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>

            {/* Design Requirements */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={requestStepStart + 1} /> Design Requirements
              </h2>
              <Textarea
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="Describe what you want on the product — theme, style, colours, images, logo idea..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-28"
              />
            </div>

            {/* Special Instructions */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={requestStepStart + 2} />
                Special Instructions <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <Textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Delivery deadline, print on back only, reference image links..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-20"
              />
            </div>

            {/* Quantity (non-T-shirt only) */}
            {!isTShirt && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Step n={requestStepStart + 3} /> Select Quantity
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">−</button>
                  <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">+</button>
                  <span className="text-gray-500 text-sm ml-1">pieces</span>
                </div>
                {quantity >= 10 && <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>}
              </div>
            )}

            {/* Submit */}
            <motion.button
              onClick={handleSubmitRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
            >
              {submitted
                ? <><CheckCircle2 size={20} /> Request Sent!</>
                : <><MessageCircle size={20} /> Submit Design Request via WhatsApp {isTShirt && totalQty > 0 ? `(${totalQty} pcs)` : ""}</>
              }
            </motion.button>
            <p className="text-center text-gray-600 text-xs">Our team will review your requirements and get back to you within a few hours.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
