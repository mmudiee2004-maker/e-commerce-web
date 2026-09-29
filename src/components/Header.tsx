import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { itemCount, openCart } = useCart();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop All', path: '/shop' },
    { label: 'Leather', path: '/shop?category=Leather' },
    { label: 'Coffee', path: '/shop?category=Coffee' },
    { label: 'Ceramics', path: '/shop?category=Ceramics' },
    { label: 'Candles', path: '/shop?category=Candles' },
    { label: 'Woodwork', path: '/shop?category=Woodwork' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Store className="h-7 w-7 text-stone-800" strokeWidth={1.5} />
            <span className="text-xl font-semibold tracking-tight text-stone-900">
              CraftCart
            </span>
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="hidden text-sm font-medium text-stone-500 transition-colors hover:text-stone-900 sm:inline"
          >
            Admin
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-stone-800" />
            ) : (
              <Menu className="h-6 w-6 text-stone-800" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-stone-200 lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  location.pathname + location.search === link.path
                    ? 'text-stone-900'
                    : 'text-stone-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-sm font-medium text-stone-600"
            >
              Admin
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
