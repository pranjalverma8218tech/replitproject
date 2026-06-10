import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Trash2, Plus, Minus, ShoppingBag, Palette,
  MessageCircle, ArrowRight, ArrowLeft, User, Phone, MapPin, Mail, AlertCircle
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
    const e = validate(info);
    setErrors(e);
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    const updated = { ...info, [field]: value };
    setInfo(updated);
    if (touched[field]) {
      setErrors(validate(updated));
    }
  };

  const handleProceed = () => {
    setTouched({ name: true, phone: true, address: true, email: true });
    const e = validate(info);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep("checkout");
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
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
            className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col"
            style={{
              background: "rgba(10,10,10,0.97)",
              backdropFilter: "blur(24px)",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* ─── STEP 1: CART ─── */}
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <motion.div
                  key="cart-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={20} className="text-primary" />
                      <h2 className="text-white font-bold text-lg">Your Cart</h2>
                      {totalItems > 0 && (
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {items.length > 0 && (
                        <button
                          onClick={clearCart}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors font-semibold px-2 py-1 rounded"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={handleClose}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {items.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-16">
                        <ShoppingBag size={56} className="text-gray-700 mb-4" />
                        <p className="text-gray-400 font-semibold mb-2">Your cart is empty</p>
                        <p className="text-gray-600 text-sm">Browse our products and add items to get started.</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {items.map(item => (
                          <motion.div
                            key={item.cartId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.22 }}
                            className="bg-[#141414] border border-white/8 rounded-2xl p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary flex-shrink-0">
                                {item.isCustomized ? <Palette size={20} /> : <ShoppingBag size={18} />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className="text-white font-semibold text-sm leading-snug">{item.productName}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{item.categoryLabel}</p>
                                  </div>
                                  <button
                                    onClick={() => removeItem(item.cartId)}
                                    className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>

                                {item.isCustomized ? (
                                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-primary bg-primary/12 border border-primary/25 px-2 py-0.5 rounded-full">
                                    <Palette size={10} /> Customized Design
                                  </span>
                                ) : item.customization ? (
                                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                                    ✓ Options Selected
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-gray-400 bg-white/6 border border-white/10 px-2 py-0.5 rounded-full">
                                    Standard Purchase
                                  </span>
                                )}

                                {item.customization && (
                                  <div className="mt-2 space-y-0.5">
                                    {(item.customization.color || item.customization.gender) && (
                                      <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
                                        {item.customization.color && (
                                          <span className="flex items-center gap-1">
                                            {item.customization.colorHex && (
                                              <span className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block flex-shrink-0"
                                                style={{ backgroundColor: item.customization.colorHex }} />
                                            )}
                                            {item.customization.color}
                                          </span>
                                        )}
                                        {item.customization.gender && <span>{item.customization.gender}</span>}
                                        {item.customization.variant && <span>{item.customization.variant}</span>}
                                        {item.customization.size && !item.customization.sizeBreakdown && (
                                          <span>Size: {item.customization.size}</span>
                                        )}
                                      </div>
                                    )}
                                    {item.customization.sizeBreakdown && Object.keys(item.customization.sizeBreakdown).length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-1">
                                        {Object.entries(item.customization.sizeBreakdown).map(([size, count]) => (
                                          <span key={size} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/8 border border-white/10 text-gray-300">
                                            {size} × {count}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    {item.customization.uploadedFileName && (
                                      <p className="text-xs text-green-500 truncate">📎 {item.customization.uploadedFileName}</p>
                                    )}
                                    {item.customization.customText && (
                                      <p className="text-xs text-gray-400 truncate">Text: "{item.customization.customText}"</p>
                                    )}
                                    {item.customization.designDesc && (
                                      <p className="text-xs text-gray-500 truncate">Note: {item.customization.designDesc}</p>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-3">
                                  <p className="text-primary font-extrabold">{item.priceLabel}</p>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQty(item.cartId, item.quantity - 1)}
                                      className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                                    <button
                                      onClick={() => updateQty(item.cartId, item.quantity + 1)}
                                      className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/15 text-white flex items-center justify-center transition-colors"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-xs mt-1 text-right">
                                  Subtotal: <span className="text-gray-400 font-semibold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Footer */}
                  {items.length > 0 && (
                    <div className="flex-shrink-0 border-t border-white/8 px-6 py-5 space-y-4">
                      <div className="bg-[#141414] border border-white/8 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Items ({totalItems})</span>
                          <span className="text-white">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>Shipping</span>
                          <span className="text-green-400 font-semibold">Calculated at checkout</span>
                        </div>
                        <div className="border-t border-white/8 pt-2 flex justify-between font-extrabold text-base">
                          <span className="text-white">Total</span>
                          <span className="text-primary">₹{totalPrice.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("checkout")}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm"
                        style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 18px rgba(229,62,62,0.3)" }}
                      >
                        Proceed to Checkout <ArrowRight size={15} />
                      </motion.button>
                      <p className="text-center text-xs text-gray-600">No payment required now. Finalize details via WhatsApp.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ─── STEP 2: CUSTOMER DETAILS ─── */}
              {step === "checkout" && (
                <motion.div
                  key="checkout-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setStep("cart")}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <div>
                        <h2 className="text-white font-bold text-lg leading-none">Delivery Details</h2>
                        <p className="text-gray-500 text-xs mt-0.5">Step 2 of 2</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                    {/* Order summary chip */}
                    <div className="bg-[#141414] border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{totalItems} item{totalItems !== 1 ? "s" : ""}</span>
                      <span className="text-primary font-extrabold text-sm">₹{totalPrice.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                        <User size={12} /> Full Name <span className="text-primary">*</span>
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
                        <Phone size={12} /> Phone Number <span className="text-primary">*</span>
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
                        <MapPin size={12} /> Shipping Address <span className="text-primary">*</span>
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
                        <Mail size={12} /> Email <span className="text-gray-600 font-normal normal-case tracking-normal">(optional)</span>
                      </label>
                      <input
                        type="email"
                        value={info.email}
                        onChange={e => handleChange("email", e.target.value)}
                        placeholder="you@example.com"
                        className={fieldClass("email")}
                        autoComplete="email"
                      />
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      Your details will be shared with Radhe Digital via WhatsApp to process your order. We'll never share them elsewhere.
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex-shrink-0 border-t border-white/8 px-6 py-5 space-y-3">
                    <a
                      href={Object.keys(validate(info)).length === 0 ? buildWhatsApp() : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => {
                        const errs = validate(info);
                        if (Object.keys(errs).length > 0) {
                          e.preventDefault();
                          setTouched({ name: true, phone: true, address: true });
                          setErrors(errs);
                          return;
                        }
                        // Fire-and-forget: save order to database silently
                        const primaryItem = items[0];
                        createOrder({
                          customerName: info.name.trim(),
                          mobile: info.phone.trim(),
                          address: info.address.trim(),
                          email: info.email.trim() || undefined,
                          productName: items.length === 1
                            ? primaryItem.productName
                            : `${primaryItem.productName} (+${items.length - 1} more)`,
                          category: primaryItem.categoryLabel,
                          quantity: items.reduce((s, i) => s + i.quantity, 0),
                          total: totalPrice,
                          isWhatsapp: true,
                          notes: JSON.stringify(items.map(i => ({
                            name: i.productName, qty: i.quantity, price: i.price,
                            label: i.priceLabel, customization: i.customization ?? null,
                          }))),
                        }).catch(() => {/* silent — WhatsApp is the primary channel */});
                        setTimeout(handleClose, 400);
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm"
                        style={{ background: "linear-gradient(135deg,#25D366,#1da851)", boxShadow: "0 4px 18px rgba(37,211,102,0.3)" }}
                      >
                        <MessageCircle size={17} /> Confirm Order on WhatsApp <ArrowRight size={15} />
                      </motion.button>
                    </a>
                    <p className="text-center text-xs text-gray-600">No payment required now · Order confirmed via WhatsApp</p>
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
