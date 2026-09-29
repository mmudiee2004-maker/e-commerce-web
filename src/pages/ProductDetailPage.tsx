import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Check, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      setProduct(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-stone-100" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-6 w-1/4 animate-pulse rounded bg-stone-100" />
            <div className="h-32 w-full animate-pulse rounded bg-stone-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-stone-900">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-stone-600 hover:text-stone-900">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-stone-500">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-stone-900">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-stone-900">{product.name}</span>
      </nav>

      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wide text-amber-600">
            {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold text-stone-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-stone-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm text-stone-600">
                  In stock — {product.stock} available
                </span>
              </>
            ) : (
              <span className="text-sm text-red-600">Currently sold out</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-stone-200 px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" strokeWidth={1.5} /> Add to Cart
                  </>
                )}
              </button>
            </>
          )}

          <div className="mt-10 border-t border-stone-200 pt-6">
            <h3 className="text-sm font-semibold text-stone-900">Shipping & Returns</h3>
            <p className="mt-2 text-sm text-stone-500">
              Free shipping on orders over $75. Standard delivery in 5-7 business days.
              Returns accepted within 30 days in original condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
