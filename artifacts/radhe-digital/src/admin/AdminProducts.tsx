import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, X, Package, ChevronDown, Loader2,
  RefreshCw, WifiOff, AlertCircle, Image as ImageIcon, ListChecks,
  PlusCircle, MinusCircle, Upload, Link2, CheckCircle2
} from "lucide-react";
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  uploadImage,
  type Product, type ProductImage, type ProductSpec, DB_NOT_CONNECTED_MSG
} from "./api";
import { invalidateApiProductsCache } from "@/hooks/useApiProducts";
import type { ProductCategory } from "./sampleData";

const CATEGORIES: ProductCategory[] = [
  "T-Shirt Printing", "Mug Printing", "Cap Printing",
  "Mobile Cover Printing", "Corporate Gifts", "Customized Products",
];

const BADGES = ["", "Best Seller", "Popular", "Trending", "Premium", "Bulk Deal", "Eco", "New"];

const IMAGE_VIEWS: { view: ProductImage["view"]; label: string }[] = [
  { view: "front",   label: "Front View" },
  { view: "back",    label: "Back View" },
  { view: "side",    label: "Side View" },
  { view: "closeup", label: "Close-Up View" },
];

const EMPTY_IMAGES: ProductImage[] = IMAGE_VIEWS.map(v => ({ view: v.view, label: v.label, url: "" }));

interface FormState {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  priceLabel: string;
  badge: string;
  tags: string;
  images: ProductImage[];
  features: string[];
  specifications: ProductSpec[];
  status: "Active" | "Inactive";
  stock: number;
}

const EMPTY_FORM: FormState = {
  id: "", name: "", category: "T-Shirt Printing", description: "",
  price: 0, priceLabel: "", badge: "", tags: "",
  images: EMPTY_IMAGES,
  features: [""],
  specifications: [{ label: "", value: "" }],
  status: "Active", stock: 0,
};

function productToForm(p: Product): FormState {
  const existingImages = (p.images ?? []) as ProductImage[];
  const images = IMAGE_VIEWS.map(v => {
    const found = existingImages.find(i => i.view === v.view);
    return found ?? { view: v.view, label: v.label, url: "" };
  });
  return {
    id: p.id,
    name: p.name, category: p.category as ProductCategory,
    description: p.description ?? "", price: Number(p.price),
    priceLabel: p.priceLabel ?? "",
    badge: p.badge ?? "", tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
    images,
    features: p.features && p.features.length > 0 ? p.features : [""],
    specifications: p.specifications && p.specifications.length > 0 ? p.specifications : [{ label: "", value: "" }],
    status: p.status, stock: p.stock,
  };
}

