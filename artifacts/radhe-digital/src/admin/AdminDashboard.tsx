import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShoppingCart, Users, Package, Clock, Truck, CheckCircle2,
  TrendingUp, ArrowUpRight, MessageCircle, AlertCircle
} from "lucide-react";
import { SAMPLE_ORDERS, SAMPLE_PRODUCTS, SAMPLE_CUSTOMERS, OrderStatus } from "./sampleData";

const STATUS_COLOR: Record<OrderStatus, string> = {
  "New Order":       "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Contacted":       "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  "Design Received": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "In Production":   "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Ready":           "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Delivered":       "bg-green-500/15 text-green-400 border-green-500/25",
  "Cancelled":       "bg-red-500/15 text-red-400 border-red-500/25",
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/8 rounded-2xl p-5 flex items-start gap-4"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-white font-black text-2xl mt-0.5">{value}</p>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const total = SAMPLE_ORDERS.length;
  const pending = SAMPLE_ORDERS.filter(o => o.status === "New Order").length;
  const inProd  = SAMPLE_ORDERS.filter(o => o.status === "In Production").length;
  const delivered = SAMPLE_ORDERS.filter(o => o.status === "Delivered").length;
  const cancelled = SAMPLE_ORDERS.filter(o => o.status === "Cancelled").length;
  const revenue = SAMPLE_ORDERS.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);
  const wpOrders = SAMPLE_ORDERS.filter(o => o.isWhatsApp).length;

  const recent = [...SAMPLE_ORDERS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-white font-black text-2xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin · Radhe Digital</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders"   value={total}     sub={`${cancelled} cancelled`} color="bg-primary/15 text-primary" />
        <StatCard icon={TrendingUp}   label="Revenue"        value={`₹${revenue.toLocaleString("en-IN")}`} sub="excl. cancelled" color="bg-green-500/15 text-green-400" />
        <StatCard icon={Users}        label="Customers"      value={SAMPLE_CUSTOMERS.length} sub="unique" color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={Package}      label="Products"       value={SAMPLE_PRODUCTS.filter(p => p.status === "Active").length} sub="active" color="bg-purple-500/15 text-purple-400" />
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(["New Order","Contacted","In Production","Ready","Delivered","Cancelled"] as OrderStatus[]).map(s => (
          <div key={s} className="bg-[#111] border border-white/8 rounded-xl p-4 text-center">
            <p className="text-white font-black text-xl">{SAMPLE_ORDERS.filter(o => o.status === s).length}</p>
            <p className="text-gray-500 text-xs mt-1 leading-snug">{s}</p>
          </div>
        ))}
      </div>

      {/* Alert: new orders + WhatsApp */}
      {(pending > 0 || wpOrders > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {pending > 0 && (
            <div className="flex items-center gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm"><span className="font-bold">{pending} new order{pending > 1 ? "s" : ""}</span> waiting for action</p>
              <Link href="/admin/orders"><span className="ml-auto text-blue-400 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:text-blue-300">View <ArrowUpRight size={12} /></span></Link>
            </div>
          )}
          {wpOrders > 0 && (
            <div className="flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3">
              <MessageCircle size={16} className="text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm"><span className="font-bold">{wpOrders} WhatsApp order{wpOrders > 1 ? "s" : ""}</span> received</p>
              <Link href="/admin/whatsapp-orders"><span className="ml-auto text-green-400 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:text-green-300">View <ArrowUpRight size={12} /></span></Link>
            </div>
          )}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h2 className="text-white font-bold text-base">Recent Orders</h2>
          <Link href="/admin/orders"><span className="text-primary text-xs font-semibold flex items-center gap-1 cursor-pointer hover:underline">View all <ArrowUpRight size={12} /></span></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6">
                {["Order ID","Customer","Product","Qty","Total","Status","Date"].map(h => (
                  <th key={h} className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o, i) => (
                <tr key={o.id} className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === recent.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-5 py-3.5 text-primary font-mono text-xs font-bold whitespace-nowrap">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-white font-semibold whitespace-nowrap">{o.customerName}</p>
                    <p className="text-gray-600 text-xs">{o.mobile}</p>
                  </td>
                  <td className="px-5 py-3.5 text-gray-300 max-w-[160px] truncate">{o.productName}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-center">{o.quantity}</td>
                  <td className="px-5 py-3.5 text-white font-bold whitespace-nowrap">₹{o.total.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${STATUS_COLOR[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">{new Date(o.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
