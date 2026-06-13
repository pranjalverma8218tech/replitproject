import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu, X, Search, ShoppingCart, ChevronDown,
  Shirt, Coffee, HardHat, Pen, Award, Gift, Image, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const PRODUCTS = [
  { icon: Shirt,  label: "T-Shirts",       href: "/categories/t-shirts",       desc: "Custom printed tees" },
  { icon: Coffee, label: "Mugs",            href: "/categories/mugs",            desc: "Photo & logo mugs" },
  { icon: HardHat,label: "Caps",            href: "/categories/caps",            desc: "Embroidered & printed" },
  { icon: Pen,    label: "Pens",            href: "/categories/pens",            desc: "Branded writing pens" },
  { icon: Award,  label: "Badges",          href: "/categories/badges",          desc: "Custom metal & acrylic" },
  { icon: Image,  label: "Photo Frames",    href: "/categories/photo-frames",    desc: "Personalised frames" },
  { icon: Gift,   label: "Corporate Gifts", href: "/categories/corporate-gifts", desc: "Bulk gift solutions" },
];

const NAV_LINKS = [
  { name: "Home",      href: "/" },
  { name: "Products",  href: "/categories", hasDropdown: true },
  { name: "Customize", href: "/customize" },
  { name: "About",     href: "/about" },
  { name: "Contact",   href: "/contact" },
];

export function Navbar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen]             = useState(false);
  const [servicesOpen, setServicesOpen]         = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [scrolled, setScrolled]                 = useState(false);
  const [searchOpen, setSearchOpen]             = useState(false);
  const [searchQuery, setSearchQuery]           = useState("");
  const [lang, setLang]                         = useState<"EN" | "HI">("EN");
  const { totalItems, toggleCart }              = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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
        background: "#ffffff",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      {/* Top accent line */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#DC2626,#b91c1c,#DC2626)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#DC2626,#b91c1c)", boxShadow: "0 4px 12px rgba(220,38,38,0.35)" }}
            >
              <span className="text-white font-black text-sm leading-none">RD</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-xl tracking-tight text-gray-900">
                Radhe <span className="text-red-600">Digital</span>
              </span>
              <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Custom Printing Studio</span>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.name} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200"
                    style={{
                      color: servicesOpen ? "#DC2626" : "#374151",
                      background: servicesOpen ? "rgba(220,38,38,0.06)" : "transparent",
                    }}
                    onMouseEnter={e => { if (!servicesOpen) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                    onMouseLeave={e => { if (!servicesOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {link.name}
                    <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={15} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {servicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)",
                        }}
                      >
                        <div className="px-3 pt-3 pb-2">
                          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase px-2 mb-2">Browse Categories</p>
                          {PRODUCTS.map((s) => {
                            const Icon = s.icon;
                            return (
                              <Link
                                key={s.label}
                                href={s.href}
                                onClick={() => setServicesOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group"
                                style={{ color: "#374151" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.05)"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#374151"; }}
                              >
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-150"
                                  style={{ background: "rgba(220,38,38,0.08)" }}
                                >
                                  <Icon size={18} className="text-red-600" />
                                </div>
                                <div className="flex flex-col leading-tight">
                                  <span className="text-sm font-bold">{s.label}</span>
                                  <span className="text-xs text-gray-400">{s.desc}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="px-3 pb-3">
                          <Link
                            href="/categories"
                            onClick={() => setServicesOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-red-600 border-2 border-red-100 hover:bg-red-50 transition-all duration-150"
                          >
                            View All Products →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200"
                  style={{
                    color: isActive(link.href) ? "#ffffff" : "#374151",
                    background: isActive(link.href) ? "#DC2626" : "transparent",
                    boxShadow: isActive(link.href) ? "0 4px 12px rgba(220,38,38,0.3)" : "none",
                  }}
                  onMouseEnter={e => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.background = "#f9fafb"; }}
                  onMouseLeave={e => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>

          {/* ── Right Side Actions ── */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Search */}
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 220, opacity: 1 }}
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
                      className="w-full h-10 rounded-xl px-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors"
                      style={{ background: "#f3f4f6", border: "1.5px solid #e5e7eb" }}
                      onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = "#DC2626"; }}
                      onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ color: "#6b7280", background: "transparent" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
                title="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{ color: "#6b7280", background: "transparent" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; (e.currentTarget as HTMLElement).style.color = "#DC2626"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
              title="Cart"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  style={{ background: "#DC2626", boxShadow: "0 2px 8px rgba(220,38,38,0.5)" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div
              className="flex items-center rounded-xl overflow-hidden border"
              style={{ borderColor: "#e5e7eb" }}
            >
              {(["EN", "HI"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="px-3 py-2 text-xs font-black transition-all duration-200"
                  style={{
                    background: lang === l ? "#DC2626" : "transparent",
                    color: lang === l ? "#ffffff" : "#6b7280",
                  }}
                >
                  {l === "HI" ? "हिं" : "EN"}
                </button>
              ))}
            </div>

            {/* CTA */}
            <Link href="/customize">
              <motion.button
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#DC2626 0%,#b91c1c 100%)",
                  boxShadow: "0 4px 18px rgba(220,38,38,0.4)",
                  letterSpacing: "0.03em",
                }}
              >
                <Sparkles size={16} />
                CUSTOMIZE NOW
              </motion.button>
            </Link>
          </div>

          {/* ── Mobile: cart + hamburger ── */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleCart}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center"
                  style={{ background: "#DC2626" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
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
            style={{ background: "#ffffff", borderTop: "1px solid #f3f4f6" }}
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

              {/* Mobile search */}
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-11 rounded-xl pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none"
                  style={{ background: "#f3f4f6", border: "1.5px solid #e5e7eb" }}
                />
              </div>

              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <div key={link.name}>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-bold text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                    >
                      {link.name}
                      <motion.span animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={16} className="text-gray-400" />
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
                          {PRODUCTS.map((s) => {
                            const Icon = s.icon;
                            return (
                              <Link
                                key={s.label}
                                href={s.href}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Icon size={17} className="text-red-500 flex-shrink-0" />
                                {s.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3.5 rounded-xl text-[15px] font-bold transition-colors"
                    style={{
                      color: isActive(link.href) ? "#ffffff" : "#374151",
                      background: isActive(link.href) ? "#DC2626" : "transparent",
                    }}
                  >
                    {link.name}
                  </Link>
                )
              )}

              {/* Mobile CTA */}
              <div className="pt-3 border-t border-gray-100">
                <Link href="/customize" onClick={() => setMobileOpen(false)}>
                  <button
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black text-white"
                    style={{ background: "linear-gradient(135deg,#DC2626,#b91c1c)", boxShadow: "0 4px 18px rgba(220,38,38,0.35)" }}
                  >
                    <Sparkles size={16} />
                    CUSTOMIZE NOW
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
