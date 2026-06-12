import React, { useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shirt, Coffee, HardHat, Pen, Award, Image, Gift } from "lucide-react";
import { CATEGORIES } from "@/data/products";
import { useApiProducts } from "@/hooks/useApiProducts";

const ICONS: Record<string, JSX.Element> = {
  "t-shirts": <Shirt size={28} />,
  "mugs": <Coffee size={28} />,
  "caps": <HardHat size={28} />,
  "pens": <Pen size={28} />,
  "badges": <Award size={28} />,
  "photo-frames": <Image size={28} />,
  "corporate-gifts": <Gift size={28} />,
};

export default function CategoriesPage() {
  const apiProducts = useApiProducts();

  const countBySlug = useMemo(() => {
    const map: Record<string, number> = {};
    Object.values(apiProducts).forEach(p => {
      if (p.status !== "Inactive" && p.categorySlug) {
        map[p.categorySlug] = (map[p.categorySlug] ?? 0) + 1;
      }
    });
    return map;
  }, [apiProducts]);

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Banner */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 100%)", borderBottom: "1px solid rgba(196,150,42,0.15)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(196,150,42,0.08) 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)", background: "rgba(196,150,42,0.1)" }}>
            All Categories
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Customize <span style={{ color: "#C4962A" }}>Anything You Imagine</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From a single personalised mug to 1000-piece corporate orders — browse our full range of printable products.
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/categories/${cat.slug}`}>
                <motion.div
                  className="group bg-white border border-gray-100 rounded-2xl p-7 cursor-pointer transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -6 }}
                  style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(196,150,42,0.15)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,150,42,0.35)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgb(243,244,246)";
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 16px rgba(229,62,62,0.3)" }}
                  >
                    {ICONS[cat.slug] ?? <Gift size={28} />}
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{cat.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-gray-400">
                      {countBySlug[cat.slug] !== undefined
                        ? `${countBySlug[cat.slug]} product${countBySlug[cat.slug] !== 1 ? "s" : ""}`
                        : "Browse products"}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold text-primary transition-all group-hover:gap-2">
                      View <ArrowRight size={14} />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
