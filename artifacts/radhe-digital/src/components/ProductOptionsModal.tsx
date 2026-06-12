import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ImageOff, User, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919319903380";
const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];
const GENDERS = ["Men", "Women", "Unisex"];

export interface ProductVariant {
  id?: string;
  color: string;
  hex: string;
  border?: boolean;
}

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
  variants?: ProductVariant[];
  initialColorIndex?: number;
  originalImageUrl?: string;
  variantImageUrls?: (string | undefined)[];
  onClose: () => void;
}

export function ProductOptionsModal({
  product,
  categorySlug,
  categoryLabel,
  variants = [],
  initialColorIndex = 0,
  originalImageUrl,
  variantImageUrls = [],
  onClose,
}: Props) {
  const isTShirt = categorySlug === "t-shirts";

  const hasColors = variants.length > 0;
  const clampedInitial = !hasColors
    ? -1
    : initialColorIndex < 0
      ? -1
      : Math.min(initialColorIndex, variants.length - 1);

  const [selectedColor, setSelectedColor] = useState(clampedInitial);
  const [customColor, setCustomColor] = useState("");
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [gender, setGender] = useState("Unisex");
  const [sizeQtys, setSizeQtys] = useState<Record<string, number>>(
    Object.fromEntries(T_SHIRT_SIZES.map(s => [s, 0]))
  );
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});

  const totalQty = isTShirt
    ? Object.values(sizeQtys).reduce((a, b) => a + b, 0)
    : qty;

  const isOriginal = selectedColor < 0;

  const colorName = showCustomColor
    ? (customColor.trim() || "Custom Colour")
    : isOriginal
      ? ""
      : (variants[selectedColor]?.color ?? "");

  const colorHex = showCustomColor
    ? "#888"
    : isOriginal
      ? "#888"
      : (variants[selectedColor]?.hex ?? "#e53e3e");

  const total = product.price * totalQty;

  const previewImageUrl: string | undefined = (() => {
    if (showCustomColor) return originalImageUrl;
    if (!isOriginal && hasColors) {
      return variantImageUrls[selectedColor] ?? originalImageUrl;
    }
    return originalImageUrl;
  })();

  const previewLabel = showCustomColor
    ? (customColor.trim() ? `Custom: ${customColor.trim()}` : "Custom Colour")
    : isOriginal
      ? "Original Product"
      : (variants[selectedColor]?.color ?? "Original Product");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const validate = () => {
    const errs: { name?: string; mobile?: string } = {};
    if (!customerName.trim()) errs.name = "Please enter your name";
    if (!customerMobile.trim()) {
      errs.mobile = "Please enter your mobile number";
    } else if (!/^[6-9]\d{9}$/.test(customerMobile.trim())) {
      errs.mobile = "Enter a valid 10-digit Indian mobile number";
    }
    return errs;
  };

  const handleOrderViaWhatsApp = () => {
    if (totalQty === 0) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const divider = `━━━━━━━━━━━━━━`;

    const selectedOption = showCustomColor && customColor.trim()
      ? `${customColor.trim()} (Custom)`
      : isOriginal || !colorName
        ? "Original Product"
        : colorName;

    const sizeLines = isTShirt
      ? Object.entries(sizeQtys)
          .filter(([, q]) => q > 0)
          .map(([s, q]) => `  ${s}: ${q} pc${q !== 1 ? "s" : ""}`)
          .join("\n")
      : null;

    const imageUrl = previewImageUrl ?? "";

    const lines: string[] = [];

    lines.push(`🛍️ *NEW ORDER - RADHE DIGITAL*`);
    lines.push(``);
    lines.push(divider);
    lines.push(``);
    lines.push(`📦 *PRODUCT DETAILS*`);
    lines.push(``);
    lines.push(`*Product:*`);
    lines.push(`${product.name}`);
    lines.push(``);
    lines.push(`*Category:*`);
    lines.push(`${categoryLabel}`);
    lines.push(``);
    lines.push(`*Selected Option:*`);
    lines.push(`${selectedOption}`);
    lines.push(``);

    if (isTShirt) {
      lines.push(`*Gender:*`);
      lines.push(`${gender}`);
      lines.push(``);
      if (sizeLines) {
        lines.push(`*Sizes & Quantities:*`);
        lines.push(sizeLines);
        lines.push(``);
      }
    }

    lines.push(`*Quantity:*`);
    lines.push(`${totalQty} pc${totalQty !== 1 ? "s" : ""}`);
    lines.push(``);
    lines.push(`*Unit Price:*`);
    lines.push(`${product.priceLabel ?? `₹${product.price}`}`);
    lines.push(``);
    lines.push(`*Subtotal:*`);
    lines.push(`₹${total.toLocaleString("en-IN")}`);
    lines.push(``);
    lines.push(divider);
    lines.push(``);

    if (imageUrl) {
      lines.push(`🖼 *PRODUCT IMAGE*`);
      lines.push(``);
      lines.push(`*Image URL:*`);
      lines.push(imageUrl);
      lines.push(``);
      lines.push(divider);
      lines.push(``);
    }

    lines.push(`👤 *CUSTOMER DETAILS*`);
    lines.push(``);
    lines.push(`*Name:*`);
    lines.push(`${customerName.trim()}`);
    lines.push(``);
    lines.push(`*Mobile:*`);
    lines.push(`${customerMobile.trim()}`);
    lines.push(``);
    lines.push(divider);
    lines.push(``);
    lines.push(`💰 *ORDER SUMMARY*`);
    lines.push(``);
    lines.push(`*Total Amount:*`);
    lines.push(`₹${total.toLocaleString("en-IN")}`);
    lines.push(``);
    lines.push(divider);
    lines.push(``);
    lines.push(`Please confirm availability and payment details.`);
    lines.push(`Thank you! 🙏`);

    const msg = lines.join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    onClose();
  };

  const inputCls = (err?: string) =>
    `w-full h-11 px-3 rounded-xl border-2 text-sm outline-none transition-colors ${
      err
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#25D366]"
    }`;

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
          {/* Sticky header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest">{categoryLabel}</p>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{product.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-6">

            {/* ── Product Preview ── */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 pt-3 pb-1.5">
                Product Preview
              </p>
              <motion.div
                key={previewImageUrl ?? "no-img"}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="relative w-full bg-[#141414] overflow-hidden"
                style={{ aspectRatio: "16/9" }}
              >
                {previewImageUrl ? (
                  <img
                    src={previewImageUrl}
                    alt={`${product.name} – ${previewLabel}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <div
                      className="w-14 h-14 rounded-full opacity-80 flex items-center justify-center"
                      style={{ backgroundColor: isOriginal ? "#555" : colorHex }}
                    >
                      <ImageOff size={20} className="text-white opacity-60" />
                    </div>
                    <p className="text-xs text-gray-500">No image uploaded</p>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm">
                  {hasColors && !isOriginal && !showCustomColor && (
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 border border-white/30"
                      style={{ backgroundColor: colorHex }}
                    />
                  )}
                  <span className="text-[11px] font-semibold text-white">{previewLabel}</span>
                </div>
              </motion.div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-800 truncate">{product.name}</span>
                <span className="text-sm font-extrabold text-primary ml-3 flex-shrink-0">
                  {product.priceLabel ?? `₹${product.price}`}
                </span>
              </div>
            </div>

            {/* ── Colour selector ── */}
            {hasColors && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">
                  Colour:{" "}
                  <span className="text-gray-900">
                    {isOriginal ? "Not selected" : colorName}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2.5 mb-3">
                  {variants.map((v, i) => {
                    const isWhite = ["#ffffff", "#f5f5f5", "#FFFFFF"].includes(v.hex);
                    return (
                      <button
                        key={v.id ?? v.color}
                        onClick={() => { setSelectedColor(i); setShowCustomColor(false); }}
                        title={v.color}
                        className={`w-9 h-9 rounded-full transition-all duration-200 ${
                          !showCustomColor && !isOriginal && selectedColor === i
                            ? "ring-2 ring-[#C4962A] ring-offset-2 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: v.hex,
                          border: isWhite ? "2px solid rgba(0,0,0,0.15)" : "none",
                        }}
                      />
                    );
                  })}
                  <button
                    onClick={() => setShowCustomColor(v => !v)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                      showCustomColor
                        ? "border-[#C4962A] text-[#C4962A] bg-[#C4962A]/8"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
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

            {/* ── Gender (T-shirts only) ── */}
            {isTShirt && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Gender</p>
                <div className="flex gap-2">
                  {GENDERS.map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                        gender === g
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Sizes & Qty ── */}
            {isTShirt ? (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Sizes & Quantities</p>
                <div className="space-y-2">
                  {T_SHIRT_SIZES.map(size => (
                    <div
                      key={size}
                      className="flex items-center justify-between py-2 px-3 rounded-xl bg-gray-50 border border-gray-100"
                    >
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

            {/* ── Order Summary ── */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5 border border-gray-100">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Price per piece</span>
                <span className="font-semibold text-gray-900">{product.priceLabel ?? `₹${product.price}`}</span>
              </div>
              {hasColors && !isOriginal && !showCustomColor && colorName && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Colour</span>
                  <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                    <span
                      className="w-3 h-3 rounded-full inline-block border border-gray-200"
                      style={{ backgroundColor: colorHex }}
                    />
                    {colorName}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>Total pieces</span>
                <span className="font-semibold text-gray-900">{totalQty}</span>
              </div>
              <div className="border-t border-gray-200 pt-1.5 flex justify-between font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* ── Customer Details ── */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Your Details</p>
              <div className="space-y-3">
                <div>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      value={customerName}
                      onChange={e => { setCustomerName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
                      placeholder="Your full name"
                      className={`${inputCls(errors.name)} pl-9`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1 pl-1">{errors.name}</p>}
                </div>
                <div>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      value={customerMobile}
                      onChange={e => { setCustomerMobile(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, mobile: undefined })); }}
                      placeholder="10-digit mobile number"
                      inputMode="numeric"
                      className={`${inputCls(errors.mobile)} pl-9`}
                    />
                  </div>
                  {errors.mobile && <p className="text-xs text-red-500 mt-1 pl-1">{errors.mobile}</p>}
                </div>
              </div>
            </div>

            {/* ── Order via WhatsApp CTA ── */}
            <div className="pb-2">
              <motion.button
                onClick={handleOrderViaWhatsApp}
                disabled={totalQty === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: totalQty > 0 ? "linear-gradient(135deg,#25D366,#1ebe57)" : "#ccc",
                  boxShadow: totalQty > 0 ? "0 4px 18px rgba(37,211,102,0.35)" : "none",
                }}
              >
                <FaWhatsapp size={20} />
                {totalQty === 0
                  ? "Select quantity to continue"
                  : `Order via WhatsApp · ${totalQty} item${totalQty !== 1 ? "s" : ""}`}
              </motion.button>
              <p className="text-xs text-gray-400 text-center mt-3">
                No payment upfront · Complete your order on WhatsApp
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
