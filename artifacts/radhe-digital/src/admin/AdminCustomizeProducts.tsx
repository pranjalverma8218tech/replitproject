import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, X, Loader2, RefreshCw, WifiOff,
  AlertCircle, Upload, CheckCircle2, Paintbrush, ImageOff,
  Package, ChevronDown, Tag, Palette,
} from "lucide-react";
import {
  getCustomizeProducts, createCustomizeProduct, updateCustomizeProduct,
  deleteCustomizeProduct, uploadImageWithProgress,
  type CustomizeProduct,
} from "./api";

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = ["T-Shirts", "Mugs", "Caps", "Hoodies", "Corporate Gifts"] as const;
type Category = typeof CATEGORIES[number];

const SIZES = ["S", "M", "L", "XL", "XXL", "3XL"];

const CATEGORY_SLUG: Record<string, string> = {
  "T-Shirts":        "t-shirts",
  "Mugs":            "mugs",
  "Caps":            "caps",
  "Hoodies":         "hoodies",
  "Corporate Gifts": "corporate-gifts",
};

type ImageField = "frontImage" | "backImage" | "sideImage";

interface FormState {
  name: string;
  productType: string;
  category: Category;
  basePrice: number;
  description: string;
  frontImage: string;
  backImage: string;
  sideImage: string;
  colors: string[];
  sizes: string[];
  status: "Active" | "Inactive";
}

const EMPTY_FORM: FormState = {
  name: "", productType: "", category: "T-Shirts", basePrice: 0,
  description: "", frontImage: "", backImage: "", sideImage: "",
  colors: [], sizes: [], status: "Active",
};

function productToForm(p: CustomizeProduct): FormState {
  return {
    name: p.name, productType: p.productType, category: p.category as Category,
    basePrice: Number(p.basePrice), description: p.description,
    frontImage: p.frontImage, backImage: p.backImage, sideImage: p.sideImage,
    colors: p.colors ?? [], sizes: p.sizes ?? [], status: p.status,
  };
}

// ─── Image Upload Box ─────────────────────────────────────────────────────────
function ImageUploadBox({
  label, value, onUploaded, uploadKey,
}: {
  label: string;
  value: string;
  onUploaded: (url: string) => void;
  uploadKey: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const { url } = await uploadImageWithProgress(file, p => setProgress(p));
      onUploaded(url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProgress(null);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#111] group">
          <img src={value} alt={label} className="w-full h-32 object-contain p-2" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => onUploaded("")}
              className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg"
            >
              Remove
            </button>
            <label className="px-3 py-1.5 bg-white/20 text-white text-xs font-bold rounded-lg cursor-pointer">
              Replace
              <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
            </label>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/4 transition-all group">
          {progress !== null ? (
            <>
              <Loader2 size={18} className="animate-spin text-primary" />
              <span className="text-xs text-primary font-bold">{progress}%</span>
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <Upload size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">Upload {label}</span>
            </>
          )}
          <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handle} />
        </label>
      )}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

