import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Edit2, Trash2, X, Package, ChevronDown, Loader2,
  RefreshCw, WifiOff, AlertCircle, Image as ImageIcon, ListChecks,
  PlusCircle, MinusCircle, Upload, Link2, CheckCircle2, Copy,
  Eye, ArrowLeft, BarChart2, Layers, Coffee, Smartphone, Gift,
  Palette, MoreHorizontal, CheckSquare, Square, Tag, ChevronRight,
  ShirtIcon, HardHat,
} from "lucide-react";
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  uploadImage, uploadImageWithProgress,
  type Product, type ProductImage, type ProductSpec, type ProductVariant, DB_NOT_CONNECTED_MSG
} from "./api";
import { compressImage, validateImageFile } from "./imageUtils";
import { invalidateApiProductsCache } from "@/hooks/useApiProducts";
import type { ProductCategory } from "./sampleData";

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES: ProductCategory[] = [
  "T-Shirt Printing", "Mug Printing", "Cap Printing",
  "Mobile Cover Printing", "Corporate Gifts", "Customized Products", "Other Products",
];

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "T-Shirt Printing":    { icon: <ShirtIcon size={22} />, color: "#e53e3e", bg: "rgba(229,62,62,0.12)" },
  "Mug Printing":        { icon: <Coffee size={22} />, color: "#ed8936", bg: "rgba(237,137,54,0.12)" },
  "Cap Printing":        { icon: <HardHat size={22} />, color: "#ecc94b", bg: "rgba(236,201,75,0.12)" },
  "Mobile Cover Printing": { icon: <Smartphone size={22} />, color: "#48bb78", bg: "rgba(72,187,120,0.12)" },
  "Corporate Gifts":     { icon: <Gift size={22} />, color: "#9f7aea", bg: "rgba(159,122,234,0.12)" },
  "Customized Products": { icon: <Palette size={22} />, color: "#4299e1", bg: "rgba(66,153,225,0.12)" },
  "Other Products":      { icon: <Package size={22} />, color: "#a0aec0", bg: "rgba(160,174,192,0.12)" },
};

const BADGES = ["", "Best Seller", "Popular", "Trending", "Premium", "Bulk Deal", "Eco", "New"];

const IMAGE_VIEWS: { view: ProductImage["view"]; label: string }[] = [
  { view: "front",   label: "Front View" },
  { view: "back",    label: "Back View" },
  { view: "side",    label: "Side View" },
  { view: "closeup", label: "Close-Up View" },
];
const EMPTY_IMAGES: ProductImage[] = IMAGE_VIEWS.map(v => ({ view: v.view, label: v.label, url: "" }));
const EMPTY_VARIANT_IMAGES = (): ProductImage[] => IMAGE_VIEWS.map(v => ({ view: v.view, label: v.label, url: "" }));

