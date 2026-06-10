import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, X, Package, ChevronDown, ImagePlus, Loader2, RefreshCw, WifiOff, AlertCircle } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct, type Product, DB_NOT_CONNECTED_MSG } from "./api";
import type { ProductCategory } from "./sampleData";

const CATEGORIES: ProductCategory[] = [
  "T-Shirt Printing","Mug Printing","Cap Printing",
  "Mobile Cover Printing","Corporate Gifts","Customized Products",
];

const EMPTY_FORM = { name:"", category:"T-Shirt Printing" as ProductCategory, description:"", price:0, imageUrl:"", status:"Active" as "Active"|"Inactive", stock:0 };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [dbDown,   setDbDown]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState<{ open:boolean; editing:Product|null }>({ open:false, editing:null });
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<string|null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try { setProducts(await getProducts({ search: search || undefined })); }
    catch (e:any) {
      if (e.code==="DB_NOT_CONFIGURED"||e.status===503) setDbDown(true);
      else setError(e.message ?? "Failed to load products");
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm(EMPTY_FORM); setModal({ open:true, editing:null }); };
  const openEdit = (p:Product) => { setForm({ name:p.name, category:p.category as ProductCategory, description:p.description??'', price:Number(p.price), imageUrl:p.imageUrl??'', status:p.status, stock:p.stock }); setModal({ open:true, editing:p }); };
  const closeModal = () => setModal({ open:false, editing:null });

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (modal.editing) {
        const updated = await updateProduct(modal.editing.id, form);
        setProducts(prev => prev.map(p => p.id === modal.editing!.id ? { ...p, ...updated } : p));
      } else {
        const created = await createProduct(form);
        setProducts(prev => [created, ...prev]);
      }
      closeModal();
    } catch (e:any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id:string) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e:any) { setError(e.message); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{loading ? "Loading…" : `${products.filter(p=>p.status==="Active").length} active · ${products.filter(p=>p.status==="Inactive").length} inactive`}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
            <RefreshCw size={13} className={loading?"animate-spin":""} />
          </button>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={openAdd} disabled={dbDown}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm disabled:opacity-40"
            style={{ background:"linear-gradient(135deg,#e53e3e,#c53030)", boxShadow:"0 4px 14px rgba(229,62,62,0.3)" }}>
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
      {error && <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"><AlertCircle size={16} className="text-red-400 flex-shrink-0" /><p className="text-red-300 text-sm">{error}</p></div>}

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
          className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-600"><Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading products…</span></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-600"><Package size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">{dbDown ? "Connect database to manage products" : "No products yet. Add your first product."}</p></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <motion.div key={p.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
              <div className="h-36 bg-[#1a1a1a] border-b border-white/6 flex items-center justify-center">
                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" /> : <Package size={36} className="text-gray-700" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><p className="text-white font-bold text-sm truncate">{p.name}</p><p className="text-gray-600 text-xs mt-0.5">{p.category}</p></div>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg border ${p.status==="Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}>{p.status}</span>
                </div>
                <p className="text-gray-500 text-xs mt-2 line-clamp-2">{p.description}</p>
                <div className="flex items-end justify-between mt-3">
                  <div><p className="text-primary font-black text-lg">₹{Number(p.price)}</p><p className="text-gray-600 text-xs">Stock: {p.stock}</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-xl bg-white/6 hover:bg-primary/15 hover:text-primary text-gray-400 flex items-center justify-center transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-xl bg-white/6 hover:bg-red-500/15 hover:text-red-400 text-gray-400 flex items-center justify-center transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal.open && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={closeModal} />
            <motion.div initial={{ opacity:0, scale:0.96, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96, y:20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 bg-[#111] border border-white/10 rounded-2xl overflow-hidden"
              style={{ boxShadow:"0 24px 80px rgba(0,0,0,0.7)" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <h3 className="text-white font-bold text-base">{modal.editing ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all"><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="h-24 bg-[#1a1a1a] border border-dashed border-white/15 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/40 transition-colors">
                  <ImagePlus size={20} className="text-gray-600" /><p className="text-gray-600 text-xs">Click to upload product image</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Product Name *</label>
                  <input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Classic Round Neck T-Shirt"
                    className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                    <div className="relative">
                      <select value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value as ProductCategory}))}
                        className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 pr-8 text-sm text-white outline-none appearance-none cursor-pointer focus:border-primary/40 transition-colors">
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
                    <div className="relative">
                      <select value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value as "Active"|"Inactive"}))}
                        className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 pr-8 text-sm text-white outline-none appearance-none cursor-pointer focus:border-primary/40 transition-colors">
                        <option value="Active" className="bg-[#1a1a1a]">Active</option>
                        <option value="Inactive" className="bg-[#1a1a1a]">Inactive</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Price (₹)</label>
                    <input type="number" value={form.price||""} onChange={e => setForm(f=>({...f,price:Number(e.target.value)}))} placeholder="199"
                      className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Stock</label>
                    <input type="number" value={form.stock||""} onChange={e => setForm(f=>({...f,stock:Number(e.target.value)}))} placeholder="100"
                      className="w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={3} placeholder="Product description…"
                    className="w-full bg-[#1a1a1a] border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors resize-none" />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-white/8 flex gap-3">
                <button onClick={closeModal} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 h-10 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#e53e3e,#c53030)" }}>
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
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4 bg-[#111] border border-white/10 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-400" /></div>
              <h3 className="text-white font-bold text-lg mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 h-10 rounded-xl border border-white/12 text-gray-400 hover:text-white text-sm font-semibold transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-bold transition-colors">Delete</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
