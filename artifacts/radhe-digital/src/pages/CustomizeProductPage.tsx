import React, { useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, X, ArrowLeft, AlertTriangle,
  Sparkles, ChevronRight, Tag, FileText, MessageCircle,
  Minus, Plus, Image as ImageIcon, Award
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { getProductBySlug } from "@/data/customizeProducts";

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
      <span className="text-sm font-bold" style={{ color: active ? "#DC2626" : "#374151" }}>
        {pos.label}
      </span>
      <p className="text-xs leading-snug" style={{ color: "#9ca3af" }}>{pos.desc}</p>
    </button>
  );
}

/* ─── Upload Box ─── */
function UploadBox({
  label, sublabel, file, preview, inputRef, accept, onFileChange, onRemove, icon: Icon,
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
        <p className="text-gray-800 font-bold text-sm">{label}</p>
        {sublabel && <p className="text-gray-400 text-xs mt-0.5">{sublabel}</p>}
      </div>
      <span
        className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
        style={{ background: "#DC2626", color: "#ffffff" }}
      >
        BROWSE FILE
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
  title, step, badge, badgeGreen, children, required,
}: {
  title: string;
  step: number;
  badge?: string;
  badgeGreen?: boolean;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border bg-white overflow-hidden"
      style={{ borderColor: "#e5e7eb", boxShadow: "0 1px 8px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#f3f4f6", background: "#fafafa" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-full text-sm font-black flex items-center justify-center flex-shrink-0 text-white"
            style={{ background: "#DC2626" }}
          >
            {step}
          </span>
          <h2 className="text-gray-900 font-extrabold text-base tracking-tight">{title}</h2>
          {required && (
            <span className="text-xs font-bold text-red-500">*required</span>
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

      {/* Card Body */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
}

/* ─── Quantity Selector ─── */
function QuantitySelector({
  value, onChange,
}: {
  value: number;
  onChange: (v: number) => void;
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
        {/* Minus */}
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

        {/* Manual input */}
        <input
          type="number"
          min={1}
          value={inputVal}
          onChange={e => handleInput(e.target.value)}
          onBlur={handleBlur}
          className="w-20 h-12 rounded-xl border-2 text-center font-black text-xl outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ borderColor: "#DC2626", color: "#111827" }}
        />

        {/* Plus */}
        <button
          onClick={inc}
          className="w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-all duration-150"
          style={{ borderColor: "#DC2626", color: "#DC2626", background: "rgba(220,38,38,0.05)" }}
        >
          <Plus size={18} />
        </button>

        <div className="ml-1">
          <p className="text-gray-900 font-bold text-sm">{value} piece{value !== 1 ? "s" : ""}</p>
          <p className="text-gray-400 text-xs">Minimum order: 1</p>
        </div>
      </div>

      {/* Quick presets */}
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
        <span className="px-3 py-1.5 text-xs text-gray-400 flex items-center">or type any number above</span>
      </div>

      {value >= 10 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "rgba(234,179,8,0.1)", color: "#b45309", border: "1px solid rgba(234,179,8,0.3)" }}
        >
          🎉 Bulk order! You qualify for a special bulk discount price.
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main Page ─── */
export default function CustomizeProductPage() {
  const { category, productSlug } = useParams<{ category: string; productSlug: string }>();
  const [, setLocation] = useLocation();

  const product = getProductBySlug(category ?? "", productSlug ?? "");
  const { addItem, openCart } = useCart();

  /* ── Print position ── */
  const positions = product?.printPositions ?? [];
  const [printPosition, setPrintPosition] = useState<string>(positions[0]?.id ?? "front");

  /* ── File states ── */
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);

  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const backRef = useRef<HTMLInputElement>(null);

  /* ── Text ── */
  const [designInstructions, setDesignInstructions] = useState("");

  /* ── Quantity ── */
  const [quantity, setQuantity] = useState(1);

  /* ── T-Shirt size breakdown ── */
  const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
  type Size = typeof SIZES[number];
  const [sizeQty, setSizeQty] = useState<Record<Size, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const isTShirt = category === "t-shirts";
  const totalSizeQty = isTShirt ? Object.values(sizeQty).reduce((a, b) => a + b, 0) : 0;
  const effectiveQty = isTShirt ? Math.max(1, totalSizeQty) : quantity;
  const sizeBreakdown = SIZES.filter(s => sizeQty[s] > 0).map(s => `${s}×${sizeQty[s]}`).join(", ");

  const setSizeAmount = (size: Size, val: string) => {
    const n = Math.max(0, parseInt(val) || 0);
    setSizeQty(prev => ({ ...prev, [size]: n }));
  };

  /* ── UI states ── */
  const [showError, setShowError] = useState(false);
  const [saved, setSaved] = useState(false);

  /* ── File handler factory ── */
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

  /* ── Validation ── */
  const isBothSides = printPosition === "both";
  const hasLogo = !!logoFile;
  const hasDesign = !!(frontFile || backFile);
  const hasInstructions = designInstructions.trim().length > 0;
  const isValid = hasLogo || hasDesign || hasInstructions;

  /* ── Save to cart ── */
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

  /* ── WhatsApp ── */
  const handleWhatsApp = () => {
    if (!isValid) { setShowError(true); return; }
    const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;
    const lines = [
      `Hello Radhe Digital! I'd like to customize a product.`,
      ``,
      `*Product:* ${product?.name ?? category}`,
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

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found.</p>
          <button onClick={() => setLocation("/customize")} className="text-red-600 underline text-sm font-semibold">
            Back to Customize
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
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-gray-300">/</span>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
            <span className="hover:text-red-600 cursor-pointer font-medium" onClick={() => setLocation("/customize")}>
              Customize
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
              Customization Studio
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">

          {/* ══════════════════════════════════════
              LEFT: Product Preview + Info
          ══════════════════════════════════════ */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">

            {/* Product Image */}
            <div
              className="rounded-2xl overflow-hidden bg-white border border-gray-200"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
            >
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Print position overlay badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                    style={{ background: "rgba(220,38,38,0.92)", backdropFilter: "blur(4px)" }}
                  >
                    <Award size={11} /> {printPositionLabel}
                  </span>
                </div>
              </div>

              {/* Product info inside the card */}
              <div className="p-5 border-t border-gray-100">
                <h1 className="text-xl font-extrabold text-gray-900 leading-tight mb-1">
                  {product.name}
                </h1>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={15} style={{ color: "#DC2626" }} />
                    <span className="text-2xl font-black" style={{ color: "#DC2626" }}>
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">/ piece</span>
                  </div>
                  {quantity >= 10 && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                      Bulk Rate
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
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4">
                Order Summary
              </p>
              <div className="space-y-2.5">
                <SummaryRow label="Product" value={product.name} />
                <SummaryRow label="Print Position" value={printPositionLabel} valueColor="#DC2626" />
                {isTShirt ? (
                  <>
                    {SIZES.filter(s => sizeQty[s] > 0).map(s => (
                      <SummaryRow key={s} label={`Size ${s}`} value={`${sizeQty[s]} pc${sizeQty[s] > 1 ? "s" : ""}`} />
                    ))}
                    <SummaryRow label="Total Pieces" value={`${totalSizeQty} piece${totalSizeQty !== 1 ? "s" : ""}`} />
                  </>
                ) : (
                  <SummaryRow label="Quantity" value={`${quantity} piece${quantity > 1 ? "s" : ""}`} />
                )}
                <div className="border-t border-gray-100 pt-2.5 mt-1">
                  <SummaryRow
                    label="Base Total"
                    value={`₹${(product.price * effectiveQty).toLocaleString("en-IN")}`}
                    valueColor="#DC2626"
                    bold
                    large
                  />
                </div>
                {hasLogo && <SummaryRow label="Logo" value="Uploaded ✓" valueColor="#16a34a" />}
                {hasDesign && (
                  <SummaryRow
                    label={isBothSides ? "Designs" : "Design"}
                    value={isBothSides
                      ? [frontFile && "Front ✓", backFile && "Back ✓"].filter(Boolean).join(", ")
                      : "Uploaded ✓"
                    }
                    valueColor="#16a34a"
                  />
                )}
                {hasInstructions && <SummaryRow label="Instructions" value="Added ✓" valueColor="#16a34a" />}
              </div>
              <p className="text-gray-400 text-xs mt-4 leading-relaxed">
                * Final price may vary by print complexity & bulk quantity.
              </p>
            </div>
          </div>

          {/* ══════════════════════════════════════
              RIGHT: Customization Form
          ══════════════════════════════════════ */}
          <div className="space-y-5">

            {/* Page Title */}
            <div className="mb-2">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customize Your Product</h2>
              <p className="text-gray-500 text-sm mt-1">
                Fill in your design details below. At least one of logo, design, or instructions is required.
              </p>
            </div>

            {/* 1. Quantity / Size */}
            {isTShirt ? (
              <SectionCard
                title="SIZE & QUANTITY"
                step={1}
                badge={totalSizeQty > 0 ? `${totalSizeQty} pcs` : "Required"}
                badgeGreen={totalSizeQty > 0}
              >
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm">Enter how many pieces you need per size. Leave blank if not required.</p>

                  {/* Size grid */}
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="grid grid-cols-[80px_1fr_auto] gap-3 px-1">
                      <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Size</span>
                      <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Quantity (pieces)</span>
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
                        {/* Size badge */}
                        <span
                          className="w-12 h-10 rounded-lg flex items-center justify-center text-sm font-black border-2"
                          style={
                            sizeQty[size] > 0
                              ? { background: "#DC2626", color: "#fff", borderColor: "#DC2626" }
                              : { background: "#fff", color: "#374151", borderColor: "#e5e7eb" }
                          }
                        >
                          {size}
                        </span>

                        {/* Quantity input */}
                        <input
                          type="number"
                          min={0}
                          value={sizeQty[size] === 0 ? "" : sizeQty[size]}
                          onChange={e => setSizeAmount(size, e.target.value)}
                          placeholder="0"
                          className="w-full h-10 rounded-xl border-2 px-3 text-sm font-bold text-gray-900 outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          style={{
                            borderColor: sizeQty[size] > 0 ? "#DC2626" : "#e5e7eb",
                            background: "#fff",
                          }}
                        />

                        {/* +/- stepper */}
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

                  {/* Total bar */}
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl border-2"
                    style={
                      totalSizeQty > 0
                        ? { borderColor: "#DC2626", background: "rgba(220,38,38,0.06)" }
                        : { borderColor: "#e5e7eb", background: "#f9fafb" }
                    }
                  >
                    <span className="text-sm font-bold text-gray-700">Total T-Shirts</span>
                    <div className="flex items-center gap-2">
                      {sizeBreakdown && (
                        <span className="text-xs text-gray-400 font-medium">{sizeBreakdown}</span>
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
                      🎉 Bulk order! You qualify for a special bulk discount price.
                    </motion.div>
                  )}
                </div>
              </SectionCard>
            ) : (
              <SectionCard title="QUANTITY" step={1}>
                <QuantitySelector value={quantity} onChange={setQuantity} />
              </SectionCard>
            )}

            {/* 2. Print Position */}
            {positions.length > 0 && (
              <SectionCard title="PRINT POSITION" step={2}>
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
              title="UPLOAD YOUR LOGO"
              step={3}
              badge={hasLogo ? "Uploaded ✓" : "Optional"}
              badgeGreen={hasLogo}
              required={!isValid && showError}
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
              />
            </SectionCard>

            {/* 4. Upload Design */}
            <SectionCard
              title={isBothSides ? "UPLOAD YOUR DESIGNS (FRONT & BACK)" : "UPLOAD YOUR DESIGN"}
              step={4}
              badge={hasDesign ? "Uploaded ✓" : "Optional"}
              badgeGreen={hasDesign}
              required={!isValid && showError}
            >
              {isBothSides ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Front Design</p>
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
                    />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Back Design</p>
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
                />
              )}
            </SectionCard>

            {/* 5. Design Instructions */}
            <SectionCard
              title="DESIGN INSTRUCTIONS"
              step={5}
              badge={hasInstructions ? "Added ✓" : "Optional"}
              badgeGreen={hasInstructions}
              required={!isValid && showError}
            >
              <div className="space-y-3">
                <p className="text-gray-500 text-sm leading-relaxed">
                  Describe exactly what you want — text, colors, placement, fonts, or any other details. Our design team will follow your instructions precisely.
                </p>
                <Textarea
                  value={designInstructions}
                  onChange={e => { setDesignInstructions(e.target.value); setShowError(false); }}
                  placeholder={`Example: "Print our company logo on the front in white. Add 'Est. 2020' text below. Use bold Montserrat font."`}
                  className="border-gray-200 text-gray-900 placeholder-gray-400 focus:border-red-400 rounded-xl resize-none h-28 text-sm"
                  style={{ background: "#fafafa" }}
                />
                <div
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.15)" }}
                >
                  <FileText size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-xs leading-relaxed">
                    <strong className="text-gray-800">No design file?</strong> Just describe your idea here — our team will create it for you at no extra charge.
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
                  <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 font-bold text-sm">Design information required</p>
                    <p className="text-red-600 text-xs mt-0.5 leading-snug">
                      Please provide at least one of: Upload Logo, Upload Design, or Design Instructions before proceeding.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CTA Buttons ── */}
            <div className="space-y-3 pt-2">
              {/* Primary */}
              <motion.button
                onClick={handleSaveToCart}
                whileHover={isValid ? { scale: 1.01, y: -1 } : {}}
                whileTap={isValid ? { scale: 0.99 } : {}}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-extrabold text-white text-base transition-all duration-200"
                style={
                  saved
                    ? { background: "linear-gradient(135deg,#16a34a,#15803d)", boxShadow: "0 6px 24px rgba(22,163,74,0.35)" }
                    : isValid
                    ? { background: "linear-gradient(135deg,#DC2626,#b91c1c)", boxShadow: "0 6px 24px rgba(220,38,38,0.35)" }
                    : { background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" }
                }
              >
                {saved ? (
                  <><CheckCircle2 size={20} /> ORDER SAVED — OPENING CART</>
                ) : isValid ? (
                  <>
                    <Sparkles size={20} />
                    PROCEED TO ORDER
                    <span className="ml-auto text-sm font-bold opacity-80">
                      {effectiveQty} pc{effectiveQty > 1 ? "s" : ""} · ₹{(product.price * effectiveQty).toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <><FileText size={18} /> PROVIDE DESIGN INFORMATION TO CONTINUE</>
                )}
              </motion.button>

              {/* Secondary: WhatsApp */}
              <motion.button
                onClick={handleWhatsApp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 border-2"
                style={{ borderColor: "#25d366", color: "#16a34a", background: "rgba(37,211,102,0.05)" }}
              >
                <MessageCircle size={18} style={{ color: "#25d366" }} />
                SUBMIT REQUEST VIA WHATSAPP
              </motion.button>
            </div>

            <p className="text-center text-gray-400 text-xs pb-4">
              No upfront payment · Our team will confirm your order via WhatsApp before printing starts.
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
      <span className={`text-gray-500 ${large ? "text-sm font-semibold" : "text-xs"}`}>{label}</span>
      <span
        className={`text-right ${large ? "text-lg" : "text-sm"} ${bold ? "font-extrabold" : "font-semibold"}`}
        style={{ color: valueColor ?? "#111827" }}
      >
        {value}
      </span>
    </div>
  );
}
