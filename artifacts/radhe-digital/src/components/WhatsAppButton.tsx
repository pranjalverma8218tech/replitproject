import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  const whatsappUrl = "https://wa.me/919319903380";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-[#1ebe57] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(37,211,102,0.4)] flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={28} className="relative z-10 sm:text-[32px]" />
      <span className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg shadow-black/10 border border-gray-100">
        Need help? Chat with us!
      </span>
      <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30 z-0"></div>
    </a>
  );
}
