import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { CATEGORIES } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? 'All';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }

      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else {
        query = query.order('price', { ascending: false });
      }

      const { data } = await query;
      setProducts(data ?? []);
      setLoading(false);
    }
    load();
  }, [selectedCategory, sortBy]);

  const setCategory = (cat: string) => {
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Shop All Products</h1>
        <p className="mt-2 text-stone-500">
          {selectedCategory === 'All'
            ? 'Browse our full collection of handcrafted goods'
            : `Explore our ${selectedCategory.toLowerCase()} collection`}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters */}
        <aside className="lg:w-56 lg:shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-900">Categories</h3>
            <ul className="mt-3 space-y-1">
              <li>
                <button
                  onClick={() => setCategory('All')}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedCategory === 'All'
                      ? 'bg-stone-900 font-medium text-white'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  All Products
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setCategory(cat)}
                    className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-stone-900 font-medium text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-stone-500">
              {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 focus:border-stone-400 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 py-20">
              <p className="text-stone-500">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
