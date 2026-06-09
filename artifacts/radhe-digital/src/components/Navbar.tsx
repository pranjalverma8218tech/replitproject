import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, X, Search, ShoppingCart, User, ChevronDown,
  Shirt, Coffee, HardHat, Pen, Award, Gift, Image,
  LogIn, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const PRODUCTS = [
  { icon: <Shirt size={16} />, label: "T-Shirts", href: "/categories/t-shirts" },
  { icon: <Coffee size={16} />, label: "Mugs", href: "/categories/mugs" },
  { icon: <HardHat size={16} />, label: "Caps", href: "/categories/caps" },
  { icon: <Pen size={16} />, label: "Pens", href: "/categories/pens" },
  { icon: <Award size={16} />, label: "Badges", href: "/categories/badges" },
  { icon: <Image size={16} />, label: "Photo Frames", href: "/categories/photo-frames" },
  { icon: <Gift size={16} />, label: "Corporate Gifts", href: "/categories/corporate-gifts" },
];

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/categories", hasDropdown: true },
  { name: "Customize", href: "/customize" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, toggleCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); setServicesOpen(false); }, [location]);

  const isActive = (href: string) => location === href;

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(5, 5, 5, 0.88)"
          : "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(20px) saturate(1.4)",
        WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        borderBottom: scrolled
          ? "1px solid rgba(229, 62, 62, 0.3)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Brand Logo (text only, compact) ── */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-xs leading-none">RD</span>
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight leading-none">
              Radhe <span className="text-primary">Digital</span>
            </span>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      servicesOpen
                        ? "bg-[#C4962A]/10 text-[#C4962A]"
                        : "text-gray-300 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.name}
                    <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 w-56 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: "rgba(12,12,12,0.95)",
                          backdropFilter: "blur(24px)",
                          border: "1px solid rgba(229,62,62,0.2)",
                          boxShadow: "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                        }}
                      >
                        <div className="p-2">
                          {PRODUCTS.map((s) => (
                            <Link
                              key={s.label}
                              href={s.href}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-primary/15 transition-all duration-150 group"
                            >
                              <span className="text-primary group-hover:scale-110 transition-transform duration-150">{s.icon}</span>
                              {s.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-[#C4962A] bg-[#C4962A]/10"
                      : "text-gray-300 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* ── Right Side Actions ── */}
          <div className="hidden lg:flex items-center gap-1">

            {/* Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mr-1"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                      placeholder="Search products..."
                      className="w-full h-9 bg-white/10 border border-white/15 rounded-lg px-3 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/50 transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-200"
                title="Search"
              >
                <Search size={17} />
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-all duration-200"
              title="Cart"
            >
              <ShoppingCart size={17} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Login */}
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/8 transition-all duration-200"
              title="Login / Signup"
            >
              <User size={15} />
              <span>Login</span>
            </button>

            {/* Start Designing CTA */}
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="ml-1 flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)",
                  boxShadow: "0 4px 18px rgba(229,62,62,0.35)",
                }}
              >
                Start Designing
              </motion.button>
            </Link>
          </div>

          {/* ── Mobile: cart + hamburger ── */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <ShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
            style={{
              background: "rgba(8,8,8,0.97)",
              backdropFilter: "blur(24px)",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

              {/* Mobile search */}
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-primary/40"
                />
              </div>

              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      {link.name}
                      <motion.span animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={15} />
                      </motion.span>
                    </button>
                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden ml-4 mt-1 space-y-0.5"
                        >
                          {PRODUCTS.map((s) => (
                            <Link
                              key={s.label}
                              href={s.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-primary/15 transition-colors"
                            >
                              <span className="text-primary">{s.icon}</span>
                              {s.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(link.href)
                        ? "text-[#C4962A] bg-[#C4962A]/10"
                        : "text-gray-300 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              )}

              {/* Mobile auth + CTA */}
              <div className="pt-3 border-t border-white/8 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-white/15 hover:border-white/30 hover:text-white transition-colors">
                    <LogIn size={15} /> Login
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-white/15 hover:border-white/30 hover:text-white transition-colors">
                    <UserPlus size={15} /> Sign Up
                  </button>
                </div>
                <Link href="/customize" onClick={() => setMobileOpen(false)}>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #e53e3e 0%, #c53030 100%)", boxShadow: "0 4px 18px rgba(229,62,62,0.3)" }}
                  >
                    Start Designing
                  </button>
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
