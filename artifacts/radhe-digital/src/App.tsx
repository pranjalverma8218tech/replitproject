import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

import HomePage from "@/pages/HomePage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryPage from "@/pages/CategoryPage";
import CustomizePage from "@/pages/CustomizePage";
import CustomizeCategoryPage from "@/pages/CustomizeCategoryPage";
import CustomizeProductPage from "@/pages/CustomizeProductPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/not-found";

import { AdminProvider } from "@/admin/AdminContext";
import AdminLogin from "@/admin/AdminLogin";
import AdminLayout from "@/admin/AdminLayout";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminProducts from "@/admin/AdminProducts";
import AdminCustomizeProducts from "@/admin/AdminCustomizeProducts";
import AdminOrders from "@/admin/AdminOrders";
import AdminCustomers from "@/admin/AdminCustomers";
import AdminWhatsApp from "@/admin/AdminWhatsApp";
import AdminSettings from "@/admin/AdminSettings";
import AdminHomepageCategories from "@/admin/AdminHomepageCategories";
import AdminHomepageCms from "@/admin/AdminHomepageCms";
import AdminGallery from "@/admin/AdminGallery";
import { useAdmin } from "@/admin/AdminContext";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}

function AdminRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/admin/login"); }, []);
  return null;
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdmin();
  const [, navigate] = useLocation();
  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated]);
  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard">
        <AdminProtectedRoute>
          <AdminLayout><AdminDashboard /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/products">
        <AdminProtectedRoute>
          <AdminLayout><AdminProducts /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/customize-products">
        <AdminProtectedRoute>
          <AdminLayout><AdminCustomizeProducts /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/orders">
        <AdminProtectedRoute>
          <AdminLayout><AdminOrders /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/customers">
        <AdminProtectedRoute>
          <AdminLayout><AdminCustomers /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/whatsapp-orders">
        <AdminProtectedRoute>
          <AdminLayout><AdminWhatsApp /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/settings">
        <AdminProtectedRoute>
          <AdminLayout><AdminSettings /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/homepage-categories">
        <AdminProtectedRoute>
          <AdminLayout><AdminHomepageCategories /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/homepage-cms">
        <AdminProtectedRoute>
          <AdminLayout><AdminHomepageCms /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin/gallery">
        <AdminProtectedRoute>
          <AdminLayout><AdminGallery /></AdminLayout>
        </AdminProtectedRoute>
      </Route>
      <Route path="/admin" component={AdminRedirect} />
    </Switch>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/categories" component={CategoriesPage} />
      <Route path="/categories/:slug/:productId" component={ProductDetailPage} />
      <Route path="/categories/:slug" component={CategoryPage} />
      <Route path="/customize" component={CustomizePage} />
      <Route path="/customize/:category/:productSlug" component={CustomizeProductPage} />
      <Route path="/customize/:category" component={CustomizeCategoryPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return <AdminRouter />;
  }

  return (
    <LanguageProvider>
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden w-full">
        <Navbar />
        <main className="flex-1 w-full pt-[58px] sm:pt-[82px]">
          <PublicRouter />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
      <CartDrawer />
    </CartProvider>
    </LanguageProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <AppContent />
          </WouterRouter>
        </AdminProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
