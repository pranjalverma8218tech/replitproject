import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, Truck, HeadphonesIcon, Package, Star, ArrowRight,
  Shield, Zap, Users, Award, CheckCircle, ChevronDown, ChevronUp,
  MessageCircle, Palette, Clock, TrendingUp, BadgeCheck, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@assets/f6e27559-1690-4a6b-8f98-a83af78055c3_1780679869972.png";

/* ─── SVG Product Illustrations ─── */

function TshirtSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <path d="M60 50 L40 80 L65 85 L65 155 L135 155 L135 85 L160 80 L140 50 L115 65 C110 68 90 68 85 65 Z" fill={color} opacity="0.9" />
      <rect x="82" y="90" width="36" height="28" rx="4" fill="white" opacity="0.15" />
      <text x="100" y="108" textAnchor="middle" fill="white" fontSize="10" fontFamily="sans-serif" fontWeight="bold">PRINT</text>
    </svg>
  );
}

function MugSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <rect x="55" y="65" width="90" height="100" rx="10" fill="white" opacity="0.1" stroke="white" strokeWidth="2" />
      <rect x="58" y="68" width="84" height="94" rx="8" fill={color} opacity="0.85" />
      <path d="M145 90 Q168 90 168 110 Q168 130 145 130" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
      <rect x="68" y="100" width="54" height="18" rx="4" fill="white" opacity="0.25" />
      <text x="95" y="112" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif" fontWeight="bold">RADHE</text>
      <rect x="55" y="160" width="90" height="6" rx="3" fill="white" opacity="0.3" />
    </svg>
  );
}

function CapSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <ellipse cx="100" cy="130" rx="65" ry="12" fill={color} opacity="0.3" />
      <path d="M45 120 Q45 75 100 70 Q155 75 155 120 Z" fill={color} opacity="0.9" />
      <path d="M45 120 Q30 120 28 115 Q26 108 45 118" fill={color} opacity="0.7" />
      <rect x="80" y="90" width="40" height="22" rx="4" fill="white" opacity="0.2" />
      <text x="100" y="104" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">RD</text>
      <rect x="45" y="118" width="110" height="6" rx="3" fill="#333" />
    </svg>
  );
}

function PenSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <rect x="88" y="30" width="24" height="130" rx="12" fill={color} opacity="0.9" />
      <rect x="90" y="32" width="8" height="126" rx="4" fill="white" opacity="0.12" />
      <polygon points="88,160 112,160 100,178" fill="#aaa" />
      <polygon points="96,170 104,170 100,178" fill="#666" />
      <rect x="88" y="28" width="24" height="16" rx="8" fill="#555" />
      <rect x="90" y="80" width="20" height="4" rx="2" fill="white" opacity="0.3" />
      <rect x="90" y="90" width="20" height="4" rx="2" fill="white" opacity="0.3" />
    </svg>
  );
}

function BadgeSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <rect x="50" y="70" width="100" height="80" rx="10" fill={color} opacity="0.9" />
      <rect x="85" y="50" width="30" height="25" rx="4" fill="#888" />
      <rect x="90" y="55" width="20" height="5" rx="2" fill="#666" />
      <circle cx="100" cy="100" r="22" fill="white" opacity="0.15" />
      <text x="100" y="97" textAnchor="middle" fill="white" fontSize="9" fontFamily="sans-serif" fontWeight="bold">RADHE</text>
      <text x="100" y="109" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif">DIGITAL</text>
      <rect x="65" y="132" width="70" height="6" rx="3" fill="white" opacity="0.25" />
    </svg>
  );
}

function GiftBoxSVG({ color = "#e53e3e" }: { color?: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      <rect width="200" height="200" rx="16" fill="#1a1a1a" />
      <rect x="45" y="100" width="110" height="75" rx="6" fill={color} opacity="0.9" />
      <rect x="40" y="80" width="120" height="26" rx="5" fill={color} />
      <rect x="93" y="80" width="14" height="95" fill="white" opacity="0.25" />
      <path d="M100 80 Q80 65 72 55 Q65 45 75 42 Q85 40 100 80" fill={color} opacity="0.8" />
      <path d="M100 80 Q120 65 128 55 Q135 45 125 42 Q115 40 100 80" fill={color} opacity="0.8" />
      <rect x="40" y="78" width="120" height="4" fill="white" opacity="0.2" />
    </svg>
  );
}

