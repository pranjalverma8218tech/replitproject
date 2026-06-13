import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronRight, ShoppingCart, Palette, ShoppingBag,
  Truck, Shield, Star, ArrowRight, Package, CheckCircle, Loader2
} from "lucide-react";
import { CATEGORY_MAP } from "@/data/products";
import { CATEGORY_DETAILS, type GalleryView } from "@/data/productDetails";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ProductOptionsModal } from "@/components/ProductOptionsModal";
import {
  useApiProducts, useApiProductsLoaded, getViewImages,
  type ApiProductData, type ApiProductImage
} from "@/hooks/useApiProducts";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Gallery SVGs ─── */
function GallerySVG({
  slug, angle, color = "#e53e3e", active = false
}: { slug: string; angle: string; color?: string; active?: boolean }) {
  const svgMap: Record<string, (c: string) => JSX.Element> = {
    "t-shirts": (c) => (
      <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
        <rect width="300" height="300" fill="#f5f5f5"/>
        <path d="M90 82 L57 132 L99 141 L99 237 L201 237 L201 141 L243 132 L210 82 L171 105 C162 109 138 109 129 105 Z" fill={c} opacity="0.92"/>
        <rect x="126" y="142" width="48" height="36" rx="6" fill="white" opacity="0.35"/>
      </svg>
    ),
    "mugs": (c) => (
      <svg viewBox="0 0 300 300" className="w-full h-full" fill="none">
        <rect width="300" height="300" fill="#f5f5f5"/>
        <rect x="78" y="93" width="132" height="150" rx="18" fill={c} opacity="0.88"/>
        <path d="M210 127 Q249 127 249 162 Q249 196 210 196" stroke="white" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.9"/>
        <rect x="96" y="145" width="78" height="24" rx="6" fill="white" opacity="0.3"/>
      </svg>
    ),
  };
  const fn = svgMap[slug] ?? svgMap["t-shirts"];
  return fn(color);
}

/* ─── Colour Swatch ─── */
function ColorSwatch({ hex, name, active, onClick, hasBorder }: {
  hex: string; name: string; active: boolean; onClick: () => void; hasBorder?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 focus:outline-none group"
      style={{ minWidth: 56 }}
    >
      <span
        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          background: active ? `${hex}22` : hex,
          border: active
            ? `3px solid #C4962A`
            : hasBorder
              ? `2px solid rgba(0,0,0,0.15)`
              : "2px solid transparent",
          boxShadow: active
            ? "0 0 0 3px rgba(196,150,42,0.18), 0 4px 14px rgba(0,0,0,0.08)"
            : "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        {active && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        className="text-[11px] font-semibold text-center leading-tight w-14 truncate"
        style={{ color: active ? "#C4962A" : "#6b7280" }}
      >
        {name}
      </span>
    </button>
  );
}

