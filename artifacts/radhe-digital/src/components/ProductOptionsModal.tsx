import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { type Product } from "@/data/products";
import { CATEGORY_DETAILS } from "@/data/productDetails";
import { useCart } from "@/context/CartContext";

const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Unisex"];

interface Props {
  product: Product;
  categorySlug: string;
  categoryLabel: string;
  onClose: () => void;
}

export function ProductOptionsModal({ product, categorySlug, categoryLabel, onClose }: Props) {
  const { addItem } = useCart();
  const details = CATEGORY_DETAILS[categorySlug];
  const isTShirt = categorySlug === "t-shirts";

  const [selectedColor, setSelectedColor] = useState(0);
  const [customColor, setCustomColor] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [gender, setGender] = useState("Unisex");
  const [sizeQtys, setSizeQtys] = useState<Record<string, number>>(
    Object.fromEntries(T_SHIRT_SIZES.map(s => [s, 0]))
  );
  const [qty, setQty] = useState(1);

  const totalQty = isTShirt
    ? Object.values(sizeQtys).reduce((a, b) => a + b, 0)
    : qty;

  const colorName = showCustomColor
    ? (customColor.trim() || "Custom Colour")
    : (details?.colors[selectedColor]?.name ?? "Default");

  const colorHex = showCustomColor
    ? undefined
    : (details?.colors[selectedColor]?.hex);

  const handleSizeQty = (size: string, val: number) => {
    setSizeQtys(prev => ({ ...prev, [size]: Math.max(0, val) }));
  };

  const handleSizeInput = (size: string, raw: string) => {
    if (raw === "") { setSizeQtys(prev => ({ ...prev, [size]: 0 })); return; }
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0) handleSizeQty(size, num);
  };

  const handleConfirm = () => {
    if (totalQty < 1) return;

    const customization = isTShirt
      ? {
          color: colorName,
          colorHex,
          gender,
          sizeBreakdown: Object.fromEntries(
            Object.entries(sizeQtys).filter(([, v]) => v > 0)
          ),
        }
      : {
          color: details?.colors?.[selectedColor]?.name,
          colorHex: details?.colors?.[selectedColor]?.hex,
        };

    addItem({
      productId: product.id,
      productName: product.name,
      categorySlug,
      categoryLabel,
      price: product.price,
      priceLabel: product.priceLabel,
      isCustomized: false,
      quantity: totalQty,
      customization,
    });
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const canConfirm = totalQty >= 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-end md:items-center justify-center px-0 md:px-4"
        style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          className="w-full max-w-lg rounded-t-3xl md:rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(10,10,10,0.99)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 -12px 60px rgba(0,0,0,0.85)",
            maxHeight: "92dvh",
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-1">Select Options</p>
              <h2 className="text-white font-extrabold text-lg leading-snug">{product.name}</h2>
              <p className="text-gray-500 text-xs mt-0.5">{categoryLabel} · {product.priceLabel}/pc</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all flex-shrink-0 mt-0.5"
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Scrollable body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* ═══════════ T-SHIRT SPECIFIC ═══════════ */}
            {isTShirt && (
              <>
                {/* Colour */}
                {details?.colors && (
                  <div>
                    <p className="text-sm font-bold text-white mb-3">
                      Colour <span className="text-gray-500 font-normal">·</span>{" "}
                      <span className="text-primary">{colorName}</span>
                    </p>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {details.colors.map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => { setSelectedColor(i); setShowCustomColor(false); }}
                          title={c.name}
                          className={`w-9 h-9 rounded-full transition-all duration-200 ${
                            !showCustomColor && selectedColor === i
                              ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-black"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            border: c.border ? "2px solid rgba(255,255,255,0.35)" : "none",
                          }}
                        />
                      ))}
                      <button
                        onClick={() => setShowCustomColor(v => !v)}
                        className={`h-9 px-4 rounded-full text-xs font-bold border transition-all ${
                          showCustomColor
                            ? "bg-primary border-primary text-white"
                            : "border-white/20 text-gray-400 hover:text-white hover:border-white/40 bg-transparent"
                        }`}
                      >
                        + Custom
                      </button>
                    </div>
                    {showCustomColor && (
                      <motion.input
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        type="text"
                        value={customColor}
                        onChange={e => setCustomColor(e.target.value)}
                        placeholder="e.g. Forest Green, Maroon, Sky Blue…"
                        className="w-full h-11 bg-[#1a1a1a] border border-white/15 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/60 transition-colors"
                        autoFocus
                      />
                    )}
                  </div>
                )}

                {/* Gender */}
                <div>
                  <p className="text-sm font-bold text-white mb-3">Gender Type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {GENDERS.map(g => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                          gender === g
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "border-white/12 text-gray-400 hover:text-white hover:border-white/30 bg-white/3"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Per-size quantities */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-white">Size &amp; Quantity</p>
                    {totalQty > 0 && (
                      <span className="text-xs font-bold text-primary">
                        {totalQty} piece{totalQty !== 1 ? "s" : ""} selected
                      </span>
                    )}
                  </div>
                  <div className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden">
                    {T_SHIRT_SIZES.map((size, i) => (
                      <div
                        key={size}
                        className={`flex items-center justify-between px-4 py-3 transition-colors ${
                          sizeQtys[size] > 0 ? "bg-primary/6" : ""
                        } ${i !== T_SHIRT_SIZES.length - 1 ? "border-b border-white/6" : ""}`}
                      >
                        <span className={`w-12 text-sm font-extrabold ${sizeQtys[size] > 0 ? "text-white" : "text-gray-500"}`}>
                          {size}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSizeQty(size, sizeQtys[size] - 1)}
                            className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95"
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={sizeQtys[size] === 0 ? "" : sizeQtys[size]}
                            placeholder="0"
                            onChange={e => handleSizeInput(size, e.target.value)}
                            className="w-14 h-8 text-center bg-[#1e1e1e] border border-white/12 rounded-lg text-sm text-white font-bold outline-none focus:border-primary/60 transition-colors placeholder-gray-700"
                          />
                          <button
                            onClick={() => handleSizeQty(size, sizeQtys[size] + 1)}
                            className="w-8 h-8 rounded-lg bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {/* Total row */}
                    <div className="flex items-center justify-between px-4 py-3.5 bg-primary/10 border-t border-primary/20">
                      <span className="text-sm font-extrabold text-primary">Total Quantity</span>
                      <span className={`text-2xl font-extrabold transition-colors ${totalQty > 0 ? "text-white" : "text-gray-600"}`}>
                        {totalQty}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ═══════════ NON-T-SHIRT ═══════════ */}
            {!isTShirt && (
              <>
                {/* Colour / variant if available */}
                {details?.colors && details.colors.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-white mb-3">
                      Colour <span className="text-gray-500 font-normal">·</span>{" "}
                      <span className="text-primary">{details.colors[selectedColor]?.name ?? "Default"}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {details.colors.map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(i)}
                          title={c.name}
                          className={`w-9 h-9 rounded-full transition-all duration-200 ${
                            selectedColor === i
                              ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-black"
                              : "hover:scale-105 opacity-80 hover:opacity-100"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            border: c.border ? "2px solid rgba(255,255,255,0.35)" : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <p className="text-sm font-bold text-white mb-4">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQty(v => Math.max(1, v - 1))}
                      className="w-14 h-14 rounded-2xl bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      value={qty}
                      onChange={e => {
                        const n = parseInt(e.target.value, 10);
                        if (!isNaN(n) && n >= 1) setQty(n);
                        else if (e.target.value === "") setQty(1);
                      }}
                      className="flex-1 h-14 text-center bg-[#1a1a1a] border border-white/15 rounded-2xl text-2xl text-white font-extrabold outline-none focus:border-primary/60 transition-colors"
                    />
                    <button
                      onClick={() => setQty(v => v + 1)}
                      className="w-14 h-14 rounded-2xl bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Footer / Confirm ── */}
          <div className="flex-shrink-0 border-t border-white/8 px-6 py-5">
            <motion.button
              onClick={handleConfirm}
              disabled={!canConfirm}
              whileHover={canConfirm ? { scale: 1.02 } : {}}
              whileTap={canConfirm ? { scale: 0.97 } : {}}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200"
              style={
                canConfirm
                  ? { background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 24px rgba(229,62,62,0.4)" }
                  : { background: "#2a2a2a", cursor: "not-allowed", opacity: 0.5 }
              }
            >
              <ShoppingCart size={17} />
              {isTShirt
                ? canConfirm
                  ? `Add ${totalQty} Item${totalQty !== 1 ? "s" : ""} to Cart`
                  : "Select at least 1 size"
                : `Add ${qty} to Cart`
              }
            </motion.button>
            <p className="text-center text-xs text-gray-600 mt-3">
              Confirm your order via WhatsApp · No payment required now
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
