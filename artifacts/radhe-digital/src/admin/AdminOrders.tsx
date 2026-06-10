import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, MessageCircle, Phone, Loader2, RefreshCw, WifiOff, AlertCircle } from "lucide-react";
import { getOrders, updateOrderStatus, type Order, type OrderStatus, DB_NOT_CONNECTED_MSG } from "./api";

const ALL_STATUSES: OrderStatus[] = ["New Order","Contacted","Design Received","In Production","Ready","Delivered","Cancelled"];

const STATUS_COLOR: Record<OrderStatus, string> = {
  "New Order":       "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Contacted":       "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  "Design Received": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "In Production":   "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Ready":           "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Delivered":       "bg-green-500/15 text-green-400 border-green-500/25",
  "Cancelled":       "bg-red-500/15 text-red-400 border-red-500/25",
};

export default function AdminOrders() {
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [dbDown,      setDbDown]      = useState(false);
  const [search,      setSearch]      = useState("");
  const [filterStatus,setFilterStatus]= useState<OrderStatus | "All">("All");

  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try {
      const data = await getOrders({ status: filterStatus !== "All" ? filterStatus : undefined, search: search || undefined });
      setOrders(data);
    } catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) setDbDown(true);
      else setError(e.message ?? "Failed to load orders");
    } finally { setLoading(false); }
  }, [filterStatus, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try { await updateOrderStatus(id, status); }
    catch { load(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">{loading ? "Loading…" : `${orders.length} orders`}</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

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
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID, customer, mobile…"
            className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as OrderStatus | "All")}
            className="h-10 bg-[#111] border border-white/10 rounded-xl pl-9 pr-8 text-sm text-white outline-none appearance-none cursor-pointer transition-colors">
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Status tabs */}
      <div className="hidden lg:flex flex-wrap gap-2">
        {(["All", ...ALL_STATUSES] as Array<"All" | OrderStatus>).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filterStatus === s ? "bg-primary/15 border-primary/30 text-primary" : "bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/20"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-600">
            <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading orders…</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Search size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{dbDown ? "Connect database to see orders" : "No orders found"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {["Order ID","Customer","Product","Qty","Total","Status","Date","Actions"].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === orders.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-primary font-mono text-xs font-bold">{o.id}</span>
                      {o.isWhatsapp && <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-md"><MessageCircle size={9} />WA</span>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-semibold whitespace-nowrap">{o.customerName}</p>
                      <a href={`tel:${o.mobile}`} className="text-gray-600 text-xs hover:text-primary flex items-center gap-1"><Phone size={10} />{o.mobile}</a>
                    </td>
                    <td className="px-5 py-4"><p className="text-gray-300 max-w-[160px] truncate">{o.productName}</p><p className="text-gray-600 text-xs">{o.category}</p></td>
                    <td className="px-5 py-4 text-gray-400 text-center">{o.quantity}</td>
                    <td className="px-5 py-4 text-white font-bold whitespace-nowrap">₹{Number(o.total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <select value={o.status} onChange={e => handleStatusChange(o.id, e.target.value as OrderStatus)}
                          className={`appearance-none pr-6 pl-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer outline-none ${STATUS_COLOR[o.status]}`}
                          style={{ background: "transparent" }}>
                          {ALL_STATUSES.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>)}
                        </select>
                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <a href={`https://wa.me/91${o.mobile}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/12 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors whitespace-nowrap">
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