type Tab = "info" | "images" | "details";

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [dbDown,   setDbDown]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
  const [form,     setForm]     = useState<FormState>(EMPTY_FORM);
  const [tab,      setTab]      = useState<Tab>("info");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try { setProducts(await getProducts({ search: search || undefined })); }
    catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) setDbDown(true);
      else setError(e.message ?? "Failed to load products");
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY_FORM); setTab("info"); setModal({ open: true, editing: null }); };
  const openEdit = (p: Product) => { setForm(productToForm(p)); setTab("info"); setModal({ open: true, editing: p }); };
  const closeModal = () => { setModal({ open: false, editing: null }); };

  const setImage = (idx: number, url: string) => {
    setForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? { ...img, url } : img) }));
  };

  const handleFileUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx);
    try {
      const { url } = await uploadImage(file);
      setImage(idx, url);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setUploadingIdx(null);
    }
  };

  const setFeature = (idx: number, val: string) =>
    setForm(f => ({ ...f, features: f.features.map((v, i) => i === idx ? val : v) }));
  const addFeature = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (idx: number) =>
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));

  const setSpec = (idx: number, key: "label" | "value", val: string) =>
    setForm(f => ({ ...f, specifications: f.specifications.map((s, i) => i === idx ? { ...s, [key]: val } : s) }));
  const addSpec = () => setForm(f => ({ ...f, specifications: [...f.specifications, { label: "", value: "" }] }));
  const removeSpec = (idx: number) =>
    setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    if (!form.name.trim()) { setTab("info"); return; }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || undefined,
        price: form.price,
        priceLabel: form.priceLabel.trim() || undefined,
        badge: form.badge || undefined,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        images: form.images.filter(i => i.url.trim()),
        features: form.features.filter(f => f.trim()),
        specifications: form.specifications.filter(s => s.label.trim() && s.value.trim()),
        status: form.status,
        stock: form.stock,
      };
      if (!modal.editing && form.id.trim()) {
        payload.id = form.id.trim();
      }
      if (modal.editing) {
        const updated = await updateProduct(modal.editing.id, payload);
        setProducts(prev => prev.map(p => p.id === modal.editing!.id ? { ...p, ...updated } : p));
      } else {
        const created = await createProduct(payload as Parameters<typeof createProduct>[0]);
        setProducts(prev => [created, ...prev]);
      }
      invalidateApiProductsCache();
      closeModal();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e: any) { setError(e.message); }
    finally { setDeleteId(null); }
  };

  const getProductThumb = (p: Product) => {
    const imgs = p.images as ProductImage[] | undefined;
    const front = imgs?.find(i => i.view === "front" && i.url);
    return front?.url ?? (imgs?.find(i => i.url)?.url) ?? p.imageUrl ?? null;
  };

  const TAB_LABELS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "info",    label: "Basic Info",     icon: <Package size={13} /> },
    { id: "images",  label: "Images",         icon: <ImageIcon size={13} /> },
    { id: "details", label: "Features & Specs", icon: <ListChecks size={13} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Loading…" : `${products.filter(p => p.status === "Active").length} active · ${products.filter(p => p.status === "Inactive").length} inactive`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={openAdd} disabled={dbDown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 14px rgba(229,62,62,0.3)" }}>
            <Plus size={15} /> Add Product
          </motion.button>
        </div>
      </div>

      {dbDown && (
        <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-4">
          <WifiOff size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div><p className="text-yellow-300 text-sm font-bold">Database Not Connected</p><p className="text-yellow-400/70 text-xs mt-1">{DB_NOT_CONNECTED_MSG}</p></div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
          className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-600">
          <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading products…</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{dbDown ? "Connect database to manage products" : "No products yet. Add your first product."}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => {
            const thumb = getProductThumb(p);
            const imgCount = ((p.images as ProductImage[] | undefined) ?? []).filter(i => i.url).length;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
                <div className="h-36 bg-[#1a1a1a] border-b border-white/6 flex items-center justify-center relative">
                  {thumb
                    ? <img src={thumb} alt={p.name} className="h-full w-full object-cover" />
                    : <Package size={36} className="text-gray-700" />
                  }
                  {imgCount > 0 && (
                    <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-gray-300 border border-white/10">
                      {imgCount} photo{imgCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{p.name}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{p.category}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ${p.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.badge && <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">{p.badge}</span>}
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{p.description}</p>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <p className="text-primary font-black text-lg">
                        {p.priceLabel || `₹${Number(p.price)}`}
                      </p>
                      <p className="text-gray-600 text-xs">Stock: {p.stock}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-xl bg-white/6 hover:bg-primary/15 hover:text-primary text-gray-400 flex items-center justify-center transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-xl bg-white/6 hover:bg-red-500/15 hover:text-red-400 text-gray-400 flex items-center justify-center transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {modal.open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)", maxHeight: "90vh" }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
                <h3 className="text-white font-bold text-base">{modal.editing ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all">
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/8 flex-shrink-0">
                {TAB_LABELS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-5 py-3 text-xs font-bold transition-all border-b-2 -mb-[1px] ${tab === t.id ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                {/* ── Tab: Basic Info ── */}
                {tab === "info" && (
                  <div className="p-6 space-y-4">
                    {!modal.editing && (
                      <div>
                        <label className="label-xs">Product ID <span className="text-gray-600 normal-case font-normal">(optional — use static ID like ts-001 to link with website catalog)</span></label>
                        <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                          placeholder="e.g. ts-001 (leave blank to auto-generate)"
                          className="input-field font-mono" />
                      </div>
                    )}
                    <div>
                      <label className="label-xs">Product Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Classic Round Neck T-Shirt"
                        className="input-field" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-xs">Category</label>
                        <div className="relative">
                          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))}
                            className="input-field appearance-none pr-8 cursor-pointer">
                            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="label-xs">Status</label>
                        <div className="relative">
                          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as "Active" | "Inactive" }))}
                            className="input-field appearance-none pr-8 cursor-pointer">
                            <option value="Active" className="bg-[#1a1a1a]">Active</option>
                            <option value="Inactive" className="bg-[#1a1a1a]">Inactive</option>
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="label-xs">Price (₹) *</label>
                        <input type="number" value={form.price || ""} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                          placeholder="199" className="input-field" />
                      </div>
                      <div>
                        <label className="label-xs">Price Label</label>
                        <input value={form.priceLabel} onChange={e => setForm(f => ({ ...f, priceLabel: e.target.value }))}
                          placeholder="₹199 or From ₹149" className="input-field" />
                      </div>
                      <div>
                        <label className="label-xs">Stock</label>
                        <input type="number" value={form.stock || ""} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                          placeholder="100" className="input-field" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-xs">Badge</label>
                        <div className="relative">
                          <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                            className="input-field appearance-none pr-8 cursor-pointer">
                            {BADGES.map(b => <option key={b} value={b} className="bg-[#1a1a1a]">{b || "— None —"}</option>)}
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="label-xs">Tags (comma-separated)</label>
                        <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                          placeholder="cotton, unisex, casual" className="input-field" />
                      </div>
                    </div>

                    <div>
                      <label className="label-xs">Description</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={3} placeholder="Product description…"
                        className="w-full bg-[#1a1a1a] border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors resize-none" />
                    </div>
                  </div>
                )}

                {/* ── Tab: Images ── */}
                {tab === "images" && (
                  <div className="p-6 space-y-4">
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Upload photos from your computer for each view. You can also paste a direct image URL instead.
                    </p>

                    {form.images.map((img, idx) => (
                      <div key={img.view} className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
                        {/* Hidden file input */}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          ref={el => { fileRefs.current[idx] = el; }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(idx, file);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />

                        <div className="flex gap-4 p-4">
                          {/* Thumbnail / Upload zone */}
                          <button
                            type="button"
                            onClick={() => fileRefs.current[idx]?.click()}
                            disabled={uploadingIdx === idx}
                            className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-primary/50 bg-[#0d0d0d] hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 overflow-hidden relative group"
                          >
                            {uploadingIdx === idx ? (
                              <Loader2 size={20} className="animate-spin text-primary" />
                            ) : img.url ? (
                              <>
                                <img
                                  src={img.url}
                                  alt={img.label}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  onError={() => {}}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Upload size={16} className="text-white" />
                                </div>
                                <div className="absolute top-1 right-1">
                                  <CheckCircle2 size={14} className="text-green-400 drop-shadow" />
                                </div>
                              </>
                            ) : (
                              <>
                                <Upload size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                                <span className="text-[9px] text-gray-600 group-hover:text-primary transition-colors font-semibold text-center leading-tight">
                                  Click to<br/>upload
                                </span>
                              </>
                            )}
                          </button>

                          {/* Label + URL input + actions */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-0.5 rounded-lg border border-white/10 bg-white/4">
                                {img.label}
                              </span>
                              {img.url && (
                                <button
                                  onClick={() => setImage(idx, "")}
                                  className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors font-semibold flex items-center gap-1"
                                >
                                  <X size={11} /> Remove
                                </button>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => fileRefs.current[idx]?.click()}
                                disabled={uploadingIdx === idx}
                                className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold transition-all border border-primary/20 flex-shrink-0 disabled:opacity-50"
                              >
                                <Upload size={12} />
                                {uploadingIdx === idx ? "Uploading…" : "Upload"}
                              </button>
                              <div className="relative flex-1 min-w-0">
                                <Link2 size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input
                                  value={img.url}
                                  onChange={e => setImage(idx, e.target.value)}
                                  placeholder="or paste URL…"
                                  className="w-full h-9 bg-[#0d0d0d] border border-white/12 rounded-lg pl-8 pr-3 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-[11px] text-gray-500 leading-relaxed">
                      <span className="font-bold text-gray-400">Supported formats:</span> JPG, PNG, WebP, GIF · Max 10 MB per image<br/>
                      Images are stored on the server and displayed instantly on your product pages.
                    </div>
                  </div>
                )}

                {/* ── Tab: Features & Specs ── */}
                {tab === "details" && (
                  <div className="p-6 space-y-6">
                    {/* Features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="label-xs">Product Features</label>
                        <button onClick={addFeature}
                          className="flex items-center gap-1 text-xs text-primary hover:text-red-400 transition-colors font-semibold">
                          <PlusCircle size={13} /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.features.map((feat, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input value={feat} onChange={e => setFeature(idx, e.target.value)}
                              placeholder="e.g. 100% combed cotton fabric"
                              className="flex-1 h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                            {form.features.length > 1 && (
                              <button onClick={() => removeFeature(idx)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/8 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15">
                                <MinusCircle size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="label-xs">Specifications</label>
                        <button onClick={addSpec}
                          className="flex items-center gap-1 text-xs text-primary hover:text-red-400 transition-colors font-semibold">
                          <PlusCircle size={13} /> Add Spec
                        </button>
                      </div>
                      <div className="space-y-2">
                        {form.specifications.map((spec, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input value={spec.label} onChange={e => setSpec(idx, "label", e.target.value)}
                              placeholder="Label (e.g. Material)"
                              className="w-36 flex-shrink-0 h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                            <input value={spec.value} onChange={e => setSpec(idx, "value", e.target.value)}
                              placeholder="Value (e.g. 100% Cotton)"
                              className="flex-1 h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                            {form.specifications.length > 1 && (
                              <button onClick={() => removeSpec(idx)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/8 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15">
                                <MinusCircle size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/8 flex gap-3 flex-shrink-0">
                <button onClick={closeModal}
                  className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name.trim()}
                  className="flex-1 h-10 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)" }}>
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {modal.editing ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 h-10 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
