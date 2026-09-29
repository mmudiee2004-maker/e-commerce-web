import { type ReactNode } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Store,
  Package,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { session, loading, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin" replace />;

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/admin/inventory', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="flex items-center gap-2 border-b border-stone-200 px-6 py-5">
          <Store className="h-6 w-6 text-stone-800" strokeWidth={1.5} />
          <div>
            <span className="block text-sm font-bold text-stone-900">CraftCart</span>
            <span className="block text-xs text-stone-400">Admin Portal</span>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-stone-200 p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            <Store className="h-4 w-4" strokeWidth={1.5} />
            View Store
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="fixed inset-x-0 top-0 z-30 border-b border-stone-200 bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-stone-800" strokeWidth={1.5} />
            <span className="text-sm font-bold text-stone-900">CraftCart Admin</span>
          </div>
          <button onClick={handleSignOut} className="text-stone-600">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex gap-1 px-4 pb-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  active ? 'bg-stone-900 text-white' : 'text-stone-600'
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:pl-64">
        <div className="pt-20 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
