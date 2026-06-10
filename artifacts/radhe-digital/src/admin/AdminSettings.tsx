import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, Store, Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);

  const [biz, setBiz] = useState({
    name: "Radhe Digital",
    phone: "919319903380",
    email: "radhedigital@gmail.com",
    address: "Mathura, Uttar Pradesh, India",
    whatsapp: "919319903380",
    tagline: "Custom T-Shirt & Printing Studio",
  });

  const [creds, setCreds] = useState({ email: "admin@radhedigital.com", password: "" });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full h-10 bg-[#1a1a1a] border border-white/12 rounded-xl px-4 text-sm text-white placeholder-gray-600 outline-none focus:border-primary/40 transition-colors";

  return (
    <div className="space-y-7 max-w-2xl">
      <div>
        <h1 className="text-white font-black text-2xl">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your store and admin credentials</p>
      </div>

      {/* Business Info */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <Store size={16} className="text-primary" />
          <h2 className="text-white font-bold text-base">Business Information</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Store Name</label>
              <input value={biz.name} onChange={e => setBiz(b=>({...b,name:e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Tagline</label>
              <input value={biz.tagline} onChange={e => setBiz(b=>({...b,tagline:e.target.value}))} className={inputCls} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5"><Phone size={11} />Contact Phone</label>
              <input value={biz.phone} onChange={e => setBiz(b=>({...b,phone:e.target.value}))} className={inputCls} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5"><MessageCircle size={11} />WhatsApp Number</label>
              <input value={biz.whatsapp} onChange={e => setBiz(b=>({...b,whatsapp:e.target.value}))} placeholder="919XXXXXXXXX" className={inputCls} />
              <p className="text-gray-700 text-xs mt-1">Include country code (91 for India)</p>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5"><Mail size={11} />Business Email</label>
            <input type="email" value={biz.email} onChange={e => setBiz(b=>({...b,email:e.target.value}))} className={inputCls} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5"><MapPin size={11} />Address</label>
            <input value={biz.address} onChange={e => setBiz(b=>({...b,address:e.target.value}))} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Admin Credentials */}
      <div className="bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
          <Mail size={16} className="text-primary" />
          <h2 className="text-white font-bold text-base">Admin Credentials</h2>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Admin Email</label>
            <input type="email" value={creds.email} onChange={e => setCreds(c=>({...c,email:e.target.value}))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">New Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={creds.password} onChange={e => setCreds(c=>({...c,password:e.target.value}))}
                placeholder="Leave blank to keep current password" className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPw(p=>!p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-gray-700 text-xs mt-1.5">Current password: Radhe@2024</p>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-4 py-3">
        <p className="text-yellow-400/80 text-xs leading-relaxed">
          <span className="font-bold">Note:</span> Settings and credentials in this demo are reset on page refresh. 
          Connect a backend to persist changes permanently.
        </p>
      </div>

      {/* Save button */}
      <motion.button
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm"
        style={{ background: saved ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#e53e3e,#c53030)", boxShadow: "0 4px 14px rgba(0,0,0,0.3)", transition: "background 0.3s" }}
      >
        {saved ? <><CheckCircle2 size={15} /> Settings Saved!</> : <><Save size={15} /> Save Settings</>}
      </motion.button>
    </div>
  );
}
