import React, { useState, useRef, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, CheckCircle2, MessageCircle, X, ArrowLeft,
  Shirt, Coffee, HardHat, Pen, Award, Image as ImageIcon, Gift,
  Lock, Sparkles, RotateCcw, AlignCenter, AlignLeft, AlignRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";

/* ─── Constants ─── */
const T_SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
type TShirtSize = typeof T_SHIRT_SIZES[number];

const GENDER_OPTIONS = ["Men", "Women", "Unisex"] as const;
type Gender = typeof GENDER_OPTIONS[number];

interface PrintPosition { id: string; label: string; desc: string }

const PRINT_POSITIONS: Record<string, PrintPosition[]> = {
  "t-shirts": [
    { id: "front",  label: "Front Side",  desc: "Print on the front of the T-shirt" },
    { id: "back",   label: "Back Side",   desc: "Print on the back of the T-shirt" },
    { id: "both",   label: "Both Sides",  desc: "Separate design on front & back" },
  ],
  "mugs": [
    { id: "front",  label: "Front Print",     desc: "Visible side when drinking" },
    { id: "back",   label: "Back Print",      desc: "Opposite side of the handle" },
    { id: "wrap",   label: "Wrap Around",     desc: "Full 360° all-over print" },
  ],
  "caps": [
    { id: "front",  label: "Front Panel",     desc: "Logo on the front panel" },
    { id: "side",   label: "Side Print",      desc: "Print on the left or right panel" },
    { id: "back",   label: "Back Print",      desc: "Print above the strap/closure" },
  ],
};

const CATEGORY_META: Record<string, {
  label: string; icon: React.ElementType; color: string; price: number; priceLabel: string;
}> = {
  "t-shirts":        { label: "T-Shirt",        icon: Shirt,      color: "#e53e3e", price: 199, priceLabel: "₹199" },
  "mugs":            { label: "Mug",             icon: Coffee,     color: "#f6ad55", price: 249, priceLabel: "₹249" },
  "caps":            { label: "Cap",             icon: HardHat,    color: "#4299e1", price: 179, priceLabel: "₹179" },
  "pens":            { label: "Pen",             icon: Pen,        color: "#68d391", price: 49,  priceLabel: "₹49"  },
  "badges":          { label: "Badge",           icon: Award,      color: "#f6e05e", price: 29,  priceLabel: "₹29"  },
  "photo-frames":    { label: "Photo Frame",     icon: ImageIcon,  color: "#b794f4", price: 299, priceLabel: "₹299" },
  "corporate-gifts": { label: "Corporate Gift",  icon: Gift,       color: "#fc8181", price: 499, priceLabel: "₹499" },
};

type Tab = "upload" | "request";
type DesignSide = "front" | "back";

/* ─── Step badge ─── */
function Step({ n }: { n: number }) {
  return (
    <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-black flex items-center justify-center flex-shrink-0">
      {n}
    </span>
  );
}

/* ─── Print Position Card ─── */
function PositionCard({ pos, active, onClick }: {
  pos: PrintPosition; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all duration-200 ${
        active
          ? "border-primary bg-primary/12"
          : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
      }`}
    >
      <div className="flex items-center gap-2 w-full">
        <span
          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            active ? "border-primary" : "border-white/30"
          }`}
        >
          {active && <span className="w-2 h-2 rounded-full bg-primary" />}
        </span>
        <span className={`text-sm font-bold transition-colors ${active ? "text-white" : "text-gray-300"}`}>
          {pos.label}
        </span>
      </div>
      <p className="text-xs text-gray-500 ml-6 leading-snug">{pos.desc}</p>
    </button>
  );
}

