import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle, Phone, Mail, ShoppingBag } from "lucide-react";
import { SAMPLE_CUSTOMERS } from "./sampleData";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");

  const filtered = SAMPLE_CUSTOMERS.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.mobile.includes(q) || (c.email?.toLowerCase().includes(q) ?? false);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-black text-2xl">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{SAMPLE_CUSTOMERS.length} registered customers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, mobile or email…"
          className="w-full h-10 bg-[#111] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors"
        />
      </div>

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
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center text-gray-600 py-12">No customers found</td></tr>
            ) : filtered.map((c, i) => (
              <motion.tr key={c.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{c.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{c.name}</p>
                      <p className="text-gray-600 text-xs font-mono">{c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <a href={`tel:${c.mobile}`} className="text-gray-300 text-sm hover:text-primary flex items-center gap-1.5 transition-colors">
                    <Phone size={12} className="text-gray-600" />{c.mobile}
                  </a>
                </td>
                <td className="px-5 py-4">
                  {c.email
                    ? <a href={`mailto:${c.email}`} className="text-gray-300 text-sm hover:text-primary flex items-center gap-1.5 transition-colors truncate max-w-[180px]"><Mail size={12} className="text-gray-600 flex-shrink-0" />{c.email}</a>
                    : <span className="text-gray-700 text-xs">—</span>
                  }
                </td>
                <td className="px-5 py-4">
                  <div className="space-y-0.5 max-w-[180px]">
                    {c.orderedProducts.slice(0,2).map(p => (
                      <p key={p} className="text-gray-400 text-xs truncate flex items-center gap-1"><ShoppingBag size={10} className="text-gray-600 flex-shrink-0" />{p}</p>
                    ))}
                    {c.orderedProducts.length > 2 && <p className="text-gray-600 text-xs">+{c.orderedProducts.length - 2} more</p>}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/12 border border-primary/20 text-primary font-bold text-sm">{c.totalOrders}</span>
                </td>
                <td className="px-5 py-4 text-white font-bold whitespace-nowrap">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(c.lastOrderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                </td>
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
        {filtered.map(c => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-white/8 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold">{c.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{c.name}</p>
                <p className="text-gray-600 text-xs">{c.id}</p>
              </div>
              <span className="text-primary font-black">₹{c.totalSpent.toLocaleString("en-IN")}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <a href={`tel:${c.mobile}`} className="flex items-center gap-1.5 text-gray-400"><Phone size={11} className="text-gray-600" />{c.mobile}</a>
              {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-gray-400 truncate"><Mail size={11} className="text-gray-600" />{c.email}</a>}
              <span className="flex items-center gap-1.5 text-gray-400"><ShoppingBag size={11} className="text-gray-600" />{c.totalOrders} orders</span>
              <span className="text-gray-500">Last: {new Date(c.lastOrderDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</span>
            </div>
            <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors">
              <MessageCircle size={13} /> Open WhatsApp
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