function makeVariantId() { return `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

interface FormState {
  id: string; name: string; category: ProductCategory; description: string;
  price: number; priceLabel: string; badge: string; tags: string;
  images: ProductImage[]; variants: ProductVariant[]; features: string[]; specifications: ProductSpec[];
  status: "Active" | "Inactive"; stock: number;
}
const EMPTY_FORM: FormState = {
  id: "", name: "", category: "T-Shirt Printing", description: "",
  price: 0, priceLabel: "", badge: "", tags: "",
  images: EMPTY_IMAGES, variants: [], features: [""], specifications: [{ label: "", value: "" }],
  status: "Active", stock: 0,
};
function productToForm(p: Product): FormState {
  const existingImages = (p.images ?? []) as ProductImage[];
  const images = IMAGE_VIEWS.map(v => existingImages.find(i => i.view === v.view) ?? { view: v.view, label: v.label, url: "" });
  const variants: ProductVariant[] = (p.variants ?? []).map(v => ({
    ...v,
    images: IMAGE_VIEWS.map(view => v.images?.find(i => i.view === view.view) ?? { view: view.view, label: view.label, url: "" }),
  }));
  return {
    id: p.id, name: p.name, category: p.category as ProductCategory,
    description: p.description ?? "", price: Number(p.price),
    priceLabel: p.priceLabel ?? "", badge: p.badge ?? "",
    tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
    images, variants,
    features: p.features?.length ? p.features : [""],
    specifications: p.specifications?.length ? p.specifications : [{ label: "", value: "" }],
    status: p.status, stock: p.stock,
  };
}

type Tab = "info" | "images" | "variants" | "details";
type BulkAction = "delete" | "category" | "status" | null;

function getThumb(p: Product): string | null {
  const imgs = p.images as ProductImage[] | undefined;
  return imgs?.find(i => i.view === "front" && i.url)?.url ?? imgs?.find(i => i.url)?.url ?? p.imageUrl ?? null;
}
function imgCount(p: Product): number {
  return ((p.images as ProductImage[] | undefined) ?? []).filter(i => i.url).length;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products,      setProducts]      = useState<Product[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState<string | null>(null);
  const [dbDown,        setDbDown]        = useState(false);

  // navigation
  const [selectedCat,   setSelectedCat]   = useState<string | null>(null);
  const [search,        setSearch]        = useState("");

  // bulk
  const [selectedIds,   setSelectedIds]   = useState<Set<string>>(new Set());
  const [bulkAction,    setBulkAction]    = useState<BulkAction>(null);
  const [bulkCat,       setBulkCat]       = useState<ProductCategory>("T-Shirt Printing");
  const [bulkStatus,    setBulkStatus]    = useState<"Active" | "Inactive">("Active");

  // edit modal
  const [modal,         setModal]         = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
  const [form,          setForm]          = useState<FormState>(EMPTY_FORM);
  const [tab,           setTab]           = useState<Tab>("info");

  // delete
  const [deleteId,      setDeleteId]      = useState<string | null>(null);

  // upload — keyed progress: "img-{idx}" or "v-{vi}-{imgIdx}" → 0-100
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);
  const variantFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── Load ──
  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try { setProducts(await getProducts()); }
    catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) setDbDown(true);
      else setError(e.message ?? "Failed to load products");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  // clear selection on category change
  useEffect(() => { setSelectedIds(new Set()); setSearch(""); }, [selectedCat]);

  // ── Computed ──
  const catCounts = CATEGORIES.reduce<Record<string, { total: number; active: number; inactive: number; noImg: number }>>((acc, c) => {
    const ps = products.filter(p => p.category === c);
    acc[c] = {
      total: ps.length,
      active: ps.filter(p => p.status === "Active").length,
      inactive: ps.filter(p => p.status === "Inactive").length,
      noImg: ps.filter(p => imgCount(p) === 0).length,
    };
    return acc;
  }, {} as Record<string, { total: number; active: number; inactive: number; noImg: number }>);

  const totalActive   = products.filter(p => p.status === "Active").length;
  const totalInactive = products.filter(p => p.status === "Inactive").length;
  const totalNoImg    = products.filter(p => imgCount(p) === 0).length;

  const filteredProducts = (selectedCat
    ? products.filter(p => p.category === selectedCat)
    : products
  ).filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const allVisibleSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.has(p.id));

  // ── Handlers ──
  const openAdd  = () => { setForm({ ...EMPTY_FORM, category: (selectedCat ?? "T-Shirt Printing") as ProductCategory }); setTab("info"); setModal({ open: true, editing: null }); };
  const openEdit = (p: Product) => { setForm(productToForm(p)); setTab("info"); setModal({ open: true, editing: p }); };
  const closeModal = () => setModal({ open: false, editing: null });

  const handleSave = async () => {
    if (!form.name.trim()) { setTab("info"); return; }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name.trim(), category: form.category,
        description: form.description.trim() || undefined,
        price: form.price, priceLabel: form.priceLabel.trim() || undefined,
        badge: form.badge || undefined,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        images: form.images.filter(i => i.url.trim()),
        variants: form.variants.filter(v => v.color.trim()).map(v => ({
          ...v, images: v.images.filter(i => i.url.trim()),
        })),
        features: form.features.filter(f => f.trim()),
        specifications: form.specifications.filter(s => s.label.trim() && s.value.trim()),
        status: form.status, stock: form.stock,
      };
      if (!modal.editing && form.id.trim()) payload.id = form.id.trim();
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
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } catch (e: any) { setError(e.message); }
    finally { setDeleteId(null); }
  };

  const handleDuplicate = async (p: Product) => {
    try {
      const payload = {
        name: `${p.name} (Copy)`, category: p.category as ProductCategory,
        description: p.description, price: Number(p.price),
        priceLabel: p.priceLabel, badge: p.badge,
        tags: p.tags ?? [], images: (p.images ?? []).filter((i: ProductImage) => i.url),
        features: p.features ?? [], specifications: p.specifications ?? [],
        status: "Inactive" as const, stock: p.stock,
      };
      const created = await createProduct(payload);
      setProducts(prev => [created, ...prev]);
      invalidateApiProductsCache();
    } catch (e: any) { setError(e.message); }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map(id => deleteProduct(id)));
      setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      invalidateApiProductsCache();
    } catch (e: any) { setError(e.message); }
    finally { setBulkAction(null); }
  };

  const handleBulkCategoryChange = async () => {
    const ids = Array.from(selectedIds);
    try {
      const updated = await Promise.all(ids.map(id => updateProduct(id, { category: bulkCat })));
      setProducts(prev => prev.map(p => {
        const u = updated.find(up => up.id === p.id);
        return u ? { ...p, ...u } : p;
      }));
      setSelectedIds(new Set());
      invalidateApiProductsCache();
    } catch (e: any) { setError(e.message); }
    finally { setBulkAction(null); }
  };

  const handleBulkStatusChange = async () => {
    const ids = Array.from(selectedIds);
    try {
      const updated = await Promise.all(ids.map(id => updateProduct(id, { status: bulkStatus })));
      setProducts(prev => prev.map(p => {
        const u = updated.find(up => up.id === p.id);
        return u ? { ...p, ...u } : p;
      }));
      setSelectedIds(new Set());
      invalidateApiProductsCache();
    } catch (e: any) { setError(e.message); }
    finally { setBulkAction(null); }
  };

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleSelectAll = () => {
    if (allVisibleSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredProducts.map(p => p.id)));
  };

  const setImage = (idx: number, url: string) =>
    setForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? { ...img, url } : img) }));

  const setProgress = (key: string, pct: number | null) =>
    setUploadProgress(prev => {
      if (pct === null) { const n = { ...prev }; delete n[key]; return n; }
      return { ...prev, [key]: pct };
    });

  const handleFileUpload = async (idx: number, file: File) => {
    const key = `img-${idx}`;
    setProgress(key, 0);
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImageWithProgress(compressed, pct => setProgress(key, pct));
      setImage(idx, url);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setProgress(key, null);
    }
  };

  // ── Variant Handlers ──
  const addVariant = () => setForm(f => ({
    ...f,
    variants: [...f.variants, { id: makeVariantId(), color: "", hex: "#000000", images: EMPTY_VARIANT_IMAGES(), stock: 0, priceAdjustment: 0 }],
  }));
  const removeVariant = (vi: number) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== vi) }));
  const setVariantField = (vi: number, key: string, val: string | number) =>
    setForm(f => ({ ...f, variants: f.variants.map((v, i) => i === vi ? { ...v, [key]: val } : v) }));
  const setVariantImage = (vi: number, imgIdx: number, url: string) =>
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, i) => i === vi
        ? { ...v, images: v.images.map((img, ii) => ii === imgIdx ? { ...img, url } : img) }
        : v),
    }));
  const handleVariantImageUpload = async (vi: number, imgIdx: number, file: File) => {
    const key = `v-${vi}-${imgIdx}`;
    setProgress(key, 0);
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImageWithProgress(compressed, pct => setProgress(key, pct));
      setVariantImage(vi, imgIdx, url);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally {
      setProgress(key, null);
    }
  };

  const setFeature  = (idx: number, val: string) => setForm(f => ({ ...f, features: f.features.map((v, i) => i === idx ? val : v) }));
  const addFeature  = () => setForm(f => ({ ...f, features: [...f.features, ""] }));
  const removeFeature = (idx: number) => setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  const setSpec     = (idx: number, key: "label" | "value", val: string) => setForm(f => ({ ...f, specifications: f.specifications.map((s, i) => i === idx ? { ...s, [key]: val } : s) }));
  const addSpec     = () => setForm(f => ({ ...f, specifications: [...f.specifications, { label: "", value: "" }] }));
  const removeSpec  = (idx: number) => setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }));

  const TAB_LABELS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "info",     label: "Basic Info",       icon: <Package size={13} /> },
    { id: "images",   label: "Images",           icon: <ImageIcon size={13} /> },
    { id: "variants", label: "Color Variants",   icon: <Palette size={13} />, badge: form.variants.length || undefined },
    { id: "details",  label: "Features & Specs", icon: <ListChecks size={13} /> },
  ] as { id: Tab; label: string; icon: React.ReactNode; badge?: number }[];

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {selectedCat && (
            <button onClick={() => setSelectedCat(null)}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/6 transition-all flex-shrink-0">
              <ArrowLeft size={15} />
            </button>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-gray-600 text-xs font-semibold mb-0.5">
              <button onClick={() => setSelectedCat(null)} className="hover:text-gray-400 transition-colors">Products</button>
              {selectedCat && <><ChevronRight size={11} /><span className="text-gray-400 truncate">{selectedCat}</span></>}
            </div>
            <h1 className="text-white font-black text-2xl leading-tight">
              {selectedCat ?? "Product Management"}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={load}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={openAdd} disabled={dbDown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 14px rgba(229,62,62,0.3)" }}>
            <Plus size={15} /> Add Product
          </motion.button>
        </div>
      </div>

      {/* ── Alerts ── */}
      {dbDown && (
        <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-4">
          <WifiOff size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-bold">Database Not Connected</p>
            <p className="text-yellow-400/70 text-xs mt-1">{DB_NOT_CONNECTED_MSG}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm flex-1">{error}</p>
          <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* ── Stats Bar ── */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Products", value: products.length, icon: <Layers size={15} />, color: "text-blue-400",  ring: "border-blue-500/20",  bg: "bg-blue-500/8" },
            { label: "Active",         value: totalActive,     icon: <CheckCircle2 size={15} />, color: "text-green-400", ring: "border-green-500/20", bg: "bg-green-500/8" },
            { label: "Inactive",       value: totalInactive,   icon: <MoreHorizontal size={15} />, color: "text-gray-400",  ring: "border-white/10",    bg: "bg-white/4" },
            { label: "No Images",      value: totalNoImg,      icon: <ImageIcon size={15} />,  color: "text-orange-400", ring: "border-orange-500/20", bg: "bg-orange-500/8" },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.ring} ${s.bg}`}>
              <span className={s.color}>{s.icon}</span>
              <div>
                <p className="text-white font-black text-xl leading-none">{s.value}</p>
                <p className="text-gray-500 text-[11px] mt-0.5 font-semibold">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 gap-2 text-gray-600">
          <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading products…</span>
        </div>
      ) : !selectedCat ? (
        /* ── Category Overview ─────────────────────────────────────────────── */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat];
            const counts = catCounts[cat] ?? { total: 0, active: 0, inactive: 0, noImg: 0 };
            return (
              <motion.button key={cat}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCat(cat)}
                className="text-left bg-[#111] border border-white/8 rounded-2xl p-5 hover:border-white/16 transition-all group">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: meta.bg, color: meta.color }}>
                    {meta.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-black text-2xl leading-none">{counts.total}</p>
                    <p className="text-gray-600 text-[11px] mt-0.5 font-semibold">products</p>
                  </div>
                </div>
                <p className="text-white font-bold text-sm leading-tight mb-3">{cat}</p>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    {counts.active} active
                  </span>
                  {counts.inactive > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 inline-block" />
                      {counts.inactive} inactive
                    </span>
                  )}
                  {counts.noImg > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-400">
                      <ImageIcon size={10} />
                      {counts.noImg} no image
                    </span>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-white/6 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
                  <span>Manage Products</span>
                  <ChevronRight size={13} />
                </div>
              </motion.button>
            );
          })}
          {/* All products card */}
          <motion.button
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCat("__all__")}
            className="text-left bg-[#0d0d0d] border border-white/6 border-dashed rounded-2xl p-5 hover:border-white/16 transition-all group">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/6 text-gray-500 group-hover:text-gray-300 transition-colors">
                <BarChart2 size={20} />
              </div>
              <div className="text-right">
                <p className="text-white font-black text-2xl leading-none">{products.length}</p>
                <p className="text-gray-600 text-[11px] mt-0.5 font-semibold">total</p>
              </div>
            </div>
            <p className="text-gray-400 font-bold text-sm mb-3">All Products</p>
            <div className="mt-3 pt-3 border-t border-white/6 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-gray-300 transition-colors">
              <span>View All</span>
              <ChevronRight size={13} />
            </div>
          </motion.button>
        </div>
      ) : (
        /* ── Product List ──────────────────────────────────────────────────── */
        <div className="space-y-3">

          {/* Search + filter bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={`Search ${selectedCat === "__all__" ? "all products" : selectedCat} by name or ID…`}
                className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
            </div>
            <div className="h-10 px-3.5 bg-[#111] border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
              <Tag size={12} />
              <span>{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Bulk action bar */}
          <AnimatePresence>
            {selectedIds.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap items-center gap-2 bg-primary/10 border border-primary/25 rounded-xl px-4 py-3">
                <span className="text-primary text-xs font-black mr-1">{selectedIds.size} selected</span>
                <button onClick={() => setBulkAction("delete")}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-bold border border-red-500/20 transition-all">
                  <Trash2 size={12} /> Delete Selected
                </button>
                <button onClick={() => setBulkAction("category")}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/8 hover:bg-white/12 text-gray-300 text-xs font-bold border border-white/10 transition-all">
                  <Layers size={12} /> Change Category
                </button>
                <button onClick={() => setBulkAction("status")}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-white/8 hover:bg-white/12 text-gray-300 text-xs font-bold border border-white/10 transition-all">
                  <CheckCircle2 size={12} /> Change Status
                </button>
                <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-gray-600 hover:text-gray-400 transition-colors">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Package size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{search ? "No products match your search." : "No products in this category yet."}</p>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              {/* Table header */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/6 bg-white/2">
                <button onClick={toggleSelectAll} className="flex-shrink-0 text-gray-500 hover:text-primary transition-colors">
                  {allVisibleSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                </button>
                <span className="flex-1 text-[10px] font-black uppercase tracking-widest text-gray-600">Product</span>
                <span className="hidden sm:block w-28 text-[10px] font-black uppercase tracking-widest text-gray-600">Category</span>
                <span className="w-20 text-[10px] font-black uppercase tracking-widest text-gray-600 text-right">Price</span>
                <span className="hidden sm:block w-16 text-[10px] font-black uppercase tracking-widest text-gray-600 text-center">Status</span>
                <span className="hidden md:block w-14 text-[10px] font-black uppercase tracking-widest text-gray-600 text-center">Images</span>
                <span className="w-28 text-[10px] font-black uppercase tracking-widest text-gray-600 text-right">Actions</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {filteredProducts.map((p, i) => {
                  const thumb = getThumb(p);
                  const ic = imgCount(p);
                  const isSelected = selectedIds.has(p.id);
                  return (
                    <motion.div key={p.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.03, 0.2) }}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${isSelected ? "bg-primary/6" : "hover:bg-white/2"}`}>
                      {/* Checkbox */}
                      <button onClick={() => toggleSelect(p.id)} className="flex-shrink-0 text-gray-600 hover:text-primary transition-colors">
                        {isSelected ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                      </button>

                      {/* Thumbnail + name */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-[#1a1a1a] border border-white/6 overflow-hidden flex items-center justify-center">
                          {thumb
                            ? <img src={thumb} alt={p.name} className="w-full h-full object-cover" />
                            : <Package size={16} className="text-gray-700" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-bold truncate leading-tight">{p.name}</p>
                          <p className="text-gray-600 text-[11px] font-mono mt-0.5">{p.id}</p>
                        </div>
                        {p.badge && (
                          <span className="hidden lg:inline-flex flex-shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                            {p.badge}
                          </span>
                        )}
                      </div>

                      {/* Category */}
                      <div className="hidden sm:block w-28 flex-shrink-0">
                        <span className="text-[11px] text-gray-500 font-semibold leading-tight block truncate">{p.category}</span>
                      </div>

                      {/* Price */}
                      <div className="w-20 flex-shrink-0 text-right">
                        <p className="text-primary font-black text-sm">{p.priceLabel || `₹${Number(p.price)}`}</p>
                      </div>

                      {/* Status */}
                      <div className="hidden sm:flex w-16 flex-shrink-0 justify-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${p.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}>
                          {p.status}
                        </span>
                      </div>

                      {/* Images */}
                      <div className="hidden md:flex w-14 flex-shrink-0 justify-center">
                        <span className={`text-[11px] font-bold ${ic === 0 ? "text-orange-400" : "text-gray-500"}`}>
                          {ic === 0 ? "—" : `${ic} img`}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="w-28 flex-shrink-0 flex items-center justify-end gap-1">
                        <a href={`/categories/${p.category.toLowerCase().replace(/ /g, "-")}/${p.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-white/6 hover:bg-blue-500/15 hover:text-blue-400 text-gray-500 flex items-center justify-center transition-all"
                          title="View product">
                          <Eye size={13} />
                        </a>
                        <button onClick={() => openEdit(p)}
                          className="w-7 h-7 rounded-lg bg-white/6 hover:bg-primary/15 hover:text-primary text-gray-500 flex items-center justify-center transition-all"
                          title="Edit product">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => handleDuplicate(p)}
                          className="w-7 h-7 rounded-lg bg-white/6 hover:bg-purple-500/15 hover:text-purple-400 text-gray-500 flex items-center justify-center transition-all"
                          title="Duplicate product">
                          <Copy size={13} />
                        </button>
                        <button onClick={() => setDeleteId(p.id)}
                          className="w-7 h-7 rounded-lg bg-white/6 hover:bg-red-500/15 hover:text-red-400 text-gray-500 flex items-center justify-center transition-all"
                          title="Delete product">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {modal.open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 bg-[#111] border border-white/10 rounded-2xl flex flex-col"
              style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)", maxHeight: "90vh" }}>

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
                <h3 className="text-white font-bold text-base">{modal.editing ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all"><X size={16} /></button>
              </div>

              <div className="flex border-b border-white/8 flex-shrink-0 overflow-x-auto">
                {TAB_LABELS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold transition-all border-b-2 -mb-[1px] whitespace-nowrap flex-shrink-0 ${tab === t.id ? "text-primary border-primary" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
                    {t.icon} {t.label}
                    {(t as any).badge ? (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black leading-none">
                        {(t as any).badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto flex-1">
                {tab === "info" && (
                  <div className="p-6 space-y-4">
                    {!modal.editing && (
                      <div>
                        <label className="label-xs">Product ID <span className="text-gray-600 normal-case font-normal">(optional — use static ID like ts-001 to link with website catalog)</span></label>
                        <input value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                          placeholder="e.g. ts-001 (leave blank to auto-generate)" className="input-field font-mono" />
                      </div>
                    )}
                    <div>
                      <label className="label-xs">Product Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Classic Round Neck T-Shirt" className="input-field" />
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

                {tab === "images" && (
                  <div className="p-6 space-y-4">
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Upload photos from your computer for each view. You can also paste a direct image URL instead.
                    </p>
                    {form.images.map((img, idx) => (
                      <div key={img.view} className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                          ref={el => { fileRefs.current[idx] = el; }}
                          onChange={e => { const file = e.target.files?.[0]; if (file) handleFileUpload(idx, file); e.target.value = ""; }}
                          className="hidden" />
                        <div className="flex gap-4 p-4">
                          <button type="button" onClick={() => fileRefs.current[idx]?.click()}
                            disabled={`img-${idx}` in uploadProgress}
                            className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-white/15 hover:border-primary/50 bg-[#0d0d0d] hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 overflow-hidden relative group">
                            {`img-${idx}` in uploadProgress ? (
                              <div className="flex flex-col items-center gap-1">
                                <Loader2 size={16} className="animate-spin text-primary" />
                                <span className="text-[11px] font-bold text-primary">{uploadProgress[`img-${idx}`]}%</span>
                              </div>
                            ) : img.url ? (
                              <>
                                <img src={img.url} alt={img.label} className="absolute inset-0 w-full h-full object-cover" onError={() => {}} />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Upload size={16} className="text-white" />
                                </div>
                                <div className="absolute top-1 right-1"><CheckCircle2 size={14} className="text-green-400 drop-shadow" /></div>
                              </>
                            ) : (
                              <>
                                <Upload size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                                <span className="text-[9px] text-gray-600 group-hover:text-primary transition-colors font-semibold text-center leading-tight">Click to<br/>upload</span>
                              </>
                            )}
                          </button>
                          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-0.5 rounded-lg border border-white/10 bg-white/4">{img.label}</span>
                              {img.url && (
                                <button onClick={() => setImage(idx, "")} className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors font-semibold flex items-center gap-1">
                                  <X size={11} /> Remove
                                </button>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => fileRefs.current[idx]?.click()}
                                disabled={`img-${idx}` in uploadProgress}
                                className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold transition-all border border-primary/20 flex-shrink-0 disabled:opacity-50">
                                <Upload size={12} />{`img-${idx}` in uploadProgress ? `${uploadProgress[`img-${idx}`]}%` : "Upload"}
                              </button>
                              <div className="relative flex-1 min-w-0">
                                <Link2 size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                <input value={img.url} onChange={e => setImage(idx, e.target.value)}
                                  placeholder="or paste URL…"
                                  className="w-full h-9 bg-[#0d0d0d] border border-white/12 rounded-lg pl-8 pr-3 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-[11px] text-gray-500 leading-relaxed">
                      <span className="font-bold text-gray-400">Supported formats:</span> JPG, PNG, WebP, GIF · Max 20 MB · Auto-compressed to WebP ≤500 KB before upload
                    </div>
                  </div>
                )}

                {tab === "variants" && (
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-bold">Color Variants</p>
                        <p className="text-gray-500 text-xs mt-0.5">Each variant has its own set of images. Customers see the correct photo when they pick a color.</p>
                      </div>
                      <button onClick={addVariant}
                        className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary/15 hover:bg-primary/25 text-primary text-xs font-bold border border-primary/20 transition-all flex-shrink-0">
                        <Plus size={12} /> Add Color
                      </button>
                    </div>

                    {form.variants.length === 0 && (
                      <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                        <Palette size={28} className="mx-auto mb-2 text-gray-700" />
                        <p className="text-gray-500 text-sm font-semibold">No color variants yet</p>
                        <p className="text-gray-600 text-xs mt-1">Click "Add Color" to create variants with separate images per color.</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {form.variants.map((variant, vi) => (
                        <div key={variant.id} className="bg-[#1a1a1a] border border-white/8 rounded-xl overflow-hidden">
                          {/* Variant Header */}
                          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/6">
                            <div className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0"
                              style={{ backgroundColor: variant.hex || "#555" }} />
                            <input
                              value={variant.color}
                              onChange={e => setVariantField(vi, "color", e.target.value)}
                              placeholder="Color name (e.g. Black, White, Red)"
                              className="flex-1 h-8 bg-transparent text-sm text-white placeholder-gray-600 outline-none font-semibold min-w-0"
                            />
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <label className="text-[10px] text-gray-600 font-semibold">HEX</label>
                              <div className="relative">
                                <input
                                  type="color"
                                  value={variant.hex || "#000000"}
                                  onChange={e => setVariantField(vi, "hex", e.target.value)}
                                  className="w-8 h-7 rounded cursor-pointer border border-white/10 bg-transparent p-0.5"
                                  title="Pick color"
                                />
                              </div>
                              <input
                                value={variant.hex}
                                onChange={e => setVariantField(vi, "hex", e.target.value)}
                                placeholder="#000000"
                                className="w-20 h-7 bg-[#0d0d0d] border border-white/12 rounded-lg px-2 text-xs text-white font-mono placeholder-gray-600 outline-none focus:border-primary/40 transition-colors"
                              />
                              <button onClick={() => removeVariant(vi)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15"
                                title="Remove variant">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Variant Images */}
                          <div className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Images for this color</p>
                            <div className="grid grid-cols-4 gap-2">
                              {variant.images.map((img, imgIdx) => {
                                const refKey = `v-${vi}-${imgIdx}`;
                                const isUploading = refKey in uploadProgress;
                                return (
                                  <div key={img.view} className="space-y-1">
                                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                                      ref={el => { variantFileRefs.current[refKey] = el; }}
                                      onChange={e => { const file = e.target.files?.[0]; if (file) handleVariantImageUpload(vi, imgIdx, file); e.target.value = ""; }}
                                      className="hidden" />
                                    <button type="button"
                                      onClick={() => variantFileRefs.current[refKey]?.click()}
                                      disabled={isUploading}
                                      className="w-full aspect-square rounded-xl border-2 border-dashed border-white/12 hover:border-primary/40 bg-[#0d0d0d] hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 overflow-hidden relative group">
                                      {isUploading ? (
                                        <div className="flex flex-col items-center gap-0.5">
                                          <Loader2 size={13} className="animate-spin text-primary" />
                                          <span className="text-[9px] font-bold text-primary">{uploadProgress[refKey] ?? 0}%</span>
                                        </div>
                                      ) : img.url ? (
                                        <>
                                          <img src={img.url} alt={img.label} className="absolute inset-0 w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Upload size={14} className="text-white" />
                                          </div>
                                          <div className="absolute top-1 right-1"><CheckCircle2 size={11} className="text-green-400 drop-shadow" /></div>
                                        </>
                                      ) : (
                                        <>
                                          <Upload size={14} className="text-gray-600 group-hover:text-primary transition-colors" />
                                        </>
                                      )}
                                    </button>
                                    <p className="text-[9px] text-center text-gray-600 font-bold uppercase tracking-wide truncate">{img.label.replace(" View","")}</p>
                                    {img.url && (
                                      <button onClick={() => setVariantImage(vi, imgIdx, "")}
                                        className="w-full text-[9px] text-red-400/60 hover:text-red-400 transition-colors font-semibold text-center">
                                        × remove
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Optional adjustments */}
                          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                            <div>
                              <label className="label-xs">Stock (this color)</label>
                              <input type="number" value={variant.stock || ""}
                                onChange={e => setVariantField(vi, "stock", Number(e.target.value))}
                                placeholder="0"
                                className="w-full h-8 bg-[#0d0d0d] border border-white/12 rounded-lg px-3 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                            </div>
                            <div>
                              <label className="label-xs">Price Adjustment (₹)</label>
                              <input type="number" value={variant.priceAdjustment || ""}
                                onChange={e => setVariantField(vi, "priceAdjustment", Number(e.target.value))}
                                placeholder="0 (same as base)"
                                className="w-full h-8 bg-[#0d0d0d] border border-white/12 rounded-lg px-3 text-xs text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {form.variants.length > 0 && (
                      <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-[11px] text-gray-500 leading-relaxed">
                        <span className="font-bold text-gray-400">Tip:</span> When a customer selects a color on the product page, the gallery automatically switches to that color's images. If a color has no images, the default product images are shown.
                      </div>
                    )}
                  </div>
                )}

                {tab === "details" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="label-xs">Product Features</label>
                        <button onClick={addFeature} className="flex items-center gap-1 text-xs text-primary hover:text-red-400 transition-colors font-semibold">
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
                              <button onClick={() => removeFeature(idx)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/8 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15">
                                <MinusCircle size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="label-xs">Specifications</label>
                        <button onClick={addSpec} className="flex items-center gap-1 text-xs text-primary hover:text-red-400 transition-colors font-semibold">
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
                              <button onClick={() => removeSpec(idx)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/8 hover:bg-red-500/20 text-red-400 transition-all border border-red-500/15">
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

              <div className="px-6 py-4 border-t border-white/8 flex gap-3 flex-shrink-0">
                <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
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

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-400" /></div>
              <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action <span className="text-red-400 font-bold">cannot be undone</span>. The product will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-colors">Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bulk Delete Confirm ── */}
      <AnimatePresence>
        {bulkAction === "delete" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setBulkAction(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-400" /></div>
              <h3 className="text-white font-bold text-lg mb-2">Delete {selectedIds.size} Products?</h3>
              <p className="text-gray-500 text-sm mb-6">This action <span className="text-red-400 font-bold">cannot be undone</span>. All selected products will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setBulkAction(null)} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={handleBulkDelete} className="flex-1 h-10 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-colors">Delete All</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bulk Category Change ── */}
      <AnimatePresence>
        {bulkAction === "category" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setBulkAction(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-1">Change Category</h3>
              <p className="text-gray-500 text-sm mb-4">Move {selectedIds.size} selected product{selectedIds.size !== 1 ? "s" : ""} to:</p>
              <div className="relative mb-4">
                <select value={bulkCat} onChange={e => setBulkCat(e.target.value as ProductCategory)}
                  className="input-field appearance-none pr-8 cursor-pointer">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setBulkAction(null)} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={handleBulkCategoryChange}
                  className="flex-1 h-10 rounded-xl font-bold text-white text-sm transition-colors"
                  style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)" }}>
                  Move Products
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Bulk Status Change ── */}
      <AnimatePresence>
        {bulkAction === "status" && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setBulkAction(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-1">Change Status</h3>
              <p className="text-gray-500 text-sm mb-4">Set {selectedIds.size} selected product{selectedIds.size !== 1 ? "s" : ""} to:</p>
              <div className="flex gap-3 mb-4">
                {(["Active", "Inactive"] as const).map(s => (
                  <button key={s} onClick={() => setBulkStatus(s)}
                    className={`flex-1 h-10 rounded-xl border text-sm font-bold transition-all ${bulkStatus === s
                      ? s === "Active" ? "bg-green-500/20 border-green-500/40 text-green-400" : "bg-gray-500/20 border-gray-500/40 text-gray-300"
                      : "border-white/10 text-gray-500 hover:border-white/20"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setBulkAction(null)} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={handleBulkStatusChange}
                  className="flex-1 h-10 rounded-xl font-bold text-white text-sm transition-colors"
                  style={{ background: "linear-gradient(135deg,#e53e3e,#c53030)" }}>
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
