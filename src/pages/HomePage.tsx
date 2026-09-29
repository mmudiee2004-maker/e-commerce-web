import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Hammer } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [latest, setLatest] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: f } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      const { data: l } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      setFeatured(f ?? []);
      setLatest(l ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4452379/pexels-photo-4452379.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="Artisanal craftsmanship"
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-500">
              Handcrafted. Small-batch. Built to last.
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Premium goods from independent makers
            </h1>
            <p className="mt-6 text-lg text-stone-300">
              Discover a curated collection of artisanal leather, specialty
              coffee, hand-thrown ceramics, and more — each piece made with
              intention by craftspeople who care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100"
              >
                Shop the Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop?category=Leather"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Explore Leather Goods
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { icon: Hammer, title: 'Handcrafted', desc: 'Each item made by hand in small batches' },
            { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $75 within the US' },
            { icon: ShieldCheck, title: 'Lifetime Guarantee', desc: 'We stand behind every piece we sell' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100">
                <item.icon className="h-6 w-6 text-stone-700" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">Featured Products</h2>
            <p className="mt-2 text-stone-500">Our hand-picked favorites this season</p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-100" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category showcase */}
      <section className="bg-stone-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">Shop by Category</h2>
          <p className="mt-2 text-center text-stone-500">Find exactly what you're looking for</p>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { name: 'Leather', img: 'https://images.pexels.com/photos/4452382/pexels-photo-4452382.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Coffee', img: 'https://images.pexels.com/photos/5926957/pexels-photo-5926957.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Ceramics', img: 'https://images.pexels.com/photos/3187013/pexels-photo-3187013.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Candles', img: 'https://images.pexels.com/photos/7234498/pexels-photo-7234498.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
              { name: 'Woodwork', img: 'https://images.pexels.com/photos/18877529/pexels-photo-18877529.jpeg?auto=compress&cs=tinysrgb&h=400&w=400' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="text-lg font-semibold text-white">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">New Arrivals</h2>
        <p className="mt-2 text-stone-500">Fresh from the workshop</p>
        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-100" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