// ─── Color Tag Input ──────────────────────────────────────────────────────────
function ColorTagInput({ colors, onChange }: { colors: string[]; onChange: (c: string[]) => void }) {
  const [input, setInput] = useState("");

  const add = () => {
    const v = input.trim();
    if (v && !colors.includes(v)) {
      onChange([...colors, v]);
    }
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="e.g. White, Black, Red…"
          className="flex-1 bg-[#111] border border-white/12 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 bg-primary/15 border border-primary/30 text-primary text-sm font-bold rounded-xl hover:bg-primary/25 transition-all"
        >
          Add
        </button>
      </div>
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <span key={c} className="flex items-center gap-1.5 px-3 py-1 bg-white/6 border border-white/12 rounded-full text-sm text-white font-medium">
              {c}
              <button onClick={() => onChange(colors.filter(x => x !== c))} className="text-gray-500 hover:text-red-400 transition-colors">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Size Checkbox Grid ───────────────────────────────────────────────────────
function SizeSelector({ selected, onChange }: { selected: string[]; onChange: (s: string[]) => void }) {
  const toggle = (size: string) => {
    onChange(selected.includes(size) ? selected.filter(s => s !== size) : [...selected, size]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {SIZES.map(size => (
        <button
          key={size}
          type="button"
          onClick={() => toggle(size)}
          className="w-12 h-10 rounded-lg border-2 text-sm font-black transition-all"
          style={
            selected.includes(size)
              ? { borderColor: "#DC2626", background: "rgba(220,38,38,0.15)", color: "#DC2626" }
              : { borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", color: "#9ca3af" }
          }
        >
          {size}
        </button>
      ))}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product, onEdit, onDelete,
}: {
  product: CustomizeProduct;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const img = product.frontImage || product.sideImage || product.backImage;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden hover:border-white/16 transition-all group"
    >
      {/* Image */}
      <div className="aspect-square bg-[#0d0d0d] relative overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-contain p-4" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageOff size={32} className="text-gray-700" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={
              product.status === "Active"
                ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.25)" }
                : { background: "rgba(255,255,255,0.06)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.1)" }
            }
          >
            {product.status}
          </span>
        </div>
        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={onEdit}
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors"
          >
            <Edit2 size={15} className="text-white" />
          </button>
          <button
            onClick={onDelete}
            className="w-10 h-10 rounded-xl bg-red-600/80 flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Trash2 size={15} className="text-white" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div>
          <p className="text-white font-bold text-sm leading-tight">{product.name}</p>
          {product.productType && (
            <p className="text-gray-500 text-xs mt-0.5">{product.productType}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/6 text-gray-400 border border-white/10">
            {product.category}
          </span>
          <span className="text-primary font-black text-sm">₹{Number(product.basePrice).toLocaleString("en-IN")}</span>
        </div>
        {(product.colors?.length > 0 || product.sizes?.length > 0) && (
          <div className="flex flex-wrap gap-1 pt-1 border-t border-white/6">
            {product.sizes?.length > 0 && (
              <span className="text-xs text-gray-600">{product.sizes.join(", ")}</span>
            )}
            {product.colors?.length > 0 && (
              <span className="text-xs text-gray-600 ml-auto">{product.colors.length} color{product.colors.length > 1 ? "s" : ""}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminCustomizeProducts() {
  const [products, setProducts] = useState<CustomizeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<CustomizeProduct | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomizeProducts();
      setProducts(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (p: CustomizeProduct) => {
    setEditingId(p.id);
    setForm(productToForm(p));
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Product name is required."); return; }
    if (!form.category) { setFormError("Category is required."); return; }
    if (form.basePrice <= 0) { setFormError("Base price must be greater than 0."); return; }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: form.name.trim(),
        productType: form.productType.trim(),
        category: form.category,
        categorySlug: CATEGORY_SLUG[form.category] ?? "corporate-gifts",
        basePrice: form.basePrice,
        description: form.description.trim(),
        frontImage: form.frontImage,
        backImage: form.backImage,
        sideImage: form.sideImage,
        colors: form.colors,
        sizes: form.sizes,
        status: form.status,
      };

      if (editingId) {
        await updateCustomizeProduct(editingId, payload);
        setSuccessMsg("Product updated successfully.");
      } else {
        await createCustomizeProduct(payload);
        setSuccessMsg("Product created successfully.");
      }
      closeModal();
      load();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCustomizeProduct(deleteTarget.id);
      setSuccessMsg(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      load();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  // Filter products client-side
  const filtered = products.filter(p => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    const matchSearch = !search || [p.name, p.productType, p.category]
      .some(v => v.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-black text-xl">Customization Products</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Plain products used in the Customize Printing section. Separate from regular products.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary rounded-xl text-white font-bold text-sm hover:bg-primary/85 transition-colors"
        >
          <Plus size={16} />
          Add Customization Product
        </button>
      </div>

      {/* ── Banners ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-500/25 bg-green-500/8"
          >
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-sm font-medium">{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="ml-auto"><X size={14} className="text-green-400" /></button>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-red-500/25 bg-red-500/8"
          >
            <WifiOff size={16} className="text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X size={14} className="text-red-400" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, type, category…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 bg-[#111] border border-white/10 rounded-xl text-sm text-white outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>

        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2.5 bg-[#111] border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="flex gap-4 flex-wrap text-sm">
        <span className="text-gray-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
        <span className="text-gray-600">·</span>
        <span className="text-green-400 font-medium">{products.filter(p => p.status === "Active").length} active</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-500">{products.filter(p => p.status === "Inactive").length} inactive</span>
      </div>

      {/* ── Product Grid ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin text-primary" />
          <span className="text-gray-500 text-sm ml-3">Loading products…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Paintbrush size={36} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-semibold">
            {products.length === 0 ? "No customization products yet." : "No products match your filters."}
          </p>
          {products.length === 0 && (
            <button onClick={openAdd} className="mt-4 px-5 py-2.5 bg-primary rounded-xl text-white font-bold text-sm hover:bg-primary/85 transition-colors">
              Add First Product
            </button>
          )}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={() => openEdit(p)}
              onDelete={() => setDeleteTarget(p)}
            />
          ))}
        </motion.div>
      )}

      {/* ══════════════════════════════════════════════════════
          ADD / EDIT MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
            >
              <div
                className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl my-8"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center">
                      <Paintbrush size={15} className="text-primary" />
                    </div>
                    <h2 className="text-white font-bold text-base">
                      {editingId ? "Edit Customization Product" : "Add Customization Product"}
                    </h2>
                  </div>
                  <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-white rounded-xl hover:bg-white/8 transition-all">
                    <X size={16} />
                  </button>
                </div>

                <div className="p-6 space-y-6">

                  {/* Error */}
                  {formError && (
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/20">
                      <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-300 text-sm">{formError}</p>
                    </div>
                  )}

                  {/* Row 1: Name + Product Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setField("name", e.target.value)}
                        placeholder="e.g. Plain Round Neck T-Shirt"
                        className="w-full bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Type</label>
                      <input
                        value={form.productType}
                        onChange={e => setField("productType", e.target.value)}
                        placeholder="e.g. Round Neck, Polo, Oversized"
                        className="w-full bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40"
                      />
                    </div>
                  </div>

                  {/* Row 2: Category + Base Price + Status */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category *</label>
                      <div className="relative">
                        <select
                          value={form.category}
                          onChange={e => setField("category", e.target.value as Category)}
                          className="w-full appearance-none bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/40 cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Base Price (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        value={form.basePrice || ""}
                        onChange={e => setField("basePrice", Number(e.target.value))}
                        placeholder="199"
                        className="w-full bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                      <div className="relative">
                        <select
                          value={form.status}
                          onChange={e => setField("status", e.target.value as "Active" | "Inactive")}
                          className="w-full appearance-none bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary/40 cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => setField("description", e.target.value)}
                      placeholder="Brief product description…"
                      rows={3}
                      className="w-full bg-[#0d0d0d] border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 resize-none"
                    />
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Upload size={12} /> Product Images
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <ImageUploadBox
                        label="Front Image"
                        value={form.frontImage}
                        onUploaded={url => setField("frontImage", url)}
                        uploadKey="front"
                      />
                      <ImageUploadBox
                        label="Back Image"
                        value={form.backImage}
                        onUploaded={url => setField("backImage", url)}
                        uploadKey="back"
                      />
                      <ImageUploadBox
                        label="Side Image"
                        value={form.sideImage}
                        onUploaded={url => setField("sideImage", url)}
                        uploadKey="side"
                      />
                    </div>
                  </div>

                  {/* Available Colors */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Palette size={12} /> Available Colors <span className="font-normal text-gray-600 normal-case">(optional)</span>
                    </label>
                    <ColorTagInput colors={form.colors} onChange={c => setField("colors", c)} />
                  </div>

                  {/* Available Sizes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Tag size={12} /> Available Sizes <span className="font-normal text-gray-600 normal-case">(optional)</span>
                    </label>
                    <SizeSelector selected={form.sizes} onChange={s => setField("sizes", s)} />
                  </div>

                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/8">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl text-gray-400 hover:text-white text-sm font-semibold hover:bg-white/6 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/85 transition-all disabled:opacity-60"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {editingId ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation ── */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setDeleteTarget(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={20} className="text-red-400" />
                </div>
                <h3 className="text-white font-bold text-center text-base mb-1">Delete Product</h3>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Are you sure you want to delete <strong className="text-white">"{deleteTarget.name}"</strong>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-all hover:bg-white/6"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleting && <Loader2 size={13} className="animate-spin" />}
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
