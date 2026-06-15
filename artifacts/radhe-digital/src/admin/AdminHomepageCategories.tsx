import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera, Eye, EyeOff, Trash2, Plus, Loader2,
  CheckCircle2, AlertCircle, Image as ImageIcon, Save, X, GripVertical,
} from "lucide-react";
import {
  getAdminHomepageCategories, updateHomepageCategory,
  createHomepageCategory, deleteHomepageCategory, uploadImage,
  type HomepageCategory,
} from "./api";
import { compressImage, validateImageFile } from "./imageUtils";
import { invalidateHomepageCategoriesCache } from "@/hooks/useHomepageCategories";

interface CatEdits { name: string; nameHi: string; displayOrder: string; dirty: boolean; }
interface Toast { id: number; text: string; ok: boolean; }

export default function AdminHomepageCategories() {
  const [cats, setCats] = useState<HomepageCategory[]>([]);
  const [edits, setEdits] = useState<Record<number, CatEdits>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState<Set<number>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ slug: "", name: "", nameHi: "" });
  const [addSaving, setAddSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const uploadRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const toastCounter = useRef(0);

  const addToast = (text: string, ok = true) => {
    const id = ++toastCounter.current;
    setToasts(p => [...p, { id, text, ok }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    getAdminHomepageCategories()
      .then(data => {
        setCats(data);
        const init: Record<number, CatEdits> = {};
        for (const c of data) {
          init[c.id] = { name: c.name, nameHi: c.nameHi ?? "", displayOrder: String(c.displayOrder), dirty: false };
        }
        setEdits(init);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const setEdit = (id: number, field: keyof Omit<CatEdits, "dirty">, val: string) =>
    setEdits(p => ({ ...p, [id]: { ...p[id], [field]: val, dirty: true } }));

  const saveEdits = async (cat: HomepageCategory) => {
    const e = edits[cat.id];
    if (!e?.dirty) return;
    setSaving(p => new Set([...p, cat.id]));
    try {
      const updated = await updateHomepageCategory(cat.id, {
        name: e.name,
        nameHi: e.nameHi || null,
        displayOrder: parseInt(e.displayOrder) || cat.displayOrder,
      });
      setCats(p => p.map(c => c.id === cat.id ? { ...c, ...updated } : c).sort((a, b) => a.displayOrder - b.displayOrder));
      setEdits(p => ({ ...p, [cat.id]: { ...p[cat.id], dirty: false } }));
      invalidateHomepageCategoriesCache();
      addToast("Saved!");
    } catch { addToast("Save failed. Try again.", false); }
    finally { setSaving(p => { const s = new Set(p); s.delete(cat.id); return s; }); }
  };

  const toggleVisible = async (cat: HomepageCategory) => {
    const newVal = cat.isVisible ? 0 : 1;
    setSaving(p => new Set([...p, cat.id]));
    try {
      const updated = await updateHomepageCategory(cat.id, { isVisible: newVal });
      setCats(p => p.map(c => c.id === cat.id ? { ...c, ...updated } : c));
      invalidateHomepageCategoriesCache();
      addToast(newVal ? "Visible on homepage" : "Hidden from homepage");
    } catch { addToast("Failed to update visibility.", false); }
    finally { setSaving(p => { const s = new Set(p); s.delete(cat.id); return s; }); }
  };

  const handleImageUpload = async (cat: HomepageCategory, file: File) => {
    setUploading(p => new Set([...p, cat.id]));
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImage(compressed);
      const updated = await updateHomepageCategory(cat.id, { imageUrl: url });
      setCats(p => p.map(c => c.id === cat.id ? { ...c, ...updated } : c));
      invalidateHomepageCategoriesCache();
      addToast("Image uploaded!");
    } catch (err: unknown) {
      addToast((err as Error).message ?? "Upload failed.", false);
    }
    finally { setUploading(p => { const s = new Set(p); s.delete(cat.id); return s; }); }
  };

  const removeImage = async (cat: HomepageCategory) => {
    setSaving(p => new Set([...p, cat.id]));
    try {
      const updated = await updateHomepageCategory(cat.id, { imageUrl: null });
      setCats(p => p.map(c => c.id === cat.id ? { ...c, ...updated } : c));
      invalidateHomepageCategoriesCache();
      addToast("Image removed.");
    } catch { addToast("Failed to remove image.", false); }
    finally { setSaving(p => { const s = new Set(p); s.delete(cat.id); return s; }); }
  };

  const handleDelete = async (id: number) => {
    setSaving(p => new Set([...p, id]));
    try {
      await deleteHomepageCategory(id);
      setCats(p => p.filter(c => c.id !== id));
      setEdits(p => { const e = { ...p }; delete e[id]; return e; });
      setDeleteConfirm(null);
      invalidateHomepageCategoriesCache();
      addToast("Category deleted.");
    } catch { addToast("Delete failed.", false); }
    finally { setSaving(p => { const s = new Set(p); s.delete(id); return s; }); }
  };

  const handleAdd = async () => {
    if (!newForm.slug || !newForm.name) return;
    setAddSaving(true);
    try {
      const created = await createHomepageCategory(newForm);
      setCats(p => [...p, created]);
      setEdits(p => ({ ...p, [created.id]: { name: created.name, nameHi: created.nameHi ?? "", displayOrder: String(created.displayOrder), dirty: false } }));
      setNewForm({ slug: "", name: "", nameHi: "" });
      setShowAdd(false);
      invalidateHomepageCategoriesCache();
      addToast("Category added!");
    } catch (err: unknown) { addToast((err as Error).message ?? "Failed to add category.", false); }
    finally { setAddSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-primary" /></div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="max-w-4xl relative">
      {/* Toast stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold ${t.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
            {t.ok ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>} {t.text}
          </motion.div>
        ))}
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-white font-bold text-xl">Homepage Categories Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Upload photos and manage which categories appear on your homepage.</p>
        </div>
        <button onClick={() => setShowAdd(v => !v)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors">
          <Plus size={14}/> Add Category
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-5 bg-[#191919] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold text-sm">New Category</p>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white transition-colors"><X size={15}/></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { placeholder: "URL slug (e.g. hoodies)", field: "slug" as const, transform: (v: string) => v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") },
              { placeholder: "Name in English", field: "name" as const, transform: (v: string) => v },
              { placeholder: "हिंदी नाम (optional)", field: "nameHi" as const, transform: (v: string) => v },
            ].map(({ placeholder, field, transform }) => (
              <input key={field} value={newForm[field]} placeholder={placeholder}
                onChange={e => setNewForm(f => ({ ...f, [field]: transform(e.target.value) }))}
                className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-primary/50" />
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500 hover:text-white text-sm font-semibold transition-colors rounded-xl">Cancel</button>
            <button onClick={handleAdd} disabled={!newForm.slug || !newForm.name || addSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
              {addSaving ? <Loader2 size={12} className="animate-spin"/> : <Plus size={12}/>} Add
            </button>
          </div>
        </div>
      )}

      {/* Category cards */}
      <div className="space-y-3">
        {cats.map(cat => {
          const edit = edits[cat.id];
          const isUp = uploading.has(cat.id);
          const isSav = saving.has(cat.id);

          return (
            <div key={cat.id}
              className={`bg-[#111] border rounded-2xl overflow-hidden transition-all ${cat.isVisible ? "border-white/8" : "border-white/4 opacity-55"}`}>
              <div className="flex">
                {/* Image cell */}
                <div
                  className="relative flex-shrink-0 w-28 sm:w-36 cursor-pointer select-none"
                  style={{ aspectRatio: "1 / 1" }}
                  onClick={() => !isUp && uploadRefs.current[cat.id]?.click()}
                  title={cat.imageUrl ? "Click to change image" : "Click to upload image"}
                >
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" draggable={false}/>
                  ) : (
                    <div className="w-full h-full bg-white/3 border-r border-white/5 flex flex-col items-center justify-center gap-2">
                      <Camera size={22} className="text-gray-600"/>
                      <span className="text-gray-600 text-[11px] text-center px-2 leading-tight">Upload<br/>Image</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/55 transition-colors flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center gap-1.5">
                      {isUp ? <Loader2 size={20} className="text-white animate-spin"/>
                             : <><Camera size={18} className="text-white"/><span className="text-white text-[10px] font-bold">{cat.imageUrl ? "Change" : "Upload"}</span></>}
                    </div>
                  </div>
                  <input ref={el => { uploadRefs.current[cat.id] = el; }} type="file" accept="image/jpeg,image/png,image/webp"
                    className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(cat, f); e.target.value = ""; }}/>
                </div>

                {/* Fields panel */}
                <div className="flex-1 p-4 min-w-0 flex flex-col gap-2.5">
                  {/* Name row */}
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <input value={edit?.name ?? cat.name} onChange={e => setEdit(cat.id, "name", e.target.value)}
                        className="w-full bg-white/5 border border-white/8 text-white font-bold text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-primary/50 mb-1.5"
                        placeholder="Category name"/>
                      <input value={edit?.nameHi ?? cat.nameHi ?? ""} onChange={e => setEdit(cat.id, "nameHi", e.target.value)}
                        className="w-full bg-white/5 border border-white/8 text-gray-400 text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-primary/50"
                        placeholder="हिंदी नाम (optional)"/>
                    </div>
                    {/* Visibility */}
                    <button onClick={() => !isSav && toggleVisible(cat)} disabled={isSav}
                      className={`flex-shrink-0 self-start flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        cat.isVisible
                          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20"
                      }`}>
                      {isSav ? <Loader2 size={12} className="animate-spin"/>
                              : cat.isVisible ? <Eye size={12}/> : <EyeOff size={12}/>}
                      <span className="hidden sm:inline">{cat.isVisible ? "Visible" : "Hidden"}</span>
                    </button>
                  </div>

                  {/* Order + actions row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 text-xs">Order</span>
                      <input type="number" min={1} value={edit?.displayOrder ?? cat.displayOrder}
                        onChange={e => setEdit(cat.id, "displayOrder", e.target.value)}
                        className="w-14 bg-white/5 border border-white/8 text-white text-xs px-2 py-1.5 rounded-lg text-center focus:outline-none focus:border-primary/50"/>
                    </div>
                    <span className="text-gray-700 text-xs font-mono">/{cat.slug}</span>

                    <div className="ml-auto flex items-center gap-1.5">
                      {cat.imageUrl && (
                        <button onClick={() => removeImage(cat)} disabled={isSav}
                          className="text-xs text-gray-600 hover:text-red-400 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 font-semibold transition-all">
                          Remove photo
                        </button>
                      )}
                      {edit?.dirty && (
                        <button onClick={() => saveEdits(cat)} disabled={isSav}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/90 hover:bg-primary text-white text-xs font-bold transition-colors">
                          {isSav ? <Loader2 size={11} className="animate-spin"/> : <Save size={11}/>} Save
                        </button>
                      )}
                      {deleteConfirm === cat.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-red-400 text-xs mr-1">Delete?</span>
                          <button onClick={() => handleDelete(cat.id)}
                            className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors">Yes</button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-gray-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(cat.id)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={13}/>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cats.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-600">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-20"/>
          <p className="text-sm">No categories yet. Add one above.</p>
        </div>
      )}

      {/* Tip */}
      <p className="mt-6 text-gray-700 text-xs">
        <GripVertical size={12} className="inline mr-1"/> Tip: Upload JPG, PNG or WebP images. Changes reflect on the homepage immediately after saving.
      </p>
    </div>
  );
}