/* ─── Design Upload Box ─── */
function DesignUploadBox({
  label, file, preview, inputRef,
  onFileChange, onRemove,
}: {
  label?: string;
  file: File | null;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div>
      {label && <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>}
      {!preview ? (
        <label className="relative flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/4 transition-all duration-200">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Upload size={18} className="text-primary" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Tap to upload design</p>
            <p className="text-gray-500 text-xs mt-0.5">PNG, JPG, SVG, PDF — Max 10 MB</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".png,.jpg,.jpeg,.svg,.pdf"
            onChange={onFileChange}
          />
        </label>
      ) : (
        <div className="rounded-xl overflow-hidden border border-white/12">
          <img src={preview} alt="Design" className="w-full max-h-36 object-contain bg-[#0d0d0d] p-4" />
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-t border-white/8">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm font-semibold truncate max-w-[200px]">{file?.name}</span>
            </div>
            <button onClick={onRemove} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomizeProductPage() {
  const { category } = useParams<{ category: string }>();
  const [, setLocation] = useLocation();

  /* ── Parse locked variant from URL query params ── */
  const lockedVariant = useMemo(() => {
    const search = window.location.search;
    if (!search) return null;
    const p = new URLSearchParams(search);
    const color = p.get("color");
    const colorHex = p.get("colorHex");
    const variantId = p.get("variantId");
    const imageUrl = p.get("imageUrl");
    const productId = p.get("productId");
    if (!color && !imageUrl) return null;
    return { color: color ?? "", colorHex: colorHex ?? "", variantId: variantId ?? "", imageUrl: imageUrl ?? "", productId: productId ?? "" };
  }, []);

  const isVariantLocked = !!lockedVariant?.color;
  const meta = CATEGORY_META[category ?? ""] ?? CATEGORY_META["t-shirts"];
  const Icon = meta.icon;
  const isTShirt = category === "t-shirts";
  const positions = PRINT_POSITIONS[category ?? ""] ?? [];
  const hasPositions = positions.length > 0;

  const { addItem, openCart } = useCart();

  /* ── Print position ── */
  const [printPosition, setPrintPosition] = useState<string>(positions[0]?.id ?? "front");
  const isBothSides = printPosition === "both";
  const [activeSide, setActiveSide] = useState<DesignSide>("front");

  /* ── Tab ── */
  const [tab, setTab] = useState<Tab>("upload");

  /* ── T-Shirt specific ── */
  const [gender, setGender] = useState<Gender>("Unisex");
  const [sizeQty, setSizeQty] = useState<Record<TShirtSize, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
  const totalQty = Object.values(sizeQty).reduce((a, b) => a + b, 0);

  const setSizeAmount = (size: TShirtSize, val: string) => {
    const n = Math.max(0, parseInt(val) || 0);
    setSizeQty(prev => ({ ...prev, [size]: n }));
  };

  /* ── Locked color values ── */
  const effectiveColor = isVariantLocked ? lockedVariant!.color : "";
  const effectiveColorHex = isVariantLocked ? lockedVariant!.colorHex : "";

  /* ── Non-T-Shirt quantity ── */
  const [quantity, setQuantity] = useState(1);

  /* ── Front design upload ── */
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const frontRef = useRef<HTMLInputElement>(null);

  /* ── Back design upload (Both Sides only) ── */
  const [backFile, setBackFile] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const backRef = useRef<HTMLInputElement>(null);

  /* ── Logo upload ── */
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  /* ── Cart saved state ── */
  const [saved, setSaved] = useState(false);

  /* ── Request tab state ── */
  const [customText, setCustomText] = useState("");
  const [requirements, setRequirements] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  /* ── File handlers ── */
  const makeFileHandler = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const makeRemoveHandler = (
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    ref: React.RefObject<HTMLInputElement>
  ) => () => {
    setFile(null); setPreview(null);
    if (ref.current) ref.current.value = "";
  };

  /* ── Print position label for orders ── */
  const printPositionLabel = positions.find(p => p.id === printPosition)?.label ?? printPosition;

  /* ── Derived values ── */
  const sizeBreakdown = T_SHIRT_SIZES.filter(s => sizeQty[s] > 0).map(s => `${s}×${sizeQty[s]}`).join(", ");
  const effectiveQty = isTShirt ? totalQty : quantity;

  /* ── Back navigation ── */
  const handleBack = () => {
    if (lockedVariant?.productId && category) { history.back(); }
    else { setLocation("/customize"); }
  };

  /* ── Save Customization to Cart ── */
  const handleSaveToCart = () => {
    const uploadNote = isBothSides
      ? [frontFile?.name && `Front: ${frontFile.name}`, backFile?.name && `Back: ${backFile.name}`].filter(Boolean).join(" | ")
      : frontFile?.name ?? undefined;

    addItem({
      productId: lockedVariant?.productId ?? `${category}-custom`,
      productName: `Custom ${meta.label}`,
      categorySlug: category ?? "",
      categoryLabel: meta.label,
      price: meta.price,
      priceLabel: meta.priceLabel,
      isCustomized: true,
      quantity: effectiveQty || 1,
      image: lockedVariant?.imageUrl || undefined,
      customization: {
        color: effectiveColor || undefined,
        colorHex: effectiveColorHex || undefined,
        size: isTShirt ? sizeBreakdown || undefined : undefined,
        quantity: effectiveQty || 1,
        uploadedFileName: uploadNote,
        printPosition: hasPositions ? printPositionLabel : undefined,
      },
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); openCart(); }, 1600);
  };

  /* ── WhatsApp Request ── */
  const handleSubmitRequest = () => {
    const lines = [
      `Hello Radhe Digital! I'd like to request a custom ${meta.label}.`,
      ``,
      `*Product:* ${meta.label}`,
      hasPositions ? `*Print Position:* ${printPositionLabel}` : "",
      isTShirt ? `*Gender:* ${gender}` : "",
      isTShirt && effectiveColor ? `*Color:* ${effectiveColor}` : "",
      lockedVariant?.variantId ? `*Variant ID:* ${lockedVariant.variantId}` : "",
      isTShirt
        ? T_SHIRT_SIZES.filter(s => sizeQty[s] > 0).map(s => `*${s}:* ${sizeQty[s]} pcs`).join("\n")
        : `*Quantity:* ${quantity}`,
      isTShirt ? `*Total Quantity:* ${totalQty} T-Shirts` : "",
      customText   ? `*Custom Text:* ${customText}` : "",
      requirements ? `*Design Requirements:* ${requirements}` : "",
      instructions ? `*Special Instructions:* ${instructions}` : "",
      lockedVariant?.imageUrl ? `*Product Image:* ${lockedVariant.imageUrl}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/919319903380?text=${encodeURIComponent(lines)}`, "_blank");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  /* ── Step numbering ── */
  // Step 1 always = Print Position (when positions exist)
  // T-shirt: +Gender, +Color(if unlocked), +Size — then uploads
  const tShirtBaseSteps = hasPositions ? 1 : 0;
  const genderStep   = tShirtBaseSteps + 1;
  const colorStep    = genderStep + 1;                          // only when !isVariantLocked
  const sizeStep     = isVariantLocked ? genderStep + 1 : colorStep + 1;
  const uploadStep   = isTShirt ? sizeStep + 1 : (hasPositions ? 2 : 1);
  const logoStep     = uploadStep + 1;
  const qtyStep      = logoStep + 1;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <section className="bg-[#0a0a0a] border-b border-white/8 py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-5 transition-colors"
          >
            <ArrowLeft size={14} /> {lockedVariant?.productId ? "Back to Product" : "Back to Categories"}
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}
            >
              <Icon size={22} style={{ color: meta.color }} />
            </div>
            <div>
              <span className="text-xs font-bold tracking-[0.18em] uppercase text-gray-500">Customize</span>
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{meta.label}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* ── Locked Variant Banner ── */}
        {isVariantLocked && (
          <div
            className="flex items-center gap-4 rounded-2xl p-4 border"
            style={{ background: "rgba(196,150,42,0.07)", borderColor: "rgba(196,150,42,0.25)" }}
          >
            {lockedVariant!.imageUrl ? (
              <img
                src={lockedVariant!.imageUrl}
                alt={lockedVariant!.color}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-white/10"
              />
            ) : (
              <span
                className="w-16 h-16 rounded-xl flex-shrink-0 border border-white/10"
                style={{ backgroundColor: lockedVariant!.colorHex || "#888" }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={12} style={{ color: "#C4962A" }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C4962A" }}>Variant Locked</span>
              </div>
              <p className="text-white font-bold text-sm">{lockedVariant!.color ? `Color: ${lockedVariant!.color}` : "Original Product"}</p>
              <p className="text-gray-500 text-xs mt-0.5">This color is locked from your product selection.</p>
            </div>
            {lockedVariant!.colorHex && (
              <span className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/20" style={{ backgroundColor: lockedVariant!.colorHex }} />
            )}
          </div>
        )}

        {/* ── Step 1: Print Position ── */}
        {hasPositions && (
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Step n={1} />
              <span>Choose Print Position</span>
              {printPosition && (
                <span
                  className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(229,62,62,0.12)", color: "#fc8181", border: "1px solid rgba(229,62,62,0.25)" }}
                >
                  {printPositionLabel}
                </span>
              )}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2.5">
              {positions.map(pos => (
                <PositionCard
                  key={pos.id}
                  pos={pos}
                  active={printPosition === pos.id}
                  onClick={() => { setPrintPosition(pos.id); setActiveSide("front"); }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab switcher */}
        <div className="grid grid-cols-2 gap-2 bg-[#111] border border-white/8 rounded-2xl p-1.5">
          {(["upload", "request"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white"
              }`}
            >
              {t === "upload" ? <><Upload size={14} /> Upload Existing Design</> : <><MessageCircle size={14} /> Request Design Creation</>}
            </button>
          ))}
        </div>

        {/* ── T-Shirt shared options ── */}
        {isTShirt && (
          <>
            {/* Gender */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={genderStep} /> Gender Type
              </h2>
              <div className="flex gap-3">
                {GENDER_OPTIONS.map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      gender === g
                        ? "bg-primary text-white border-primary"
                        : "bg-white/6 text-gray-300 border-white/12 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Color (only when NOT locked) */}
            {!isVariantLocked && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Step n={colorStep} /> T-Shirt Color
                </h2>
                <p className="text-gray-500 text-sm mb-3">
                  Select a color from the product page, or describe your preferred color below.
                </p>
                <Input
                  placeholder="e.g. Sky Blue, Maroon, Olive Green, Bottle Green..."
                  className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
                />
              </div>
            )}

            {/* Size + Quantity */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <Step n={sizeStep} /> Size &amp; Quantity
              </h2>
              <p className="text-gray-500 text-xs mb-5 ml-8">Enter how many pieces per size. Leave blank if not needed.</p>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-3 px-1 mb-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Size</span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity (pcs)</span>
                </div>
                {T_SHIRT_SIZES.map(s => (
                  <div
                    key={s}
                    className={`grid grid-cols-2 gap-3 items-center px-4 py-3 rounded-xl border transition-colors ${
                      sizeQty[s] > 0 ? "bg-primary/8 border-primary/30" : "bg-white/4 border-white/8"
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black border ${
                      sizeQty[s] > 0 ? "bg-primary text-white border-primary" : "bg-white/8 text-gray-300 border-white/12"
                    }`}>{s}</span>
                    <input
                      type="number" min={0}
                      value={sizeQty[s] === 0 ? "" : sizeQty[s]}
                      onChange={e => setSizeAmount(s, e.target.value)}
                      placeholder="0"
                      className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-3 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
              <div className={`mt-4 flex items-center justify-between px-4 py-3 rounded-xl border ${
                totalQty > 0 ? "bg-primary/10 border-primary/30" : "bg-white/4 border-white/8"
              }`}>
                <span className="text-sm font-semibold text-gray-300">Total T-Shirts</span>
                <span className={`text-xl font-extrabold ${totalQty > 0 ? "text-primary" : "text-gray-600"}`}>{totalQty}</span>
              </div>
              {totalQty >= 10 && <p className="text-yellow-400 text-xs mt-2 text-center">🎉 Bulk order — we'll offer you a special price!</p>}
            </div>
          </>
        )}

        {/* ── Upload Tab content ── */}
        {tab === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            {/* Upload Design — split by side when "Both Sides" */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={uploadStep} />
                {isBothSides ? "Upload Your Designs" : "Upload Your Design"}
              </h2>

              {isBothSides ? (
                <>
                  {/* Side tab switcher */}
                  <div className="flex gap-2 mb-4">
                    {(["front", "back"] as DesignSide[]).map(side => (
                      <button
                        key={side}
                        onClick={() => setActiveSide(side)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 flex items-center justify-center gap-2 ${
                          activeSide === side
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {side === "front" ? <AlignCenter size={14} /> : <RotateCcw size={14} />}
                        {side === "front" ? "Front Design" : "Back Design"}
                        {side === "front" && frontFile && <CheckCircle2 size={13} className="text-green-400" />}
                        {side === "back" && backFile && <CheckCircle2 size={13} className="text-green-400" />}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    {activeSide === "front" ? (
                      <motion.div key="front" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                        <DesignUploadBox
                          file={frontFile}
                          preview={frontPreview}
                          inputRef={frontRef}
                          onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                          onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                        />
                      </motion.div>
                    ) : (
                      <motion.div key="back" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                        <DesignUploadBox
                          file={backFile}
                          preview={backPreview}
                          inputRef={backRef}
                          onFileChange={makeFileHandler(setBackFile, setBackPreview)}
                          onRemove={makeRemoveHandler(setBackFile, setBackPreview, backRef)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <DesignUploadBox
                  file={frontFile}
                  preview={frontPreview}
                  inputRef={frontRef}
                  onFileChange={makeFileHandler(setFrontFile, setFrontPreview)}
                  onRemove={makeRemoveHandler(setFrontFile, setFrontPreview, frontRef)}
                />
              )}
            </div>

            {/* Logo */}
            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                <Step n={logoStep} />
                Upload Your Logo
                <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <p className="text-gray-500 text-xs mb-4 ml-8">If your design includes a separate logo file, upload it here.</p>
              {!logoFile ? (
                <label className="relative flex items-center gap-3 py-4 px-5 border border-dashed border-white/12 rounded-xl cursor-pointer hover:border-primary/30 hover:bg-primary/4 transition-all">
                  <Upload size={15} className="text-gray-500" />
                  <span className="text-gray-400 text-sm">Tap to upload logo (PNG, SVG)</span>
                  <input ref={logoRef} type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".png,.jpg,.jpeg,.svg" onChange={e => { const f = e.target.files?.[0]; if (f) setLogoFile(f); }} />
                </label>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border border-white/12 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm font-semibold truncate max-w-[220px]">{logoFile.name}</span>
                  </div>
                  <button onClick={() => { setLogoFile(null); if (logoRef.current) logoRef.current.value = ""; }} className="text-gray-500 hover:text-red-400 transition-colors"><X size={14} /></button>
                </div>
              )}
            </div>

            {/* Quantity (non-T-shirt) */}
            {!isTShirt && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Step n={qtyStep} /> Select Quantity
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">−</button>
                  <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">+</button>
                  <span className="text-gray-500 text-sm ml-1">pieces</span>
                </div>
                {quantity >= 10 && <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>}
              </div>
            )}

            {/* ── Order Summary Preview ── */}
            {(hasPositions || isTShirt) && (
              <div
                className="rounded-2xl p-4 border space-y-2"
                style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Summary</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Product</span>
                    <span className="text-white font-semibold">{meta.label}</span>
                  </div>
                  {hasPositions && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Print Position</span>
                      <span className="text-white font-semibold">{printPositionLabel}</span>
                    </div>
                  )}
                  {isTShirt && gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Gender</span>
                      <span className="text-white font-semibold">{gender}</span>
                    </div>
                  )}
                  {effectiveColor && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Color</span>
                      <span className="text-white font-semibold flex items-center gap-1.5">
                        {effectiveColorHex && <span className="w-3 h-3 rounded-full inline-block border border-white/20" style={{ backgroundColor: effectiveColorHex }} />}
                        {effectiveColor}
                      </span>
                    </div>
                  )}
                  {isTShirt && totalQty > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sizes</span>
                      <span className="text-white font-semibold">{sizeBreakdown}</span>
                    </div>
                  )}
                  {isBothSides && (frontFile || backFile) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Designs</span>
                      <span className="text-white font-semibold text-right">
                        {[frontFile && "Front ✓", backFile && "Back ✓"].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  {!isBothSides && frontFile && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Design File</span>
                      <span className="text-green-400 font-semibold">Uploaded ✓</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Save Customization Button ── */}
            <motion.button
              onClick={handleSaveToCart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={saved
                ? { background: "linear-gradient(135deg,#38a169,#276749)", boxShadow: "0 4px 20px rgba(56,161,105,0.35)" }
                : { background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 20px rgba(229,62,62,0.35)" }
              }
            >
              {saved ? (
                <><CheckCircle2 size={20} /> Customization Saved — Opening Cart</>
              ) : (
                <><Sparkles size={20} /> Save Customization &amp; Add to Cart {isTShirt && totalQty > 0 ? `(${totalQty} pcs)` : ""}</>
              )}
            </motion.button>
            <p className="text-center text-gray-600 text-xs">
              No upfront payment · Confirm your customized order via WhatsApp after checkout.
            </p>
          </motion.div>
        )}

        {/* ── Request Tab content ── */}
        {tab === "request" && (
          <motion.div key="request" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={uploadStep} /> Custom Text
              </h2>
              <Input
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="e.g. Team Name, Company Name, Slogan..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 h-11 rounded-xl"
              />
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={uploadStep + 1} /> Design Requirements
              </h2>
              <Textarea
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="Describe what you want — theme, style, colours, images, logo idea..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-28"
              />
            </div>

            <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
              <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                <Step n={uploadStep + 2} />
                Special Instructions <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
              </h2>
              <Textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Delivery deadline, print on back only, reference image links..."
                className="bg-[#1a1a1a] border-white/12 text-white placeholder-gray-600 focus:border-primary/50 rounded-xl resize-none h-20"
              />
            </div>

            {!isTShirt && (
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
                  <Step n={uploadStep + 3} /> Select Quantity
                </h2>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">−</button>
                  <span className="w-14 text-center text-white font-bold text-xl">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 rounded-xl bg-white/8 hover:bg-white/15 text-white font-bold text-xl transition-colors flex items-center justify-center">+</button>
                  <span className="text-gray-500 text-sm ml-1">pieces</span>
                </div>
                {quantity >= 10 && <p className="text-yellow-400 text-xs mt-3">🎉 Bulk order — we'll offer you a special price!</p>}
              </div>
            )}

            <motion.button
              onClick={handleSubmitRequest}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-base transition-all duration-200"
              style={{ background: "linear-gradient(135deg,#25d366,#128c7e)", boxShadow: "0 4px 20px rgba(37,211,102,0.25)" }}
            >
              {submitted
                ? <><CheckCircle2 size={20} /> Request Sent!</>
                : <><MessageCircle size={20} /> Submit Design Request via WhatsApp {isTShirt && totalQty > 0 ? `(${totalQty} pcs)` : ""}</>
              }
            </motion.button>
            <p className="text-center text-gray-600 text-xs">
              Our team will review your requirements and get back to you within a few hours.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
