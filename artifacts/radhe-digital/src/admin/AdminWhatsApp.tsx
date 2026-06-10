import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, CheckCircle2, Clock, Package, ExternalLink, Loader2, RefreshCw, WifiOff, AlertCircle } from "lucide-react";
import { getOrders, updateOrderStatus, type Order, type OrderStatus, DB_NOT_CONNECTED_MSG } from "./api";

type WaStatus = "Pending" | "Contacted" | "Completed";

function toWaStatus(s: OrderStatus): WaStatus {
  if (s === "Delivered") return "Completed";
  if (s === "Contacted" || s === "Design Received" || s === "In Production" || s === "Ready") return "Contacted";
  return "Pending";
}

const WA_COLOR: Record<WaStatus, string> = {
  Pending:   "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Contacted: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Completed: "bg-green-500/15 text-green-400 border-green-500/25",
};

export default function AdminWhatsApp() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [dbDown,  setDbDown]  = useState(false);
  const [filter,  setFilter]  = useState<WaStatus | "All">("All");

  const load = useCallback(async () => {
    setLoading(true); setError(null); setDbDown(false);
    try { setOrders(await getOrders({ whatsapp: true })); }
    catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) setDbDown(true);
      else setError(e.message ?? "Failed to load WhatsApp orders");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markContacted = async (o: Order) => {
    if (o.status === "New Order") {
      try {
        await updateOrderStatus(o.id, "Contacted");
        setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "Contacted" } : x));
      } catch {}
    }
  };

  const markCompleted = async (o: Order) => {
    if (o.status !== "Delivered") {
      try {
        await updateOrderStatus(o.id, "Delivered");
        setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: "Delivered" } : x));
      } catch {}
    }
  };

  const counts = {
    Pending:   orders.filter(o => toWaStatus(o.status) === "Pending").length,
    Contacted: orders.filter(o => toWaStatus(o.status) === "Contacted").length,
    Completed: orders.filter(o => toWaStatus(o.status) === "Completed").length,
  };

  const filtered = filter === "All" ? orders : orders.filter(o => toWaStatus(o.status) === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">WhatsApp Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Orders received via WhatsApp checkout</p>
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

      {/* Summary */}
      {!dbDown && (
        <div className="grid grid-cols-3 gap-3">
          {(["Pending","Contacted","Completed"] as WaStatus[]).map(s => (
            <div key={s} className={`rounded-xl p-4 border ${WA_COLOR[s]}`}>
              {loading ? <div className="h-7 w-6 bg-white/10 rounded animate-pulse mb-1" /> : <p className="text-2xl font-black">{counts[s]}</p>}
              <p className="text-xs font-semibold mt-1 opacity-80">{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["All","Pending","Contacted","Completed"] as Array<"All"|WaStatus>).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filter===s ? "bg-primary/15 border-primary/30 text-primary" : "bg-transparent border-white/10 text-gray-500 hover:text-white"
            }`}>
            {s}{s!=="All" && ` (${counts[s as WaStatus]})`}
          </button>
        ))}
      </div>

      {/* Order cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-600"><Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading orders…</span></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600"><MessageCircle size={40} className="mx-auto mb-3 opacity-30" /><p className="text-sm">{dbDown ? "Connect database to see orders" : "No WhatsApp orders found"}</p></div>
      ) : (
        <div className="space-y-4">
          {filtered.map(o => {
            const waStatus = toWaStatus(o.status);
            return (
              <motion.div key={o.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                className="bg-[#111] border border-white/8 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={18} className="text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold">{o.customerName}</p>
                        <span className="text-gray-600 text-xs font-mono">{o.id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${WA_COLOR[waStatus]}`}>{waStatus}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <a href={`tel:${o.mobile}`} className="flex items-center gap-1 text-gray-400 text-xs hover:text-primary transition-colors"><Phone size={11} />{o.mobile}</a>
                        <span className="flex items-center gap-1 text-gray-600 text-xs"><Clock size={11} />{o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-primary font-black text-lg">₹{Number(o.total).toLocaleString("en-IN")}</p>
                </div>
                <div className="mt-4 bg-[#1a1a1a] border border-white/6 rounded-xl px-4 py-3 flex items-center gap-3">
                  <Package size={15} className="text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-sm font-semibold truncate">{o.productName}</p>
                    <p className="text-gray-600 text-xs">{o.category} · Qty: {o.quantity}</p>
                  </div>
                </div>
                {o.address && <p className="mt-2 text-gray-600 text-xs px-1">📍 {o.address}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={`https://wa.me/91${o.mobile}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-colors">
                    <MessageCircle size={14} /> Open WhatsApp <ExternalLink size={12} />
                  </a>
                  {waStatus === "Pending" && (
                    <button onClick={() => markContacted(o)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500/12 border border-blue-500/25 text-blue-400 text-sm font-semibold hover:bg-blue-500/20 transition-colors">
                      <Phone size={14} /> Mark as Contacted
                    </button>
                  )}
                  {waStatus !== "Completed" && (
                    <button onClick={() => markCompleted(o)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400 text-sm font-semibold hover:bg-green-500/20 transition-colors">
                      <CheckCircle2 size={14} /> Mark as Completed
                    </button>
                  )}
                  {waStatus === "Completed" && (
                    <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500/8 border border-green-500/15 text-green-600 text-sm font-semibold">
                      <CheckCircle2 size={14} /> Order Completed
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
