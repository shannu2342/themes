import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import DashboardHome from "./pages/admin/DashboardHome";
import ProductsManagement from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminSetup from "./pages/admin/Setup";
import AdminRouteProtection from "@/components/admin/AdminRouteProtection";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Help from "./pages/Help";
import Blog from "./pages/Blog";
import Code from "./pages/Code";
import Video from "./pages/Video";
import Audio from "./pages/Audio";
import Graphics from "./pages/Graphics";
import Photos from "./pages/Photos";
import Files3D from "./pages/Files3D";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/cancel" element={<Cancel />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* New Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<Help />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/code" element={<Code />} />
              <Route path="/video" element={<Video />} />
              <Route path="/audio" element={<Audio />} />
              <Route path="/graphics" element={<Graphics />} />
              <Route path="/photos" element={<Photos />} />
              <Route path="/3d-files" element={<Files3D />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/setup" element={<AdminSetup />} />
              <Route path="/admin/*" element={
                <AdminRouteProtection>
                  <Routes>
                    <Route path="/" element={<AdminDashboard><DashboardHome /></AdminDashboard>} />
                    <Route path="dashboard" element={<AdminDashboard><DashboardHome /></AdminDashboard>} />
                    <Route path="products" element={<AdminDashboard><ProductsManagement /></AdminDashboard>} />
                    <Route path="categories" element={<AdminDashboard><AdminCategories /></AdminDashboard>} />
                    <Route path="orders" element={<AdminDashboard><AdminOrders /></AdminDashboard>} />
                    <Route path="users" element={<AdminDashboard><AdminUsers /></AdminDashboard>} />
                    <Route path="settings" element={<AdminDashboard><div>Settings (Coming Soon)</div></AdminDashboard>} />
                  </Routes>
                </AdminRouteProtection>
              } />
              
              <Route path="/admin" element={<Admin />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
