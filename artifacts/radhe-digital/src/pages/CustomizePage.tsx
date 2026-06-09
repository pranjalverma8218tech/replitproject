import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shirt, Coffee, HardHat, Pen, Award, Image, Gift, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    slug: "t-shirts",
    label: "T-Shirts",
    desc: "Round neck, polo, sports & more",
    icon: Shirt,
    color: "#e53e3e",
  },
  {
    slug: "mugs",
    label: "Mugs",
    desc: "Photo mugs, magic mugs & more",
    icon: Coffee,
    color: "#f6ad55",
  },
  {
    slug: "caps",
    label: "Caps",
    desc: "Printed & embroidered caps",
    icon: HardHat,
    color: "#4299e1",
  },
  {
    slug: "pens",
    label: "Pens",
    desc: "Logo-printed pens for gifting",
    icon: Pen,
    color: "#68d391",
  },
  {
    slug: "badges",
    label: "Badges",
    desc: "Name badges, button badges",
    icon: Award,
    color: "#C4962A",
  },
  {
    slug: "photo-frames",
    label: "Photo Frames",
    desc: "Custom photo frames & prints",
    icon: Image,
    color: "#b794f4",
  },
  {
    slug: "corporate-gifts",
    label: "Corporate Gifts",
    desc: "Branded gift sets & combos",
    icon: Gift,
    color: "#C4962A",
  },
];

export default function CustomizePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Banner */}
      <section style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 100%)", borderBottom: "1px solid rgba(196,150,42,0.15)" }} className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border mb-4" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)", background: "rgba(196,150,42,0.1)" }}>
            Step 1 of 2
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">What would you like to customize?</h1>
          <p className="text-gray-400 text-base">Choose a product category to get started.</p>
        </div>
      </section>

      {/* Category Grid */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setLocation(`/customize/${cat.slug}`)}
                className="group relative flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl text-left transition-all duration-200"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(196,150,42,0.18)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-bold text-base leading-snug">{cat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.desc}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-1"
                  style={{ color: "#C4962A" }}
                />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 flex items-start gap-3 rounded-xl p-4 max-w-lg mx-auto border" style={{ background: "rgba(196,150,42,0.06)", borderColor: "rgba(196,150,42,0.2)" }}>
          <span className="text-lg flex-shrink-0" style={{ color: "#C4962A" }}>💡</span>
          <p className="text-gray-600 text-sm leading-relaxed">
            You can upload your own design <strong className="text-gray-900">or</strong> describe what you want — our team will create it for you.
          </p>
        </div>
      </div>
    </div>
  );
}
