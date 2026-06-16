import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { requireAuth } from "../lib/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, "../../data");

function fp(name: string) { return path.join(DATA_DIR, `cms-${name}.json`); }

function read<T>(name: string, def: T): T {
  try { return JSON.parse(fs.readFileSync(fp(name), "utf-8")); }
  catch { return Array.isArray(def) ? [...(def as unknown[])] as T : { ...(def as object) } as T; }
}

function write(name: string, data: unknown) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(fp(name), JSON.stringify(data, null, 2));
}

const byOrd = (a: { displayOrder: number }, b: { displayOrder: number }) =>
  (a.displayOrder ?? 0) - (b.displayOrder ?? 0);

// ── Defaults ──────────────────────────────────────────────────────────────────

const D_HERO = {
  tag: "Mathura's #1 Custom Printing Studio",
  line1: "Print Your",
  brand: "Brand",
  line2: "On Anything",
  subtitle: "Custom T-shirts, mugs, caps, pens and more — printed with your logo or design in hours. Bulk-friendly, no minimums.",
  btn1Text: "Start Designing",
  btn2Text: "Browse Products",
  heroImageUrl: "",
};

const D_TRUST = [
  { id: 1, text: "10,000+ Happy Customers",   displayOrder: 1 },
  { id: 2, text: "Same-Day Printing Available", displayOrder: 2 },
  { id: 3, text: "Pan India Delivery",          displayOrder: 3 },
  { id: 4, text: "Bulk Order Discounts",        displayOrder: 4 },
  { id: 5, text: "No Minimum Order",            displayOrder: 5 },
  { id: 6, text: "100% Quality Guarantee",      displayOrder: 6 },
  { id: 7, text: "Custom Designs Welcome",      displayOrder: 7 },
  { id: 8, text: "WhatsApp Support 24/7",       displayOrder: 8 },
];

const D_WHY = [
  { id: 1, iconName: "zap",     title: "Lightning Fast",           description: "Same-day printing for urgent orders. We prioritize speed without compromising quality.", displayOrder: 1 },
  { id: 2, iconName: "shield",  title: "Quality Assured",          description: "Every print is quality-checked before delivery. 100% satisfaction guaranteed.", displayOrder: 2 },
  { id: 3, iconName: "package", title: "No Minimum Order",         description: "Order as little as 1 piece. Perfect for individuals and businesses of all sizes.", displayOrder: 3 },
  { id: 4, iconName: "palette", title: "Free Design Help",         description: "Our design team helps you create the perfect design for free.", displayOrder: 4 },
  { id: 5, iconName: "truck",   title: "Pan India Delivery",       description: "Fast and reliable shipping to every corner of India.", displayOrder: 5 },
  { id: 6, iconName: "users",   title: "500+ Businesses Trust Us", description: "Trusted by schools, corporates, and individual customers across India.", displayOrder: 6 },
];

const D_STEPS = [
  { id: 1, stepNumber: "01", iconName: "sparkles", title: "Choose a Product",  description: "Browse our catalog of 50+ customizable products.", displayOrder: 1 },
  { id: 2, stepNumber: "02", iconName: "palette",  title: "Share Your Design", description: "Upload your logo or let our team design for you.", displayOrder: 2 },
  { id: 3, stepNumber: "03", iconName: "clock",    title: "We Print It",       description: "High-quality digital printing with premium inks and materials.", displayOrder: 3 },
  { id: 4, stepNumber: "04", iconName: "check",    title: "Delivered Fast",    description: "Same-day or next-day delivery available across India.", displayOrder: 4 },
];

const D_TESTIMONIALS = [
  { id: 1, name: "Rahul Sharma", initials: "RS", location: "Mathura, UP", rating: 5, text: "Ordered 100 custom t-shirts for our company event. The quality was outstanding and delivered on time. Highly recommend!", photoUrl: "", displayOrder: 1 },
  { id: 2, name: "Priya Gupta",  initials: "PG", location: "Delhi",       rating: 5, text: "Got custom mugs for my cafe — the printing is sharp and colors are vibrant. Will definitely order again!", photoUrl: "", displayOrder: 2 },
  { id: 3, name: "Amit Verma",   initials: "AV", location: "Agra, UP",    rating: 5, text: "Same-day delivery saved us for our corporate gifting deadline. Amazing quality pens and badges. 5 stars!", photoUrl: "", displayOrder: 3 },
];

