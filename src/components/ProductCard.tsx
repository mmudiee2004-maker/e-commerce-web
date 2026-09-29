import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-all hover:shadow-lg">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-stone-100">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {product.stock === 0 && (
        <span className="absolute left-3 top-3 rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-white">
          Sold Out
        </span>
      )}
      {product.featured && product.stock > 0 && (
        <span className="absolute left-3 top-3 rounded-full bg-amber-600 px-3 py-1 text-xs font-medium text-white">
          Featured
        </span>
      )}

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 text-base font-semibold text-stone-900 hover:text-stone-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-stone-500">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="flex items-center gap-1 rounded-full bg-stone-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
