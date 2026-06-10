// ============================================================
// ⚠️  SAMPLE / MOCK DATA — NOT CONNECTED TO ANY DATABASE
// ============================================================
// This file contains hardcoded placeholder data used to
// demonstrate the admin panel UI.
//
// ALL DATA HERE IS FAKE. Nothing is persisted — every page
// refresh resets to these values.
//
// FILE LOCATION:
//   artifacts/radhe-digital/src/admin/sampleData.ts
//
// DATA SECTIONS IN THIS FILE:
//   - OrderStatus / ProductCategory  →  TypeScript type definitions
//   - Order interface                →  shape of one order record
//   - Product interface              →  shape of one product record
//   - Customer interface             →  shape of one customer record
//   - SAMPLE_ORDERS (8 rows)         →  mock order data
//   - SAMPLE_PRODUCTS (10 rows)      →  mock product catalogue
//   - SAMPLE_CUSTOMERS (5 rows)      →  mock customer records
//
// PAGES THAT USE THIS FILE:
//   AdminDashboard.tsx   → SAMPLE_ORDERS, SAMPLE_PRODUCTS, SAMPLE_CUSTOMERS
//   AdminOrders.tsx      → SAMPLE_ORDERS
//   AdminProducts.tsx    → SAMPLE_PRODUCTS
//   AdminCustomers.tsx   → SAMPLE_CUSTOMERS
//   AdminWhatsApp.tsx    → SAMPLE_ORDERS (filtered to isWhatsApp:true)
//
// HOW TO REPLACE WITH REAL DATA:
//   Replace each SAMPLE_* array with an API call to your
//   backend (see bottom of this file for the integration plan).
// ============================================================

export type OrderStatus =
  | "New Order"
  | "Contacted"
  | "Design Received"
  | "In Production"
  | "Ready"
  | "Delivered"
  | "Cancelled";

export type ProductCategory =
  | "T-Shirt Printing"
  | "Mug Printing"
  | "Cap Printing"
  | "Mobile Cover Printing"
  | "Corporate Gifts"
  | "Customized Products";

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
  email?: string;
  notes?: string;
  isWhatsApp?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  imageUrl: string;
  status: "Active" | "Inactive";
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  totalOrders: number;
  orderedProducts: string[];
  lastOrderDate: string;
  totalSpent: number;
}

// ─────────────────────────────────────────────
// ⚠️  SAMPLE ORDERS — 8 fake rows
//     Replace with: GET /api/orders
// ─────────────────────────────────────────────
export const SAMPLE_ORDERS: Order[] = [
  { id: "ORD-001", customerName: "Rahul Sharma", mobile: "9876543210", productName: "Classic Round Neck T-Shirt", category: "T-Shirt Printing", quantity: 50, total: 9950, status: "In Production", date: "2026-06-09", address: "12 MG Road, Mathura, UP 281001", email: "rahul@example.com", isWhatsApp: true },
  { id: "ORD-002", customerName: "Priya Verma", mobile: "9654321087", productName: "Custom Printed Mug", category: "Mug Printing", quantity: 20, total: 3980, status: "Ready", date: "2026-06-08", address: "45 Krishna Nagar, Vrindavan, UP 281121", isWhatsApp: true },
  { id: "ORD-003", customerName: "Amit Gupta", mobile: "9123456780", productName: "Polo T-Shirt with Logo", category: "T-Shirt Printing", quantity: 100, total: 24900, status: "New Order", date: "2026-06-10", address: "78 Civil Lines, Agra, UP 282002", email: "amit.gupta@corp.com" },
  { id: "ORD-004", customerName: "Sunita Yadav", mobile: "9871234560", productName: "Printed Cap", category: "Cap Printing", quantity: 30, total: 5370, status: "Delivered", date: "2026-06-05", address: "23 Hathras Road, Mathura, UP 281003" },
  { id: "ORD-005", customerName: "Vijay Malhotra", mobile: "9012345678", productName: "Mobile Cover Custom Print", category: "Mobile Cover Printing", quantity: 10, total: 1490, status: "Contacted", date: "2026-06-10", address: "56 Goverdhan Road, Mathura, UP 281006", isWhatsApp: true },
  { id: "ORD-006", customerName: "Anita Pandey", mobile: "9988776655", productName: "Corporate Gift Set", category: "Corporate Gifts", quantity: 25, total: 12250, status: "Design Received", date: "2026-06-07", address: "89 Sector 7, Noida, UP 201301", email: "anita@businesscorp.in" },
  { id: "ORD-007", customerName: "Ravi Kumar", mobile: "9871122334", productName: "Sublimation Mug", category: "Mug Printing", quantity: 5, total: 995, status: "Delivered", date: "2026-06-04", address: "34 Brindaban Garden, Mathura, UP 281004" },
  { id: "ORD-008", customerName: "Meena Tiwari", mobile: "9654987321", productName: "Customized Hoodie", category: "Customized Products", quantity: 15, total: 10485, status: "Cancelled", date: "2026-06-03", address: "67 Railway Colony, Mathura, UP 281005", notes: "Customer cancelled due to delay" },
];

