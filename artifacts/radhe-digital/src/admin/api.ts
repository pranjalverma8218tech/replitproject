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

export interface ProductImage {
  view: "front" | "back" | "side" | "closeup";
  label: string;
  url: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  hex: string;
  images: ProductImage[];
  stock?: number;
  priceAdjustment?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number | string;
  priceLabel?: string;
  badge?: string;
  tags?: string[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  features?: string[];
  specifications?: ProductSpec[];
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

// ─── Image Upload ─────────────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<{ url: string }> {
  const token = getToken();
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message ?? "Upload failed"), { code: data.error, status: res.status });
  return data as { url: string };
}

export function uploadImageWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE}/upload`);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch { reject(new Error("Invalid server response")); }
      } else {
        try {
          const d = JSON.parse(xhr.responseText);
          reject(new Error(d.message ?? `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`));
        }
      }
    });
    xhr.addEventListener("error", () => reject(new Error("Network error. Check your connection.")));
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")));
    xhr.send(form);
  });
}

export async function deleteUploadedImage(filename: string): Promise<void> {
  const token = getToken();
  await fetch(`${BASE}/upload/${encodeURIComponent(filename)}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

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

// ─── Customization Products ───────────────────────────────────────────────────
export interface ColorVariant {
  color: string;
  hex: string;
  image: string;
}

export interface CustomizeProduct {
  id: string;
  name: string;
  productType: string;
  category: string;
  categorySlug: string;
  basePrice: number;
  description: string;
  frontImage: string;
  backImage: string;
  sideImage: string;
  colors: string[];
  sizes: string[];
  colorVariants: ColorVariant[];
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
}

export const getCustomizeProducts = (params?: { status?: string; search?: string; category?: string }) => {
  const qs = new URLSearchParams();
  if (params?.status)   qs.set("status",   params.status);
  if (params?.search)   qs.set("search",   params.search);
  if (params?.category) qs.set("category", params.category);
  const q = qs.toString();
  return apiFetch<CustomizeProduct[]>(`/customize-products${q ? `?${q}` : ""}`);
};

export const createCustomizeProduct = (data: Omit<CustomizeProduct, "id" | "createdAt" | "updatedAt">) =>
  apiFetch<CustomizeProduct>("/customize-products", { method: "POST", body: JSON.stringify(data) });

export const updateCustomizeProduct = (id: string, data: Partial<Omit<CustomizeProduct, "id" | "createdAt" | "updatedAt">>) =>
  apiFetch<CustomizeProduct>(`/customize-products/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteCustomizeProduct = (id: string) =>
  apiFetch<{ deleted: string }>(`/customize-products/${id}`, { method: "DELETE" });

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

// ─── Homepage Categories ──────────────────────────────────────────────────────
export interface HomepageCategory {
  id: number;
  slug: string;
  name: string;
  nameHi: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isVisible: number;
}

export const getAdminHomepageCategories = () =>
  apiFetch<HomepageCategory[]>("/homepage-categories/all");

export const updateHomepageCategory = (
  id: number,
  data: { name?: string; nameHi?: string | null; imageUrl?: string | null; displayOrder?: number; isVisible?: number }
) => {
  const body: Record<string, unknown> = {};
  if ("name"          in data) body.name          = data.name;
  if ("nameHi"        in data) body.name_hi       = data.nameHi;
  if ("imageUrl"      in data) body.image_url     = data.imageUrl;
  if ("displayOrder"  in data) body.display_order = data.displayOrder;
  if ("isVisible"     in data) body.is_visible    = data.isVisible;
  return apiFetch<HomepageCategory>(`/homepage-categories/${id}`, { method: "PUT", body: JSON.stringify(body) });
};

export const createHomepageCategory = (data: {
  slug: string; name: string; nameHi?: string; imageUrl?: string; displayOrder?: number;
}) =>
  apiFetch<HomepageCategory>("/homepage-categories", {
    method: "POST",
    body: JSON.stringify({ slug: data.slug, name: data.name, name_hi: data.nameHi, image_url: data.imageUrl, display_order: data.displayOrder }),
  });

export const deleteHomepageCategory = (id: number) =>
  apiFetch<{ deleted: number }>(`/homepage-categories/${id}`, { method: "DELETE" });

// ─── Homepage CMS ──────────────────────────────────────────────────────────────
export interface CmsHero { tag: string; line1: string; brand: string; line2: string; subtitle: string; btn1Text: string; btn2Text: string; heroImageUrl?: string; }
export interface CmsTrustItem { id: number; text: string; displayOrder: number; }
export interface CmsWhyUs { id: number; iconName: string; title: string; description: string; displayOrder: number; }
export interface CmsStep { id: number; stepNumber: string; iconName: string; title: string; description: string; displayOrder: number; }
export interface CmsTestimonial { id: number; name: string; initials: string; location: string; rating: number; text: string; photoUrl?: string; displayOrder: number; }
export interface CmsFaq { id: number; question: string; answer: string; displayOrder: number; }
export interface CmsCta { badge: string; title: string; highlight: string; subtitle: string; btn1Text: string; btn2Text: string; btn2Link: string; point1: string; point2: string; point3: string; ctaImageUrl?: string; }

export const getCmsHero = () => apiFetch<CmsHero>("/homepage-cms/hero");
export const putCmsHero = (d: Partial<CmsHero>) => apiFetch<CmsHero>("/homepage-cms/hero", { method: "PUT", body: JSON.stringify(d) });
export const getCmsCta  = () => apiFetch<CmsCta>("/homepage-cms/cta");
export const putCmsCta  = (d: Partial<CmsCta>)  => apiFetch<CmsCta>("/homepage-cms/cta",  { method: "PUT", body: JSON.stringify(d) });

function makeCmsArr<T extends { id: number }>(section: string) {
  return {
    get:    ()                            => apiFetch<T[]>(`/homepage-cms/${section}`),
    create: (d: Record<string, unknown>)  => apiFetch<T>(`/homepage-cms/${section}`,      { method: "POST",   body: JSON.stringify(d) }),
    update: (id: number, d: Partial<T>)  => apiFetch<T>(`/homepage-cms/${section}/${id}`, { method: "PUT",    body: JSON.stringify(d) }),
    remove: (id: number)                 => apiFetch<{ deleted: number }>(`/homepage-cms/${section}/${id}`, { method: "DELETE" }),
  };
}

export const cmsTrust        = makeCmsArr<CmsTrustItem>("trust");
export const cmsWhyUs        = makeCmsArr<CmsWhyUs>("why-us");
export const cmsSteps        = makeCmsArr<CmsStep>("steps");
export const cmsTestimonials = makeCmsArr<CmsTestimonial>("testimonials");
export const cmsFaqs         = makeCmsArr<CmsFaq>("faqs");
