import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/format';
import type { Order } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    revenue: 0,
    pending: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'Pending');

      const revenue = (orders ?? []).reduce(
        (sum, o) => sum + Number(o.total_amount),
        0
      );
      // For total revenue, fetch all orders
      const { data: allOrders } = await supabase
        .from('orders')
        .select('total_amount');

      const totalRevenue = (allOrders ?? []).reduce(
        (sum, o) => sum + Number(o.total_amount),
        0
      );

      setStats({
        productCount: productCount ?? 0,
        orderCount: orderCount ?? 0,
        revenue: totalRevenue,
        pending: pendingOrders?.length ?? 0,
      });
      setRecentOrders(orders ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.productCount, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Orders', value: stats.orderCount, icon: ShoppingCart, color: 'bg-amber-50 text-amber-600' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">Welcome back to your store overview</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-8 rounded-xl border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-stone-900">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-stone-400">Loading...</div>
        ) : recentOrders.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-stone-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-50 last:border-0">
                    <td className="px-6 py-3">
                      <div className="font-medium text-stone-900">{order.customer_name}</div>
                      <div className="text-xs text-stone-400">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-3 text-stone-600">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-stone-900">
                      {formatPrice(Number(order.total_amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: 'bg-amber-100 text-amber-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? 'bg-stone-100 text-stone-600'}`}>
      {status}
    </span>
  );
}
