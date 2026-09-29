import { Link } from 'react-router-dom';
import { Store, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-stone-800" strokeWidth={1.5} />
              <span className="text-lg font-semibold text-stone-900">
                CraftCart
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-stone-500">
              A curated marketplace for premium artisanal goods. Every piece is
              handcrafted by independent makers and built to last a lifetime.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><Link to="/shop" className="hover:text-stone-900">All Products</Link></li>
              <li><Link to="/shop?category=Leather" className="hover:text-stone-900">Leather Goods</Link></li>
              <li><Link to="/shop?category=Coffee" className="hover:text-stone-900">Specialty Coffee</Link></li>
              <li><Link to="/shop?category=Ceramics" className="hover:text-stone-900">Ceramics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-stone-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-stone-500">
              <li><a href="#" className="hover:text-stone-900">About Us</a></li>
              <li><a href="#" className="hover:text-stone-900">Our Makers</a></li>
              <li><Link to="/admin" className="hover:text-stone-900">Admin Portal</Link></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a href="#" className="text-stone-400 hover:text-stone-900" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-stone-900" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="text-stone-400 hover:text-stone-900" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-stone-200 pt-6 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} CraftCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
