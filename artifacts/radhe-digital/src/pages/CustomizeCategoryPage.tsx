import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Tag, ChevronRight, Sparkles, Loader2, AlertCircle, ImageOff } from "lucide-react";
import { useCustomizeCategoryProducts } from "@/hooks/useCustomizeApi";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomizeCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { products, categoryLabel, description, loading, error } = useCustomizeCategoryProducts(category ?? "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-red-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{t.customizeCat.loading}</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 text-lg mb-4">{error ?? t.customizeCat.notFound}</p>
          <button
            onClick={() => setLocation("/customize")}
            className="text-red-600 underline text-sm font-semibold"
          >
            {t.customizeCat.goBack}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FA" }}>

      {/* Header */}
      <section className="bg-white border-b border-gray-200" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => setLocation("/customize")}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm font-semibold mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> {t.customizeCat.backToCategories}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 flex-wrap">
            <span className="hover:text-red-600 cursor-pointer font-medium" onClick={() => setLocation("/customize")}>
              {t.nav.customize}
            </span>
            <ChevronRight size={12} />
            <span className="text-gray-700 font-semibold">{categoryLabel}</span>
          </div>

          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full text-white mb-3"
                style={{ background: "#DC2626" }}
              >
                <Sparkles size={11} /> {t.customizeCat.step2}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {t.customizeCat.chooseA} <span style={{ color: "#DC2626" }}>{categoryLabel}</span>
              </h1>
              {description && (
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{description}</p>
              )}
            </div>
            <div className="text-right text-sm text-gray-400 hidden sm:block">
              <span className="font-bold text-gray-700 text-lg">{products.length}</span> {t.customizeCat.productsAvailable}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <motion.button
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              onClick={() => setLocation(`/customize/${category}/${product.slug}`)}
              className="group text-left rounded-2xl overflow-hidden border bg-white transition-all duration-300"
              style={{
                borderColor: "#e5e7eb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#DC2626";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(220,38,38,0.14)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-square bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageOff size={32} className="text-gray-300" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm text-white"
                      style={{ background: "#DC2626", boxShadow: "0 4px 16px rgba(220,38,38,0.5)" }}
                    >
                      {t.customizeCat.customize} <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-900 font-bold text-sm leading-snug mb-1 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Tag size={12} style={{ color: "#DC2626" }} />
                    <span className="font-black text-base" style={{ color: "#DC2626" }}>
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-400 text-xs">{t.customizeCat.base}</span>
                  </div>
                  <span className="text-gray-300 group-hover:text-red-500 transition-colors">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Info tip */}
        <div
          className="mt-10 flex items-start gap-3 rounded-2xl p-4 max-w-xl mx-auto border bg-white"
          style={{ borderColor: "rgba(220,38,38,0.2)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <span style={{ color: "#DC2626" }} className="text-lg flex-shrink-0">💡</span>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t.customizeCat.tipText1} <strong className="text-gray-900">{t.customizeCat.tipStudio}</strong> {t.customizeCat.tipText2}
          </p>
        </div>
      </div>
    </div>
  );
}
