import { useState, useEffect } from "react";

export interface CmsHero {
  tag: string;
  line1: string;
  brand: string;
  line2: string;
  subtitle: string;
  btn1Text: string;
  btn2Text: string;
  heroImageUrl?: string;
}

export interface CmsTrustItem {
  id: number;
  text: string;
  displayOrder: number;
}

export interface CmsWhyUs {
  id: number;
  iconName: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface CmsStep {
  id: number;
  stepNumber: string;
  iconName: string;
  title: string;
  description: string;
  displayOrder: number;
}

export interface CmsTestimonial {
  id: number;
  name: string;
  initials: string;
  location: string;
  rating: number;
  text: string;
  photoUrl?: string;
  displayOrder: number;
}

export interface CmsFaq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
}

export interface CmsCta {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  btn1Text: string;
  btn2Text: string;
  btn2Link: string;
  point1: string;
  point2: string;
  point3: string;
  ctaImageUrl?: string;
}

export interface CmsAll {
  hero: CmsHero;
  trust: CmsTrustItem[];
  whyUs: CmsWhyUs[];
  steps: CmsStep[];
  testimonials: CmsTestimonial[];
  faqs: CmsFaq[];
  cta: CmsCta;
}

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

let _cache: CmsAll | null = null;
let _promise: Promise<CmsAll | null> | null = null;

export function invalidateHomepageCmsCache() {
  _cache = null;
  _promise = null;
}

export function useHomepageCms() {
  const [data, setData] = useState<CmsAll | null>(_cache);

  useEffect(() => {
    if (_cache) {
      setData(_cache);
      return;
    }
    if (!_promise) {
      _promise = fetch(`${BASE}/homepage-cms/all`)
        .then(r => r.json() as Promise<CmsAll>)
        .then(d => {
          _cache = d;
          return d;
        })
        .catch(() => {
          _promise = null;
          return null;
        });
    }
    _promise.then(d => {
      if (d) setData(d);
    });
  }, []);

  return { cmsData: data };
}
