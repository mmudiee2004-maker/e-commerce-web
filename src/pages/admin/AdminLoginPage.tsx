import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Store, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminLoginPage() {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (session) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-900">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-1 text-sm text-stone-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>

          <div className="rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-900">
                <Store className="h-7 w-7 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-stone-900">CraftCart Admin</h1>
              <p className="mt-1 text-sm text-stone-500">Sign in to manage your store</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@craftcart.shop"
                    className="block w-full rounded-md border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-stone-200 bg-white py-2.5 pl-10 pr-3 text-sm text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-700 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 rounded-md bg-stone-50 px-4 py-3 text-xs text-stone-500">
              <p className="font-medium text-stone-600">Demo credentials:</p>
              <p className="mt-1">Email: admin@craftcart.shop</p>
              <p>Password: CraftCart2025!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
