import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import type { OrderItem } from '@/types';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    country: 'United States',
  });

  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setError(null);

    const orderItems: OrderItem[] = items.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const { error: insertError } = await supabase.from('orders').insert({
      ...form,
      total_amount: total,
      status: 'Pending',
      items: orderItems,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <Check className="h-10 w-10 text-green-600" strokeWidth={2} />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-stone-900">Order Placed!</h1>
        <p className="mt-3 text-stone-600">
          Thank you for your order. We'll send a confirmation email to{' '}
          <span className="font-medium text-stone-900">{form.customer_email}</span>{' '}
          shortly with shipping details.
        </p>
        <Link
          to="/shop"
          className="mt-8 rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white hover:bg-stone-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-stone-900">Your cart is empty</h1>
        <p className="mt-3 text-stone-600">Add some products before checking out.</p>
        <Link
          to="/shop"
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>

      <h1 className="text-3xl font-bold text-stone-900">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Shipping Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" required value={form.customer_name}
                onChange={(v) => setForm({ ...form, customer_name: v })} />
              <Field label="Email" required type="email" value={form.customer_email}
                onChange={(v) => setForm({ ...form, customer_email: v })} />
              <div className="sm:col-span-2">
                <Field label="Street Address" required value={form.shipping_address}
                  onChange={(v) => setForm({ ...form, shipping_address: v })} />
              </div>
              <Field label="City" required value={form.city}
                onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="Postal Code" required value={form.postal_code}
                onChange={(v) => setForm({ ...form, postal_code: v })} />
              <div className="sm:col-span-2">
                <Field label="Country" required value={form.country}
                  onChange={(v) => setForm({ ...form, country: v })} />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Placing Order...
              </>
            ) : (
              `Place Order — ${formatPrice(total)}`
            )}
          </button>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
            <h2 className="text-lg font-semibold text-stone-900">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium text-stone-900">{item.product.name}</span>
                    <span className="text-xs text-stone-500">Qty: {item.quantity}</span>
                    <span className="text-sm font-semibold text-stone-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-stone-200 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Subtotal</span>
                <span className="font-medium text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Shipping</span>
                <span className="font-medium text-stone-900">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2">
                <span className="text-base font-semibold text-stone-900">Total</span>
                <span className="text-base font-bold text-stone-900">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
      />
    </div>
  );
}
