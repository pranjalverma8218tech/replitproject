import React from "react";
import { Link } from "wouter";
import { Shirt, MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-primary">
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
            <p className="text-gray-400 mb-6 max-w-sm">
              Premium custom T-shirt printing for businesses, events, and individuals. Bold prints, fast delivery, zero hassle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">T-Shirt Categories</Link></li>
              <li><Link href="/customize" className="hover:text-primary transition-colors">Start Customizing</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Services</h3>
            <ul className="space-y-4 text-gray-400">
              <li>Collar T-Shirts</li>
              <li>Round Neck T-Shirts</li>
              <li>Bulk Corporate Orders</li>
              <li>Event Custom Printing</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>DD Plaza, Sonkh Adda, Near Petrol Pump, Mathura, U.P - 281001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-primary shrink-0" size={20} />
                <span>+91 9319903380</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-primary shrink-0" size={20} />
                <span>contact@radhedigital.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Radhe Digital T-Shirt Printing. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
