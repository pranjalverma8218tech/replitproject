import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Tag, ChevronRight } from "lucide-react";
import { getCategoryBySlug } from "@/data/customizeProducts";

export default function CustomizeCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();

  const cat = getCategoryBySlug(category ?? "");

  if (!cat) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Category not found.</p>
          <button
            onClick={() => setLocation("/customize")}
            className="text-red-400 underline text-sm"
          >
            Go back to categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <section
        className="border-b border-white/8 py-10"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #110808 100%)" }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setLocation("/customize")}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Categories
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setLocation("/customize")}>
              Customize
            </span>
            <ChevronRight size={12} />
            <span className="text-gray-400">{cat.label}</span>
          </div>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full border mb-3"
                style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)", background: "rgba(196,150,42,0.1)" }}
              >
                Step 2 of 3
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                Choose a <span style={{ color: "#e53e3e" }}>{cat.label}</span>
              </h1>
              <p className="text-gray-400 text-sm mt-2">{cat.description}</p>
            </div>
            <div className="text-right text-sm text-gray-600 hidden sm:block">
              <p>{cat.products.length} products available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {cat.products.map((product, i) => (
            <motion.button
              key={product.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              onClick={() => setLocation(`/customize/${cat.slug}/${product.slug}`)}
              className="group text-left rounded-2xl overflow-hidden border border-white/8 bg-[#111] hover:border-red-500/40 transition-all duration-300"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square bg-[#1a1a1a]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm text-white"
                      style={{ background: "#e53e3e", boxShadow: "0 4px 16px rgba(229,62,62,0.5)" }}
                    >
                      Customize <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-white font-bold text-sm leading-snug mb-1 group-hover:text-red-300 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag size={12} style={{ color: "#C4962A" }} />
                    <span className="font-black text-base" style={{ color: "#C4962A" }}>
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-600 text-xs">base price</span>
                  </div>
                  <span className="text-gray-600 group-hover:text-red-400 transition-colors">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info tip */}
        <div
          className="mt-10 flex items-start gap-3 rounded-xl p-4 max-w-xl mx-auto border"
          style={{ background: "rgba(196,150,42,0.06)", borderColor: "rgba(196,150,42,0.2)" }}
        >
          <span style={{ color: "#C4962A" }} className="text-lg flex-shrink-0">💡</span>
          <p className="text-gray-400 text-sm leading-relaxed">
            Select a plain product above to open the <strong className="text-white">Customization Studio</strong> where you can upload your logo, design, or describe what you need.
          </p>
        </div>
      </div>
    </div>
  );
}