const D_FAQS = [
  { id: 1, question: "What is the minimum order quantity?",  answer: "We accept orders of just 1 piece! There is no minimum order requirement, making us perfect for individuals and bulk orders.", displayOrder: 1 },
  { id: 2, question: "How long does printing take?",         answer: "Most orders are completed within 24–48 hours. We also offer same-day printing for urgent orders.", displayOrder: 2 },
  { id: 3, question: "Can I provide my own design?",         answer: "Absolutely! You can upload your own design in PNG, PDF, or AI format when placing your order.", displayOrder: 3 },
  { id: 4, question: "What if I don't have a design?",       answer: "No problem! Our in-house design team provides free design assistance. Just share your idea.", displayOrder: 4 },
  { id: 5, question: "Do you deliver across India?",         answer: "Yes, we ship pan India. Delivery usually takes 2–5 business days depending on your location.", displayOrder: 5 },
  { id: 6, question: "What payment methods do you accept?",  answer: "We accept UPI, bank transfer, cash on delivery (local), and all major debit/credit cards.", displayOrder: 6 },
];

const D_CTA = {
  badge: "GET STARTED",
  title: "Ready to Bring Your",
  highlight: "Ideas to Life?",
  subtitle: "Join 10,000+ happy customers who trust Radhe Digital for all their printing needs.",
  btn1Text: "Start Designing Now",
  btn2Text: "Chat on WhatsApp",
  btn2Link: "https://wa.me/919319903380",
  point1: "No credit card needed",
  point2: "Free design assistance",
  point3: "100% satisfaction guaranteed",
  ctaImageUrl: "",
};

// ── Router ────────────────────────────────────────────────────────────────────

const router = Router();

/* Public combined endpoint — homepage fetches this once */
router.get("/all", (_req, res) => {
  res.json({
    hero:         read("hero",         D_HERO),
    trust:        [...read<typeof D_TRUST>("trust",        D_TRUST)].sort(byOrd),
    whyUs:        [...read<typeof D_WHY>("why-us",         D_WHY)].sort(byOrd),
    steps:        [...read<typeof D_STEPS>("steps",        D_STEPS)].sort(byOrd),
    testimonials: [...read<typeof D_TESTIMONIALS>("testimonials", D_TESTIMONIALS)].sort(byOrd),
    faqs:         [...read<typeof D_FAQS>("faqs",          D_FAQS)].sort(byOrd),
    cta:          read("cta",          D_CTA),
  });
});

/* Single-object sections */
router.get("/hero", requireAuth, (_r, res) => res.json(read("hero", D_HERO)));
router.put("/hero", requireAuth, (req, res) => {
  const d = { ...read("hero", D_HERO), ...req.body };
  write("hero", d);
  res.json(d);
});

router.get("/cta", requireAuth, (_r, res) => res.json(read("cta", D_CTA)));
router.put("/cta", requireAuth, (req, res) => {
  const d = { ...read("cta", D_CTA), ...req.body };
  write("cta", d);
  res.json(d);
});

/* Generic array-section CRUD */
function arr(name: string, def: Array<{ id: number; displayOrder: number }>) {
  router.get(`/${name}`, requireAuth, (_r, res) =>
    res.json([...read<typeof def>(name, def)].sort(byOrd)));

  router.post(`/${name}`, requireAuth, (req, res) => {
    const items = read<typeof def>(name, def);
    const maxId  = Math.max(0, ...items.map(i => i.id))           + 1;
    const maxOrd = Math.max(0, ...items.map(i => i.displayOrder)) + 1;
    const item   = { id: maxId, displayOrder: maxOrd, ...req.body };
    items.push(item as any);
    write(name, items);
    res.status(201).json(item);
  });

  router.put(`/${name}/:id`, requireAuth, (req, res) => {
    const id    = Number(req.params.id);
    const items = read<typeof def>(name, def);
    const idx   = items.findIndex(i => i.id === id);
    if (idx === -1) { res.status(404).json({ error: "NOT_FOUND" }); return; }
    Object.assign(items[idx], req.body);
    write(name, items);
    res.json(items[idx]);
  });

  router.delete(`/${name}/:id`, requireAuth, (req, res) => {
    const id    = Number(req.params.id);
    const items = read<typeof def>(name, def).filter(i => i.id !== id);
    write(name, items);
    res.json({ deleted: id });
  });
}

arr("trust",        D_TRUST);
arr("why-us",       D_WHY);
arr("steps",        D_STEPS);
arr("testimonials", D_TESTIMONIALS);
arr("faqs",         D_FAQS);

export default router;
