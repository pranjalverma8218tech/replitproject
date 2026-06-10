import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, MessageCircle, Phone } from "lucide-react";
import { SAMPLE_ORDERS, Order, OrderStatus } from "./sampleData";

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
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">("All");

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.mobile.includes(q) || o.productName.toLowerCase().includes(q);
    const matchS = filterStatus === "All" || o.status === filterStatus;
    return matchQ && matchS;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-black text-2xl">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, mobile…"
            className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as OrderStatus | "All")}
            className="h-10 bg-[#111] border border-white/10 rounded-xl pl-9 pr-8 text-sm text-white outline-none focus:border-primary/40 appearance-none cursor-pointer transition-colors"
          >
            <option value="All">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
        </div>
      </div>

      {/* Status tabs (desktop) */}
      <div className="hidden lg:flex flex-wrap gap-2">
        {(["All", ...ALL_STATUSES] as Array<"All" | OrderStatus>).map(s => {
          const count = s === "All" ? orders.length : orders.filter(o => o.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                filterStatus === s
                  ? "bg-primary/15 border-primary/30 text-primary"
                  : "bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/20"
              }`}
            >
              {s} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
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
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center text-gray-600 py-12">No orders found</td></tr>
              ) : filtered.map((o, i) => (
                <motion.tr
                  key={o.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                >
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-primary font-mono text-xs font-bold">{o.id}</span>
                    {o.isWhatsApp && <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-md"><MessageCircle size={9} />WA</span>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white font-semibold whitespace-nowrap">{o.customerName}</p>
                    <a href={`tel:${o.mobile}`} className="text-gray-600 text-xs hover:text-primary flex items-center gap-1"><Phone size={10} />{o.mobile}</a>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 max-w-[160px] truncate">{o.productName}</p>
                    <p className="text-gray-600 text-xs">{o.category}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-center">{o.quantity}</td>
                  <td className="px-5 py-4 text-white font-bold whitespace-nowrap">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <select
                        value={o.status}
                        onChange={e => updateStatus(o.id, e.target.value as OrderStatus)}
                        className={`appearance-none pr-6 pl-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer outline-none ${STATUS_COLOR[o.status]}`}
                        style={{ background: "transparent" }}
                      >
                        {ALL_STATUSES.map(s => <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(o.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://wa.me/91${o.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/12 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors whitespace-nowrap"
                    >
                      <MessageCircle size={12} /> WhatsApp
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
