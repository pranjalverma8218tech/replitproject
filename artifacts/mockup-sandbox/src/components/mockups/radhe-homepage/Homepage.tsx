import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Shirt,
  Coffee,
  PenTool,
  Award,
  Image as ImageIcon,
  Gift,
  Package,
  CheckCircle,
  Truck,
  PaintBucket,
  Monitor,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Crown,
  Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Homepage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans selection:bg-[#FF3B30] selection:text-white overflow-hidden">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold tracking-wider">
            RADHE <span className="text-[#FF3B30]">DIGITAL</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-white/70">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#why-us" className="hover:text-white transition-colors">Why Us</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <Button className="bg-[#FF3B30] hover:bg-[#ff5248] text-white rounded-none font-medium px-6 hidden md:inline-flex">
            Get Quote
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Image / Glow */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/radhe-hero-bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/40 via-[#0B0B0B]/80 to-[#0B0B0B]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF3B30]/20 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none hidden md:block">
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 text-4xl">👕</motion.div>
          <motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-1/3 right-1/4 text-4xl">🧢</motion.div>
          <motion.div animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute bottom-1/4 left-1/3 text-4xl">☕</motion.div>
          <motion.div animate={{ y: [0, 25, 0], rotate: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/2 right-1/3 text-4xl">✒️</motion.div>
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 20, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-1/3 right-1/4 text-4xl">🏅</motion.div>
          <motion.div animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} className="absolute top-1/4 right-1/6 text-4xl">🖼️</motion.div>
        </div>

        <div className="container relative z-20 mx-auto px-6 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium tracking-wide text-white/80"
          >
            Custom Printing Solutions
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4"
          >
            RADHE <span className="text-[#FF3B30] inline-block relative">
              DIGITAL
              <span className="absolute bottom-0 left-0 w-full h-[0.1em] bg-[#FF3B30] opacity-50 blur-sm"></span>
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 font-light"
          >
            We Print Your Ideas Into Reality. Premium quality printing for corporate and personal needs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Button size="lg" className="bg-[#FF3B30] hover:bg-[#ff5248] text-white w-full sm:w-auto h-14 px-8 rounded-none text-lg">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white w-full sm:w-auto h-14 px-8 rounded-none text-lg bg-transparent">
              View Products
            </Button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative z-10">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Premium Services</h2>
            <div className="w-20 h-1 bg-[#FF3B30] mx-auto mb-6"></div>
            <p className="text-white/60 max-w-2xl mx-auto">Discover our extensive range of high-quality customized printing products designed to elevate your brand.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Shirt, title: "Custom T-Shirts", desc: "Premium fabrics with vibrant, long-lasting prints." },
              { icon: Crown, title: "Custom Caps", desc: "Embroidered and printed caps for teams and promos." },
              { icon: Coffee, title: "Printed Mugs", desc: "Personalized ceramic mugs for every occasion." },
              { icon: PenTool, title: "Printed Pens", desc: "Corporate metal and plastic pens with branding." },
              { icon: Award, title: "Custom Badges", desc: "Pin-backed and magnetic badges in all shapes." },
              { icon: ImageIcon, title: "Photo Frames", desc: "High-resolution printed frames for memories." },
              { icon: Gift, title: "Corporate Gifts", desc: "Curated gift hampers for clients and employees." },
              { icon: Package, title: "Bulk Orders", desc: "Wholesale pricing for large quantity requirements." }
            ].map((service, index) => (
              <motion.div 
                key={index} 
                variants={fadeUp}
                className="group p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] hover:border-[#FF3B30]/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#FF3B30]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center mb-6 text-[#FF3B30] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,59,48,0.1)] group-hover:shadow-[0_0_20px_rgba(255,59,48,0.3)]">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 bg-[#111111] relative border-y border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF3B30]/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Industry Leaders Choose Us</h2>
              <p className="text-white/60 mb-8 text-lg">
                We combine cutting-edge printing technology with meticulous craftsmanship. Our commitment to quality and speed makes us the preferred partner for businesses across India.
              </p>
              
              <div className="space-y-4">
                {[
                  "State-of-the-art digital printing equipment",
                  "Rigorous multi-point quality inspection",
                  "Dedicated account managers for corporate clients",
                  "Eco-friendly inks and sustainable materials"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-[#FF3B30]" size={20} />
                    <span className="text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: "5000+", label: "Orders Delivered" },
                { number: "100+", label: "Corporate Clients" },
                { number: "24h", label: "Fast Processing" },
                { number: "98%", label: "Satisfaction Rate" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUp}
                  className="bg-white/[0.03] border border-white/5 p-8 rounded-2xl flex flex-col items-center justify-center text-center"
                >
                  <div className="text-4xl md:text-5xl font-black text-[#FF3B30] mb-2">{stat.number}</div>
                  <div className="text-sm text-white/60 uppercase tracking-wider font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 relative">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <div className="w-20 h-1 bg-[#FF3B30] mx-auto mb-6"></div>
          </motion.div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-[#FF3B30]/30 to-transparent -translate-y-1/2 z-0"></div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10"
            >
              {[
                { icon: PaintBucket, title: "Share Design", desc: "Upload your artwork or work with our designers." },
                { icon: Monitor, title: "Approve Mockup", desc: "Review digital proofs before we begin production." },
                { icon: Printer, title: "Printing", desc: "High-precision printing with vibrant colors." },
                { icon: Truck, title: "Fast Delivery", desc: "Securely packed and shipped to your doorstep." }
              ].map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-[#111] border-2 border-[#FF3B30]/20 flex items-center justify-center mb-6 relative group-hover:border-[#FF3B30] transition-colors duration-300">
                    <div className="absolute inset-0 bg-[#FF3B30]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <step.icon className="text-[#FF3B30] relative z-10" size={32} />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#FF3B30] text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-[#111111] relative border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Client Testimonials</h2>
            <div className="w-20 h-1 bg-[#FF3B30] mx-auto mb-6"></div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { name: "Rahul Sharma", company: "TechNova", text: "Exceptional quality for our corporate welcome kits. The print clarity on the mugs and notebooks was far beyond our expectations. Highly recommended." },
              { name: "Priya Patel", company: "EventCo", text: "We ordered 500 custom t-shirts for a marathon. Radhe Digital delivered in just 3 days with zero compromises on quality. Incredible service!" },
              { name: "Amit Kumar", company: "Local Cafe", text: "The staff badges and custom caps for my cafe gave us the professional look we needed. Great pricing and very communicative team." }
            ].map((testimonial, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp}
                className="bg-white/[0.02] backdrop-blur-md border border-white/10 p-8 rounded-2xl relative"
              >
                <div className="flex gap-1 mb-6 text-[#FF3B30]">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-white/70 italic mb-8 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3B30] to-orange-500 flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-xs text-white/50">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3B30] to-orange-600 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-lg">READY TO PRINT YOUR IDEAS?</h2>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto font-medium">Get in touch with our team today and let's create something extraordinary together.</p>
            <Button size="lg" className="bg-white text-[#FF3B30] hover:bg-gray-100 h-14 px-10 rounded-none text-lg font-bold shadow-2xl transition-transform hover:scale-105">
              REQUEST A QUOTE
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] pt-20 pb-10 border-t border-white/10 text-white/60">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div>
              <div className="text-2xl font-bold text-white mb-6">
                RADHE <span className="text-[#FF3B30]">DIGITAL</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                Premium custom printing solutions for businesses and individuals. Quality that speaks for itself.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF3B30] hover:text-white transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Our Services</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Products</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Custom T-Shirts</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Corporate Gifts</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Personalized Mugs</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">ID Cards & Badges</a></li>
                <li><a href="#" className="hover:text-[#FF3B30] transition-colors">Photo Frames</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="text-[#FF3B30] shrink-0 mt-1" size={18} />
                  <span>DD Plaza, Sonkh Adda, Near Petrol Pump, Mathura, U.P - 281001</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Phone className="text-[#FF3B30] shrink-0" size={18} />
                  <span>+91 9319903380</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail className="text-[#FF3B30] shrink-0" size={18} />
                  <span>info@radhedigital.com</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 text-center text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Radhe Digital. All rights reserved.</p>
            <p>Designed with ❤️ for premium quality</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
