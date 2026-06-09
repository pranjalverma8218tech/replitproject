export interface ColorOption {
  name: string;
  hex: string;
  border?: boolean;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface GalleryView {
  label: string;
  angle: "front" | "back" | "left" | "right" | "top" | "detail" | "handle" | "open";
}

export interface CategoryDetail {
  colors: ColorOption[];
  sizes?: string[];
  material: string;
  printingType: string;
  deliveryTime: string;
  specs: SpecRow[];
  galleryViews: GalleryView[];
}

export const CATEGORY_DETAILS: Record<string, CategoryDetail> = {
  "t-shirts": {
    colors: [
      { name: "White",       hex: "#ffffff", border: true },
      { name: "Black",       hex: "#111111" },
      { name: "Red",         hex: "#e53e3e" },
      { name: "Navy Blue",   hex: "#1e3a8a" },
      { name: "Grey",        hex: "#9ca3af" },
      { name: "Royal Blue",  hex: "#2563eb" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    material: "100% Combed Cotton / Dry-Fit Polyester",
    printingType: "DTG Print / Screen Print / Sublimation",
    deliveryTime: "3–5 business days",
    specs: [
      { label: "Fabric Material",    value: "100% Combed Cotton / Polyester" },
      { label: "GSM",                value: "180 GSM (Standard) · 220 GSM (Premium)" },
      { label: "Fit Type",           value: "Regular Fit / Slim Fit / Oversized" },
      { label: "Sleeve Type",        value: "Short Sleeve / Half Sleeve" },
      { label: "Available Sizes",    value: "S, M, L, XL, XXL" },
      { label: "Collar Type",        value: "Round Neck / V-Neck / Polo Collar" },
      { label: "Print Method",       value: "DTG · Screen Print · Sublimation · Heat Transfer" },
      { label: "Wash Care",          value: "Machine washable · Cold water · Inside out" },
      { label: "MOQ",                value: "1 piece (custom) · 50 pieces (bulk)" },
    ],
    galleryViews: [
      { label: "Front View",        angle: "front" },
      { label: "Back View",         angle: "back" },
      { label: "Left Side",         angle: "left" },
      { label: "Right Side",        angle: "right" },
      { label: "Fabric Close-up",   angle: "detail" },
    ],
  },

  "mugs": {
    colors: [
      { name: "White",       hex: "#ffffff", border: true },
      { name: "Black",       hex: "#111111" },
      { name: "Red",         hex: "#e53e3e" },
      { name: "Blue",        hex: "#2563eb" },
    ],
    material: "Premium Ceramic / Stainless Steel",
    printingType: "Sublimation Full-Wrap Print",
    deliveryTime: "2–4 business days",
    specs: [
      { label: "Material",       value: "Premium Ceramic (11oz / 15oz)" },
      { label: "Capacity",       value: "11 oz (325 ml) · 15 oz (450 ml)" },
      { label: "Finish",         value: "Gloss / Matte" },
      { label: "Print Coverage", value: "Full-wrap 360° sublimation" },
      { label: "Dishwasher",     value: "Safe (top rack)" },
      { label: "Print Durability", value: "Fade-resistant · long-lasting colours" },
      { label: "MOQ",            value: "1 piece (custom) · 24 pieces (bulk)" },
    ],
    galleryViews: [
      { label: "Front View",    angle: "front" },
      { label: "Back View",     angle: "back" },
      { label: "Side View",     angle: "left" },
      { label: "Handle Side",   angle: "handle" },
    ],
  },

  "caps": {
    colors: [
      { name: "Black",       hex: "#111111" },
      { name: "White",       hex: "#ffffff", border: true },
      { name: "Navy Blue",   hex: "#1e3a8a" },
      { name: "Red",         hex: "#e53e3e" },
      { name: "Grey",        hex: "#9ca3af" },
    ],
    sizes: ["One Size (Adjustable)"],
    material: "100% Cotton / Polyester Blend",
    printingType: "Embroidery / Screen Print",
    deliveryTime: "4–6 business days",
    specs: [
      { label: "Material",        value: "100% Cotton / Polyester Mesh" },
      { label: "Style",           value: "Snapback · Flexfit · Dad Hat · Trucker · Bucket" },
      { label: "Sizing",          value: "Adjustable strap (one size fits most)" },
      { label: "Print Area",      value: "Front panel · Side panels · Back strap" },
      { label: "Print Method",    value: "Embroidery (3D/Flat) · Screen Print · Patch" },
      { label: "Brim",            value: "Flat / Curved" },
      { label: "MOQ",             value: "1 piece (custom) · 25 pieces (bulk)" },
    ],
    galleryViews: [
      { label: "Front View",  angle: "front" },
      { label: "Back View",   angle: "back" },
      { label: "Side View",   angle: "left" },
      { label: "Top View",    angle: "top" },
    ],
  },

  "pens": {
    colors: [
      { name: "Black",       hex: "#111111" },
      { name: "Silver",      hex: "#c0c0c0" },
      { name: "Blue",        hex: "#2563eb" },
      { name: "Red",         hex: "#e53e3e" },
    ],
    material: "ABS Plastic / Brushed Metal",
    printingType: "Pad Print / Laser Engraving",
    deliveryTime: "3–5 business days",
    specs: [
      { label: "Material",       value: "ABS Plastic / Brushed Aluminium / Stainless Steel" },
      { label: "Ink Type",       value: "Ballpoint · Gel · Roller" },
      { label: "Ink Colour",     value: "Blue / Black" },
      { label: "Print Method",   value: "Pad Printing · Laser Engraving · Screen Print" },
      { label: "Print Area",     value: "Barrel · Clip" },
      { label: "Gift Packaging", value: "Individual pouch / Gift box (optional)" },
      { label: "MOQ",            value: "50 pieces (bulk) · 1 piece (executive range)" },
    ],
    galleryViews: [
      { label: "Full View",       angle: "front" },
      { label: "Top View",        angle: "top" },
      { label: "Engraved Side",   angle: "left" },
      { label: "Gift Box",        angle: "open" },
    ],
  },

  "badges": {
    colors: [
      { name: "White",       hex: "#ffffff", border: true },
      { name: "Red",         hex: "#e53e3e" },
      { name: "Blue",        hex: "#2563eb" },
      { name: "Black",       hex: "#111111" },
      { name: "Gold",        hex: "#f6ad55" },
    ],
    material: "Tin / Metal / PVC",
    printingType: "Full Colour Digital Print",
    deliveryTime: "2–3 business days",
    specs: [
      { label: "Material",       value: "Tin-plate / Die-cast Metal / PVC / Acrylic" },
      { label: "Sizes",          value: "25mm · 37mm · 44mm · 58mm · Custom" },
      { label: "Finish",         value: "Gloss laminate / Matte / Soft enamel" },
      { label: "Attachment",     value: "Safety pin · Magnetic back · Bulldog clip" },
      { label: "Print Method",   value: "Full-colour digital · Enamel fill" },
      { label: "Durability",     value: "Scratch-resistant · waterproof coating" },
      { label: "MOQ",            value: "10 pieces (custom) · 100 pieces (bulk)" },
    ],
    galleryViews: [
      { label: "Front View",    angle: "front" },
      { label: "Back View",     angle: "back" },
      { label: "Detail View",   angle: "detail" },
      { label: "Pinned On",     angle: "open" },
    ],
  },

  "photo-frames": {
    colors: [
      { name: "Natural Wood",  hex: "#c8a06b" },
      { name: "Dark Wood",     hex: "#5c3d2e" },
      { name: "Black",         hex: "#111111" },
      { name: "White",         hex: "#ffffff", border: true },
      { name: "Silver",        hex: "#c0c0c0" },
    ],
    material: "Wood / Acrylic / Metal",
    printingType: "Sublimation / UV Print",
    deliveryTime: "3–5 business days",
    specs: [
      { label: "Frame Material",   value: "Natural Wood · MDF · Acrylic · Metal" },
      { label: "Photo Size",       value: "4×6 · 5×7 · 6×8 · A4 · Custom" },
      { label: "Print Type",       value: "Sublimation print · UV direct print" },
      { label: "Finish",           value: "Matte / Gloss / Metallic" },
      { label: "Stand",            value: "Easel back stand (included)" },
      { label: "Hanging",          value: "Wall hanging keyhole (included)" },
      { label: "MOQ",              value: "1 piece" },
    ],
    galleryViews: [
      { label: "Front View",   angle: "front" },
      { label: "Side View",    angle: "left" },
      { label: "Back View",    angle: "back" },
      { label: "On Desk",      angle: "open" },
    ],
  },

  "corporate-gifts": {
    colors: [
      { name: "Brand Custom",  hex: "#e53e3e" },
      { name: "Black",         hex: "#111111" },
      { name: "Navy",          hex: "#1e3a8a" },
      { name: "White",         hex: "#ffffff", border: true },
    ],
    material: "Mixed Premium Materials",
    printingType: "Logo Branding + Screen Print",
    deliveryTime: "5–7 business days",
    specs: [
      { label: "Customisation",    value: "Logo · Name · Tagline · Brand colours" },
      { label: "Packaging",        value: "Premium branded gift box (included)" },
      { label: "Contents",         value: "Varies by set (T-shirt · Mug · Pen · Notebook · Cap)" },
      { label: "Branding Method",  value: "Screen print · Embroidery · Engraving · Sublimation" },
      { label: "Delivery",         value: "Pan India delivery · Express available" },
      { label: "MOQ",              value: "10 sets (custom) · 25 sets (bulk)" },
    ],
    galleryViews: [
      { label: "Box Open",      angle: "open" },
      { label: "Box Closed",    angle: "front" },
      { label: "Items Detail",  angle: "detail" },
      { label: "Side View",     angle: "left" },
    ],
  },
};
