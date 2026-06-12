import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shirt, Coffee, HardHat, Gift, ArrowRight, Sparkles, Check } from "lucide-react";

const CATEGORIES = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    desc: "Round neck, polo, oversized & more",
    icon: Shirt,
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.2)",
    products: "4 products",
  },
  {
    slug: "mugs",
    label: "Mugs",
    desc: "Ceramic, magic, travel mugs",
    icon: Coffee,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    products: "4 products",
  },
  {
    slug: "caps",
    label: "Caps",
    desc: "Baseball, snapback, dad caps",
    icon: HardHat,
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.2)",
    products: "4 products",
  },
  {
    slug: "hoodies",
    label: "Hoodies",
    desc: "Pullover, zip-up, fleece hoodies",
    icon: Shirt,
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.2)",
    products: "3 products",
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    desc: "Notebooks, pen sets, combos",
    icon: Gift,
    color: "#DC2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.2)",
    products: "4 products",
  },
];

const STEPS = [
  { n: "1", title: "Choose Category", desc: "Pick from T-Shirts, Mugs, Caps, Hoodies, or Corporate Gifts." },
  { n: "2", title: "Select Product", desc: "Choose a plain base product from our customization catalog." },
  { n: "3", title: "Add Your Design", desc: "Upload your logo/design or describe your idea — we print it." },
];

const FEATURES = [
  "No upfront payment",
  "Free design assistance",
  "Pan India delivery",
  "Bulk discounts available",
];

export default function CustomizePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FA" }}>

      {/* Hero */}
      <section className="bg-white border-b border-gray-200" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full text-white mb-5"
              style={{ background: "#DC2626" }}
            >
              <Sparkles size={11} /> Step 1 of 3
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              Customize <span style={{ color: "#DC2626" }}>Your Product</span>
            </h1>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed mb-8">
              Choose a product category below. We'll show you plain base products ready for your custom print, logo, or design.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FEATURES.map(f => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.2)", color: "#b91c1c" }}
                >
                  <Check size={11} /> {f}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Category Grid */}
        <div
          className="mb-10 rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.03) 100%)",
            border: "2px solid rgba(220,38,38,0.18)",
            boxShadow: "0 4px 24px rgba(220,38,38,0.08)",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span
              className="w-2 h-6 rounded-full"
              style={{ background: "#DC2626" }}
            />
            <p className="text-sm font-extrabold uppercase tracking-widest" style={{ color: "#DC2626" }}>
              Select a Category
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.button
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  onClick={() => setLocation(`/customize/${cat.slug}`)}
                  className="group relative flex items-center gap-4 p-5 rounded-2xl border bg-white text-left transition-all duration-200"
                  style={{
                    borderColor: "#e5e7eb",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px ${cat.bg.replace("0.08", "0.25")}`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: cat.bg, border: `1px solid ${cat.border}` }}
                  >
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-extrabold text-base leading-snug">{cat.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{cat.desc}</p>
                    <p className="text-xs mt-1.5 font-bold" style={{ color: cat.color }}>{cat.products}</p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-1"
                    style={{ color: cat.color }}
                  />
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* How it works */}
        <div
          className="rounded-2xl bg-white border border-gray-200 p-7"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
        >
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6 text-center">
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {STEPS.map(item => (
              <div key={item.n} className="flex gap-4">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5 text-white"
                  style={{ background: "#DC2626", boxShadow: "0 4px 12px rgba(220,38,38,0.35)" }}
                >
                  {item.n}
                </span>
                <div>
                  <p className="text-gray-900 font-extrabold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div
          className="mt-5 flex items-start gap-3 rounded-2xl p-4 border bg-white"
          style={{ borderColor: "rgba(220,38,38,0.2)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <span className="text-lg flex-shrink-0" style={{ color: "#DC2626" }}>💡</span>
          <p className="text-gray-600 text-sm leading-relaxed">
            You can upload your own design <strong className="text-gray-900">or</strong> just describe what you want — our design team will create it for you at <strong className="text-gray-900">no extra charge</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
