import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Phone, MessageSquare, Check, RefreshCw, AlertCircle, Mail, Send, Eye } from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  vehicleCategoryLabel: string;
  vehicleDetails: string;
  selectedAddons: Array<{ id: string; name: string; price: number }>;
  basePrice: number | null;
  estimatedTotal: number | null;
  isQuoteRequired: boolean;
  serviceLocation: string;
  preferredDate: string;
  preferredTime: string;
  customerNotes: string;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
  notificationStatus: 'sent' | 'failed' | 'pending_configuration';
  notificationDetails: string;
  createdAt: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadBookings(token);
    }
  }, [isAuthenticated, token]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setIsAuthenticated(true);
      setToken(data.token);
    } catch (err: any) {
      setAuthError(err.message || 'Incorrect owner PIN.');
    }
  };

  const loadBookings = async (authToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionNotice(`Booking ${bookingId} updated to ${newStatus}.`);
        loadBookings(token);
        setTimeout(() => setActionNotice(null), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResendNotification = async (bookingId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/resend-notification`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setActionNotice(data.result?.message || 'Notification check triggered.');
      loadBookings(token);
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestEmailConfig = async () => {
    if (!token) return;
    setIsTestingEmail(true);
    setActionNotice(null);
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.delivered) {
        setActionNotice(`Success! Test email was delivered via Resend to ${data.target}`);
      } else {
        setActionNotice(`Notice: ${data.message || data.error || 'Check environment variables.'}`);
      }
    } catch (err: any) {
      setActionNotice(`Email test error: ${err.message}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-[#171615] border border-[#38332E] max-w-5xl w-full rounded-sm p-6 sm:p-8 shadow-2xl my-auto text-[#F3EFE7] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#B6B0A6] hover:text-[#C69A72] transition-colors"
          aria-label="Close owner portal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto py-8 text-center">
            <div className="w-12 h-12 rounded-sm bg-[#101010] border border-[#C69A72] mx-auto flex items-center justify-center text-[#C69A72] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#F3EFE7] mb-2">Owner Portal Login</h3>
            <p className="text-xs text-[#B6B0A6] mb-6">
              Enter your secure business access PIN to manage incoming mobile detailing bookings and customer dispatches.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-1.5">
                  Owner Admin PIN
                </label>
                <input
                  type="password"
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN (Default: contreras2026)"
                  className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] px-4 py-3 text-sm rounded-sm font-mono text-center tracking-widest"
                />
              </div>

              {authError && (
                <p className="text-xs text-[#C69A72] bg-[#762B35]/30 p-2.5 rounded-sm border border-[#762B35]">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full btn-champagne-sweep py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#38332E] shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#C69A72]">
                    Verified Dispatch Console
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#F3EFE7]">
                  G Contreras Detailing Bookings
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleTestEmailConfig}
                  disabled={isTestingEmail}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-[#201E1B] border border-[#38332E] hover:border-[#C69A72] text-[#F3EFE7] rounded-sm transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#C69A72]" />
                  <span>{isTestingEmail ? 'Testing...' : 'Test Email Service'}</span>
                </button>
                <button
                  onClick={() => token && loadBookings(token)}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-2 bg-[#201E1B] border border-[#38332E] hover:border-[#C69A72] text-[#F3EFE7] rounded-sm transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#C69A72] ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Bar */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4 shrink-0">
                <div className="bg-[#101010] p-3 rounded-sm border border-[#38332E]">
                  <span className="text-[11px] text-[#B6B0A6] uppercase tracking-wider block">Total Inquiries</span>
                  <span className="text-lg font-bold font-mono text-[#F3EFE7]">{stats.total}</span>
                </div>
                <div className="bg-[#101010] p-3 rounded-sm border border-[#38332E]">
                  <span className="text-[11px] text-[#B6B0A6] uppercase tracking-wider block">New / Uncontacted</span>
                  <span className="text-lg font-bold font-mono text-[#C69A72]">{stats.new}</span>
                </div>
                <div className="bg-[#101010] p-3 rounded-sm border border-[#38332E]">
                  <span className="text-[11px] text-[#B6B0A6] uppercase tracking-wider block">Contacted</span>
                  <span className="text-lg font-bold font-mono text-[#F3EFE7]">{stats.contacted}</span>
                </div>
                <div className="bg-[#101010] p-3 rounded-sm border border-[#38332E]">
                  <span className="text-[11px] text-[#B6B0A6] uppercase tracking-wider block">Confirmed</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{stats.confirmed}</span>
                </div>
                <div className="bg-[#101010] p-3 rounded-sm border border-[#38332E]">
                  <span className="text-[11px] text-[#B6B0A6] uppercase tracking-wider block">Completed</span>
                  <span className="text-lg font-bold font-mono text-slate-300">{stats.completed}</span>
                </div>
              </div>
            )}

            {/* Action Alert Banner */}
            {actionNotice && (
              <div className="p-3 mb-4 bg-[#201E1B] border border-[#C69A72] text-xs text-[#F3EFE7] rounded-sm shrink-0 flex items-center justify-between">
                <span>{actionNotice}</span>
                <button onClick={() => setActionNotice(null)} className="text-[#B6B0A6] hover:text-[#F3EFE7]">
                  ✕
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mb-4 border-b border-[#38332E] pb-2 shrink-0 overflow-x-auto">
              {['all', 'new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`text-xs px-3 py-1.5 rounded-sm capitalize transition-colors ${
                    filter === tab
                      ? 'bg-[#C69A72] text-[#101010] font-semibold'
                      : 'text-[#B6B0A6] hover:text-[#F3EFE7] hover:bg-[#201E1B]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Bookings List Table / Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-12 text-[#B6B0A6] text-sm">
                  No bookings found matching "{filter}".
                </div>
              ) : (
                filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-[#201E1B] border border-[#38332E] p-4 sm:p-5 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#C69A72] bg-[#101010] px-2 py-0.5 rounded-sm border border-[#38332E]">
                          {b.id}
                        </span>
                        <span className="text-sm font-bold text-[#F3EFE7]">{b.customerName}</span>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-sm ${
                            b.status === 'new'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                              : b.status === 'confirmed'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : b.status === 'completed'
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-[#101010] text-[#B6B0A6]'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-[11px] text-[#B6B0A6] font-mono">
                          {new Date(b.createdAt).toLocaleDateString()} at {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-[#B6B0A6]">
                        <div>
                          <span className="text-[#F3EFE7] font-semibold">Vehicle: </span>
                          <span>{b.vehicleDetails} ({b.vehicleCategoryLabel})</span>
                        </div>
                        <div>
                          <span className="text-[#F3EFE7] font-semibold">Appointment: </span>
                          <span>{b.preferredDate} · {b.preferredTime}</span>
                        </div>
                        <div>
                          <span className="text-[#F3EFE7] font-semibold">Location: </span>
                          <span>{b.serviceLocation}</span>
                        </div>
                      </div>

                      {b.selectedAddons.length > 0 && (
                        <div className="text-xs text-[#B6B0A6]">
                          <span className="text-[#C69A72] font-semibold">Add-ons: </span>
                          <span>{b.selectedAddons.map((a) => `${a.name} (+$${a.price})`).join(', ')}</span>
                        </div>
                      )}

                      {b.customerNotes && (
                        <div className="text-xs text-[#F3EFE7]/80 bg-[#101010] p-2 rounded-sm border border-[#38332E]/60 italic">
                          "{b.customerNotes}"
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs pt-1">
                        <span className="text-[#B6B0A6]">Total:</span>
                        <span className="font-editorial text-base font-bold text-[#C69A72]">
                          {b.isQuoteRequired ? 'Custom Quote' : `$${b.estimatedTotal}`}
                        </span>
                        <span className="text-[#38332E]">·</span>
                        <span className="text-[11px] text-[#B6B0A6]">
                          Email: {b.notificationStatus === 'sent' ? 'Delivered' : 'Pending Key'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Buttons for Owner */}
                    <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#38332E]">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${b.phone.replace(/\D/g, '')}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-[#C69A72] text-[#101010] font-semibold rounded-sm hover:bg-[#d6aa82] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call ({b.phone})</span>
                        </a>

                        <a
                          href={`sms:${b.phone.replace(/\D/g, '')}`}
                          className="inline-flex items-center justify-center text-xs px-3 py-2 bg-[#171615] text-[#F3EFE7] border border-[#38332E] hover:border-[#C69A72] rounded-sm transition-colors"
                          title="Text customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#C69A72]" />
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className="bg-[#101010] border border-[#38332E] text-xs text-[#F3EFE7] px-2 py-1.5 rounded-sm"
                        >
                          <option value="new">Mark New</option>
                          <option value="contacted">Mark Contacted</option>
                          <option value="confirmed">Mark Confirmed</option>
                          <option value="completed">Mark Completed</option>
                          <option value="cancelled">Mark Cancelled</option>
                        </select>

                        <button
                          onClick={() => handleResendNotification(b.id)}
                          className="p-1.5 bg-[#171615] hover:bg-[#101010] border border-[#38332E] rounded-sm text-[#B6B0A6] hover:text-[#C69A72]"
                          title="Retry Notification"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
