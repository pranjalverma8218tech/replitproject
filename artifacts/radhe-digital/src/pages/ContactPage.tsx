import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-black text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a question about a bulk order or a custom design? We're here to help. Reach out to us directly.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
              <h3 className="text-2xl font-bold text-black mb-8">Contact Information</h3>
              
              <div className="space-y-8 flex-1">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-full text-primary shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                    <p className="text-gray-600">+91 9319903380</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-full text-primary shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">contact@radhedigital.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-full text-primary shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Store Address</h4>
                    <p className="text-gray-600 leading-relaxed">
                      DD Plaza, Sonkh Adda, Near Petrol Pump,<br/>
                      Mathura, U.P - 281001,<br/>
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-100 p-3 rounded-full text-gray-700 shrink-0">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Business Hours</h4>
                    <p className="text-gray-600">Monday - Saturday<br/>10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-gray-100">
                <a href="https://wa.me/919319903380" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#1ebe57] text-white">
                    <FaWhatsapp className="mr-2" size={24} /> Message on WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full overflow-hidden min-h-[500px] flex flex-col relative group">
              <div className="absolute inset-0 bg-gray-200" style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                <div className="bg-white p-6 rounded-full shadow-xl mb-4 text-primary animate-bounce">
                  <MapPin size={48} />
                </div>
                <div className="bg-white py-3 px-6 rounded-xl shadow-lg border border-gray-100 text-center">
                  <h3 className="font-bold text-black text-lg">Radhe Digital</h3>
                  <p className="text-gray-600 text-sm">DD Plaza, Sonkh Adda, Near Petrol Pump, Mathura, U.P - 281001</p>
                  <Button variant="outline" size="sm" className="mt-3 w-full">Get Directions</Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
