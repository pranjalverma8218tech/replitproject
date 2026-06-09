import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, Palette, MessageCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice, clearCart } = useCart();

  const buildWhatsApp = () => {
    if (items.length === 0) return "#";
    const lines = items.map((item, i) => {
      const custom = item.isCustomized && item.customization
        ? `\n   ↳ Customized | Color: ${item.customization.color ?? "-"} | Size: ${item.customization.size ?? "-"} | Qty: ${item.quantity}${item.customization.designDesc ? ` | Note: ${item.customization.designDesc}` : ""}`
        : `\n   ↳ As-Is | Qty: ${item.quantity}`;
      return `${i + 1}. ${item.productName} (${item.categoryLabel}) — ${item.priceLabel}/pc${custom}`;
    });
    const total = `₹${totalPrice.toLocaleString("en-IN")}`;
    const msg = `Hello Radhe Digital! 🛒 I'd like to place an order:\n\n${lines.join("\n\n")}\n\n*Total: ${total}*\n\nPlease confirm availability and share payment details. Thank you!`;
    return `https://wa.me/919319903380?text=${encodeURIComponent(msg)}`;
  };

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
            onClick={closeCart}
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
                  onClick={closeCart}
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
                        {/* Product colour swatch / icon */}
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

                          {/* Customization badge */}
                          {item.isCustomized ? (
                            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-primary bg-primary/12 border border-primary/25 px-2 py-0.5 rounded-full">
                              <Palette size={10} /> Customized Design
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-gray-400 bg-white/6 border border-white/10 px-2 py-0.5 rounded-full">
                              As-Is Purchase
                            </span>
                          )}

                          {/* Customization details */}
                          {item.isCustomized && item.customization && (
                            <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                              {item.customization.color && <span className="mr-3">Color: {item.customization.color}</span>}
                              {item.customization.size && <span className="mr-3">Size: {item.customization.size}</span>}
                              {item.customization.uploadedFileName && (
                                <span className="block text-green-500 truncate">📎 {item.customization.uploadedFileName}</span>
                              )}
                              {item.customization.customText && (
                                <span className="block text-gray-400 truncate">Text: "{item.customization.customText}"</span>
                              )}
                            </div>
                          )}

                          {/* Price + Qty */}
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
                {/* Order summary */}
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

                {/* WhatsApp checkout */}
                <a href={buildWhatsApp()} target="_blank" rel="noopener noreferrer" onClick={closeCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#25D366,#1da851)", boxShadow: "0 4px 18px rgba(37,211,102,0.3)" }}
                  >
                    <MessageCircle size={17} /> Confirm Order on WhatsApp <ArrowRight size={15} />
                  </motion.button>
                </a>
                <p className="text-center text-xs text-gray-600">No payment required now. Finalize details via WhatsApp.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
