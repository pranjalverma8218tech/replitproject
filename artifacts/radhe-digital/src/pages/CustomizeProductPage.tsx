import React, { useState, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, X, ArrowLeft, AlertTriangle,
  Sparkles, ChevronRight, Tag, Package, FileText, MessageCircle, Minus, Plus
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
      className="flex-1 flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all duration-200"
      style={
        active
          ? { borderColor: "#e53e3e", background: "rgba(229,62,62,0.1)" }
          : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }
      }
    >
      <div className="flex items-center gap-2 w-full">
        <span
          className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
          style={{ borderColor: active ? "#e53e3e" : "rgba(255,255,255,0.3)" }}
        >
          {active && <span className="w-2 h-2 rounded-full" style={{ background: "#e53e3e" }} />}
        </span>
        <span
          className="text-sm font-bold transition-colors"
          style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.6)" }}
        >
          {pos.label}
        </span>
      </div>
      <p className="text-xs text-gray-600 ml-6 leading-snug">{pos.desc}</p>
    </button>
  );
}

/* ─── Upload Box ─── */
function UploadBox({
  label, sublabel, file, preview, inputRef, accept, onFileChange, onRemove,
}: {
  label: string;
  sublabel?: string;
  file: File | null;
  preview?: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  accept: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  if (file) {
    return (
      <div className="rounded-xl overflow-hidden border border-white/10">
        {preview && (
          <img
            src={preview}
            alt="Uploaded"
            className="w-full max-h-32 object-contain bg-[#0d0d0d] p-3"
          />
        )}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-t border-white/8">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
            <span className="text-green-400 text-sm font-semibold truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <button onClick={onRemove} className="text-gray-500 hover:text-red-400 transition-colors ml-2 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label className="relative flex flex-col items-center justify-center gap-2.5 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/4"
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(229,62,62,0.12)" }}
      >
        <Upload size={18} style={{ color: "#e53e3e" }} />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-sm">{label}</p>
        {sublabel && <p className="text-gray-500 text-xs mt-0.5">{sublabel}</p>}
      </div>
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

/* ─── Main Page ─── */
export default function CustomizeProductPage() {
  const { category, productSlug } = useParams<{ category: string; productSlug: string }>();
  const [, setLocation] = useLocation();

  const product = getProductBySlug(category ?? "", productSlug ?? "");
  const { addItem, openCart } = useCart();

  /* ── Print position ── */
  const positions = product?.printPositions ?? [];
  const [printPosition, setPrintPosition] = useState<string>(positions[0]?.id ?? "front");
  const isBothSides = printPosition === "both";

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

  /* ── Text states ── */
  const [designInstructions, setDesignInstructions] = useState("");

  /* ── Quantity ── */
  const [quantity, setQuantity] = useState(1);

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
      quantity,
      image: product?.image,
      customization: {
        printPosition: printPositionLabel,
        uploadedFileName: designNote,
        logoFileName: logoFile?.name,
        designInstructions: designInstructions.trim() || undefined,
        quantity,
      },
    });

    setSaved(true);
    setTimeout(() => { setSaved(false); openCart(); }, 1600);
  };

  /* ── WhatsApp fallback ── */
  const handleWhatsApp = () => {
    if (!isValid) { setShowError(true); return; }
    const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;
    const lines = [
      `Hello Radhe Digital! I'd like to customize a product.`,
      ``,
      `*Product:* ${product?.name ?? category}`,
      `*Print Position:* ${printPositionLabel}`,
      `*Quantity:* ${quantity}`,
      logoFile ? `*Logo:* ${logoFile.name}` : "",
      frontFile ? `*Design (Front):* ${frontFile.name}` : "",
      backFile ? `*Design (Back):* ${backFile.name}` : "",
      designInstructions.trim() ? `*Instructions:* ${designInstructions.trim()}` : "",
      `*Base Price:* ${product?.priceLabel ?? ""}`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(lines)}`, "_blank");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Product not found.</p>
          <button
            onClick={() => setLocation("/customize")}
            className="text-red-400 underline text-sm"
          >
            Back to Customize
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <section
        className="border-b border-white/8 py-8"
        style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #110808 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => setLocation(`/customize/${category}`)}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} /> Back to {product.category}
          </button>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setLocation("/customize")}>
              Customize
            </span>
            <ChevronRight size={12} />
            <span className="hover:text-gray-400 cursor-pointer" onClick={() => setLocation(`/customize/${category}`)}>
              {product.category}
            </span>
            <ChevronRight size={12} />
            <span className="text-gray-400">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

          {/* ── LEFT: Product Preview ── */}
          <div className="lg:sticky lg:top-8 lg:self-start space-y-5">
            {/* Step badge */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full border"
              style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.35)", background: "rgba(196,150,42,0.1)" }}
            >
              Step 3 of 3 · Customization Studio
            </span>

            {/* Product image */}
            <div
              className="rounded-2xl overflow-hidden border border-white/8"
              style={{ background: "#111" }}
            >
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
                >
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-gray-400" />
                    <span className="text-white text-xs font-semibold">Plain base — ready for customization</span>
                  </div>
                </div>
              </div>

              {/* Product meta */}
              <div className="p-5">
                <h1 className="text-xl font-extrabold text-white leading-tight mb-1">
                  {product.name}
                </h1>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={14} style={{ color: "#C4962A" }} />
                    <span className="text-2xl font-black" style={{ color: "#C4962A" }}>
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-600 text-xs">/ piece</span>
                  </div>
                  {quantity >= 10 && (
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(196,150,42,0.15)", color: "#C4962A" }}
                    >
                      Bulk Discount Applies
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Order summary card */}
            <div
              className="rounded-2xl p-5 border space-y-2.5"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Order Summary</p>
              <div className="space-y-2">
                <Row label="Product" value={product.name} />
                {positions.length > 0 && (
                  <Row
                    label="Print Position"
                    value={positions.find(p => p.id === printPosition)?.label ?? printPosition}
                    valueColor="#fc8181"
                  />
                )}
                <Row label="Quantity" value={`${quantity} piece${quantity > 1 ? "s" : ""}`} />
                <Row
                  label="Total (base)"
                  value={`₹${(product.price * quantity).toLocaleString("en-IN")}`}
                  valueColor="#C4962A"
                  bold
                />
                {hasLogo && <Row label="Logo" value="Uploaded ✓" valueColor="#4ade80" />}
                {hasDesign && (
                  <Row
                    label={isBothSides ? "Designs" : "Design"}
                    value={isBothSides
                      ? [frontFile && "Front ✓", backFile && "Back ✓"].filter(Boolean).join(", ")
                      : "Uploaded ✓"
                    }
                    valueColor="#4ade80"
                  />
                )}
                {hasInstructions && <Row label="Instructions" value="Added ✓" valueColor="#4ade80" />}
              </div>
              <p className="text-gray-600 text-xs pt-1">
                * Final price may vary based on print complexity & bulk quantity.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Customization Options ── */}
          <div className="space-y-5">

            {/* 1. Print Position */}
            {positions.length > 0 && (
              <Section title="Print Position" step={1}>
                <div className="flex flex-wrap gap-2.5">
                  {positions.map(pos => (
                    <PositionCard
                      key={pos.id}
                      pos={pos}
                      active={printPosition === pos.id}
                      onClick={() => { setPrintPosition(pos.id); }}
                    />
                  ))}
                </div>
              </Section>
            )}

            {/* 2. Upload Logo */}
            <Section
              title="Upload Logo"
              step={2}
              badge={hasLogo ? "Uploaded" : "Optional"}
              badgeGreen={hasLogo}
            >
              <UploadBox
                label="Tap to upload your logo"
                sublabel="PNG, SVG recommended — Max 10 MB"
                file={logoFile}
                preview={logoPreview}
                inputRef={logoRef}
                accept=".png,.jpg,.jpeg,.svg"
                onFileChange={makeFileHandler(setLogoFile, setLogoPreview)}
                onRemove={makeRemoveHandler(setLogoFile, setLogoPreview, logoRef)}
              />
            </Section>

            {/* 3. Upload Design */}
            <Section
              title={isBothSides ? "Upload Designs (Front & Back)" : "Upload Design"}
              step={3}
              badge={hasDesign ? "Uploaded" : "Optional"}
              badgeGreen={hasDesign}
            >
              {isBothSides ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Front Design</p>
                    <UploadBox
                      label="Upload Front"
                      sublabel="PNG, JPG, PDF"
                      file={frontFile}
                      preview={frontPreview}
                      inputRef={frontRef}
                      accept=".png,.jpg,.jpeg,.svg,.pdf"
                      onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                      onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                    />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Back Design</p>
                    <UploadBox
                      label="Upload Back"
                      sublabel="PNG, JPG, PDF"
                      file={backFile}
                      preview={backPreview}
                      inputRef={backRef}
                      accept=".png,.jpg,.jpeg,.svg,.pdf"
                      onFileChange={makeFileHandler(setBackFile, setBackPreview)}
                      onRemove={makeRemoveHandler(setBackFile, setBackPreview, backRef)}
                    />
                  </div>
                </div>
              ) : (
                <UploadBox
                  label="Tap to upload your design"
                  sublabel="PNG, JPG, SVG, PDF — Max 10 MB"
                  file={frontFile}
                  preview={frontPreview}
                  inputRef={frontRef}
                  accept=".png,.jpg,.jpeg,.svg,.pdf"
                  onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                  onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                />
              )}
            </Section>

            {/* 4. Design Instructions */}
            <Section
              title="Design Instructions"
              step={4}
              badge={hasInstructions ? "Added" : "Optional"}
              badgeGreen={hasInstructions}
            >
              <Textarea
                value={designInstructions}
                onChange={e => { setDesignInstructions(e.target.value); setShowError(false); }}
                placeholder={`Describe what you want printed — text, placement, colors, fonts, or any specific details.\n\nExample: "Print company logo on front in white. Add 'Est. 2020' text below the logo."`}
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-red-500/50 rounded-xl resize-none h-28 transition-colors"
              />
              <p className="text-gray-600 text-xs mt-2">
                Describe your vision if you don't have a file ready — our team will design it for you.
              </p>
            </Section>

            {/* 5. Quantity */}
            <Section title="Quantity" step={5}>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-xl overflow-hidden border border-white/12">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-14 text-center text-white font-black text-xl bg-[#1a1a1a] h-12 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {quantity} piece{quantity > 1 ? "s" : ""}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Total: ₹{(product.price * quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              {quantity >= 10 && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-yellow-400 text-xs mt-3 flex items-center gap-1.5"
                >
                  🎉 Bulk order! We'll offer you a special discounted price.
                </motion.p>
              )}
            </Section>

            {/* ── Validation Banner ── */}
            <AnimatePresence>
              {showError && !isValid && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-3 rounded-2xl px-4 py-4 border"
                  style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.35)" }}
                >
                  <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-bold text-sm">Design information required</p>
                    <p className="text-red-400/80 text-xs mt-0.5 leading-snug">
                      Please provide at least one of: Upload Logo, Upload Design, or Design Instructions before continuing.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CTA Buttons ── */}
            <div className="space-y-3">
              {/* Primary: Add to Cart */}
              <motion.button
                onClick={handleSaveToCart}
                whileHover={isValid ? { scale: 1.02 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
                style={
                  saved
                    ? { background: "linear-gradient(135deg,#38a169,#276749)", boxShadow: "0 4px 20px rgba(56,161,105,0.35)" }
                    : isValid
                    ? { background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }
                    : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "not-allowed" }
                }
              >
                {saved ? (
                  <><CheckCircle2 size={20} /> Saved! Opening Cart…</>
                ) : isValid ? (
                  <><Sparkles size={20} /> Add to Cart — {quantity} pc{quantity > 1 ? "s" : ""} · ₹{(product.price * quantity).toLocaleString("en-IN")}</>
                ) : (
                  <><FileText size={18} className="opacity-40" /> Add Logo, Design or Instructions to Continue</>
                )}
              </motion.button>

              {/* Secondary: WhatsApp */}
              <motion.button
                onClick={handleWhatsApp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-200 border"
                style={{ background: "rgba(37,211,102,0.08)", borderColor: "rgba(37,211,102,0.3)", color: "#25d366" }}
              >
                <MessageCircle size={18} />
                Or Send Request via WhatsApp
              </motion.button>
            </div>

            <p className="text-center text-gray-600 text-xs">
              No upfront payment · Our team will confirm your order via WhatsApp before printing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: Section wrapper ── */
function Section({
  title, step, badge, badgeGreen, children,
}: {
  title: string;
  step: number;
  badge?: string;
  badgeGreen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 border border-white/8 space-y-4"
      style={{ background: "#111" }}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-white font-bold text-base flex items-center gap-2.5">
          <span
            className="w-6 h-6 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(229,62,62,0.2)", border: "1px solid rgba(229,62,62,0.4)", color: "#fc8181" }}
          >
            {step}
          </span>
          {title}
        </h2>
        {badge && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={
              badgeGreen
                ? { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
                : { background: "rgba(255,255,255,0.06)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }
            }
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ── Helper: Summary row ── */
function Row({
  label, value, valueColor, bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-gray-500">{label}</span>
      <span
        className={`text-right ${bold ? "font-extrabold" : "font-semibold"}`}
        style={{ color: valueColor ?? "#ffffff" }}
      >
        {value}
      </span>
    </div>
  );
}
