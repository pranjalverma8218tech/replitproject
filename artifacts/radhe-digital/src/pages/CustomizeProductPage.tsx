import React, { useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion } from "framer-motion";
import {
  Upload, CheckCircle2, ShoppingCart, MessageCircle,
  X, ArrowLeft, Shirt, Coffee, HardHat, Pen, Award, Image as ImageIcon, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";

const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];

const CATEGORY_META: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string;
  price: number;
  priceLabel: string;
}> = {
  "t-shirts": { label: "T-Shirt", icon: Shirt, color: "#e53e3e", price: 199, priceLabel: "₹199" },
  "mugs": { label: "Mug", icon: Coffee, color: "#f6ad55", price: 249, priceLabel: "₹249" },
  "caps": { label: "Cap", icon: HardHat, color: "#4299e1", price: 179, priceLabel: "₹179" },
  "pens": { label: "Pen", icon: Pen, color: "#68d391", price: 49, priceLabel: "₹49" },
  "badges": { label: "Badge", icon: Award, color: "#f6e05e", price: 29, priceLabel: "₹29" },
  "photo-frames": { label: "Photo Frame", icon: ImageIcon, color: "#b794f4", price: 299, priceLabel: "₹299" },
  "corporate-gifts": { label: "Corporate Gift", icon: Gift, color: "#fc8181", price: 499, priceLabel: "₹499" },
};

type Tab = "upload" | "request";

export default function CustomizeProductPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();

  const meta = CATEGORY_META[category ?? ""] ?? CATEGORY_META["t-shirts"];
  const Icon = meta.icon;
  const isTShirt = category === "t-shirts";

  const { addItem, openCart } = useCart();

  const [tab, setTab] = useState<Tab>("upload");

  // Shared
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [addedToCart, setAddedToCart] = useState(false);

  // Upload tab
  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designPreview, setDesignPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const designRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  // Request tab
  const [customText, setCustomText] = useState("");
  const [requirements, setRequirements] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
    if (!file) return;
    setLogoFile(file);
  };

  const removeDesign = () => {
    setDesignFile(null);
    setDesignPreview(null);
    if (designRef.current) designRef.current.value = "";
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoRef.current) logoRef.current.value = "";
  };

  const handleAddToCart = () => {
    addItem({
      productId: `${category}-custom`,
      productName: `Custom ${meta.label}`,
      categorySlug: category ?? "",
      categoryLabel: meta.label,
      price: meta.price,
      priceLabel: meta.priceLabel,
      isCustomized: true,
      quantity,
      customization: {
        size: isTShirt ? size : undefined,
        quantity,
        uploadedFileName: designFile?.name,
        designDesc: undefined,
      },
    });
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); openCart(); }, 1500);
  };

  const handleSubmitRequest = () => {
    const lines = [
      `Hello Radhe Digital! I'd like to request a custom design.`,
      ``,
      `*Product:* ${meta.label}`,
      isTShirt ? `*Size:* ${size}` : "",
      `*Quantity:* ${quantity}`,
      customText ? `*Custom Text:* ${customText}` : "",
      requirements ? `*Design Requirements:* ${requirements}` : "",
      instructions ? `*Special Instructions:* ${instructions}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(lines)}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#111] border border-white/8 rounded-2xl p-1.5">
          <button
            onClick={() => setTab("upload")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === "upload"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Upload size={15} /> Upload Existing Design
          </button>
          <button
            onClick={() => setTab("request")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === "request"
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <MessageCircle size={15} /> Request Design Creation
          </button>
        </div>

        {/* T-Shirt Size */}
        {isTShirt && (
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">1</span>
              Select Size
            </h2>
            <div className="flex flex-wrap gap-2">
              {T_SHIRT_SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`w-14 h-11 rounded-xl text-sm font-bold border transition-all duration-200 ${
                    size === s
                      ? "bg-primary text-white border-primary"
                      : "bg-white/6 text-gray-300 border-white/12 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {tab === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Upload Image */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "2" : "1"}
                </span>
                Upload Your Design
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
                  <img src={designPreview} alt="Design preview" className="w-full max-h-44 object-contain bg-[#0d0d0d] p-4" />
                  <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-t border-white/8">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-green-400" />
                      <span className="text-green-400 text-sm font-semibold truncate max-w-[200px]">{designFile?.name}</span>
                    </div>
                    <button onClick={removeDesign} className="text-gray-500 hover:text-red-400 transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Logo */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "3" : "2"}
                </span>
                Upload Your Logo <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <p className="text-gray-500 text-xs mb-4 ml-8">If your design needs a separate logo file, upload it here.</p>

              {!logoFile ? (
                <label className="relative flex items-center gap-3 py-4 px-5 border border-dashed border-white/12 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-primary/4 transition-all duration-200">
                  <Upload size={16} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">Tap to upload logo (PNG, SVG)</span>
                  <input
                    ref={logoRef}
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleLogoFile}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-white/12 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold truncate max-w-[220px]">{logoFile.name}</span>
                  </div>
                  <button onClick={removeLogo} className="text-gray-500 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "4" : "3"}
                </span>
                Select Quantity
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center"
                >−</button>
                <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center"
                >+</button>
                <span className="text-gray-500 text-sm ml-1">pieces</span>
              </div>
              {quantity >= 10 && (
                <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>
              )}
            </div>

            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }}
            >
              {addedToCart ? (
                <><CheckCircle2 size={20} /> Added to Cart!</>
              ) : (
                <><ShoppingCart size={20} /> Add to Cart</>
              )}
            </motion.button>

            <p className="text-center text-gray-600 text-xs">
              After adding to cart, confirm your order via WhatsApp. No upfront payment required.
            </p>
          </motion.div>
        )}

        {/* Request Tab */}
        {tab === "request" && (
          <motion.div
            key="request"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Custom Text */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "2" : "1"}
                </span>
                Custom Text
              </h2>
              <Input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. Team Name, Company Name, Slogan..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>

            {/* Design Requirements */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "3" : "2"}
                </span>
                Design Requirements
              </h2>
              <Textarea
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="Describe what you want on the product — theme, style, colours, images, logo idea..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-28"
              />
            </div>

            {/* Special Instructions */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 space-y-4">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "4" : "3"}
                </span>
                Special Instructions <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <Textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Delivery deadline, specific placement, reference image links, print on back only..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-20"
              />
            </div>

            {/* Quantity */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center">
                  {isTShirt ? "5" : "4"}
                </span>
                Select Quantity
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center"
                >−</button>
                <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center"
                >+</button>
                <span className="text-gray-500 text-sm ml-1">pieces</span>
              </div>
              {quantity >= 10 && (
                <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmitRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
            >
              {submitted ? (
                <><CheckCircle2 size={20} /> Request Sent!</>
              ) : (
                <><MessageCircle size={20} /> Submit Design Request via WhatsApp</>
              )}
            </motion.button>

            <p className="text-center text-gray-600 text-xs">
              Our team will review your requirements and get back to you within a few hours.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
