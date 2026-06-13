import React from "react";
import { Link } from "wouter";
import { Upload, Shirt, Phone, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  const stepIcons = [
    <Upload size={32} />,
    <Shirt size={32} />,
    <Phone size={32} />,
    <Package size={32} />,
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Intro Header */}
      <div className="text-white py-12 lg:py-32" style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1010 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-6xl font-bold mb-6">{a.title}</h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light">{a.subtitle}</p>
        </div>
      </div>

      {/* Process Section */}
      <section className="py-12 md:py-24 bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-16">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
              {a.processBadge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 mt-2">{a.processTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg">{a.processSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 -z-10 -translate-y-1/2" style={{ background: "linear-gradient(90deg, transparent, rgba(196,150,42,0.3), transparent)" }} />
            {a.steps.map((step, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative z-10">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white" style={{ background: "linear-gradient(135deg, #C4962A, #A07820)", boxShadow: "0 4px 20px rgba(196,150,42,0.3)" }}>
                  {stepIcons[idx]}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{idx + 1}. {step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border" style={{ color: "#C4962A", borderColor: "rgba(196,150,42,0.3)", background: "rgba(196,150,42,0.08)" }}>
                Our Story
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 mt-2">Our Mission & Vision</h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900 block mb-1">The Mission</strong>
                  To empower individuals, businesses, and communities to express their identity through high-quality, customized apparel without the hassle of traditional printing constraints.
                </p>
                <p>
                  <strong className="text-gray-900 block mb-1">The Vision</strong>
                  To become the most trusted and efficient digital printing partner in India, known for flawless execution, unmatched customer support, and bridging the gap between digital design and physical print.
                </p>
                <p>
                  <strong className="text-gray-900 block mb-1">Experience & Expertise</strong>
                  With years of experience in the garment and printing industry, our technicians understand the nuance of fabrics, inks, and curing processes. Whether it is DTG, Screen Printing, or Sublimation, we ensure the print outlasts the fabric.
                </p>
              </div>
              <div className="mt-8 flex gap-3">
                <Link href="/categories">
                  <Button size="lg" className="bg-primary hover:bg-red-700 text-white">
                    {a.startCustomizing} <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    {a.contactUs}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <img src="/images/gallery-3.png" alt="Team at work" className="w-full h-full object-cover rounded-2xl shadow-lg col-span-2 aspect-video" />
              <div className="rounded-2xl p-6 flex flex-col justify-center text-center" style={{ background: "rgba(196,150,42,0.08)", border: "1px solid rgba(196,150,42,0.2)" }}>
                <span className="text-4xl font-black block mb-2" style={{ color: "#C4962A" }}>10k+</span>
                <span className="text-gray-700 font-medium">Orders Delivered</span>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 flex flex-col justify-center text-center">
                <span className="text-4xl font-black text-white block mb-2">99%</span>
                <span className="text-gray-400 font-medium">Happy Customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
