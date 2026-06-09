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
    color: "#f6e05e",
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
    color: "#fc8181",
  },
];

export default function CustomizePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="bg-[#0a0a0a] border-b border-white/8 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/10 mb-4">
            Step 1 of 2
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">What would you like to customize?</h1>
          <p className="text-gray-400 text-base">Choose a product category to get started.</p>
        </div>
      </section>

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
                className="group relative flex items-center gap-4 p-5 bg-[#111] border border-white/8 rounded-2xl text-left hover:border-white/20 hover:bg-[#161616] transition-all duration-200"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}
                >
                  <Icon size={22} style={{ color: cat.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-snug">{cat.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{cat.desc}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all duration-200 flex-shrink-0"
                />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-10 flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl p-4 max-w-lg mx-auto">
          <span className="text-primary text-lg flex-shrink-0">💡</span>
          <p className="text-gray-300 text-sm leading-relaxed">
            You can upload your own design <strong className="text-white">or</strong> describe what you want — our team will create it for you.
          </p>
        </div>
      </div>
    </div>
  );
}
