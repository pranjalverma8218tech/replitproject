import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shirt, Coffee, HardHat, Pen, Award, Image, Gift } from "lucide-react";
import { CATEGORIES } from "@/data/products";

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
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Banner */}
      <section className="relative bg-[#0a0a0a] border-b border-white/8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(229,62,62,0.1) 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 text-center">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 px-3 py-1 rounded-full border border-primary/30 bg-primary/10">
            All Categories
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Customize <span className="text-primary">Anything You Imagine</span>
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
                  className="group bg-[#111] border border-white/8 rounded-2xl p-7 cursor-pointer hover:border-primary/40 transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -6 }}
                  style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(229,62,62,0.18)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.4)"; }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {ICONS[cat.slug]}
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">{cat.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-5">{cat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{cat.products.length} products</span>
                    <span className="flex items-center gap-1 text-primary text-sm font-bold group-hover:gap-2 transition-all duration-200">
                      Browse <ArrowRight size={15} />
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
