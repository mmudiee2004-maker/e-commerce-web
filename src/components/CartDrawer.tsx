import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
  } = useCart();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 transition-opacity"
          onClick={closeCart}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-stone-800" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-stone-900">
              Your Cart ({itemCount})
            </h2>
          </div>
          <button onClick={closeCart} aria-label="Close cart">
            <X className="h-5 w-5 text-stone-600 hover:text-stone-900" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-12 w-12 text-stone-300" strokeWidth={1} />
            <p className="text-center text-stone-500">
              Your cart is empty. Start exploring our collection.
            </p>
            <Link
              to="/shop"
              onClick={closeCart}
              className="rounded-full bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 border-b border-stone-100 py-4 last:border-0"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-stone-900">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-stone-400 hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-xs text-stone-400">
                      {item.product.category}
                    </span>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-stone-600">Subtotal</span>
                <span className="text-xl font-bold text-stone-900">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mb-3 text-xs text-stone-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full rounded-full bg-stone-900 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-stone-700"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="mt-2 block w-full py-2 text-center text-sm text-stone-500 hover:text-stone-900"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
