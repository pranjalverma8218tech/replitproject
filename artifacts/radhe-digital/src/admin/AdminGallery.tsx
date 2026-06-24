import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Loader2, CheckCircle2, AlertCircle,
  Camera, X, Image as ImageIcon, GripVertical, Edit2, Save, RefreshCw,
} from "lucide-react";
import {
  getGalleryImages, createGalleryImage, updateGalleryImage,
  deleteGalleryImage, reorderGalleryImages, uploadImage, type GalleryImage,
} from "./api";
import { compressImage, validateImageFile } from "./imageUtils";
import { invalidateGalleryCache } from "@/hooks/useGallery";

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

const lCls = "text-gray-500 text-[11px] font-semibold uppercase tracking-wide mb-1 block";
const iCls = "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-primary/50";

function AddImageModal({
  onSave,
  onClose,
  addToast,
}: {
  onSave: (data: { imageUrl: string; caption: string }) => Promise<void>;
  onClose: () => void;
  addToast: (t: string, ok?: boolean) => void;
}) {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImage(compressed);
      setImageUrl(url);
      addToast("Image uploaded!");
    } catch (err: unknown) {
      addToast((err as Error).message ?? "Upload failed.", false);
    } finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!imageUrl) { addToast("Please upload an image.", false); return; }
    setSaving(true);
    try {
      await onSave({ imageUrl, caption });
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-white font-bold">Add Gallery Image</p>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16}/></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className={lCls}>Image *</label>
            <div
              className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/10"
              style={{ background: imageUrl ? undefined : "rgba(255,255,255,0.03)" }}
              onClick={() => !uploading && fileRef.current?.click()}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Camera size={24} className="text-gray-600"/>
                  <span className="text-gray-600 text-xs">Click to upload image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 flex flex-col items-center gap-1.5">
                  {uploading
                    ? <Loader2 size={22} className="text-white animate-spin"/>
                    : <><Camera size={20} className="text-white"/><span className="text-white text-xs font-bold">{imageUrl ? "Change" : "Upload"}</span></>
                  }
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImage(f); e.target.value = ""; }}/>
            </div>
            {imageUrl && (
              <button onClick={() => setImageUrl("")} className="mt-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors">
                Remove image
              </button>
            )}
          </div>

          <div>
            <label className={lCls}>Caption (optional)</label>
            <input value={caption} onChange={e => setCaption(e.target.value)} className={iCls} placeholder="e.g. Custom Bulk T-Shirts for Events"/>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-white text-sm font-semibold transition-colors rounded-xl">Cancel</button>
          <button onClick={handleSubmit} disabled={saving || uploading || !imageUrl}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin"/> : <Save size={13}/>}
            Add Image
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EditCaptionModal({
  item,
  onSave,
  onClose,
}: {
  item: GalleryImage;
  onSave: (caption: string) => Promise<void>;
  onClose: () => void;
}) {
  const [caption, setCaption] = useState(item.caption);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    try { await onSave(caption); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.8)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <p className="text-white font-bold">Edit Caption</p>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={16}/></button>
        </div>
        <div className="p-5">
          <img src={item.imageUrl} alt="" className="w-full h-36 object-cover rounded-xl mb-4"/>
          <label className={lCls}>Caption</label>
          <input value={caption} onChange={e => setCaption(e.target.value)} className={iCls} placeholder="Short caption for this image"/>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-white/8">
          <button onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-white text-sm font-semibold transition-colors rounded-xl">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
            {saving ? <Loader2 size={13} className="animate-spin"/> : <Save size={13}/>}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<GalleryImage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Set<number>>(new Set());

  // Drag state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [replacing, setReplacing] = useState<Set<number>>(new Set());
  const replaceRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const { toasts, add: addToast } = useToasts();

  useEffect(() => {
    getGalleryImages()
      .then(data => setItems(data.sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const refresh = (updated: GalleryImage[]) => {
    setItems(updated.sort((a, b) => a.displayOrder - b.displayOrder));
    invalidateGalleryCache();
  };

  const handleAdd = async (data: { imageUrl: string; caption: string }) => {
    const created = await createGalleryImage(data);
    refresh([...items, created]);
    setShowAdd(false);
    addToast("Image added to gallery!");
  };

  const handleEditCaption = async (id: number, caption: string) => {
    const updated = await updateGalleryImage(id, { caption });
    refresh(items.map(p => p.id === id ? updated : p));
    setEditItem(null);
    addToast("Caption updated!");
  };

  const handleDelete = async (id: number) => {
    setDeleting(s => new Set([...s, id]));
    try {
      await deleteGalleryImage(id);
      refresh(items.filter(p => p.id !== id));
      setDeleteConfirm(null);
      addToast("Image removed.");
    } catch { addToast("Delete failed.", false); }
    finally { setDeleting(s => { const n = new Set(s); n.delete(id); return n; }); }
  };

  // Image replacement
  const handleReplaceImage = async (id: number, file: File) => {
    setReplacing(s => new Set([...s, id]));
    try {
      validateImageFile(file);
      const { file: compressed } = await compressImage(file);
      const { url } = await uploadImage(compressed);
      const updated = await updateGalleryImage(id, { imageUrl: url });
      refresh(items.map(p => p.id === id ? updated : p));
      addToast("Image replaced!");
    } catch (err: unknown) {
      addToast((err as Error).message ?? "Replace failed.", false);
    } finally {
      setReplacing(s => { const n = new Set(s); n.delete(id); return n; });
    }
  };

  // Drag-and-drop reorder
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };
  const handleDrop = async (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOverIdx(null); return; }
    const prevItems = [...items];
    const reordered = [...items];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dropIdx, 0, moved);
    const withOrder = reordered.map((item, i) => ({ ...item, displayOrder: i + 1 }));
    setItems(withOrder);
    setDragIdx(null);
    setDragOverIdx(null);
    try {
      await reorderGalleryImages(withOrder.map(i => i.id));
      invalidateGalleryCache();
      addToast("Order saved!");
    } catch {
      // Rollback on failure
      setItems(prevItems);
      addToast("Reorder failed.", false);
    }
  };
  const handleDragEnd = () => { setDragIdx(null); setDragOverIdx(null); };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-primary"/></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
      <AlertCircle size={32} className="text-red-400"/>
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  );

  return (
    <div className="max-w-5xl relative">
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
          <h2 className="text-white font-bold text-lg">Gallery Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage the <span className="text-white font-semibold">"Our Recent Work"</span> gallery shown on the homepage.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors"
        >
          <Plus size={14}/> Add Image
        </button>
      </div>

      {/* Stats bar */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 mb-5 px-4 py-3 bg-white/3 rounded-xl border border-white/8">
          <span className="text-gray-400 text-sm">{items.length} image{items.length !== 1 ? "s" : ""} in gallery</span>
          <span className="text-gray-700 text-xs">• Drag rows to reorder</span>
        </div>
      )}

      {/* Grid preview */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8">
              <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
              {item.caption && (
                <p className="absolute bottom-2 left-2 right-2 text-white text-[10px] font-semibold leading-tight line-clamp-2">{item.caption}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List — drag to reorder */}
      <div className="space-y-2">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            className={`bg-[#111] border rounded-2xl overflow-hidden transition-all cursor-grab active:cursor-grabbing ${
              dragOverIdx === idx && dragIdx !== idx
                ? "border-primary/60 shadow-lg shadow-primary/10"
                : "border-white/8"
            } ${dragIdx === idx ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3 p-3">
              {/* Drag handle */}
              <div className="text-gray-700 hover:text-gray-400 transition-colors flex-shrink-0 px-1">
                <GripVertical size={16}/>
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/8">
                <img src={item.imageUrl} alt={item.caption} className="w-full h-full object-cover"/>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">#{idx + 1}</p>
                <p className="text-white text-sm font-semibold truncate mt-0.5">
                  {item.caption || <span className="text-gray-600 italic font-normal">No caption</span>}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Hidden file input for replace */}
                <input
                  ref={el => { replaceRefs.current[item.id] = el; }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleReplaceImage(item.id, f); e.target.value = ""; }}
                />
                <button
                  onClick={() => replaceRefs.current[item.id]?.click()}
                  disabled={replacing.has(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all disabled:opacity-50"
                >
                  {replacing.has(item.id) ? <Loader2 size={11} className="animate-spin"/> : <RefreshCw size={11}/>} Replace
                </button>
                <button
                  onClick={() => setEditItem(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all"
                >
                  <Edit2 size={11}/> Caption
                </button>
                {deleteConfirm === item.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-red-400 text-xs mr-1">Delete?</span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting.has(item.id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg font-bold transition-colors"
                    >
                      {deleting.has(item.id) ? <Loader2 size={11} className="animate-spin"/> : "Yes"}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-500 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors">No</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-gray-600">
          <ImageIcon size={40} className="mx-auto mb-3 opacity-20"/>
          <p className="text-sm">No gallery images yet.</p>
          <p className="text-xs text-gray-700 mt-1">Add your first image to showcase your work on the homepage.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary/20 transition-colors"
          >
            <Plus size={13}/> Add first image
          </button>
        </div>
      )}

      {items.length > 0 && (
        <p className="mt-4 text-gray-700 text-xs">
          Tip: Drag rows to reorder. Images appear on the homepage in the order shown here.
        </p>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAdd && (
          <AddImageModal
            addToast={addToast}
            onClose={() => setShowAdd(false)}
            onSave={handleAdd}
          />
        )}
        {editItem && (
          <EditCaptionModal
            item={editItem}
            onClose={() => setEditItem(null)}
            onSave={caption => handleEditCaption(editItem.id, caption)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
