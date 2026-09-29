import { useEffect, useState } from 'react';
import { Loader2, ShoppingCart, X, MapPin, Mail, User, Package } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Order, OrderStatus } from '@/types';
import { ORDER_STATUSES } from '@/types';
import { formatPrice, formatDate } from '@/lib/format';

const statusColors: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    setOrders(data ?? []);
    setLoading(false);
  }

  const filtered = orders.filter(
    (o) => statusFilter === 'All' || o.status === statusFilter
  );

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      alert(error.message);
      setUpdating(null);
      return;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
    setUpdating(null);
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-stone-900">Order Management</h1>
      <p className="mt-1 text-sm text-stone-500">View and manage customer orders</p>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {(['All', ...ORDER_STATUSES] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {status}
            {status !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({orders.filter((o) => o.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="mt-6 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <ShoppingCart className="h-10 w-10 mb-2" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 text-center font-medium">Items</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-stone-900">{order.customer_name}</div>
                      <div className="text-xs text-stone-400">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-center text-stone-600">
                      {order.items?.length ?? 0}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900">
                      {formatPrice(Number(order.total_amount))}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updating === order.id}
                        className={`rounded-full border-0 px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-400 ${statusColors[order.status]}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-stone-900">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Status */}
              <div className="flex items-center justify-between rounded-lg bg-stone-50 px-4 py-3">
                <span className="text-sm text-stone-600">Order Status</span>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Customer info */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-stone-900">Customer</h3>
                <div className="mt-3 space-y-2 text-sm text-stone-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-stone-400" />
                    {selectedOrder.customer_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-stone-400" />
                    {selectedOrder.customer_email}
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-stone-900">Shipping Address</h3>
                <div className="mt-3 flex gap-2 text-sm text-stone-600">
                  <MapPin className="h-4 w-4 shrink-0 text-stone-400" />
                  <div>
                    <p>{selectedOrder.shipping_address}</p>
                    <p>{selectedOrder.city}, {selectedOrder.postal_code}</p>
                    <p>{selectedOrder.country}</p>
                  </div>
                </div>
              </div>

              {/* Order items */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-stone-900">Items</h3>
                <div className="mt-3 space-y-3">
                  {(selectedOrder.items ?? []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border border-stone-100 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-stone-400" />
                        <div>
                          <span className="text-sm font-medium text-stone-900">{item.name}</span>
                          <span className="ml-2 text-xs text-stone-400">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-900">Order Total</span>
                  <span className="text-xl font-bold text-stone-900">
                    {formatPrice(Number(selectedOrder.total_amount))}
                  </span>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  Placed on {formatDate(selectedOrder.created_at)}
                </p>
              </div>
            </div>

            {/* Status update */}
            <div className="border-t border-stone-200 px-5 py-4">
              <label className="block text-sm font-medium text-stone-700">Update Status</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {ORDER_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedOrder.id, status)}
                    disabled={updating === selectedOrder.id || selectedOrder.status === status}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedOrder.status === status
                        ? statusColors[status] + ' ring-2 ring-stone-400'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