// ─────────────────────────────────────────────
// ⚠️  SAMPLE PRODUCTS — 10 fake rows
//     Replace with: GET /api/products
// ─────────────────────────────────────────────
export const SAMPLE_PRODUCTS: Product[] = [
  { id: "PRD-001", name: "Classic Round Neck T-Shirt", category: "T-Shirt Printing", description: "Premium 180 GSM cotton round neck t-shirt with custom logo or text printing.", price: 199, imageUrl: "", status: "Active", stock: 500 },
  { id: "PRD-002", name: "Polo T-Shirt with Logo", category: "T-Shirt Printing", description: "Professional polo t-shirt with embroidered or printed logo. Ideal for corporate teams.", price: 249, imageUrl: "", status: "Active", stock: 300 },
  { id: "PRD-003", name: "Custom Printed Mug", category: "Mug Printing", description: "Glossy white 325ml ceramic mug with full-colour photo or design print.", price: 199, imageUrl: "", status: "Active", stock: 200 },
  { id: "PRD-004", name: "Sublimation Mug", category: "Mug Printing", description: "HD sublimation printed ceramic mug. Vibrant, long-lasting prints.", price: 199, imageUrl: "", status: "Active", stock: 150 },
  { id: "PRD-005", name: "Printed Cap", category: "Cap Printing", description: "Adjustable baseball cap with custom embroidery or print on front panel.", price: 179, imageUrl: "", status: "Active", stock: 250 },
  { id: "PRD-006", name: "Mobile Cover Custom Print", category: "Mobile Cover Printing", description: "Hard back custom printed mobile cover. Available for all major phone models.", price: 149, imageUrl: "", status: "Active", stock: 400 },
  { id: "PRD-007", name: "Corporate Gift Set", category: "Corporate Gifts", description: "Premium corporate gift hamper with branded mug, cap, and pen set.", price: 490, imageUrl: "", status: "Active", stock: 100 },
  { id: "PRD-008", name: "Customized Hoodie", category: "Customized Products", description: "Premium 300 GSM fleece hoodie with custom front/back print or embroidery.", price: 699, imageUrl: "", status: "Active", stock: 150 },
  { id: "PRD-009", name: "Oversize T-Shirt", category: "T-Shirt Printing", description: "Trendy oversized t-shirt with DTF or screen printing. Popular for events.", price: 299, imageUrl: "", status: "Active", stock: 200 },
  { id: "PRD-010", name: "Pen Set (Branded)", category: "Corporate Gifts", description: "Set of 5 branded pens with company name or logo engraved.", price: 125, imageUrl: "", status: "Inactive", stock: 0 },
];

// ─────────────────────────────────────────────
// ⚠️  SAMPLE CUSTOMERS — 5 fake rows
//     Replace with: GET /api/customers
// ─────────────────────────────────────────────
export const SAMPLE_CUSTOMERS: Customer[] = [
  { id: "CUS-001", name: "Rahul Sharma", mobile: "9876543210", email: "rahul@example.com", totalOrders: 3, orderedProducts: ["Classic Round Neck T-Shirt", "Polo T-Shirt with Logo", "Printed Cap"], lastOrderDate: "2026-06-09", totalSpent: 34850 },
  { id: "CUS-002", name: "Priya Verma", mobile: "9654321087", totalOrders: 2, orderedProducts: ["Custom Printed Mug", "Sublimation Mug"], lastOrderDate: "2026-06-08", totalSpent: 4975 },
  { id: "CUS-003", name: "Amit Gupta", mobile: "9123456780", email: "amit.gupta@corp.com", totalOrders: 1, orderedProducts: ["Polo T-Shirt with Logo"], lastOrderDate: "2026-06-10", totalSpent: 24900 },
  { id: "CUS-004", name: "Sunita Yadav", mobile: "9871234560", totalOrders: 2, orderedProducts: ["Printed Cap", "Custom Printed Mug"], lastOrderDate: "2026-06-05", totalSpent: 7350 },
  { id: "CUS-005", name: "Anita Pandey", mobile: "9988776655", email: "anita@businesscorp.in", totalOrders: 1, orderedProducts: ["Corporate Gift Set"], lastOrderDate: "2026-06-07", totalSpent: 12250 },
];
