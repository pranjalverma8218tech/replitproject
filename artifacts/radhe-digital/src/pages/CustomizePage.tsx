import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shirt, Coffee, HardHat, Gift, ArrowRight, Sparkles } from "lucide-react";

const CATEGORIES = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    desc: "Round neck, polo, oversized & more",
    icon: Shirt,
    color: "#e53e3e",
    products: "4 products",
  },
  {
    slug: "mugs",
    label: "Mugs",
    desc: "Ceramic, magic, travel mugs",
    icon: Coffee,
    color: "#f6ad55",
    products: "4 products",
  },
  {
    slug: "caps",
    label: "Caps",
    desc: "Baseball, snapback, dad caps",
    icon: HardHat,
    color: "#4299e1",
    products: "4 products",
  },
  {
    slug: "hoodies",
    label: "Hoodies",
    desc: "Pullover, zip-up, fleece hoodies",
    icon: Shirt,
    color: "#a78bfa",
    products: "3 products",
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    desc: "Notebooks, pen sets, combos",
    icon: Gift,
    color: "#C4962A",
    products: "4 products",
  },
];

export default function CustomizePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Banner */}
      <section
        className="py-16 border-b border-white/8"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #110808 50%, #0a0a0a 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border mb-5"
              style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)", background: "rgba(196,150,42,0.1)" }}
            >
              <Sparkles size={12} /> Step 1 of 3
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Customize <span style={{ color: "#e53e3e" }}>Your Product</span>
            </h1>
            <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
              Choose a product category below. We'll show you plain base products ready for your custom print, logo, or design.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-6">
          Select a Category
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                onClick={() => setLocation(`/customize/${cat.slug}`)}
                className="group relative flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-250"
                style={{
                  background: "#111",
                  borderColor: "rgba(255,255,255,0.08)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${cat.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.4)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35` }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-snug">{cat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.desc}</p>
                  <p className="text-xs mt-1.5 font-semibold" style={{ color: cat.color }}>
                    {cat.products}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-1"
                  style={{ color: cat.color }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* How it works */}
        <div className="mt-12">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-widest mb-5 text-center">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: "1", title: "Pick a Category", desc: "Choose from T-Shirts, Mugs, Caps, Hoodies, or Corporate Gifts." },
              { step: "2", title: "Select a Product", desc: "Pick a plain base product from our customization catalog." },
              { step: "3", title: "Add Your Design", desc: "Upload your logo/design or describe what you want — we'll print it." },
            ].map(item => (
              <div
                key={item.step}
                className="flex gap-3 p-4 rounded-xl border border-white/8"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(229,62,62,0.2)", color: "#fc8181", border: "1px solid rgba(229,62,62,0.35)" }}
                >
                  {item.step}
                </span>
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-8 flex items-start gap-3 rounded-xl p-4 border"
          style={{ background: "rgba(196,150,42,0.06)", borderColor: "rgba(196,150,42,0.2)" }}
        >
          <span className="text-lg flex-shrink-0" style={{ color: "#C4962A" }}>💡</span>
          <p className="text-gray-400 text-sm leading-relaxed">
            You can upload your own design <strong className="text-white">or</strong> just describe what you want — our design team will create it for you at no extra charge.
          </p>
        </div>
      </div>
    </div>
  );
}