/* ─── Related Product Card ─── */
function RelatedCard({ product, slug, catLabel, index }: {
  product: ApiProductData; slug: string; catLabel: string; index: number;
}) {
  const imgs = getViewImages(product);
  const img = imgs[0]?.url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="group"
    >
      <Link href={`/categories/${slug}/${product.id}`}>
        <div className="bg-white rounded-xl overflow-hidden border border-white/10 cursor-pointer transition-all duration-300 hover:border-[#C4962A]/40 hover:shadow-xl">
          <div className="aspect-square bg-[#1a1a1a] overflow-hidden">
            {img
              ? <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl">👕</div>
            }
          </div>
          <div className="p-3">
            <p className="text-white font-semibold text-sm leading-snug truncate">{product.name}</p>
            <p className="text-[#C4962A] font-bold text-sm mt-0.5">{product.priceLabel ?? `₹${product.price}`}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ProductDetailPage() {
  const { slug, productId } = useParams<{ slug: string; productId: string }>();
  const [, setLocation] = useLocation();
  const categoryConfig = CATEGORY_MAP[slug ?? ""];
  const details = CATEGORY_DETAILS[slug ?? ""];
  const { t } = useLanguage();

  const { addItemSilent } = useCart();
  const { toast } = useToast();

  const [activeView, setActiveView] = useState(0);
  const [activeColor, setActiveColor] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const apiProducts = useApiProducts();
  const loaded = useApiProductsLoaded();

  const product: ApiProductData | undefined = productId ? apiProducts[productId] : undefined;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900">
        <Loader2 size={48} className="animate-spin text-primary opacity-60 mb-4" />
        <p className="text-gray-400 text-sm">{t.product.loading}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-900 px-4 text-center">
        <Package size={60} className="text-primary mb-6 opacity-50" />
        <h1 className="text-3xl font-extrabold mb-3">{t.product.notFound}</h1>
        <p className="text-gray-500 mb-8">{t.product.notFoundDesc}</p>
        <button onClick={() => setLocation(`/categories/${slug}`)} className="px-8 py-3 rounded-xl bg-primary text-white font-bold">
          {t.product.backTo} {categoryConfig?.label ?? t.product.products}
        </button>
      </div>
    );
  }

  const categoryLabel = categoryConfig?.label ?? product.category ?? t.product.products;
  const galleryViews = details?.galleryViews ?? [{ label: "View", angle: "front" as const }];
  const related = Object.values(apiProducts)
    .filter(p => p.categorySlug === slug && p.id !== productId && p.status !== "Inactive")
    .slice(0, 4);

  const apiVariants = (product.variants ?? []).filter((v: any) => v.color?.trim());
  const hasVariants = apiVariants.length > 0;

  const selectedVariant = (hasVariants && activeColor >= 0)
    ? apiVariants[Math.min(activeColor, apiVariants.length - 1)]
    : null;

  const productLevelImages: ApiProductImage[] = getViewImages(product);

  const realImages: ApiProductImage[] = (() => {
    if (!selectedVariant) return productLevelImages;
    const variantImgs = (selectedVariant.images ?? []).filter((i: ApiProductImage) => i.url);
    if (variantImgs.length === 0) return productLevelImages;
    const variantByView = new Map(variantImgs.map((i: ApiProductImage) => [i.view, i]));
    const merged = productLevelImages.map((img: ApiProductImage) => variantByView.get(img.view) ?? img);
    const productViews = new Set(productLevelImages.map((i: ApiProductImage) => i.view));
    const extras = variantImgs.filter((i: ApiProductImage) => !productViews.has(i.view));
    return [...merged, ...extras];
  })();

  const hasRealImages = realImages.length > 0;
  const activeRealImage = hasRealImages ? realImages[Math.min(activeView, realImages.length - 1)] : null;

  const selectedColorHex = (hasVariants && activeColor >= 0)
    ? (apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.hex ?? "#e53e3e")
    : "#e53e3e";

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          <Link href="/" className="hover:text-gray-700 transition-colors">{t.product.home}</Link>
          <ChevronRight size={13} />
          <Link href="/categories" className="hover:text-gray-700 transition-colors">{t.product.products}</Link>
          <ChevronRight size={13} />
          <Link href={`/categories/${slug}`} className="hover:text-gray-700 transition-colors">{categoryLabel}</Link>
          <ChevronRight size={13} />
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── LEFT: Gallery ── */}
          <div className="space-y-3">
            <motion.div
              key={`${activeView}-${activeColor}-${hasRealImages}`}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative aspect-square bg-[#141414] rounded-2xl overflow-hidden border border-gray-200"
              style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
            >
              {activeRealImage
                ? <img src={activeRealImage.url} alt={`${product.name} – ${activeRealImage.label}`} className="w-full h-full object-cover" loading="lazy" />
                : <GallerySVG slug={slug ?? ""} angle={galleryViews[activeView]?.angle ?? "front"} color={selectedColorHex} active />
              }
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white shadow-lg">
                  {product.badge}
                </span>
              )}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 border border-white/10 text-xs text-white font-semibold backdrop-blur-sm">
                {hasRealImages ? (activeRealImage?.label ?? "View") : (galleryViews[activeView]?.label)}
              </div>
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}>
              {hasRealImages
                ? realImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveView(i)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 ${
                        activeView === i ? "ring-2 shadow-lg" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={activeView === i ? { borderColor: "#C4962A", boxShadow: "0 2px 12px rgba(196,150,42,0.25)" } : {}}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))
                : galleryViews.map((view, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveView(i)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all duration-200 ${
                        activeView === i ? "ring-2 shadow-lg" : "border-gray-200 hover:border-gray-400"
                      }`}
                      style={activeView === i ? { borderColor: "#C4962A", boxShadow: "0 2px 12px rgba(196,150,42,0.25)" } : {}}
                    >
                      <GallerySVG slug={slug ?? ""} angle={view.angle} color={selectedColorHex} />
                    </button>
                  ))
              }
            </div>
          </div>

          {/* ── RIGHT: Overview ── */}
          <div className="space-y-6">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
                  {categoryLabel}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary text-white">{product.badge}</span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-xs ml-2">4.8 · Verified reviews</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{product.description ?? ""}</p>
            </div>

            <div className="flex items-end gap-3 py-4 border-y border-gray-200">
              <span className="text-primary font-extrabold text-3xl">
                {product.priceLabel ?? `₹${product.price}`}
              </span>
              <span className="text-gray-400 text-sm pb-1">{t.product.perPiecePrinting}</span>
            </div>

            {hasVariants && (() => {
              const colorCount = apiVariants.length;
              const selectedColorName = activeColor === -1
                ? null
                : (apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.color ?? null);
              return (
                <div className="space-y-3 py-1">
                  <div className="flex items-center gap-2">
                    <span className="block w-1 h-5 rounded-full flex-shrink-0" style={{ background: "#C4962A" }} />
                    <span className="text-sm font-bold text-gray-800">{t.product.availableColors}</span>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full ml-1"
                      style={{ background: "rgba(196,150,42,0.1)", color: "#C4962A", border: "1px solid rgba(196,150,42,0.2)" }}
                    >
                      {colorCount}
                    </span>
                    {(selectedColorName || activeColor === -1) && (
                      <span className="ml-auto text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        {selectedColorName && (
                          <span
                            className="w-3 h-3 rounded-full inline-block border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: apiVariants[Math.min(activeColor, apiVariants.length - 1)]?.hex ?? "#e53e3e" }}
                          />
                        )}
                        {selectedColorName ?? t.product.originalColor}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-4">
                    <button
                      onClick={() => { setActiveColor(-1); setActiveView(0); }}
                      className="flex flex-col items-center gap-2 focus:outline-none group"
                      style={{ minWidth: 56 }}
                    >
                      <span
                        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                        style={{
                          background: activeColor === -1 ? "rgba(196,150,42,0.12)" : "#f3f4f6",
                          border: activeColor === -1 ? "3px solid #C4962A" : "2px solid #e5e7eb",
                          boxShadow: activeColor === -1
                            ? "0 0 0 3px rgba(196,150,42,0.18), 0 4px 14px rgba(0,0,0,0.08)"
                            : "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                      >
                        {activeColor === -1 ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8.5L6.5 12L13 5" stroke="#C4962A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#9ca3af" />
                            <rect x="10" y="2" width="6" height="6" rx="1.5" fill="#9ca3af" opacity="0.6" />
                            <rect x="2" y="10" width="6" height="6" rx="1.5" fill="#9ca3af" opacity="0.6" />
                            <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#9ca3af" opacity="0.35" />
                          </svg>
                        )}
                      </span>
                      <span
                        className="text-[11px] font-semibold text-center leading-tight w-14"
                        style={{ color: activeColor === -1 ? "#C4962A" : "#6b7280" }}
                      >
                        {t.product.originalColor}
                      </span>
                    </button>

                    {apiVariants.map((v: any, i: number) => (
                      <ColorSwatch
                        key={v.id ?? i}
                        hex={v.hex}
                        hasBorder={["#ffffff", "#f5f5f5", "#FFFFFF"].includes(v.hex)}
                        name={v.color}
                        active={activeColor === i}
                        onClick={() => { setActiveColor(activeColor === i ? -1 : i); setActiveView(0); }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {details?.sizes && details.sizes.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-3">{t.product.availableSizes}</p>
                <div className="flex flex-wrap gap-2">
                  {details.sizes.map((s: string) => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-700 font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🎨", label: "Printing", value: details?.printingType ?? "Custom Print" },
                { icon: "🧵", label: "Material", value: details?.material ?? "Premium Material" },
                { icon: "🚚", label: "Delivery", value: details?.deliveryTime ?? "3–5 business days" },
                { icon: "✅", label: "Quality", value: "100% Checked & Packed" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-xl" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{item.label}</p>
                    <p className="text-xs text-gray-700 font-semibold leading-tight mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield size={13} className="text-green-500" /> {t.product.secureOrder}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Truck size={13} className="text-blue-500" /> {t.product.panIndiaDelivery}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={13} className="text-yellow-500" /> {t.product.qualityGuaranteed}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all text-sm"
                >
                  <ShoppingBag size={17} /> {t.product.buyNow}
                </motion.button>
                <motion.button
                  onClick={() => {
                    const apiVariantsNow = (product.variants ?? []).filter((v: any) => v.color?.trim());
                    const hasVar = apiVariantsNow.length > 0;
                    const cartImageUrl =
                      activeRealImage?.url
                      ?? productLevelImages[0]?.url
                      ?? undefined;
                    addItemSilent({
                      productId: product.id,
                      productName: product.name,
                      categorySlug: slug ?? "",
                      categoryLabel,
                      price: product.price,
                      priceLabel: product.priceLabel ?? `₹${product.price}`,
                      isCustomized: false,
                      quantity: 1,
                      image: cartImageUrl,
                      customization: (hasVar && activeColor >= 0)
                        ? {
                            color: apiVariantsNow[Math.min(activeColor, apiVariantsNow.length - 1)]?.color,
                            colorHex: apiVariantsNow[Math.min(activeColor, apiVariantsNow.length - 1)]?.hex,
                          }
                        : undefined,
                    });
                    toast({
                      title: t.product.addedToCart,
                      description: `${product.name} — ${t.product.addedToCartDesc}`,
                    });
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-gray-700 border border-gray-200 hover:border-[#C4962A] hover:text-[#C4962A] transition-all text-sm"
                >
                  <ShoppingCart size={17} /> {t.product.addToCart}
                </motion.button>
              </div>
              <motion.button
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("productId", product.id);
                  if (activeColor >= 0 && selectedVariant) {
                    params.set("variantId", selectedVariant.id ?? selectedVariant.color);
                    params.set("color", selectedVariant.color);
                    params.set("colorHex", selectedVariant.hex ?? "");
                    const variantImgUrl = activeRealImage?.url ?? productLevelImages[0]?.url ?? "";
                    if (variantImgUrl) params.set("imageUrl", variantImgUrl);
                  } else {
                    const imgUrl = activeRealImage?.url ?? productLevelImages[0]?.url ?? "";
                    if (imgUrl) params.set("imageUrl", imgUrl);
                  }
                  setLocation(`/customize/${slug}?${params.toString()}`);
                }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm"
                style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.3)" }}
              >
                <Palette size={17} /> {t.product.customizeNowFull}
                <ArrowRight size={15} />
              </motion.button>
            </div>

            <p className="text-xs text-gray-400 text-center">{t.product.noPaymentNote}</p>
          </div>
        </div>
      </div>

      {showModal && (() => {
        const originalImgUrl =
          activeRealImage?.url
          ?? productLevelImages[Math.min(activeView, Math.max(0, productLevelImages.length - 1))]?.url
          ?? productLevelImages[0]?.url;

        const currentAngle = galleryViews[activeView]?.angle;
        const varImgUrls: (string | undefined)[] = apiVariants.map((v: any) => {
          const imgs = (v.images ?? []).filter((i: ApiProductImage) => i.url);
          if (imgs.length === 0) return originalImgUrl;
          const angleMatch = imgs.find((i: ApiProductImage) => i.view === currentAngle);
          return ((angleMatch ?? imgs[0]).url as string) ?? originalImgUrl;
        });

        return (
          <ProductOptionsModal
            product={product}
            categorySlug={slug ?? ""}
            categoryLabel={categoryLabel}
            variants={apiVariants.map((v: any) => ({
              id: v.id,
              color: v.color,
              hex: v.hex,
              border: v.hex === "#ffffff" || v.hex === "#f5f5f5" || v.hex === "#FFFFFF",
            }))}
            initialColorIndex={activeColor}
            originalImageUrl={originalImgUrl}
            variantImageUrls={varImgUrls}
            onClose={() => setShowModal(false)}
          />
        );
      })()}

      {/* Specifications */}
      {details?.specs && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-xl font-extrabold mb-5 flex items-center gap-2 text-gray-900">
            <span className="w-1 h-6 rounded-full" style={{ background: "#C4962A" }} />
            {t.product.productSpecs}
          </h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
            {details.specs.map((spec: any, i: number) => (
              <div
                key={spec.label}
                className={`grid grid-cols-2 gap-2 px-4 py-3 ${i !== details.specs.length - 1 ? "border-b border-gray-100" : ""} ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <span className="text-gray-500 text-sm font-semibold">{spec.label}</span>
                <span className="text-gray-800 text-sm">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t py-14" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 100%)", borderColor: "rgba(196,150,42,0.15)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-7">
              <h2 className="text-xl font-extrabold flex items-center gap-2 text-white">
                <span className="w-1 h-6 rounded-full" style={{ background: "#C4962A" }} />
                {t.product.moreIn} {categoryLabel}
              </h2>
              <Link href={`/categories/${slug}`}>
                <button className="flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: "#C4962A" }}>
                  {t.product.viewAll} <ArrowRight size={14} />
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p, i) => (
                <RelatedCard
                  key={p.id}
                  product={p}
                  slug={slug ?? ""}
                  catLabel={categoryLabel}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
