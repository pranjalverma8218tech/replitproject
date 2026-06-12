import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { CATEGORY_DETAILS } from "@/data/productDetails";
import { useCart } from "@/context/CartContext";

const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Unisex"];

interface ProductLike {
  id: string;
  name: string;
  price: number;
  priceLabel?: string;
}

interface Props {
  product: ProductLike;
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
    ? "#888"
    : (details?.colors[selectedColor]?.hex ?? "#e53e3e");

  const total = product.price * totalQty;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleAddToCart = () => {
    if (totalQty === 0) return;
    if (isTShirt) {
      Object.entries(sizeQtys).forEach(([size, q]) => {
        if (q > 0) {
          addItem({
            id: `${product.id}-${size}-${colorName}`,
            name: product.name,
            price: product.price,
            quantity: q,
            category: categoryLabel,
            customization: `${gender} · ${size} · ${colorName}`,
          });
        }
      });
    } else {
      addItem({
        id: `${product.id}-${colorName}`,
        name: product.name,
        price: product.price,
        quantity: qty,
        category: categoryLabel,
        customization: colorName !== "Default" ? colorName : undefined,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{ maxHeight: "90vh", overflowY: "auto" }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{categoryLabel}</p>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{product.name}</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Colour */}
            {details?.colors && details.colors.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Colour: <span className="text-gray-900">{colorName}</span>
                </p>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {details.colors.map((c, i) => (
                    <button
                      key={c.name}
                      onClick={() => { setSelectedColor(i); setShowCustomColor(false); }}
                      title={c.name}
                      className={`w-9 h-9 rounded-full transition-all duration-200 ${
                        !showCustomColor && selectedColor === i
                          ? "ring-2 ring-[#C4962A] ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.hex, border: c.border ? "2px solid rgba(0,0,0,0.15)" : "none" }}
                    />
                  ))}
                  <button
                    onClick={() => setShowCustomColor(v => !v)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      showCustomColor ? "border-[#C4962A] text-[#C4962A] bg-[#C4962A]/8" : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    + Custom
                  </button>
                </div>
                {showCustomColor && (
                  <input
                    value={customColor}
                    onChange={e => setCustomColor(e.target.value)}
                    placeholder="e.g. Royal Blue, #1a2b3c…"
                    className="w-full h-10 px-3 rounded-xl border-2 border-[#C4962A]/40 text-sm outline-none focus:border-[#C4962A]"
                    autoFocus
                  />
                )}
              </div>
            )}

            {/* Gender (T-shirts) */}
            {isTShirt && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Gender</p>
                <div className="flex gap-2">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        gender === g ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size + Qty (T-shirts) */}
            {isTShirt ? (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Sizes & Quantities</p>
                <div className="space-y-2">
                  {T_SHIRT_SIZES.map(size => (
                    <div key={size} className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100">
                      <span className="text-sm font-bold text-gray-700 w-8">{size}</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSizeQtys(prev => ({ ...prev, [size]: Math.max(0, (prev[size] ?? 0) - 1) }))}
                          className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
                          disabled={!sizeQtys[size]}
                        >
                          <Minus size={13} className="text-gray-600" />
                        </button>
                        <span className="text-sm font-extrabold w-6 text-center">{sizeQtys[size] ?? 0}</span>
                        <button
                          onClick={() => setSizeQtys(prev => ({ ...prev, [size]: (prev[size] ?? 0) + 1 }))}
                          className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
                        >
                          <Plus size={13} className="text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(v => Math.max(1, v - 1))}
                    className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Minus size={15} className="text-gray-600" />
                  </button>
                  <span className="text-xl font-extrabold text-gray-900 w-10 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(v => v + 1)}
                    className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <Plus size={15} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Price per piece</span>
                <span className="font-semibold text-gray-900">{product.priceLabel ?? `₹${product.price}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total pieces</span>
                <span className="font-semibold text-gray-900">{totalQty}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pb-2">
              <motion.button
                onClick={handleAddToCart}
                disabled={totalQty === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: totalQty > 0 ? "linear-gradient(135deg,#e53e3e,#c53030)" : "#ccc", boxShadow: totalQty > 0 ? "0 4px 18px rgba(229,62,62,0.3)" : "none" }}
              >
                <ShoppingCart size={18} />
                {totalQty === 0 ? "Select quantity to continue" : `Add ${totalQty} item${totalQty !== 1 ? "s" : ""} to Cart`}
              </motion.button>
              <p className="text-xs text-gray-400 text-center mt-3">
                No payment upfront · Confirm via WhatsApp
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
