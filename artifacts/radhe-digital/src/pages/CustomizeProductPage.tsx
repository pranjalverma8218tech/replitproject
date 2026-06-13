import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, X, ArrowLeft, AlertTriangle,
  Sparkles, ChevronRight, Tag, FileText, MessageCircle,
  Minus, Plus, Image as ImageIcon, Award, Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useCustomizeProduct, type ColorVariant } from "@/hooks/useCustomizeApi";
import { useLanguage } from "@/context/LanguageContext";

/* ─── Print Position Card ─── */
function PositionCard({
  pos, active, onClick,
}: {
  pos: { id: string; label: string; desc: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 text-center transition-all duration-200"
      style={
        active
          ? { borderColor: "#DC2626", background: "rgba(220,38,38,0.06)", boxShadow: "0 0 0 3px rgba(220,38,38,0.12)" }
          : { borderColor: "#e5e7eb", background: "#ffffff" }
      }
    >
      <span
        className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0"
        style={{ borderColor: active ? "#DC2626" : "#d1d5db" }}
      >
        {active && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#DC2626" }} />}
      </span>
      <span className="text-base font-black" style={{ color: active ? "#DC2626" : "#374151" }}>
        {pos.label}
      </span>
      <p className="text-sm leading-snug" style={{ color: "#9ca3af" }}>{pos.desc}</p>
    </button>
  );
}

/* ─── Upload Box ─── */
function UploadBox({
  label, sublabel, file, preview, inputRef, accept, onFileChange, onRemove, icon: Icon, browseLabel,
}: {
  label: string;
  sublabel?: string;
  file: File | null;
  preview?: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  accept: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  icon?: React.ElementType;
  browseLabel: string;
}) {
  const IconComp = Icon ?? Upload;

  if (file) {
    return (
      <div className="rounded-xl overflow-hidden border-2 border-green-200 bg-green-50">
        {preview && (
          <img src={preview} alt="Uploaded" className="w-full max-h-36 object-contain bg-gray-50 p-3" />
        )}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-green-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
            <span className="text-green-700 text-sm font-semibold truncate max-w-[200px]">{file.name}</span>
          </div>
          <button
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors ml-2 flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label
      className="relative flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group"
      style={{ borderColor: "#d1d5db", background: "#fafafa" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "#DC2626";
        (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.03)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "#d1d5db";
        (e.currentTarget as HTMLElement).style.background = "#fafafa";
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
        style={{ background: "rgba(220,38,38,0.08)" }}
      >
        <IconComp size={22} style={{ color: "#DC2626" }} />
      </div>
      <div className="text-center">
        <p className="text-gray-800 font-bold text-base">{label}</p>
        {sublabel && <p className="text-gray-400 text-sm mt-0.5">{sublabel}</p>}
      </div>
      <span
        className="text-sm font-bold px-4 py-2 rounded-full transition-colors"
        style={{ background: "#DC2626", color: "#ffffff" }}
      >
        {browseLabel}
      </span>
      <input
        ref={inputRef}
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept={accept}
        onChange={onFileChange}
      />
    </label>
  );
}

/* ─── Section Card ─── */
function SectionCard({
  title, step, badge, badgeGreen, children, required, requiredLabel,
}: {
  title: string;
  step: number;
  badge?: string;
  badgeGreen?: boolean;
  children: React.ReactNode;
  required?: boolean;
  requiredLabel?: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#f3f4f6", background: "#fafafa" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-full text-base font-black flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: "#DC2626" }}
          >
            {step}
          </span>
          <h2 className="text-gray-900 font-black text-xl tracking-tight">{title}</h2>
          {required && (
            <span className="text-sm font-bold text-red-500">*{requiredLabel}</span>
          )}
        </div>
        {badge && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={
              badgeGreen
                ? { background: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.25)" }
                : { background: "#f3f4f6", color: "#9ca3af", border: "1px solid #e5e7eb" }
            }
          >
            {badge}
          </span>
        )}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

/* ─── Quantity Selector ─── */
function QuantitySelector({
  value, onChange, pieceSingular, piecePlural, minimumOrder, orTypeNumber, bulkMsg,
}: {
  value: number;
  onChange: (v: number) => void;
  pieceSingular: string;
  piecePlural: string;
  minimumOrder: string;
  orTypeNumber: string;
  bulkMsg: string;
}) {
  const [inputVal, setInputVal] = useState(String(value));

  const handleInput = (raw: string) => {
    setInputVal(raw);
    const n = parseInt(raw);
    if (!isNaN(n) && n >= 1) onChange(n);
  };

  const handleBlur = () => {
    const n = parseInt(inputVal);
    if (isNaN(n) || n < 1) {
      setInputVal("1");
      onChange(1);
    } else {
      setInputVal(String(n));
      onChange(n);
    }
  };

  const dec = () => {
    const next = Math.max(1, value - 1);
    onChange(next);
    setInputVal(String(next));
  };

  const inc = () => {
    const next = value + 1;
    onChange(next);
    setInputVal(String(next));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={dec}
          disabled={value <= 1}
          className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-all duration-150"
          style={{
            borderColor: value <= 1 ? "#e5e7eb" : "#DC2626",
            color: value <= 1 ? "#d1d5db" : "#DC2626",
            background: value <= 1 ? "#f9fafb" : "rgba(220,38,38,0.05)",
          }}
        >
          <Minus size={18} />
        </button>

        <input
          type="number"
          min={1}
          value={inputVal}
          onChange={e => handleInput(e.target.value)}
          onBlur={handleBlur}
          className="w-20 h-12 rounded-xl border-2 text-center font-black text-xl outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ borderColor: "#DC2626", color: "#111827" }}
        />

        <button
          onClick={inc}
          className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-all duration-150"
          style={{ borderColor: "#DC2626", color: "#DC2626", background: "rgba(220,38,38,0.05)" }}
        >
          <Plus size={18} />
        </button>

        <div className="ml-1">
          <p className="text-gray-900 font-bold text-base">{value} {value !== 1 ? piecePlural : pieceSingular}</p>
          <p className="text-gray-400 text-sm">{minimumOrder}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 5, 10, 25, 50, 100].map(n => (
          <button
            key={n}
            onClick={() => { onChange(n); setInputVal(String(n)); }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150"
            style={
              value === n
                ? { background: "#DC2626", color: "#ffffff", borderColor: "#DC2626" }
                : { background: "#ffffff", color: "#374151", borderColor: "#e5e7eb" }
            }
          >
            {n}
          </button>
        ))}
        <span className="px-3 py-1.5 text-xs text-gray-400 flex items-center">{orTypeNumber}</span>
      </div>

      {value >= 10 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(234,179,8,0.1)", color: "#b45309", border: "1px solid rgba(234,179,8,0.3)" }}
        >
          {bulkMsg}
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function CustomizeProductPage() {
  const { category, productSlug } = useParams<{ category: string; productSlug: string }>();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { product, loading, error } = useCustomizeProduct(category ?? "", productSlug ?? "");
  const { addItem, openCart } = useCart();

  const positions = product?.printPositions ?? [];
  const [printPosition, setPrintPosition] = useState<string>("front");

  useEffect(() => {
    if (product?.printPositions?.[0]?.id) {
      setPrintPosition(product.printPositions[0].id);
    }
  }, [product?.id]);

  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);

  useEffect(() => {
    if (product?.colorVariants?.length) {
      setSelectedVariant(product.colorVariants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product?.id]);

  const displayImage = selectedVariant?.image || product?.image || "";

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);

  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const backRef = useRef<HTMLInputElement>(null);

  const [designInstructions, setDesignInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"] as const;
  type Size = typeof SIZES[number];
  const [sizeQty, setSizeQty] = useState<Record<Size, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, "3XL": 0 });
  const isTShirt = category === "t-shirts";
  const totalSizeQty = isTShirt ? Object.values(sizeQty).reduce((a, b) => a + b, 0) : 0;
  const effectiveQty = isTShirt ? Math.max(1, totalSizeQty) : quantity;
  const sizeBreakdown = SIZES.filter(s => sizeQty[s] > 0).map(s => `${s}×${sizeQty[s]}`).join(", ");

  const setSizeAmount = (size: Size, val: string) => {
    const n = Math.max(0, parseInt(val) || 0);
    setSizeQty(prev => ({ ...prev, [size]: n }));
  };

  const [showError, setShowError] = useState(false);
  const [saved, setSaved] = useState(false);

  const makeFileHandler = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    setShowError(false);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = ev => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const makeRemoveHandler = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    ref: React.RefObject<HTMLInputElement>
  ) => () => {
    setFile(null);
    setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  const isBothSides = printPosition === "both";
  const hasLogo = !!logoFile;
  const hasDesign = !!(frontFile || backFile);
  const hasInstructions = designInstructions.trim().length > 0;
  const isValid = hasLogo || hasDesign || hasInstructions;

  const handleSaveToCart = () => {
    if (!isValid) { setShowError(true); return; }
    setShowError(false);
    const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;
    const designNote = isBothSides
      ? [frontFile && `Front: ${frontFile.name}`, backFile && `Back: ${backFile.name}`].filter(Boolean).join(" | ")
      : frontFile?.name ?? undefined;
    addItem({
      productId: `${category}-${productSlug}-custom`,
      productName: product?.name ?? "Custom Product",
      categorySlug: category ?? "",
      categoryLabel: product?.category ?? "",
      price: product?.price ?? 0,
      priceLabel: product?.priceLabel ?? "",
      isCustomized: true,
      quantity: effectiveQty,
      image: product?.image,
      customization: {
        printPosition: printPositionLabel,
        color: selectedVariant?.color,
        uploadedFileName: designNote,
        logoFileName: logoFile?.name,
        designInstructions: designInstructions.trim() || undefined,
        quantity: effectiveQty,
        size: isTShirt && sizeBreakdown ? sizeBreakdown : undefined,
      },
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); openCart(); }, 1600);
  };

  const handleWhatsApp = () => {
    if (!isValid) { setShowError(true); return; }
    const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;
    const lines = [
      `Hello Radhe Digital! I'd like to customize a product.`,
      ``,
      `*Product:* ${product?.name ?? category}`,
      selectedVariant ? `*Color:* ${selectedVariant.color}` : "",
      `*Print Position:* ${printPositionLabel}`,
      isTShirt && sizeBreakdown
        ? `*Sizes & Quantity:* ${sizeBreakdown} (Total: ${totalSizeQty} pcs)`
        : `*Quantity:* ${quantity}`,
      logoFile ? `*Logo:* ${logoFile.name}` : "",
      frontFile ? `*Design (Front):* ${frontFile.name}` : "",
      backFile ? `*Design (Back):* ${backFile.name}` : "",
      designInstructions.trim() ? `*Instructions:* ${designInstructions.trim()}` : "",
      `*Base Price:* ${product?.priceLabel ?? ""} × ${effectiveQty} = ₹${(product?.price ?? 0) * effectiveQty}`,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(lines)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-red-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">{t.customizeProd.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">{error ?? t.customizeProd.notFound}</p>
          <button onClick={() => setLocation("/customize")} className="text-red-600 underline text-sm font-semibold">
            {t.customizeProd.backToCustomize}
          </button>
        </div>
      </div>
    );
  }

  const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FA" }}>

      {/* ── Top Nav Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => setLocation(`/customize/${category}`)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">{t.customizeProd.back}</span>
          </button>
          <span className="text-gray-300">/</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <span className="hover:text-red-600 cursor-pointer font-medium" onClick={() => setLocation("/customize")}>
              {t.customizeProd.customize}
            </span>
            <ChevronRight size={11} />
            <span className="hover:text-red-600 cursor-pointer font-medium" onClick={() => setLocation(`/customize/${category}`)}>
              {product.category}
            </span>
            <ChevronRight size={11} />
            <span className="text-gray-700 font-semibold">{product.name}</span>
          </div>
          <div className="ml-auto flex-shrink-0">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-full text-white"
              style={{ background: "#DC2626" }}
            >
              <Sparkles size={11} />
              {t.customizeProd.studio}
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

          {/* LEFT: Product Preview + Info */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">

            <div
              className="rounded-2xl overflow-hidden bg-white border border-gray-200"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
            >
              <div className="relative aspect-square">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "rgba(220,38,38,0.92)", backdropFilter: "blur(4px)" }}
                  >
                    <Award size={11} /> {printPositionLabel}
                  </span>
                </div>
                {selectedVariant && (
                  <div className="absolute top-3 right-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
                      style={{ background: selectedVariant.hex }}
                    >
                      {selectedVariant.color}
                    </span>
                  </div>
                )}
              </div>

              {(product.colorVariants?.length ?? 0) > 0 && (
                <div className="px-5 pb-5 pt-4 border-t border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{t.customizeProd.selectColor}</p>
                  <div className="flex flex-wrap gap-2.5">
                    {product.colorVariants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        title={v.color}
                        className="relative w-10 h-10 rounded-full transition-all duration-150 flex-shrink-0 focus:outline-none"
                        style={{
                          background: v.hex,
                          boxShadow: selectedVariant?.color === v.color
                            ? "0 0 0 2.5px #fff, 0 0 0 4.5px #DC2626"
                            : "0 1px 4px rgba(0,0,0,0.3)",
                          transform: selectedVariant?.color === v.color ? "scale(1.14)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                  {selectedVariant && (
                    <p className="text-sm font-black mt-3 flex items-center gap-1.5" style={{ color: "#374151" }}>
                      <span
                        className="inline-block w-3 h-3 rounded-full border border-gray-300"
                        style={{ background: selectedVariant.hex }}
                      />
                      <span style={{ color: "#DC2626" }}>{selectedVariant.color}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="p-5 border-t border-gray-100">
                <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">
                  {product.name}
                </h1>
                <p className="text-gray-500 text-base leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={18} style={{ color: "#DC2626" }} />
                    <span className="text-3xl font-black" style={{ color: "#DC2626" }}>
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">{t.customizeProd.pieceLabel}</span>
                  </div>
                  {quantity >= 10 && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                      {t.customizeProd.bulkRate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div
              className="rounded-2xl bg-white border border-gray-200 p-5"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
            >
              <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">
                {t.customizeProd.orderSummary}
              </p>
              <div className="space-y-2.5">
                <SummaryRow label={t.customizeProd.productLabel} value={product.name} />
                {selectedVariant && (
                  <SummaryRow label={t.customizeProd.colorLabel} value={selectedVariant.color} valueColor={selectedVariant.hex} />
                )}
                <SummaryRow label={t.customizeProd.printPositionLabel} value={printPositionLabel} valueColor="#DC2626" />
                {isTShirt ? (
                  <>
                    {SIZES.filter(s => sizeQty[s] > 0).map(s => (
                      <SummaryRow key={s} label={`Size ${s}`} value={`${sizeQty[s]} pc${sizeQty[s] > 1 ? "s" : ""}`} />
                    ))}
                    <SummaryRow label={t.customizeProd.totalPiecesLabel} value={`${totalSizeQty} ${t.customizeProd.piecePlural}`} />
                  </>
                ) : (
                  <SummaryRow label={t.customizeProd.quantityLabel} value={`${quantity} ${quantity !== 1 ? t.customizeProd.piecePlural : t.customizeProd.pieceSingular}`} />
                )}
                <div className="border-t border-gray-100 pt-2.5 mt-1">
                  <SummaryRow
                    label={t.customizeProd.baseTotalLabel}
                    value={`₹${(product.price * effectiveQty).toLocaleString("en-IN")}`}
                    valueColor="#DC2626"
                    bold
                    large
                  />
                </div>
                {hasLogo && <SummaryRow label={t.customizeProd.logoLabel} value={t.customizeProd.uploadedMark} valueColor="#16a34a" />}
                {hasDesign && (
                  <SummaryRow
                    label={isBothSides ? t.customizeProd.designsLabel : t.customizeProd.designLabel}
                    value={isBothSides
                      ? [frontFile && `Front ✓`, backFile && `Back ✓`].filter(Boolean).join(", ")
                      : t.customizeProd.uploadedMark
                    }
                    valueColor="#16a34a"
                  />
                )}
                {hasInstructions && <SummaryRow label={t.customizeProd.instructionsLabel} value={t.customizeProd.addedMark} valueColor="#16a34a" />}
              </div>
              <p className="text-gray-400 text-xs mt-4 leading-relaxed">
                {t.customizeProd.finalPriceNote}
              </p>
            </div>
          </div>

          {/* RIGHT: Customization Form */}
          <div className="space-y-5">

            <div className="mb-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{t.customizeProd.customizeYour}</h2>
              <p className="text-gray-500 text-base mt-2">
                {t.customizeProd.customizeYourDesc}
              </p>
            </div>

            {/* 1. Quantity / Size */}
            {isTShirt ? (
              <SectionCard
                title={t.customizeProd.sizeQtyTitle}
                step={1}
                badge={totalSizeQty > 0 ? `${totalSizeQty} pcs` : t.customizeProd.requiredBadge}
                badgeGreen={totalSizeQty > 0}
                requiredLabel="required"
              >
                <div className="space-y-4">
                  <p className="text-gray-500 text-base">{t.customizeProd.sizeQtyDesc}</p>

                  <div className="space-y-2">
                    <div className="grid grid-cols-[80px_1fr_auto] gap-3 px-1">
                      <span className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">{t.customizeProd.sizeHeader}</span>
                      <span className="text-sm font-extrabold text-gray-400 uppercase tracking-wider">{t.customizeProd.qtyHeader}</span>
                      <span className="w-20" />
                    </div>

                    {SIZES.map(size => (
                      <div
                        key={size}
                        className="grid grid-cols-[80px_1fr_auto] gap-3 items-center p-3 rounded-xl border transition-all duration-150"
                        style={
                          sizeQty[size] > 0
                            ? { borderColor: "#DC2626", background: "rgba(220,38,38,0.04)" }
                            : { borderColor: "#e5e7eb", background: "#fafafa" }
                        }
                      >
                        <span
                          className="w-12 h-10 rounded-lg flex items-center justify-center text-base font-black border-2"
                          style={
                            sizeQty[size] > 0
                              ? { background: "#DC2626", color: "#fff", borderColor: "#DC2626" }
                              : { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                          }
                        >
                          {size}
                        </span>

                        <input
                          type="number"
                          min={0}
                          value={sizeQty[size] === 0 ? "" : sizeQty[size]}
                          onChange={e => setSizeAmount(size, e.target.value)}
                          placeholder="0"
                          className="w-full h-10 rounded-xl border-2 px-3 text-base font-bold text-gray-900 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{
                            borderColor: sizeQty[size] > 0 ? "#DC2626" : "#e5e7eb",
                            background: "#fff",
                          }}
                        />

                        <div className="flex items-center gap-1 w-20 flex-shrink-0">
                          <button
                            onClick={() => setSizeAmount(size, String(Math.max(0, sizeQty[size] - 1)))}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors"
                            style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                          >
                            <Minus size={12} />
                          </button>
                          <button
                            onClick={() => setSizeAmount(size, String(sizeQty[size] + 1))}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center transition-colors"
                            style={{ borderColor: "#DC2626", color: "#DC2626", background: "rgba(220,38,38,0.05)" }}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2"
                    style={
                      totalSizeQty > 0
                        ? { borderColor: "#DC2626", background: "rgba(220,38,38,0.06)" }
                        : { borderColor: "#e5e7eb", background: "#f9fafb" }
                    }
                  >
                    <span className="text-base font-bold text-gray-700">{t.customizeProd.totalTShirts}</span>
                    <div className="flex items-center gap-2">
                      {sizeBreakdown && (
                        <span className="text-sm text-gray-400 font-medium">{sizeBreakdown}</span>
                      )}
                      <span
                        className="text-2xl font-black"
                        style={{ color: totalSizeQty > 0 ? "#DC2626" : "#d1d5db" }}
                      >
                        {totalSizeQty}
                      </span>
                    </div>
                  </div>

                  {totalSizeQty >= 10 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ background: "rgba(234,179,8,0.1)", color: "#b45309", border: "1px solid rgba(234,179,8,0.3)" }}
                    >
                      {t.customizeProd.bulkMsg}
                    </motion.div>
                  )}
                </div>
              </SectionCard>
            ) : (
              <SectionCard title={t.customizeProd.quantityTitle} step={1} requiredLabel="required">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  pieceSingular={t.customizeProd.pieceSingular}
                  piecePlural={t.customizeProd.piecePlural}
                  minimumOrder={t.customizeProd.minimumOrder}
                  orTypeNumber={t.customizeProd.orTypeNumber}
                  bulkMsg={t.customizeProd.bulkMsg}
                />
              </SectionCard>
            )}

            {/* 2. Print Position */}
            {positions.length > 0 && (
              <SectionCard title={t.customizeProd.printPositionTitle} step={2} requiredLabel="required">
                <div className="grid grid-cols-3 gap-3">
                  {positions.map(pos => (
                    <PositionCard
                      key={pos.id}
                      pos={pos}
                      active={printPosition === pos.id}
                      onClick={() => setPrintPosition(pos.id)}
                    />
                  ))}
                </div>
              </SectionCard>
            )}

            {/* 3. Upload Logo */}
            <SectionCard
              title={t.customizeProd.uploadLogoTitle}
              step={3}
              badge={hasLogo ? t.customizeProd.uploadedMark : t.customizeProd.logoOptional}
              badgeGreen={hasLogo}
              required={!isValid && showError}
              requiredLabel="required"
            >
              <UploadBox
                label="Drop your logo here or click to browse"
                sublabel="PNG, SVG recommended · Max 10 MB"
                file={logoFile}
                preview={logoPreview}
                inputRef={logoRef}
                accept=".png,.jpg,.jpeg,.svg"
                icon={Award}
                onFileChange={makeFileHandler(setLogoFile, setLogoPreview)}
                onRemove={makeRemoveHandler(setLogoFile, setLogoPreview, logoRef)}
                browseLabel={t.customizeProd.browseFile}
              />
            </SectionCard>

            {/* 4. Upload Design */}
            <SectionCard
              title={isBothSides ? t.customizeProd.uploadDesignsTitle : t.customizeProd.uploadDesignTitle}
              step={4}
              badge={hasDesign ? t.customizeProd.uploadedMark : t.customizeProd.designOptional}
              badgeGreen={hasDesign}
              required={!isValid && showError}
              requiredLabel="required"
            >
              {isBothSides ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">{t.customizeProd.frontDesign}</p>
                    <UploadBox
                      label="Upload Front"
                      sublabel="PNG, JPG, PDF"
                      file={frontFile}
                      preview={frontPreview}
                      inputRef={frontRef}
                      accept=".png,.jpg,.jpeg,.svg,.pdf"
                      icon={ImageIcon}
                      onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                      onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                      browseLabel={t.customizeProd.browseFile}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">{t.customizeProd.backDesign}</p>
                    <UploadBox
                      label="Upload Back"
                      sublabel="PNG, JPG, PDF"
                      file={backFile}
                      preview={backPreview}
                      inputRef={backRef}
                      accept=".png,.jpg,.jpeg,.svg,.pdf"
                      icon={ImageIcon}
                      onFileChange={makeFileHandler(setBackFile, setBackPreview)}
                      onRemove={makeRemoveHandler(setBackFile, setBackPreview, backRef)}
                      browseLabel={t.customizeProd.browseFile}
                    />
                  </div>
                </div>
              ) : (
                <UploadBox
                  label="Drop your design here or click to browse"
                  sublabel="PNG, JPG, SVG, PDF · Max 10 MB"
                  file={frontFile}
                  preview={frontPreview}
                  inputRef={frontRef}
                  accept=".png,.jpg,.jpeg,.svg,.pdf"
                  icon={ImageIcon}
                  onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                  onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                  browseLabel={t.customizeProd.browseFile}
                />
              )}
            </SectionCard>

            {/* 5. Design Instructions */}
            <SectionCard
              title={t.customizeProd.designInstrTitle}
              step={5}
              badge={hasInstructions ? t.customizeProd.addedMark : t.customizeProd.instrOptional}
              badgeGreen={hasInstructions}
              required={!isValid && showError}
              requiredLabel="required"
            >
              <div className="space-y-3">
                <p className="text-gray-500 text-base leading-relaxed">
                  {t.customizeProd.instrDesc}
                </p>
                <Textarea
                  value={designInstructions}
                  onChange={e => { setDesignInstructions(e.target.value); setShowError(false); }}
                  placeholder={t.customizeProd.instrPlaceholder}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-400 rounded-xl resize-none h-32 text-base"
                  style={{ background: "#fafafa" }}
                />
                <div
                  className="flex items-start gap-2 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.15)" }}
                >
                  <FileText size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-sm leading-relaxed">
                    <strong className="text-gray-800">{t.customizeProd.noDesignFile}</strong> {t.customizeProd.noDesignFileDesc}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* ── Validation Error ── */}
            <AnimatePresence>
              {showError && !isValid && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 rounded-2xl px-4 py-4 border"
                  style={{ background: "rgba(220,38,38,0.05)", borderColor: "rgba(220,38,38,0.3)" }}
                >
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-bold text-base">{t.customizeProd.validationTitle}</p>
                    <p className="text-red-600 text-sm mt-0.5 leading-snug">
                      {t.customizeProd.validationDesc}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CTA Buttons ── */}
            <div className="space-y-3 pt-2">
              <motion.button
                onClick={handleSaveToCart}
                whileHover={isValid ? { scale: 1.01, y: -1 } : {}}
                whileTap={isValid ? { scale: 0.99 } : {}}
                className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-white text-lg transition-all duration-200"
                style={
                  saved
                    ? { background: "linear-gradient(135deg,#16a34a,#15803d)", boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }
                    : isValid
                    ? { background: "linear-gradient(135deg,#DC2626,#b91c1c)", boxShadow: "0 6px 24px rgba(220,38,38,0.35)" }
                    : { background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }
                }
              >
                {saved ? (
                  <><CheckCircle2 size={20} /> {t.customizeProd.orderSaved}</>
                ) : isValid ? (
                  <div className="flex items-center justify-between w-full px-1">
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} />
                      <span>{t.customizeProd.proceedToOrder}</span>
                    </div>
                    <div className="flex flex-col items-end leading-tight">
                      <span className="text-sm font-bold opacity-90">₹{(product.price * effectiveQty).toLocaleString("en-IN")}</span>
                      <span className="text-xs font-medium opacity-70">{effectiveQty} {effectiveQty > 1 ? t.customizeProd.piecePlural : t.customizeProd.pieceSingular}</span>
                    </div>
                  </div>
                ) : (
                  <><FileText size={18} /> {t.customizeProd.provideDesign}</>
                )}
              </motion.button>

              <motion.button
                onClick={handleWhatsApp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base transition-all duration-200 border-2"
                style={{ borderColor: "#25d366", color: "#16a34a", background: "rgba(37,211,102,0.05)" }}
              >
                <MessageCircle size={20} style={{ color: "#25d366" }} />
                {t.customizeProd.submitWhatsApp}
              </motion.button>
            </div>

            <p className="text-center text-gray-400 text-sm pb-4">
              {t.customizeProd.noUpfrontNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Summary Row ── */
function SummaryRow({
  label, value, valueColor, bold, large,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
  large?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className={`text-gray-500 ${large ? "text-base font-semibold" : "text-sm"}`}>{label}</span>
      <span
        className={`text-right ${large ? "text-xl" : "text-base"} ${bold ? "font-extrabold" : "font-semibold"}`}
        style={{ color: valueColor ?? "#111827" }}
      >
        {value}
      </span>
    </div>
  );
}
