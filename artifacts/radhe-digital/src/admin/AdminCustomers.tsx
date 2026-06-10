import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, Phone, Mail, ShoppingBag, Loader2, RefreshCw, WifiOff, AlertCircle } from "lucide-react";
import { getCustomers, type Customer, DB_NOT_CONNECTED_MSG } from "./api";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [dbDown,    setDbDown]    = useState(false);
  const [search,    setSearch]    = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try { setCustomers(await getCustomers({ search: search || undefined })); }
    catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) setDbDown(true);
      else setError(e.message ?? "Failed to load customers");
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">{loading ? "Loading…" : `${customers.length} customers`}</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {dbDown && (
        <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-4">
          <WifiOff size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div><p className="text-yellow-300 text-sm font-bold">Database Not Connected</p><p className="text-yellow-400/70 text-xs mt-1">{DB_NOT_CONNECTED_MSG}</p></div>
        </div>
      )}
      {error && <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"><AlertCircle size={16} className="text-red-400 flex-shrink-0" /><p className="text-red-300 text-sm">{error}</p></div>}

      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, mobile or email…"
          className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-600"><Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading customers…</span></div>
      ) : customers.length === 0 ? (
        <div className="text-center py-16 text-gray-600"><Users size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">{dbDown ? "Connect database to see customers" : "No customers yet"}</p></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Customer","Mobile","Email","Products Ordered","Total Orders","Total Spent","Last Order","Actions"].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <motion.tr key={c.id} initial={{ opacity:0 }} animate={{ opacity:1 }}
                    className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === customers.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-bold text-sm">{c.name.charAt(0)}</span>
                        </div>
                        <div><p className="text-white font-semibold">{c.name}</p><p className="text-gray-600 text-xs font-mono">{c.id}</p></div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><a href={`tel:${c.mobile}`} className="text-gray-300 text-sm hover:text-primary flex items-center gap-1.5 transition-colors"><Phone size={12} className="text-gray-600" />{c.mobile}</a></td>
                    <td className="px-5 py-4">
                      {c.email ? <a href={`mailto:${c.email}`} className="text-gray-300 text-sm hover:text-primary flex items-center gap-1.5 transition-colors truncate max-w-[180px]"><Mail size={12} className="text-gray-600 flex-shrink-0" />{c.email}</a>
                        : <span className="text-gray-700 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 max-w-[180px]">
                        {(c.orderedProducts ?? []).slice(0,2).map(p => (
                          <p key={p} className="text-gray-400 text-xs truncate flex items-center gap-1"><ShoppingBag size={10} className="text-gray-600 flex-shrink-0" />{p}</p>
                        ))}
                        {(c.orderedProducts?.length ?? 0) > 2 && <p className="text-gray-600 text-xs">+{c.orderedProducts.length - 2} more</p>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center"><span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/12 border border-primary/20 text-primary font-bold text-sm">{c.totalOrders}</span></td>
                    <td className="px-5 py-4 text-white font-bold whitespace-nowrap">₹{Number(c.totalSpent).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</td>
                    <td className="px-5 py-4">
                      <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/12 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors whitespace-nowrap">
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-4">
            {customers.map(c => (
              <motion.div key={c.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                className="bg-[#111] border border-white/8 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{c.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-white font-bold">{c.name}</p><p className="text-gray-600 text-xs">{c.id}</p></div>
                  <span className="text-primary font-black">₹{Number(c.totalSpent).toLocaleString("en-IN")}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <a href={`tel:${c.mobile}`} className="flex items-center gap-1.5 text-gray-400"><Phone size={11} className="text-gray-600" />{c.mobile}</a>
                  {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-gray-400 truncate"><Mail size={11} className="text-gray-600" />{c.email}</a>}
                  <span className="flex items-center gap-1.5 text-gray-400"><ShoppingBag size={11} className="text-gray-600" />{c.totalOrders} orders</span>
                  <span className="text-gray-500">Last: {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}</span>
                </div>
                <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={13} /> Open WhatsApp
                </a>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Missing import fix
function Users(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
