import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingCart, Users, MessageCircle,
  Settings, LogOut, Menu, X, ChevronRight, Bell, Paintbrush, Images
} from "lucide-react";
import { useAdmin } from "./AdminContext";

const NAV_ITEMS = [
  { label: "Dashboard",              path: "/admin/dashboard",          icon: LayoutDashboard },
  { label: "Products",               path: "/admin/products",           icon: Package },
  { label: "Customization Products", path: "/admin/customize-products", icon: Paintbrush },
  { label: "Orders",                 path: "/admin/orders",             icon: ShoppingCart },
  { label: "Customers",              path: "/admin/customers",          icon: Users },
  { label: "WhatsApp Orders",        path: "/admin/whatsapp-orders",    icon: MessageCircle },
  { label: "Homepage Images",        path: "/admin/homepage-categories", icon: Images },
  { label: "Settings",               path: "/admin/settings",           icon: Settings },
];

function NavItem({ item, active, onClick }: { item: typeof NAV_ITEMS[0]; active: boolean; onClick?: () => void }) {
  const Icon = item.icon;
  return (
    <Link href={item.path} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all group ${
          active
            ? "bg-primary/15 border border-primary/30 text-primary"
            : "text-gray-400 hover:text-white hover:bg-white/6 border border-transparent"
        }`}
      >
        <Icon size={17} className="flex-shrink-0" />
        <span className="text-sm font-semibold">{item.label}</span>
        {active && <ChevronRight size={14} className="ml-auto" />}
      </div>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAdmin();
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const Sidebar = ({ onNavClick }: { onNavClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">RD</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Radhe Digital</p>
            <p className="text-gray-600 text-xs mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-4 mb-3">Main Menu</p>
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.path}
            item={item}
            active={location === item.path}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/8 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/8 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={17} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
        <p className="text-[10px] text-gray-700 text-center mt-3">admin@radhedigital.com</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/8 bg-[#0d0d0d] fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 left-0 h-full w-72 z-50 bg-[#0d0d0d] border-r border-white/8 lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
              <Sidebar onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-5 py-3.5 border-b border-white/8 bg-[#0a0a0a]/95 backdrop-blur-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all"
          >
            <Menu size={18} />
          </button>

          {/* Page title from nav */}
          <div className="flex-1">
            <p className="text-white font-bold text-sm">
              {NAV_ITEMS.find(n => n.path === location)?.label ?? "Admin Panel"}
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/8 transition-all relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"></span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
