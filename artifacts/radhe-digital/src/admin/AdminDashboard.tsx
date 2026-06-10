import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ShoppingCart, Users, Package, TrendingUp,
  ArrowUpRight, MessageCircle, AlertCircle, Loader2, RefreshCw, WifiOff
} from "lucide-react";
import { getDashboardStats, type DashboardStats, type Order, type OrderStatus, DB_NOT_CONNECTED_MSG } from "./api";

const STATUS_COLOR: Record<OrderStatus, string> = {
  "New Order":       "bg-blue-500/15 text-blue-400 border-blue-500/25",
  "Contacted":       "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  "Design Received": "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "In Production":   "bg-orange-500/15 text-orange-400 border-orange-500/25",
  "Ready":           "bg-teal-500/15 text-teal-400 border-teal-500/25",
  "Delivered":       "bg-green-500/15 text-green-400 border-green-500/25",
  "Cancelled":       "bg-red-500/15 text-red-400 border-red-500/25",
};

function StatCard({ icon: Icon, label, value, sub, color, loading }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string; loading?: boolean;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/8 rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
        {loading
          ? <div className="h-8 w-16 bg-white/6 rounded-lg animate-pulse mt-1" />
          : <p className="text-white font-black text-2xl mt-0.5">{value}</p>
        }
        {sub && !loading && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

const ALL_STATUSES: OrderStatus[] = ["New Order","Contacted","In Production","Ready","Delivered","Cancelled"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbDown, setDbDown] = useState(false);

  const load = async () => {
    setLoading(true); setError(null); setDbDown(false);
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (e: any) {
      if (e.code === "DB_NOT_CONFIGURED" || e.status === 503) {
        setDbDown(true);
      } else {
        setError(e.message ?? "Failed to load dashboard data");
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const cancelled = stats?.statusBreakdown?.Cancelled ?? 0;
  const pending   = stats?.statusBreakdown?.["New Order"] ?? 0;
  const wpOrders  = stats?.recentOrders.filter(o => o.isWhatsapp).length ?? 0;

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-black text-2xl">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin · Radhe Digital</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs font-semibold transition-all">
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* DB not connected banner */}
      {dbDown && (
        <div className="flex items-start gap-3 bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-4">
          <WifiOff size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-bold">Database Not Connected</p>
            <p className="text-yellow-400/70 text-xs mt-1 leading-relaxed">{DB_NOT_CONNECTED_MSG}</p>
          </div>
        </div>
      )}

      {error && !dbDown && (
        <div className="flex items-center gap-3 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingCart} label="Total Orders"   loading={loading} value={stats?.totalOrders ?? 0}     sub={`${cancelled} cancelled`} color="bg-primary/15 text-primary" />
        <StatCard icon={TrendingUp}   label="Revenue"        loading={loading} value={`₹${Number(stats?.revenue ?? 0).toLocaleString("en-IN")}`} sub="excl. cancelled" color="bg-green-500/15 text-green-400" />
        <StatCard icon={Users}        label="Customers"      loading={loading} value={stats?.totalCustomers ?? 0}  sub="unique" color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={Package}      label="Products"       loading={loading} value={stats?.activeProducts ?? 0}  sub="active" color="bg-purple-500/15 text-purple-400" />
      </div>

      {/* Order status breakdown */}
      {!dbDown && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_STATUSES.map(s => (
            <div key={s} className="bg-[#111] border border-white/8 rounded-xl p-4 text-center">
              {loading
                ? <div className="h-7 w-8 bg-white/6 rounded-lg animate-pulse mx-auto mb-1" />
                : <p className="text-white font-black text-xl">{stats?.statusBreakdown?.[s] ?? 0}</p>
              }
              <p className="text-gray-500 text-xs mt-1 leading-snug">{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {!dbDown && !loading && stats && (pending > 0 || wpOrders > 0) && (
        <div className="grid sm:grid-cols-2 gap-4">
          {pending > 0 && (
            <div className="flex items-center gap-3 bg-blue-500/8 border border-blue-500/20 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-blue-400 flex-shrink-0" />
              <p className="text-blue-300 text-sm"><span className="font-bold">{pending} new order{pending > 1 ? "s" : ""}</span> waiting for action</p>
              <Link href="/admin/orders"><span className="ml-auto text-blue-400 text-xs font-semibold flex items-center gap-1 cursor-pointer">View <ArrowUpRight size={12} /></span></Link>
            </div>
          )}
          {wpOrders > 0 && (
            <div className="flex items-center gap-3 bg-green-500/8 border border-green-500/20 rounded-xl px-4 py-3">
              <MessageCircle size={16} className="text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm"><span className="font-bold">{wpOrders} WhatsApp order{wpOrders > 1 ? "s" : ""}</span> received</p>
              <Link href="/admin/whatsapp-orders"><span className="ml-auto text-green-400 text-xs font-semibold flex items-center gap-1 cursor-pointer">View <ArrowUpRight size={12} /></span></Link>
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
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-600">
            <Loader2 size={18} className="animate-spin" /><span className="text-sm">Loading orders…</span>
          </div>
        ) : dbDown || !stats?.recentOrders.length ? (
          <div className="text-center py-12 text-gray-600">
            <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">{dbDown ? "Connect database to see orders" : "No orders yet"}</p>
          </div>
        ) : (
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
                {stats.recentOrders.map((o, i) => (
                  <tr key={o.id} className={`border-b border-white/4 hover:bg-white/3 transition-colors ${i === stats.recentOrders.length - 1 ? "border-b-0" : ""}`}>
                    <td className="px-5 py-3.5 text-primary font-mono text-xs font-bold whitespace-nowrap">{o.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-semibold whitespace-nowrap">{o.customerName}</p>
                      <p className="text-gray-600 text-xs">{o.mobile}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-300 max-w-[160px] truncate">{o.productName}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-center">{o.quantity}</td>
                    <td className="px-5 py-3.5 text-white font-bold whitespace-nowrap">₹{Number(o.total).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border whitespace-nowrap ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
