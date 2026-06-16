import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle,
  ChevronUp, ChevronDown, Layout, Megaphone, Award, ListOrdered,
  MessageSquare, HelpCircle, Zap, Star,
} from "lucide-react";
import {
  getCmsHero, putCmsHero, getCmsCta, putCmsCta,
  cmsTrust, cmsWhyUs, cmsSteps, cmsTestimonials, cmsFaqs,
  type CmsHero, type CmsTrustItem, type CmsWhyUs, type CmsStep,
  type CmsTestimonial, type CmsFaq, type CmsCta,
} from "./api";

// ── Toasts ────────────────────────────────────────────────────────────────────
interface Toast { id: number; text: string; ok: boolean; }

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ctr = useRef(0);
  const addToast = useCallback((text: string, ok = true) => {
    const id = ++ctr.current;
    setToasts(p => [...p, { id, text, ok }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return { toasts, addToast };
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-semibold text-white ${t.ok ? "bg-green-600" : "bg-red-600"}`}>
          {t.ok ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>} {t.text}
        </motion.div>
      ))}
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const iCls  = "w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2.5 rounded-xl placeholder-gray-600 focus:outline-none focus:border-primary/50";
const taCls = `${iCls} resize-none`;
const lCls  = "text-gray-500 text-[11px] font-semibold uppercase tracking-wide mb-1 block";
const cardCls = "bg-[#111] border border-white/8 rounded-2xl p-4";

// ── Generic list-section hook ─────────────────────────────────────────────────
interface CmsArr<T extends { id: number; displayOrder: number }> {
  get:    ()                             => Promise<T[]>;
  create: (d: Record<string, unknown>)   => Promise<T>;
  update: (id: number, d: Partial<T>)   => Promise<T>;
  remove: (id: number)                  => Promise<unknown>;
}

function useSection<T extends { id: number; displayOrder: number }>(
  api: CmsArr<T>,
  addToast: (t: string, ok?: boolean) => void,
) {
  const [items, setItems]     = useState<T[]>([]);
  const [loaded, setLoaded]   = useState(false);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [delConfirm, setDelConfirm] = useState<number | null>(null);
  const [draftMap, setDraftMap] = useState<Map<number, Partial<T> & { dirty?: boolean }>>(new Map());

  useEffect(() => {
    api.get()
      .then(data => { setItems(data); setLoaded(true); })
      .catch(() => addToast("Failed to load.", false));
  }, []);

  const sorted = [...items].sort((a, b) => a.displayOrder - b.displayOrder);

  const getDraft = (item: T): T => {
    const d = draftMap.get(item.id);
    return d ? { ...item, ...d } : item;
  };

  const setDraft = (id: number, updates: Partial<T>) => {
    setDraftMap(m => {
      const n = new Map(m);
      n.set(id, { ...(n.get(id) ?? {}), ...updates, dirty: true });
      return n;
    });
  };

  const isDirty  = (id: number) => !!(draftMap.get(id)?.dirty);
  const isSaving = (id: number) => savingIds.has(id);

  const saveItem = async (item: T) => {
    const draft = draftMap.get(item.id);
    if (!draft?.dirty) return;
    const { dirty, ...updates } = draft;
    setSavingIds(s => new Set([...s, item.id]));
    try {
      const updated = await api.update(item.id, updates as Partial<T>);
      setItems(p => p.map(i => i.id === item.id ? { ...i, ...updated } : i));
      setDraftMap(m => { const n = new Map(m); n.delete(item.id); return n; });
      addToast("Saved!");
    } catch { addToast("Save failed.", false); }
    finally { setSavingIds(s => { const n = new Set(s); n.delete(item.id); return n; }); }
  };

  const deleteItem = async (id: number) => {
    setSavingIds(s => new Set([...s, id]));
    try {
      await api.remove(id);
      setItems(p => p.filter(i => i.id !== id));
      setDelConfirm(null);
      addToast("Deleted.");
    } catch { addToast("Delete failed.", false); }
    finally { setSavingIds(s => { const n = new Set(s); n.delete(id); return n; }); }
  };

  const addItem = async (newData: Record<string, unknown>) => {
    const maxOrd = Math.max(0, ...items.map(i => i.displayOrder)) + 1;
    try {
      const created = await api.create({ ...newData, displayOrder: maxOrd });
      setItems(p => [...p, created]);
      addToast("Added!");
      return created;
    } catch { addToast("Add failed.", false); return null; }
  };

  const reorderItem = async (id: number, dir: "up" | "down") => {
    const s = [...items].sort((a, b) => a.displayOrder - b.displayOrder);
    const idx = s.findIndex(i => i.id === id);
    const si = dir === "up" ? idx - 1 : idx + 1;
    if (si < 0 || si >= s.length) return;
    const a = { ...s[idx], displayOrder: s[si].displayOrder };
    const b = { ...s[si], displayOrder: s[idx].displayOrder };
    setItems(p => p.map(i => i.id === a.id ? a : i.id === b.id ? b : i));
    await Promise.all([
      api.update(a.id, { displayOrder: a.displayOrder } as Partial<T>).catch(() => null),
      api.update(b.id, { displayOrder: b.displayOrder } as Partial<T>).catch(() => null),
    ]);
  };

  return { items: sorted, loaded, getDraft, setDraft, isDirty, isSaving, saveItem, deleteItem, addItem, reorderItem, delConfirm, setDelConfirm };
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function ReorderBtns({ idx, total, onUp, onDown }: { idx: number; total: number; onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-0.5 pt-0.5 flex-shrink-0">
      <button onClick={onUp} disabled={idx === 0} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors p-0.5 rounded"><ChevronUp size={13}/></button>
      <button onClick={onDown} disabled={idx === total - 1} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors p-0.5 rounded"><ChevronDown size={13}/></button>
    </div>
  );
}

function ItemActions({ dirty, saving, onSave, delConfirm, onDeleteRequest, onDeleteConfirm, onDeleteCancel }: {
  dirty: boolean; saving: boolean; onSave: () => void;
  delConfirm: boolean; onDeleteRequest: () => void; onDeleteConfirm: () => void; onDeleteCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {dirty && (
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-primary/90 hover:bg-primary text-white text-xs font-bold transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={11} className="animate-spin"/> : <Save size={11}/>}
        </button>
      )}
      {delConfirm ? (
        <span className="flex items-center gap-1">
          <span className="text-red-400 text-xs mr-1">Delete?</span>
          <button onClick={onDeleteConfirm} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg font-bold">Yes</button>
          <button onClick={onDeleteCancel} className="text-xs text-gray-500 hover:text-white px-2.5 py-1.5 rounded-lg">No</button>
        </span>
      ) : (
        <button onClick={onDeleteRequest} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
          <Trash2 size={13}/>
        </button>
      )}
    </div>
  );
}

function Spinner() {
  return <div className="flex items-center justify-center h-40"><Loader2 className="animate-spin text-primary" size={28}/></div>;
}

// ── Tab: Hero ─────────────────────────────────────────────────────────────────
function HeroTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const [form, setForm] = useState<Partial<CmsHero>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCmsHero().then(d => { setForm(d); setLoaded(true); })
      .catch(() => addToast("Failed to load hero data.", false));
  }, []);

  const set = (k: keyof CmsHero, v: string) => setForm(p => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { await putCmsHero(form as CmsHero); addToast("Hero section saved!"); }
    catch { addToast("Save failed.", false); }
    finally { setSaving(false); }
  };

  if (!loaded) return <Spinner/>;

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-gray-500 text-sm mb-5">Edit the text in the hero banner at the top of the homepage.</p>
      <div>
        <label className={lCls}>Badge / Tag Text</label>
        <input value={form.tag ?? ""} onChange={e => set("tag", e.target.value)} className={iCls} placeholder="Mathura's #1 Custom Printing Studio"/>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={lCls}>Title Line 1</label>
          <input value={form.line1 ?? ""} onChange={e => set("line1", e.target.value)} className={iCls} placeholder="Print Your"/>
        </div>
        <div>
          <label className={lCls}>Highlighted Word</label>
          <input value={form.brand ?? ""} onChange={e => set("brand", e.target.value)} className={iCls} placeholder="Brand"/>
        </div>
        <div>
          <label className={lCls}>Title Line 2</label>
          <input value={form.line2 ?? ""} onChange={e => set("line2", e.target.value)} className={iCls} placeholder="On Anything"/>
        </div>
      </div>
      <div className="text-gray-600 text-xs px-1">
        Preview: <span className="text-white">{form.line1} </span>
        <span style={{ color: "#F59E0B" }}>{form.brand}</span>
        <br/>
        <span style={{ color: "#F59E0B" }}>{form.line2}</span>
      </div>
      <div>
        <label className={lCls}>Subtitle / Description</label>
        <textarea rows={3} value={form.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} className={taCls}/>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lCls}>Primary Button Text</label>
          <input value={form.btn1Text ?? ""} onChange={e => set("btn1Text", e.target.value)} className={iCls}/>
        </div>
        <div>
          <label className={lCls}>Secondary Button Text</label>
          <input value={form.btn2Text ?? ""} onChange={e => set("btn2Text", e.target.value)} className={iCls}/>
        </div>
      </div>
      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Save Hero Section
      </button>
    </div>
  );
}

// ── Tab: Trust Bar ─────────────────────────────────────────────────────────────
function TrustTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const s = useSection<CmsTrustItem>(cmsTrust as unknown as CmsArr<CmsTrustItem>, addToast);
  const [newText, setNewText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    await s.addItem({ text: newText.trim() });
    setNewText("");
    setAdding(false);
  };

  if (!s.loaded) return <Spinner/>;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-gray-500 text-sm mb-4">These items scroll across the trust bar below the hero. Keep them short and punchy.</p>
      <div className="flex gap-2 mb-4">
        <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="Add a new trust item..."
          onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
          className={`flex-1 ${iCls}`}/>
        <button onClick={handleAdd} disabled={adding || !newText.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
          {adding ? <Loader2 size={13} className="animate-spin"/> : <Plus size={13}/>} Add
        </button>
      </div>
      {s.items.map((item, idx) => {
        const draft = s.getDraft(item);
        return (
          <div key={item.id} className={`${cardCls} flex items-center gap-3`}>
            <ReorderBtns idx={idx} total={s.items.length} onUp={() => s.reorderItem(item.id, "up")} onDown={() => s.reorderItem(item.id, "down")}/>
            <input value={draft.text} onChange={e => s.setDraft(item.id, { text: e.target.value } as Partial<CmsTrustItem>)} className={`flex-1 ${iCls}`}/>
            <ItemActions
              dirty={s.isDirty(item.id)} saving={s.isSaving(item.id)} onSave={() => s.saveItem(item)}
              delConfirm={s.delConfirm === item.id} onDeleteRequest={() => s.setDelConfirm(item.id)}
              onDeleteConfirm={() => s.deleteItem(item.id)} onDeleteCancel={() => s.setDelConfirm(null)}
            />
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Why Choose Us ─────────────────────────────────────────────────────────
const ICON_OPTIONS = ["zap","shield","package","palette","truck","users","star","award","clock","sparkles","check","heart","gift","phone","image"];

function WhyUsTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const s = useSection<CmsWhyUs>(cmsWhyUs as unknown as CmsArr<CmsWhyUs>, addToast);
  const [nf, setNf] = useState({ iconName: "zap", title: "", description: "" });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!nf.title.trim()) return;
    setAdding(true);
    await s.addItem(nf);
    setNf({ iconName: "zap", title: "", description: "" });
    setAdding(false);
  };

  if (!s.loaded) return <Spinner/>;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-gray-500 text-sm mb-4">Feature cards in the "Why Choose Us" section. Recommended: 6 cards.</p>
      <div className={`${cardCls} space-y-3`} style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.15)" }}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">+ Add New Card</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={lCls}>Icon</label>
            <select value={nf.iconName} onChange={e => setNf(p => ({ ...p, iconName: e.target.value }))} className={`${iCls} cursor-pointer`}>
              {ICON_OPTIONS.map(o => <option key={o} value={o} style={{ background: "#111" }}>{o}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={lCls}>Title</label>
            <input value={nf.title} onChange={e => setNf(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Lightning Fast" className={iCls}/>
          </div>
        </div>
        <div>
          <label className={lCls}>Description</label>
          <textarea rows={2} value={nf.description} onChange={e => setNf(p => ({ ...p, description: e.target.value }))} placeholder="Short description..." className={taCls}/>
        </div>
        <button onClick={handleAdd} disabled={adding || !nf.title.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
          {adding ? <Loader2 size={13} className="animate-spin"/> : <Plus size={13}/>} Add Card
        </button>
      </div>
      {s.items.map((item, idx) => {
        const draft = s.getDraft(item);
        return (
          <div key={item.id} className={cardCls}>
            <div className="flex items-start gap-3">
              <ReorderBtns idx={idx} total={s.items.length} onUp={() => s.reorderItem(item.id, "up")} onDown={() => s.reorderItem(item.id, "down")}/>
              <div className="flex-1 space-y-2.5">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={lCls}>Icon</label>
                    <select value={draft.iconName} onChange={e => s.setDraft(item.id, { iconName: e.target.value } as Partial<CmsWhyUs>)} className={`${iCls} cursor-pointer`}>
                      {ICON_OPTIONS.map(o => <option key={o} value={o} style={{ background: "#111" }}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className={lCls}>Title</label>
                    <input value={draft.title} onChange={e => s.setDraft(item.id, { title: e.target.value } as Partial<CmsWhyUs>)} className={iCls}/>
                  </div>
                </div>
                <div>
                  <label className={lCls}>Description</label>
                  <textarea rows={2} value={draft.description} onChange={e => s.setDraft(item.id, { description: e.target.value } as Partial<CmsWhyUs>)} className={taCls}/>
                </div>
              </div>
              <ItemActions
                dirty={s.isDirty(item.id)} saving={s.isSaving(item.id)} onSave={() => s.saveItem(item)}
                delConfirm={s.delConfirm === item.id} onDeleteRequest={() => s.setDelConfirm(item.id)}
                onDeleteConfirm={() => s.deleteItem(item.id)} onDeleteCancel={() => s.setDelConfirm(null)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: How It Works ──────────────────────────────────────────────────────────
const STEP_ICONS = ["sparkles","palette","clock","check","package","truck","star","zap","shield","users","award","phone"];

function StepsTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const s = useSection<CmsStep>(cmsSteps as unknown as CmsArr<CmsStep>, addToast);
  const [nf, setNf] = useState({ stepNumber: "05", iconName: "sparkles", title: "", description: "" });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!nf.title.trim()) return;
    setAdding(true);
    await s.addItem(nf);
    setNf({ stepNumber: "05", iconName: "sparkles", title: "", description: "" });
    setAdding(false);
  };

  if (!s.loaded) return <Spinner/>;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-gray-500 text-sm mb-4">The step-by-step process in the "How It Works" section.</p>
      <div className={`${cardCls} space-y-3`} style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.15)" }}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">+ Add New Step</p>
        <div className="grid grid-cols-4 gap-3">
          <div><label className={lCls}>Step #</label><input value={nf.stepNumber} onChange={e => setNf(p => ({ ...p, stepNumber: e.target.value }))} className={iCls} maxLength={3}/></div>
          <div>
            <label className={lCls}>Icon</label>
            <select value={nf.iconName} onChange={e => setNf(p => ({ ...p, iconName: e.target.value }))} className={`${iCls} cursor-pointer`}>
              {STEP_ICONS.map(o => <option key={o} value={o} style={{ background: "#111" }}>{o}</option>)}
            </select>
          </div>
          <div className="col-span-2"><label className={lCls}>Title</label><input value={nf.title} onChange={e => setNf(p => ({ ...p, title: e.target.value }))} className={iCls}/></div>
        </div>
        <div><label className={lCls}>Description</label><textarea rows={2} value={nf.description} onChange={e => setNf(p => ({ ...p, description: e.target.value }))} className={taCls}/></div>
        <button onClick={handleAdd} disabled={adding || !nf.title.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
          {adding ? <Loader2 size={13} className="animate-spin"/> : <Plus size={13}/>} Add Step
        </button>
      </div>
      {s.items.map((item, idx) => {
        const draft = s.getDraft(item);
        return (
          <div key={item.id} className={cardCls}>
            <div className="flex items-start gap-3">
              <ReorderBtns idx={idx} total={s.items.length} onUp={() => s.reorderItem(item.id, "up")} onDown={() => s.reorderItem(item.id, "down")}/>
              <div className="flex-1 space-y-2.5">
                <div className="grid grid-cols-4 gap-3">
                  <div><label className={lCls}>Step #</label><input value={draft.stepNumber} onChange={e => s.setDraft(item.id, { stepNumber: e.target.value } as Partial<CmsStep>)} className={iCls} maxLength={3}/></div>
                  <div>
                    <label className={lCls}>Icon</label>
                    <select value={draft.iconName} onChange={e => s.setDraft(item.id, { iconName: e.target.value } as Partial<CmsStep>)} className={`${iCls} cursor-pointer`}>
                      {STEP_ICONS.map(o => <option key={o} value={o} style={{ background: "#111" }}>{o}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2"><label className={lCls}>Title</label><input value={draft.title} onChange={e => s.setDraft(item.id, { title: e.target.value } as Partial<CmsStep>)} className={iCls}/></div>
                </div>
                <div><label className={lCls}>Description</label><textarea rows={2} value={draft.description} onChange={e => s.setDraft(item.id, { description: e.target.value } as Partial<CmsStep>)} className={taCls}/></div>
              </div>
              <ItemActions
                dirty={s.isDirty(item.id)} saving={s.isSaving(item.id)} onSave={() => s.saveItem(item)}
                delConfirm={s.delConfirm === item.id} onDeleteRequest={() => s.setDelConfirm(item.id)}
                onDeleteConfirm={() => s.deleteItem(item.id)} onDeleteCancel={() => s.setDelConfirm(null)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Testimonials ──────────────────────────────────────────────────────────
function TestimonialsTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const s = useSection<CmsTestimonial>(cmsTestimonials as unknown as CmsArr<CmsTestimonial>, addToast);
  const [nf, setNf] = useState({ name: "", initials: "", location: "", rating: 5, text: "" });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!nf.name.trim() || !nf.text.trim()) return;
    setAdding(true);
    await s.addItem(nf);
    setNf({ name: "", initials: "", location: "", rating: 5, text: "" });
    setAdding(false);
  };

  const StarRow = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1 mt-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          className={`transition-colors ${n <= value ? "text-yellow-400" : "text-gray-600 hover:text-yellow-300"}`}>
          <Star size={16} className={n <= value ? "fill-yellow-400" : ""}/>
        </button>
      ))}
    </div>
  );

  if (!s.loaded) return <Spinner/>;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-gray-500 text-sm mb-4">Customer reviews displayed in the Testimonials section.</p>
      <div className={`${cardCls} space-y-3`} style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.15)" }}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">+ Add New Review</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={lCls}>Full Name</label>
            <input value={nf.name} onChange={e => {
              const v = e.target.value;
              const initials = v.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2);
              setNf(p => ({ ...p, name: v, initials }));
            }} placeholder="Rahul Sharma" className={iCls}/>
          </div>
          <div><label className={lCls}>Initials (2 chars)</label><input value={nf.initials} onChange={e => setNf(p => ({ ...p, initials: e.target.value.toUpperCase().slice(0,2) }))} maxLength={2} placeholder="RS" className={iCls}/></div>
          <div><label className={lCls}>Location</label><input value={nf.location} onChange={e => setNf(p => ({ ...p, location: e.target.value }))} placeholder="Delhi" className={iCls}/></div>
        </div>
        <div><label className={lCls}>Star Rating</label><StarRow value={nf.rating} onChange={v => setNf(p => ({ ...p, rating: v }))}/></div>
        <div><label className={lCls}>Review Text</label><textarea rows={3} value={nf.text} onChange={e => setNf(p => ({ ...p, text: e.target.value }))} placeholder="What did the customer say?" className={taCls}/></div>
        <button onClick={handleAdd} disabled={adding || !nf.name.trim() || !nf.text.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
          {adding ? <Loader2 size={13} className="animate-spin"/> : <Plus size={13}/>} Add Review
        </button>
      </div>
      {s.items.map((item, idx) => {
        const draft = s.getDraft(item);
        return (
          <div key={item.id} className={cardCls}>
            <div className="flex items-start gap-3">
              <ReorderBtns idx={idx} total={s.items.length} onUp={() => s.reorderItem(item.id, "up")} onDown={() => s.reorderItem(item.id, "down")}/>
              <div className="flex-1 space-y-2.5">
                <div className="grid grid-cols-3 gap-3">
                  <div><label className={lCls}>Name</label><input value={draft.name} onChange={e => s.setDraft(item.id, { name: e.target.value } as Partial<CmsTestimonial>)} className={iCls}/></div>
                  <div><label className={lCls}>Initials</label><input value={draft.initials} onChange={e => s.setDraft(item.id, { initials: e.target.value.toUpperCase().slice(0,2) } as Partial<CmsTestimonial>)} maxLength={2} className={iCls}/></div>
                  <div><label className={lCls}>Location</label><input value={draft.location} onChange={e => s.setDraft(item.id, { location: e.target.value } as Partial<CmsTestimonial>)} className={iCls}/></div>
                </div>
                <div>
                  <label className={lCls}>Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => s.setDraft(item.id, { rating: n } as Partial<CmsTestimonial>)}
                        className={`transition-colors ${n <= draft.rating ? "text-yellow-400" : "text-gray-600 hover:text-yellow-300"}`}>
                        <Star size={16} className={n <= draft.rating ? "fill-yellow-400" : ""}/>
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className={lCls}>Review Text</label><textarea rows={3} value={draft.text} onChange={e => s.setDraft(item.id, { text: e.target.value } as Partial<CmsTestimonial>)} className={taCls}/></div>
              </div>
              <ItemActions
                dirty={s.isDirty(item.id)} saving={s.isSaving(item.id)} onSave={() => s.saveItem(item)}
                delConfirm={s.delConfirm === item.id} onDeleteRequest={() => s.setDelConfirm(item.id)}
                onDeleteConfirm={() => s.deleteItem(item.id)} onDeleteCancel={() => s.setDelConfirm(null)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: FAQs ──────────────────────────────────────────────────────────────────
function FaqsTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const s = useSection<CmsFaq>(cmsFaqs as unknown as CmsArr<CmsFaq>, addToast);
  const [nf, setNf] = useState({ question: "", answer: "" });
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!nf.question.trim()) return;
    setAdding(true);
    await s.addItem(nf);
    setNf({ question: "", answer: "" });
    setAdding(false);
  };

  if (!s.loaded) return <Spinner/>;

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-gray-500 text-sm mb-4">Frequently asked questions shown at the bottom of the homepage.</p>
      <div className={`${cardCls} space-y-3`} style={{ borderStyle: "dashed", borderColor: "rgba(255,255,255,0.15)" }}>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">+ Add New FAQ</p>
        <div><label className={lCls}>Question</label><input value={nf.question} onChange={e => setNf(p => ({ ...p, question: e.target.value }))} placeholder="e.g. What is the minimum order?" className={iCls}/></div>
        <div><label className={lCls}>Answer</label><textarea rows={3} value={nf.answer} onChange={e => setNf(p => ({ ...p, answer: e.target.value }))} placeholder="Your answer here..." className={taCls}/></div>
        <button onClick={handleAdd} disabled={adding || !nf.question.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50">
          {adding ? <Loader2 size={13} className="animate-spin"/> : <Plus size={13}/>} Add FAQ
        </button>
      </div>
      {s.items.map((item, idx) => {
        const draft = s.getDraft(item);
        return (
          <div key={item.id} className={cardCls}>
            <div className="flex items-start gap-3">
              <ReorderBtns idx={idx} total={s.items.length} onUp={() => s.reorderItem(item.id, "up")} onDown={() => s.reorderItem(item.id, "down")}/>
              <div className="flex-1 space-y-2.5">
                <div><label className={lCls}>Question</label><input value={draft.question} onChange={e => s.setDraft(item.id, { question: e.target.value } as Partial<CmsFaq>)} className={iCls}/></div>
                <div><label className={lCls}>Answer</label><textarea rows={3} value={draft.answer} onChange={e => s.setDraft(item.id, { answer: e.target.value } as Partial<CmsFaq>)} className={taCls}/></div>
              </div>
              <ItemActions
                dirty={s.isDirty(item.id)} saving={s.isSaving(item.id)} onSave={() => s.saveItem(item)}
                delConfirm={s.delConfirm === item.id} onDeleteRequest={() => s.setDelConfirm(item.id)}
                onDeleteConfirm={() => s.deleteItem(item.id)} onDeleteCancel={() => s.setDelConfirm(null)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Tab: Final CTA ─────────────────────────────────────────────────────────────
function CtaTab({ addToast }: { addToast: (t: string, ok?: boolean) => void }) {
  const [form, setForm] = useState<Partial<CmsCta>>({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCmsCta().then(d => { setForm(d); setLoaded(true); })
      .catch(() => addToast("Failed to load CTA data.", false));
  }, []);

  const set = (k: keyof CmsCta, v: string) => setForm(p => ({ ...p, [k]: v }));
  const save = async () => {
    setSaving(true);
    try { await putCmsCta(form as CmsCta); addToast("CTA section saved!"); }
    catch { addToast("Save failed.", false); }
    finally { setSaving(false); }
  };

  if (!loaded) return <Spinner/>;

  return (
    <div className="max-w-xl space-y-4">
      <p className="text-gray-500 text-sm mb-5">Edit the final call-to-action section at the bottom of the homepage.</p>
      <div><label className={lCls}>Badge Text</label><input value={form.badge ?? ""} onChange={e => set("badge", e.target.value)} className={iCls} placeholder="GET STARTED"/></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={lCls}>Title (before highlight)</label><input value={form.title ?? ""} onChange={e => set("title", e.target.value)} className={iCls} placeholder="Ready to Bring Your"/></div>
        <div><label className={lCls}>Highlighted Text</label><input value={form.highlight ?? ""} onChange={e => set("highlight", e.target.value)} className={iCls} placeholder="Ideas to Life?"/></div>
      </div>
      <div><label className={lCls}>Subtitle</label><textarea rows={2} value={form.subtitle ?? ""} onChange={e => set("subtitle", e.target.value)} className={taCls}/></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={lCls}>Primary Button Text</label><input value={form.btn1Text ?? ""} onChange={e => set("btn1Text", e.target.value)} className={iCls}/></div>
        <div><label className={lCls}>Secondary Button Text</label><input value={form.btn2Text ?? ""} onChange={e => set("btn2Text", e.target.value)} className={iCls}/></div>
      </div>
      <div><label className={lCls}>WhatsApp / Button 2 Link</label><input value={form.btn2Link ?? ""} onChange={e => set("btn2Link", e.target.value)} className={iCls} placeholder="https://wa.me/91..."/></div>
      <div className="border-t border-white/8 pt-4">
        <p className="text-gray-600 text-[11px] font-bold uppercase tracking-wide mb-3">Bottom Trust Points</p>
        <div className="grid grid-cols-3 gap-3">
          <div><label className={lCls}>Point 1</label><input value={form.point1 ?? ""} onChange={e => set("point1", e.target.value)} className={iCls}/></div>
          <div><label className={lCls}>Point 2</label><input value={form.point2 ?? ""} onChange={e => set("point2", e.target.value)} className={iCls}/></div>
          <div><label className={lCls}>Point 3</label><input value={form.point3 ?? ""} onChange={e => set("point3", e.target.value)} className={iCls}/></div>
        </div>
      </div>
      <button onClick={save} disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60">
        {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Save CTA Section
      </button>
    </div>
  );
}

// ── Tabs config ────────────────────────────────────────────────────────────────
type Tab = "hero" | "trust" | "why-us" | "steps" | "testimonials" | "faqs" | "cta";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "hero",         label: "Hero",          icon: <Layout size={14}/> },
  { key: "trust",        label: "Trust Bar",     icon: <Megaphone size={14}/> },
  { key: "why-us",       label: "Why Choose Us", icon: <Award size={14}/> },
  { key: "steps",        label: "How It Works",  icon: <ListOrdered size={14}/> },
  { key: "testimonials", label: "Testimonials",  icon: <MessageSquare size={14}/> },
  { key: "faqs",         label: "FAQs",          icon: <HelpCircle size={14}/> },
  { key: "cta",          label: "Final CTA",     icon: <Zap size={14}/> },
];

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminHomepageCms() {
  const { toasts, addToast } = useToasts();
  const [tab, setTab] = useState<Tab>("hero");

  const renderTab = () => {
    switch (tab) {
      case "hero":         return <HeroTab addToast={addToast}/>;
      case "trust":        return <TrustTab addToast={addToast}/>;
      case "why-us":       return <WhyUsTab addToast={addToast}/>;
      case "steps":        return <StepsTab addToast={addToast}/>;
      case "testimonials": return <TestimonialsTab addToast={addToast}/>;
      case "faqs":         return <FaqsTab addToast={addToast}/>;
      case "cta":          return <CtaTab addToast={addToast}/>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-white mb-1">Homepage Manager</h1>
        <p className="text-gray-500 text-sm">Edit all homepage sections without touching code. Changes go live instantly.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-white/8">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              tab === t.key
                ? "bg-primary/15 border-primary/30 text-primary"
                : "border-transparent text-gray-500 hover:text-white hover:bg-white/6"
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {renderTab()}
      </motion.div>

      <ToastStack toasts={toasts}/>
    </div>
  );
}
