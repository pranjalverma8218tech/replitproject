import React, { createContext, useContext, useState, useCallback } from "react";

export interface CartCustomization {
  color?: string;
  colorHex?: string;
  size?: string;
  sizeBreakdown?: Record<string, number>;
  gender?: string;
  variant?: string;
  quantity?: number;
  position?: string;
  designDesc?: string;
  uploadedFileName?: string;
  customText?: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  categorySlug: string;
  categoryLabel: string;
  price: number;
  priceLabel: string;
  isCustomized: boolean;
  customization?: CartCustomization;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalPrice: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Adds item AND opens the cart drawer. */
  addItem: (item: Omit<CartItem, "cartId">) => void;
  /** Adds item silently — does NOT open the cart drawer. Use for Buy Now / direct Add to Cart. */
  addItemSilent: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

let idCounter = 0;
function genId() {
  return `cart-${Date.now()}-${++idCounter}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(v => !v), []);

  const addItem = useCallback((item: Omit<CartItem, "cartId">) => {
    setItems(prev => [...prev, { ...item, cartId: genId() }]);
    setIsOpen(true);
  }, []);

  const addItemSilent = useCallback((item: Omit<CartItem, "cartId">) => {
    setItems(prev => [...prev, { ...item, cartId: genId() }]);
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems(prev => prev.filter(i => i.cartId !== cartId));
  }, []);

  const updateQty = useCallback((cartId: string, qty: number) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, totalItems, totalPrice, openCart, closeCart, toggleCart, addItem, addItemSilent, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
