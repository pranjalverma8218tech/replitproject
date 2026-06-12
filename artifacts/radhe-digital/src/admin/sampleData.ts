// ============================================================
// Type definitions only — all data is now loaded from the API
// See: src/admin/api.ts for API client and types
// See: artifacts/api-server/setup.sql for MySQL table schema
// ============================================================

// Re-export types from api.ts for backwards compatibility
export type { OrderStatus, Order, Product, Customer } from "./api";
export type ProductCategory =
  | "T-Shirt Printing"
  | "Mug Printing"
  | "Cap Printing"
  | "Pen Printing"
  | "Badge Printing"
  | "Photo Frame Printing"
  | "Corporate Gifts";
