import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle,
  Camera, X, Image as ImageIcon, ChevronUp, ChevronDown, Edit2,
} from "lucide-react";
import {
  getFeaturedProducts, createFeaturedProduct, updateFeaturedProduct,
  deleteFeaturedProduct, uploadImage, type FeaturedProduct,
} from "./api";
import { compressImage, validateImageFile } from "./imageUtils";
import { invalidateFeaturedProductsCache } from "@/hooks/useFeaturedProducts";

interface Toast { id: number; text: string; ok: boolean; }
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ctr = useRef(0);
  const add = useCallback((text: string, ok = true) => {
    const id = ++ctr.current;
    setToasts(p => [...p, { id, text, ok }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

const BADGE_OPTIONS = ["", "Popular", "Best Seller", "Premium", "New", "Hot", "Sale", "Trending"];

const iCls = "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-primary/50";
const lCls = "text-gray-500 text-[11px] font-semibold uppercase tracking-wide mb-1 block";

const EMPTY_FORM = { name: "", description: "", price: "", imageUrl: "", badge: "", link: "" };
type FormData = typeof EMPTY_FORM;

function ProductFormModal({
  initial, onSave, onClose, addToast,
}: {
  initial?: FeaturedProduct;
  onSave: (data: FormData & { imageUrl: string | null }) => Promise<void>;
  onClose: () => void;
  addToast: (t: string, ok?: boolean) => void;
}) {
  const [form, setForm] = useState<FormData>(
    initial
      ? { name: initial.name, description: initial.description, price: initial.price, imageUrl: initial.imageUrl ?? "", badge: initial.badge, link: initial.link }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImage(compressed);
      set("imageUrl", url);
      addToast("Image uploaded!");
    } catch (err: unknown) {
      addToast((err as Error).message ?? "Upload failed.", false);
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { addToast("Name is required.", false); return; }
    setSaving(true);
    try {
      await onSave({ ...form, imageUrl: form.imageUrl || null });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-white font-bold">{initial ? "Edit Product" : "Add Featured Product"}</p>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16}/></button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Image upload */}
          <div>
            <label className={lCls}>Product Image</label>
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/10"
              style={{ background: form.imageUrl ? undefined : "rgba(255,255,255,0.03)" }}
              onClick={() => !uploading && fileRef.current?.click()}
            >
              {form.imageUrl ? (
                <img src={form.imageUrl} alt="" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Camera size={24} className="text-gray-600"/>
                  <span className="text-gray-600 text-xs">Click to upload image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 flex flex-col items-center gap-1.5">
                  {uploading
                    ? <Loader2 size={22} className="text-white animate-spin"/>
                    : <><Camera size={20} className="text-white"/><span className="text-white text-xs font-bold">{form.imageUrl ? "Change Image" : "Upload Image"}</span></>
                  }
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f); e.target.value = ""; }}/>
            </div>
            {form.imageUrl && (
              <button onClick={() => set("imageUrl", "")} className="mt-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors">
                Remove image
              </button>
            )}
          </div>

          {/* Name */}
          <div>
            <label className={lCls}>Product Name *</label>
            <input value={form.name} onChange={e => set("name", e.target.value)} className={iCls} placeholder="e.g. Custom T-Shirts"/>
          </div>

          {/* Description */}
          <div>
            <label className={lCls}>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={2}
              className={`${iCls} resize-none`} placeholder="Short description shown on the card"/>
          </div>

          {/* Price + Badge row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lCls}>Price</label>
              <input value={form.price} onChange={e => set("price", e.target.value)} className={iCls} placeholder="e.g. ₹299"/>
            </div>
            <div>
              <label className={lCls}>Badge</label>
              <select value={form.badge} onChange={e => set("badge", e.target.value)}
                className={`${iCls} cursor-pointer`}>
                {BADGE_OPTIONS.map(b => <option key={b} value={b} style={{ background: "#111" }}>{b || "None"}</option>)}
              </select>
            </div>
          </div>

          {/* Link */}
          <div>
            <label className={lCls}>Product Link</label>
            <input value={form.link} onChange={e => set("link", e.target.value)} className={iCls} placeholder="e.g. /categories/t-shirts"/>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-white text-sm font-semibold transition-colors rounded-xl">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin"/> : <Save size={13}/>}
            {initial ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminFeaturedProducts() {
  const [items, setItems] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "add" } | { mode: "edit"; item: FeaturedProduct } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Set<number>>(new Set());
  const { toasts, add: addToast } = useToasts();

  useEffect(() => {
    getFeaturedProducts()
      .then(data => setItems(data.sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = (updated: FeaturedProduct[]) => {
    setItems(updated.sort((a, b) => a.displayOrder - b.displayOrder));
    invalidateFeaturedProductsCache();
  };

  const handleAdd = async (form: Parameters<typeof createFeaturedProduct>[0]) => {
    const created = await createFeaturedProduct(form);
    refresh([...items, created]);
    setModal(null);
    addToast("Product added!");
  };

  const handleEdit = async (id: number, form: Partial<Omit<FeaturedProduct, "id">>) => {
    const updated = await updateFeaturedProduct(id, form);
    refresh(items.map(p => p.id === id ? updated : p));
    setModal(null);
    addToast("Product updated!");
  };

  const handleDelete = async (id: number) => {
    setDeleting(s => new Set([...s, id]));
    try {
      await deleteFeaturedProduct(id);
      refresh(items.filter(p => p.id !== id));
      setDeleteConfirm(null);
      addToast("Product removed.");
    } catch { addToast("Delete failed.", false); }
    finally { setDeleting(s => { const n = new Set(s); n.delete(id); return n; }); }
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const swap = idx + dir;
    if (swap < 0 || swap >= items.length) return;
    const updated = [...items];
    const tmpOrder = updated[idx].displayOrder;
    updated[idx] = { ...updated[idx], displayOrder: updated[swap].displayOrder };
    updated[swap] = { ...updated[swap], displayOrder: tmpOrder };
    setItems(updated.sort((a, b) => a.displayOrder - b.displayOrder));
    try {
      await Promise.all([
        updateFeaturedProduct(updated[idx].id, { displayOrder: updated[idx].displayOrder }),
        updateFeaturedProduct(updated[swap].id, { displayOrder: updated[swap].displayOrder }),
      ]);
      invalidateFeaturedProductsCache();
    } catch { addToast("Reorder failed.", false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-primary"/></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <AlertCircle size={32} className="text-red-400"/>
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl relative">
      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold text-white ${t.ok ? "bg-green-600" : "bg-red-600"}`}>
            {t.ok ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>} {t.text}
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-white font-bold text-lg">Featured Products Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage the <span className="text-white font-semibold">"Most Popular Picks"</span> section. Upload images and set product details independently.
          </p>
        </div>
        <button onClick={() => setModal({ mode: "add" })}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors">
          <Plus size={14}/> Add Product
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <motion.div key={item.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex">
              {/* Image */}
              <div className="flex-shrink-0 w-28 sm:w-36" style={{ aspectRatio: "1/1" }}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full bg-white/3 flex flex-col items-center justify-center gap-1.5 border-r border-white/5">
                    <ImageIcon size={22} className="text-gray-700"/>
                    <span className="text-gray-700 text-[10px]">No image</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{item.name}</p>
                      {item.description && <p className="text-gray-500 text-xs line-clamp-1 mt-0.5">{item.description}</p>}
                    </div>
                    {item.badge && (
                      <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.price && <p className="text-[#C4962A] font-extrabold text-sm">{item.price}</p>}
                  {item.link && <p className="text-gray-700 text-[11px] font-mono mt-0.5 truncate">{item.link}</p>}
                </div>

                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  {/* Reorder */}
                  <button onClick={() => move(idx, -1)} disabled={idx === 0}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-white/8 disabled:opacity-20 transition-all">
                    <ChevronUp size={13}/>
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-white/8 disabled:opacity-20 transition-all">
                    <ChevronDown size={13}/>
                  </button>
                  <span className="text-gray-700 text-xs">#{idx + 1}</span>

                  <div className="ml-auto flex items-center gap-1.5">
                    <button onClick={() => setModal({ mode: "edit", item })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                      <Edit2 size={11}/> Edit
                    </button>
                    {deleteConfirm === item.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-red-400 text-xs mr-1">Delete?</span>
                        <button onClick={() => handleDelete(item.id)} disabled={deleting.has(item.id)}
                          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors">
                          {deleting.has(item.id) ? <Loader2 size={11} className="animate-spin"/> : "Yes"}
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirm(item.id)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={13}/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-20"/>
          <p className="text-sm">No featured products yet.</p>
          <button onClick={() => setModal({ mode: "add" })}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-colors">
            <Plus size={13}/> Add your first product
          </button>
        </div>
      )}

      <p className="mt-5 text-gray-700 text-xs">
        Tip: Use the ↑↓ arrows to reorder products. The first 4 appear on the homepage "Most Popular Picks" section.
      </p>

      {/* Modal */}
      {modal && (
        <ProductFormModal
          initial={modal.mode === "edit" ? modal.item : undefined}
          addToast={addToast}
          onClose={() => setModal(null)}
          onSave={async (form) => {
            if (modal.mode === "add") {
              await handleAdd({ name: form.name, description: form.description, price: form.price, imageUrl: form.imageUrl, badge: form.badge, link: form.link });
            } else {
              await handleEdit(modal.item.id, { name: form.name, description: form.description, price: form.price, imageUrl: form.imageUrl, badge: form.badge, link: form.link });
            }
          }}
        />
      )}
    </div>
  );
}
