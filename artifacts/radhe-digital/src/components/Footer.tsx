import React from "react";
import { Link } from "wouter";
import { Shirt, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="pt-16 pb-8 border-t-4 border-primary" style={{ background: "#0f0f0f", color: "#fff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group inline-flex">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Shirt size={24} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Radhe Digital
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">{f.tagline}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#C4962A] transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C4962A] transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#C4962A] transition-colors">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ color: "#C4962A" }}>{f.quickLinks}</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/" className="hover:text-[#C4962A] transition-colors">{f.home}</Link></li>
              <li><Link href="/categories" className="hover:text-[#C4962A] transition-colors">{f.categories}</Link></li>
              <li><Link href="/customize" className="hover:text-[#C4962A] transition-colors">{f.startCustomizing}</Link></li>
              <li><Link href="/about" className="hover:text-[#C4962A] transition-colors">{f.aboutUs}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ color: "#C4962A" }}>{f.services}</h3>
            <ul className="space-y-4 text-gray-400">
              {f.services_list.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ color: "#C4962A" }}>{f.contactUs}</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="shrink-0 mt-1" size={20} style={{ color: "#C4962A" }} />
                <span>DD Plaza, Sonkh Adda, Near Petrol Pump, Mathura, U.P - 281001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="shrink-0" size={20} style={{ color: "#C4962A" }} />
                <span>+91 9319903380</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="shrink-0" size={20} style={{ color: "#C4962A" }} />
                <span>contact@radhedigital.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {f.copyright}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">{f.privacyPolicy}</a>
            <a href="#" className="hover:text-white transition-colors">{f.termsOfService}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
