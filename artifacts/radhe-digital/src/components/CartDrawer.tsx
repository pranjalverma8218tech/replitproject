import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Trash2, Plus, Minus, ShoppingCart, ShoppingBag,
  MessageCircle, ArrowRight, ArrowLeft, User, Phone, MapPin,
  Mail, AlertCircle, Package, Tag
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/admin/api";

type Step = "cart" | "checkout";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const EMPTY: CustomerInfo = { name: "", phone: "", address: "", email: "" };

function ProductImage({ src, alt, colorHex }: { src?: string; alt: string; colorHex?: string }) {
  const [errored, setErrored] = useState(false);

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: colorHex ? `${colorHex}22` : "rgba(229,62,62,0.1)" }}
    >
      <ShoppingBag
        size={22}
        style={{ color: colorHex ?? "#e53e3e", opacity: 0.7 }}
      />
    </div>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart();

  const [step, setStep] = useState<Step>("cart");
  const [info, setInfo] = useState<CustomerInfo>(EMPTY);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerInfo, boolean>>>({});

  const handleClose = () => {
    closeCart();
    setTimeout(() => { setStep("cart"); setInfo(EMPTY); setErrors({}); setTouched({}); }, 350);
  };

  const validate = (data: CustomerInfo) => {
    const e: Partial<CustomerInfo> = {};
    if (!data.name.trim()) e.name = "Full name is required";
    if (!data.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!data.address.trim()) e.address = "Shipping address is required";
    return e;
  };

  const handleBlur = (field: keyof CustomerInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate(info));
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    if (touched[field]) setErrors(validate(updated));
  };

  const buildWhatsApp = () => {
    if (items.length === 0) return "#";

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase();

    const productLines = items.map((item, i) => {
      const subtotal = (item.price * item.quantity).toLocaleString("en-IN");
      let optLine = "";
      const c = item.customization;
      if (c) {
        const parts: string[] = [];
        if (c.color) parts.push(`Colour: ${c.color}`);
        if (c.gender) parts.push(`Gender: ${c.gender}`);
        if (c.sizeBreakdown && Object.keys(c.sizeBreakdown).length > 0) {
          const sb = Object.entries(c.sizeBreakdown).map(([s, q]) => `${s}×${q}`).join(", ");
          parts.push(`Sizes: ${sb}`);
        } else if (c.size) {
          parts.push(`Size: ${c.size}`);
        }
        if (c.variant) parts.push(`Variant: ${c.variant}`);
        if (c.customText) parts.push(`Text: "${c.customText}"`);
        if (c.designDesc) parts.push(`Note: ${c.designDesc}`);
        if (c.uploadedFileName) parts.push(`Design File: ${c.uploadedFileName}`);
        if (parts.length > 0) optLine = `\n   ↳ ${parts.join(" | ")}`;
      }
      const label = item.isCustomized ? "Customized" : "Standard";
      return `${i + 1}. [${label}] ${item.productName} (${item.categoryLabel})\n   ↳ Qty: ${item.quantity} × ${item.priceLabel} = ₹${subtotal}${optLine}`;
    });

    const total = `₹${totalPrice.toLocaleString("en-IN")}`;
    const emailLine = info.email.trim() ? `📧 Email: ${info.email.trim()}` : "";

    const msg = [
      `🛍️ *New Order — Radhe Digital*`,
      ``,
      `👤 *Customer Name:* ${info.name.trim()}`,
      `📞 *Phone Number:* ${info.phone.trim()}`,
      `📍 *Shipping Address:* ${info.address.trim()}`,
      emailLine,
      ``,
      `📦 *Ordered Products:*`,
      ...productLines,
      ``,
      `💰 *Order Total: ${total}*`,
      `📅 *Order Date & Time:* ${dateStr}, ${timeStr}`,
      ``,
      `Please confirm availability and share payment & delivery details. Thank you!`,
    ].filter(line => line !== undefined && !(line === "" && emailLine === "" && false)).join("\n");

    return `https://wa.me/919319903380?text=${encodeURIComponent(msg)}`;
  };

  const fieldClass = (field: keyof CustomerInfo) =>
    `w-full h-11 bg-[#1a1a1a] border rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none transition-colors ${
      touched[field] && errors[field]
        ? "border-red-500 focus:border-red-400"
        : "border-white/15 focus:border-[#C4962A]/60"
    }`;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[70] flex flex-col"
            style={{
              background: "#0d0d0d",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "-12px 0 60px rgba(0,0,0,0.7)",
            }}
          >
            <AnimatePresence mode="wait">

              {/* ─── STEP 1: CART ─── */}
              {step === "cart" && (
                <motion.div
                  key="cart-step"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(229,62,62,0.12)", border: "1px solid rgba(229,62,62,0.2)" }}>
                        <ShoppingCart size={17} className="text-primary" />
                      </div>
                      <div>
                        <h2 className="text-white font-bold text-base leading-none">Shopping Cart</h2>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {totalItems === 0 ? "No items yet" : `${totalItems} item${totalItems !== 1 ? "s" : ""} added`}
                        </p>
                      </div>
                      {totalItems > 0 && (
                        <span
                          className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0"
                          style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)" }}
                        >
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {items.length > 0 && (
                        <button
                          onClick={clearCart}
                          className="text-[11px] text-gray-600 hover:text-red-400 transition-colors font-semibold px-2 py-1 rounded-lg hover:bg-red-500/10"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                    {items.length === 0 ? (
                      /* Empty state */
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                          style={{ background: "rgba(229,62,62,0.08)", border: "1px solid rgba(229,62,62,0.15)" }}
                        >
                          <ShoppingBag size={36} style={{ color: "rgba(229,62,62,0.5)" }} />
                        </div>
                        <p className="text-white font-bold text-lg mb-2">Your cart is empty</p>
                        <p className="text-gray-500 text-sm mb-8 max-w-[240px] leading-relaxed">
                          Browse our products and add items to get started.
                        </p>
                        <button
                          onClick={handleClose}
                          className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                          style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 18px rgba(229,62,62,0.3)" }}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {items.map(item => (
                          <motion.div
                            key={item.cartId}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                            transition={{ duration: 0.22 }}
                            className="relative rounded-2xl overflow-hidden"
                            style={{
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <div className="flex gap-3 p-3">
                              {/* Product image */}
                              <div
                                className="flex-shrink-0 w-[84px] h-[84px] rounded-xl overflow-hidden"
                                style={{
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  background: "rgba(255,255,255,0.04)",
                                }}
                              >
                                <ProductImage
                                  src={item.image}
                                  alt={item.productName}
                                  colorHex={item.customization?.colorHex}
                                />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                {/* Name + delete */}
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-white font-bold text-sm leading-snug line-clamp-2 flex-1">{item.productName}</p>
                                  <button
                                    onClick={() => removeItem(item.cartId)}
                                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 group"
                                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                                    title="Remove item"
                                  >
                                    <Trash2 size={13} className="text-red-400 group-hover:text-red-300 transition-colors" />
                                  </button>
                                </div>

                                {/* Category */}
                                <p className="text-gray-500 text-[11px] font-medium mb-2">{item.categoryLabel}</p>

                                {/* Variant badges */}
                                <div className="flex flex-wrap gap-1.5 mb-2.5">
                                  {item.customization?.color && (
                                    <span
                                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: "rgba(196,150,42,0.12)", border: "1px solid rgba(196,150,42,0.25)", color: "#C4962A" }}
                                    >
                                      {item.customization.colorHex && (
                                        <span
                                          className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                                          style={{ backgroundColor: item.customization.colorHex, border: "1px solid rgba(255,255,255,0.3)" }}
                                        />
                                      )}
                                      {item.customization.color}
                                    </span>
                                  )}
                                  {item.customization?.size && !item.customization.sizeBreakdown && (
                                    <span
                                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}
                                    >
                                      <Tag size={9} />
                                      {item.customization.size}
                                    </span>
                                  )}
                                  {item.customization?.gender && (
                                    <span
                                      className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
                                    >
                                      {item.customization.gender}
                                    </span>
                                  )}
                                  {item.isCustomized && (
                                    <span
                                      className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full"
                                      style={{ background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.2)", color: "#fc8181" }}
                                    >
                                      Custom Design
                                    </span>
                                  )}
                                </div>

                                {/* Size breakdown */}
                                {item.customization?.sizeBreakdown && Object.keys(item.customization.sizeBreakdown).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {Object.entries(item.customization.sizeBreakdown).map(([size, count]) => (
                                      <span
                                        key={size}
                                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                        style={{ background: "rgba(255,255,255,0.07)", color: "#d1d5db" }}
                                      >
                                        {size} ×{count}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Price row + qty controls */}
                                <div className="flex items-center justify-between mt-1">
                                  <div>
                                    <p className="text-white font-black text-sm" style={{ color: "#C4962A" }}>
                                      {item.priceLabel}
                                    </p>
                                    {item.quantity > 1 && (
                                      <p className="text-gray-600 text-[10px]">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")} total
                                      </p>
                                    )}
                                  </div>

                                  {/* Qty controls */}
                                  <div
                                    className="flex items-center rounded-xl overflow-hidden"
                                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                  >
                                    <button
                                      onClick={() => updateQty(item.cartId, item.quantity - 1)}
                                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span
                                      className="text-white font-bold text-sm w-8 text-center"
                                      style={{ background: "rgba(255,255,255,0.04)" }}
                                    >
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQty(item.cartId, item.quantity + 1)}
                                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Extra customization notes */}
                            {(item.customization?.customText || item.customization?.designDesc || item.customization?.uploadedFileName) && (
                              <div
                                className="px-3 pb-3 pt-0"
                              >
                                <div
                                  className="rounded-xl px-3 py-2 space-y-1"
                                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                  {item.customization?.uploadedFileName && (
                                    <p className="text-[11px] text-green-400 truncate">📎 {item.customization.uploadedFileName}</p>
                                  )}
                                  {item.customization?.customText && (
                                    <p className="text-[11px] text-gray-400 truncate">Text: "{item.customization.customText}"</p>
                                  )}
                                  {item.customization?.designDesc && (
                                    <p className="text-[11px] text-gray-500 truncate">Note: {item.customization.designDesc}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Footer summary + CTA */}
                  {items.length > 0 && (
                    <div
                      className="flex-shrink-0 px-4 py-4 space-y-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      {/* Summary card */}
                      <div
                        className="rounded-2xl p-4 space-y-2.5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Total Items</span>
                          <span className="text-gray-300 font-semibold">{totalItems}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Subtotal</span>
                          <span className="text-gray-300 font-semibold">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Shipping</span>
                          <span className="text-green-400 font-semibold text-xs">Calculated at checkout</span>
                        </div>
                        <div
                          className="flex justify-between font-black text-base pt-2"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <span className="text-white">Grand Total</span>
                          <span style={{ color: "#C4962A" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* Checkout button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("checkout")}
                        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-white text-sm"
                        style={{
                          background: "linear-gradient(135deg,#e53e3e 0%,#c53030 100%)",
                          boxShadow: "0 6px 24px rgba(229,62,62,0.35)",
                        }}
                      >
                        Proceed to Checkout <ArrowRight size={16} />
                      </motion.button>
                      <p className="text-center text-[11px] text-gray-600">
                        No payment required now · Finalize via WhatsApp
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── STEP 2: CUSTOMER DETAILS ─── */}
              {step === "checkout" && (
                <motion.div
                  key="checkout-step"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setStep("cart")}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <div>
                        <h2 className="text-white font-bold text-base leading-none">Delivery Details</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Step 2 of 2</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" style={{ scrollbarWidth: "none" }}>

                    {/* Order summary chip */}
                    <div
                      className="rounded-2xl px-4 py-3 flex items-center justify-between"
                      style={{ background: "rgba(196,150,42,0.07)", border: "1px solid rgba(196,150,42,0.2)" }}
                    >
                      <div className="flex items-center gap-2">
                        <Package size={14} style={{ color: "#C4962A" }} />
                        <span className="text-gray-400 text-sm">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                      </div>
                      <span className="font-black text-sm" style={{ color: "#C4962A" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        <User size={11} /> Full Name <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        value={info.name}
                        onChange={e => handleChange("name", e.target.value)}
                        onBlur={() => handleBlur("name")}
                        placeholder="e.g. Rahul Sharma"
                        className={fieldClass("name")}
                        autoComplete="name"
                      />
                      {touched.name && errors.name && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                          <AlertCircle size={11} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        <Phone size={11} /> Phone Number <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        value={info.phone}
                        onChange={e => handleChange("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        placeholder="e.g. 9876543210"
                        className={fieldClass("phone")}
                        autoComplete="tel"
                        inputMode="numeric"
                        maxLength={10}
                      />
                      {touched.phone && errors.phone && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                          <AlertCircle size={11} /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        <MapPin size={11} /> Shipping Address <span className="text-primary">*</span>
                      </label>
                      <textarea
                        value={info.address}
                        onChange={e => handleChange("address", e.target.value)}
                        onBlur={() => handleBlur("address")}
                        placeholder="House/Flat No., Street, City, State, PIN code"
                        rows={3}
                        className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none ${
                          touched.address && errors.address
                            ? "border-red-500 focus:border-red-400"
                            : "border-white/15 focus:border-[#C4962A]/60"
                        }`}
                        autoComplete="street-address"
                      />
                      {touched.address && errors.address && (
                        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                          <AlertCircle size={11} /> {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Email (optional) */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        <Mail size={11} /> Email <span className="text-gray-600 font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={info.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="e.g. rahul@email.com"
                        className={fieldClass("email")}
                        autoComplete="email"
                      />
                    </div>

                    {/* Items recap */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Order</p>
                      {items.map(item => (
                        <div
                          key={item.cartId}
                          className="flex items-center gap-3 p-2.5 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                          >
                            <ProductImage src={item.image} alt={item.productName} colorHex={item.customization?.colorHex} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold truncate">{item.productName}</p>
                            <p className="text-gray-500 text-[11px]">Qty {item.quantity}</p>
                          </div>
                          <p className="text-xs font-black flex-shrink-0" style={{ color: "#C4962A" }}>
                            ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA */}
                  <div
                    className="flex-shrink-0 px-5 py-4 space-y-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="flex justify-between font-black text-base px-1"
                    >
                      <span className="text-gray-400">Total</span>
                      <span style={{ color: "#C4962A" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <motion.a
                      href={buildWhatsApp()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        try {
                          await createOrder({
                            customerName: info.name,
                            customerPhone: info.phone,
                            customerAddress: info.address,
                            customerEmail: info.email || undefined,
                            items: items.map(i => ({
                              productId: i.productId,
                              productName: i.productName,
                              categorySlug: i.categorySlug,
                              categoryLabel: i.categoryLabel,
                              quantity: i.quantity,
                              price: i.price,
                              priceLabel: i.priceLabel,
                              isCustomized: i.isCustomized,
                              customization: i.customization,
                            })),
                            totalAmount: totalPrice,
                          });
                        } catch {}
                        setTimeout(() => { clearCart(); handleClose(); }, 600);
                      }}
                      className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-white text-sm no-underline"
                      style={{
                        background: "linear-gradient(135deg,#25D366 0%,#1aae55 100%)",
                        boxShadow: "0 6px 24px rgba(37,211,102,0.3)",
                      }}
                    >
                      <MessageCircle size={18} />
                      Confirm Order on WhatsApp
                    </motion.a>
                    <p className="text-center text-[11px] text-gray-600">
                      You'll be redirected to WhatsApp to finalize your order
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
