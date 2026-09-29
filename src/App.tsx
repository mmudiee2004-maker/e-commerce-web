import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminInventoryPage from '@/pages/admin/AdminInventoryPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <Routes>
            {/* Storefront */}
            <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
            <Route path="/shop" element={<StoreLayout><ShopPage /></StoreLayout>} />
            <Route path="/product/:id" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
            <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
            <Route path="/admin/inventory" element={<AdminLayout><AdminInventoryPage /></AdminLayout>} />
            <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