/* ─── Animated Product Showcase for Hero ─── */
function HeroProductShowcase() {
  const products = [
    { label: "T-Shirt", component: <TshirtSVG /> },
    { label: "Mug", component: <MugSVG /> },
    { label: "Cap", component: <CapSVG /> },
    { label: "Pen", component: <PenSVG /> },
    { label: "Badge", component: <BadgeSVG /> },
  ];
  return (
    <div className="relative flex items-center justify-center gap-3 flex-wrap">
      {products.map((p, i) => (
        <motion.div
          key={p.label}
          className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 + i * 0.12, ease: "easeOut" }}
          whileHover={{ y: -10, scale: 1.08 }}
          style={{ boxShadow: "0 8px 32px rgba(229,62,62,0.3), 0 2px 8px rgba(0,0,0,0.5)" }}
        >
          {p.component}
          <div className="bg-black/70 text-center py-1">
            <span className="text-white text-xs font-semibold">{p.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="border border-white/10 rounded-xl overflow-hidden mb-3"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-[#141414] hover:bg-[#1e1e1e] transition-colors"
      >
        <span className="text-white font-semibold text-base pr-4">{q}</span>
        <span className="text-primary flex-shrink-0">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 py-5 text-gray-400 leading-relaxed bg-[#0f0f0f] border-t border-white/10">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Best Sellers Carousel ─── */
function BestSellersCarousel() {
  const [active, setActive] = useState(0);
  const categories = [
    { label: "T-Shirts", icon: <TshirtSVG color="#e53e3e" />, items: ["Classic Round Neck", "Premium Polo", "Dry-Fit Sports Tee"] },
    { label: "Mugs", icon: <MugSVG color="#e53e3e" />, items: ["11oz White Mug", "Magic Colour-Change Mug", "Travel Tumbler"] },
    { label: "Caps", icon: <CapSVG color="#e53e3e" />, items: ["Snapback Cap", "Flexfit Cap", "Dad Hat"] },
    { label: "Corporate Gifts", icon: <GiftBoxSVG color="#e53e3e" />, items: ["Gift Hamper Set", "Branded Notebook Combo", "Executive Kit"] },
  ];
  const cat = categories[active];
  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center mb-10 flex-wrap">
        {categories.map((c, i) => (
          <button
            key={c.label}
            onClick={() => setActive(i)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 ${
              active === i
                ? "bg-primary text-white border-primary shadow-lg shadow-red-900/40"
                : "bg-transparent text-gray-400 border-white/20 hover:border-white/40 hover:text-white"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {cat.items.map((item, i) => (
            <div
              key={item}
              className="bg-[#141414] border border-white/8 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300"
              style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
            >
              <div className="aspect-square w-full p-6 flex items-center justify-center">
                <div className="w-28 h-28 rounded-xl overflow-hidden">{cat.icon}</div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f59e0b" className="text-yellow-400" />)}
                </div>
                <h4 className="text-white font-bold mb-1">{item}</h4>
                <p className="text-gray-500 text-sm mb-4">Starting from <span className="text-primary font-bold">₹99</span></p>
                <Link href="/customize">
                  <button className="w-full py-2 rounded-xl text-sm font-bold text-white bg-primary/20 hover:bg-primary border border-primary/30 hover:border-primary transition-all duration-300">
                    Customize Now
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Main Component ─── */
export default function HomePage() {
  const trustItems = [
    { icon: <Award size={18} />, label: "Premium Quality Printing" },
    { icon: <Truck size={18} />, label: "Fast Delivery Across India" },
    { icon: <Package size={18} />, label: "Bulk Orders Available" },
    { icon: <Palette size={18} />, label: "Design Assistance" },
    { icon: <Shield size={18} />, label: "Secure Ordering" },
  ];

  const categories = [
    { svg: <TshirtSVG />, title: "T-Shirt Printing", desc: "Bold, vivid prints on premium cotton and dry-fit fabrics. Perfect for events, teams & brands." },
    { svg: <MugSVG />, title: "Mug Printing", desc: "Custom ceramic mugs for gifting, promotions, and personal keepsakes." },
    { svg: <CapSVG />, title: "Cap Printing", desc: "Embroidered or printed caps that make your brand visible everywhere." },
    { svg: <PenSVG />, title: "Pen Printing", desc: "Elegant branded pens — ideal for office giveaways and promotional kits." },
    { svg: <BadgeSVG />, title: "Badge Printing", desc: "Crisp, durable badges for events, schools, ID cards, and corporate use." },
    { svg: <GiftBoxSVG />, title: "Corporate Gifts", desc: "Curated branded merchandise sets for businesses and special occasions." },
  ];

  const featuredProducts = [
    { svg: <TshirtSVG />, name: "Classic Round Neck Tee", price: "₹199", desc: "Soft, pre-shrunk cotton. Vivid print guaranteed." },
    { svg: <MugSVG />, name: "Magic Colour-Change Mug", price: "₹249", desc: "Reveals your design when filled with a hot drink." },
    { svg: <CapSVG />, name: "Snapback Branded Cap", price: "₹349", desc: "Embroidered logo cap with adjustable snap closure." },
    { svg: <GiftBoxSVG />, name: "Corporate Gift Hamper", price: "₹999", desc: "Curated box with tee, mug, pen, and badge." },
  ];

  const whyFeatures = [
    { icon: <Printer size={28} />, title: "HD Print Quality", desc: "State-of-the-art DTG and sublimation printing that delivers photographic-grade clarity." },
    { icon: <Truck size={28} />, title: "Fast Delivery", desc: "Pan-India delivery with 5–7 day standard and 2–3 day express shipping options." },
    { icon: <Palette size={28} />, title: "Custom Design Support", desc: "Our in-house designers assist you from concept to print — free of charge." },
    { icon: <TrendingUp size={28} />, title: "Bulk Order Discounts", desc: "Attractive tiered pricing for corporate orders of 50+ pieces." },
    { icon: <BadgeCheck size={28} />, title: "Premium Materials", desc: "We source only high-grade fabric, ceramics, and accessories for every product." },
    { icon: <Users size={28} />, title: "Trusted By Businesses", desc: "Over 5,000+ happy customers from startups, colleges, and Fortune 500 companies." },
  ];

  const steps = [
    { n: "01", icon: <Package size={32} />, title: "Choose Product", desc: "Browse our wide range of printable products and select the one that fits your needs." },
    { n: "02", icon: <Palette size={32} />, title: "Upload Design", desc: "Share your artwork, logo, or text. Our team will verify and prepare it for printing." },
    { n: "03", icon: <CheckCircle size={32} />, title: "Confirm Order", desc: "Review a digital mockup, confirm quantities, and complete secure payment." },
    { n: "04", icon: <Truck size={32} />, title: "Receive Delivery", desc: "We ship your premium printed merchandise right to your doorstep, anywhere in India." },
  ];

  const testimonials = [
    { name: "Rahul Verma", role: "College Event Coordinator", rating: 5, text: "Ordered 500 custom tees for our annual fest. Quality was outstanding and delivered 2 days before the deadline!" },
    { name: "Priya Sharma", role: "Small Business Owner", rating: 5, text: "Radhe Digital perfectly matched our brand colors. The polo shirts look incredibly professional. Will order again!" },
    { name: "Ankit Patel", role: "Fitness Club Manager", rating: 5, text: "The fabric quality is great for workouts, and the prints haven't faded at all. Best printing service in India." },
    { name: "Meera Nair", role: "HR Manager, TechCorp", rating: 5, text: "We ordered branded hampers for 200 employees. Everything from mugs to badges was spot-on. Excellent service!" },
    { name: "Suresh Kumar", role: "Marketing Director", rating: 5, text: "Bulk pen and badge order for our product launch. Delivered in 4 days with perfect branding. Highly recommend!" },
    { name: "Deepa Joshi", role: "Wedding Planner", rating: 5, text: "Custom return gifts for 150 guests — mugs and tees all beautifully done. Clients were absolutely thrilled!" },
  ];

  const faqs = [
    { q: "What is the minimum order quantity (MOQ)?", a: "We cater to everyone! You can order just 1 single item or place a bulk order of 1000+ pieces at special pricing." },
    { q: "How long does delivery take?", a: "Standard delivery takes 5–7 business days. For urgent requirements, we offer expedited 2–3 day shipping across India." },
    { q: "What products can you print on?", a: "We print on T-shirts, mugs, caps, pens, badges, notebooks, tote bags, corporate gift items, and more. Contact us for custom products." },
    { q: "What file formats do you accept for designs?", a: "We accept high-resolution PNG, JPG, and PDF files. For best results, we recommend PNGs with transparent backgrounds or vector PDFs." },
    { q: "Can I get a sample before placing a bulk order?", a: "Yes! We offer sample printing before bulk orders so you can approve the quality and design before full production." },
    { q: "How do I make a payment?", a: "Once your design is finalized via WhatsApp, our team will share a payment link or UPI details to confirm the order securely." },
  ];

  return (
    <div className="w-full bg-black">

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative bg-black text-white min-h-screen flex flex-col items-center justify-center overflow-hidden pt-8 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(229,62,62,0.12) 0%, transparent 65%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", bottom: "-10%", left: "10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(229,62,62,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "20%", right: "5%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(229,62,62,0.06) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        {/* Animated grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Logo */}
          <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden flex-shrink-0 relative"
              style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 7px rgba(229,62,62,0.7), 0 0 50px 12px rgba(229,62,62,0.4)" }}
            >
              <img src={logoImg} alt="Radhe Digital" className="w-full h-full object-cover" style={{ borderRadius: "50%" }} />
              <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "50%", background: "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)" }} />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div className="flex justify-center mb-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-primary/15 text-primary font-semibold text-sm border border-primary/30 backdrop-blur">
              <Zap size={14} /> India's Premier Custom Printing Brand
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[1.05]"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          >
            Print Your Ideas<br />
            <span className="text-primary">On Anything</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 1.1 }}
          >
            Premium Custom Printing for T-Shirts, Mugs, Caps, Pens, Badges, Corporate Gifts and More.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.25 }}
          >
            <Link href="/customize">
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Button size="lg" className="w-full sm:w-auto text-base font-bold h-14 px-10 bg-primary hover:bg-red-700 text-white border-0 shadow-xl shadow-red-900/30">
                  Start Customizing <ArrowRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/categories">
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-bold h-14 px-10 bg-transparent text-white border-white/40 hover:bg-white hover:text-black">
                  View Products
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Product Showcase */}
          <HeroProductShowcase />

          {/* Stats row */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
          >
            {[
              { num: "5000+", label: "Happy Customers" },
              { num: "10+", label: "Product Categories" },
              { num: "Pan-India", label: "Delivery" },
              { num: "MOQ 1", label: "Min. Order" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-extrabold text-primary">{s.num}</p>
                <p className="text-gray-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════ TRUST BAR ═══════════════════════════════ */}
      <section className="bg-primary py-4 overflow-hidden">
        <div className="flex items-center gap-0" style={{ animation: "trustScroll 20s linear infinite" }}>
          {[...Array(3)].flatMap((_, rep) =>
            [
              { icon: <Award size={16} />, label: "Premium Quality Printing" },
              { icon: <Truck size={16} />, label: "Fast Delivery Across India" },
              { icon: <Package size={16} />, label: "Bulk Orders Available" },
              { icon: <Palette size={16} />, label: "Design Assistance" },
              { icon: <Shield size={16} />, label: "Secure Ordering" },
            ].map((item, i) => (
              <div key={`trust-${rep}-${i}`} className="flex items-center gap-2 px-8 py-2 text-white font-semibold text-sm whitespace-nowrap">
                {item.icon}
                <span>{item.label}</span>
                <span className="ml-8 text-white/40">•</span>
              </div>
            ))
          )}
        </div>
        <style>{`
          @keyframes trustScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════ CATEGORIES ═══════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              All Categories
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Customize Anything <span className="text-primary">You Imagine</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">From a single personalized mug to a 1000-piece corporate order — we print everything with precision.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                className="group bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-400 cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(229,62,62,0.2), 0 4px 24px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)"; }}
              >
                <div className="aspect-video w-full overflow-hidden">{cat.svg}</div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-2">{cat.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{cat.desc}</p>
                  <Link href="/categories">
                    <button className="flex items-center gap-2 text-primary font-bold text-sm hover:text-white transition-colors">
                      Explore <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FEATURED PRODUCTS ═══════════════════════════════ */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(229,62,62,0.08) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              Popular Picks
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Popular <span className="text-primary">Custom Products</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Our most-loved items — customized by thousands of creators, businesses, and events.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p, i) => (
              <motion.div
                key={p.name}
                className="group bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(229,62,62,0.18), 0 4px 24px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)"; }}
              >
                <div className="aspect-square w-full relative overflow-hidden">
                  {p.svg}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">Best Seller</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-sm mb-3 leading-relaxed">{p.desc}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-primary font-extrabold text-lg">Starting {p.price}</span>
                    <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f59e0b" className="text-yellow-400" />)}</div>
                  </div>
                  <Link href="/customize">
                    <button className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/40">
                      Customize Now
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ BEST SELLERS CAROUSEL ═══════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              Trending Now
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Best <span className="text-primary">Selling Products</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">The top picks trusted by businesses, colleges, and event planners across India.</p>
          </motion.div>
          <BestSellersCarousel />
        </div>
      </section>

      {/* ═══════════════════════════════ WHY CHOOSE US ═══════════════════════════════ */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(229,62,62,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(229,62,62,0.05) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              Our Edge
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Why Choose <span className="text-primary">Radhe Digital?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">We don't just print — we deliver excellence. Here's what sets us apart from the rest.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                className="group bg-[#111] border border-white/8 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(229,62,62,0.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ HOW IT WORKS ═══════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Get your custom merchandise in just four easy steps.</p>
          </motion.div>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center text-primary relative z-10">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-black">{i + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ TESTIMONIALS ═══════════════════════════════ */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              Customer Love
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Loved by <span className="text-primary">Creators & Brands</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Real feedback from real customers who trust Radhe Digital.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="bg-[#111] border border-white/8 rounded-2xl p-7 hover:border-primary/25 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, s) => <Star key={s} size={16} fill="#f59e0b" className="text-yellow-400" />)}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-extrabold text-lg">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FAQ ═══════════════════════════════ */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-block text-xs font-bold tracking-[0.25em] uppercase text-primary mb-4 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              FAQs
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-4">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-gray-400 text-lg">Everything you need to know before placing your order.</p>
          </motion.div>

          <div>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FINAL CTA ═══════════════════════════════ */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(229,62,62,0.18) 0%, transparent 60%)", filter: "blur(40px)" }} />
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-8">
              <Printer size={32} />
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Ready To Bring Your<br /><span className="text-primary">Ideas To Life?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Join 5,000+ happy customers and start your custom printing journey with Radhe Digital today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customize">
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Button size="lg" className="w-full sm:w-auto text-base font-bold h-14 px-10 bg-primary hover:bg-red-700 text-white border-0 shadow-2xl shadow-red-900/40">
                    Start Customizing <ArrowRight size={18} className="ml-2" />
                  </Button>
                </motion.div>
              </Link>
              <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base font-bold h-14 px-10 bg-transparent text-white border-white/40 hover:bg-white hover:text-black">
                    <MessageCircle size={18} className="mr-2" /> Contact on WhatsApp
                  </Button>
                </motion.div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
