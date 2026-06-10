// ─── API Client — Radhe Digital Admin ───────────────────────────────────────
// BASE uses the Vite proxy in dev (/api → http://localhost:8080/api)
// In production set VITE_API_URL=https://your-api-server.com before building

const BASE = `${import.meta.env.VITE_API_URL ?? ""}/api`;

const STORAGE_KEY = "rd_admin_auth";

function getToken(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

// ─── snake_case → camelCase transformer ─────────────────────────────────────
function toCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

async function apiFetch<T>(path: string, init?: RequestInit, skipAuth = false): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> ?? {}),
  };
  if (token && !skipAuth) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message ?? "API error"), { code: data.error, status: res.status });
  return toCamel(data) as T;
}

// ─── Types ───────────────────────────────────────────────────────────────────
export type OrderStatus =
  | "New Order" | "Contacted" | "Design Received"
  | "In Production" | "Ready" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  productName: string;
  category: string;
  quantity: number;
  total: number | string;
  status: OrderStatus;
  address: string;
  email?: string;
  notes?: string;
  isWhatsapp?: boolean;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number | string;
  imageUrl?: string;
  status: "Active" | "Inactive";
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  totalOrders: number;
  totalSpent: number | string;
  orderedProducts: string[];
  lastOrderDate?: string;
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  totalCustomers: number;
  activeProducts: number;
  statusBreakdown: Partial<Record<OrderStatus, number>>;
  recentOrders: Order[];
}

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const loginAdmin = (email: string, password: string) =>
  apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, true);

export const getMe = () => apiFetch<{ user: AdminUser }>("/auth/me");

// ─── Orders ──────────────────────────────────────────────────────────────────
export const getOrders   = (params?: { status?: string; whatsapp?: boolean; search?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status)   qs.set("status", params.status);
  if (params?.whatsapp) qs.set("whatsapp", "true");
  if (params?.search)   qs.set("search", params.search);
  const q = qs.toString();
  return apiFetch<Order[]>(`/orders${q ? `?${q}` : ""}`);
};

export const createOrder = (data: Omit<Order, "id" | "status" | "createdAt">) =>
  apiFetch<{ id: string; status: string }>("/orders", { method: "POST", body: JSON.stringify(data) });

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  apiFetch<{ id: string; status: string }>(`/orders/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProducts    = (params?: { status?: string; search?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.search) qs.set("search", params.search);
  const q = qs.toString();
  return apiFetch<Product[]>(`/products${q ? `?${q}` : ""}`);
};

export const createProduct = (data: Omit<Product, "id">) =>
  apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id: string, data: Partial<Omit<Product, "id">>) =>
  apiFetch<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProduct = (id: string) =>
  apiFetch<{ deleted: string }>(`/products/${id}`, { method: "DELETE" });

// ─── Customers ───────────────────────────────────────────────────────────────
export const getCustomers = (params?: { search?: string }) => {
  const qs = params?.search ? `?search=${encodeURIComponent(params.search)}` : "";
  return apiFetch<Customer[]>(`/customers${qs}`);
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardStats = () => apiFetch<DashboardStats>("/dashboard/stats");

// ─── DB status banner component (React JSX) ──────────────────────────────────
export const DB_NOT_CONNECTED_MSG =
  "Database not connected. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME environment variables and restart the API server.";
