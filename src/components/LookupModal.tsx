import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LookupResult {
  id: string;
  customerName: string;
  status: string;
  vehicleCategoryLabel: string;
  vehicleDetails: string;
  serviceLocation: string;
  preferredDate: string;
  preferredTime: string;
  selectedAddons: Array<{ name: string; price: number }>;
  estimatedTotal: number | null;
  isQuoteRequired: boolean;
  createdAt: string;
}

export const LookupModal: React.FC<LookupModalProps> = ({ isOpen, onClose }) => {
  const [bookingId, setBookingId] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LookupResult | null>(null);

  if (!isOpen) return null;

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!bookingId.trim()) {
      setError('Please provide your Booking Reference ID (e.g. GCB-...).');
      return;
    }

    if (phoneLast4.trim().length !== 4) {
      setError('Please enter the last 4 digits of the phone number used when booking.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/bookings/lookup?id=${encodeURIComponent(bookingId.trim())}&last4=${encodeURIComponent(phoneLast4.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Booking lookup failed.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Booking reference or phone match not found.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#171615] border border-[#38332E] max-w-lg w-full rounded-sm p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#B6B0A6] hover:text-[#C69A72] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-sm bg-[#101010] border border-[#38332E] flex items-center justify-center text-[#C69A72]">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#C69A72]">Status Verification</span>
            <h3 className="font-editorial text-2xl font-bold text-[#F3EFE7]">Track Your Booking</h3>
          </div>
        </div>

        <form onSubmit={handleLookup} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-1.5">
              Booking Reference ID
            </label>
            <input
              type="text"
              required
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value.toUpperCase())}
              placeholder="e.g. GCB-7X2A-94BF"
              className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] px-4 py-2.5 text-sm rounded-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-1.5">
              Last 4 Digits of Phone Number
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g. 1044"
              className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] px-4 py-2.5 text-sm rounded-sm font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#762B35]/30 border border-[#762B35] rounded-sm text-xs text-[#F3EFE7] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#C69A72] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-champagne-sweep py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] disabled:opacity-50 rounded-sm transition-all"
          >
            {isLoading ? 'Checking Record...' : 'Verify Status'}
          </button>
        </form>

        {result && (
          <div className="pt-4 border-t border-[#38332E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#B6B0A6]">Booking Status:</span>
              <span className={`text-xs px-2.5 py-1 rounded-sm uppercase tracking-wider font-semibold ${
                result.status === 'completed'
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  : result.status === 'confirmed'
                  ? 'bg-[#C69A72]/20 text-[#C69A72] border border-[#C69A72]'
                  : 'bg-[#201E1B] text-[#F3EFE7] border border-[#38332E]'
              }`}>
                {result.status}
              </span>
            </div>

            <div className="bg-[#101010] p-4 rounded-sm border border-[#38332E] text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#B6B0A6]">Customer:</span>
                <span className="font-semibold text-[#F3EFE7]">{result.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B6B0A6]">Vehicle:</span>
                <span className="text-[#F3EFE7]">{result.vehicleDetails}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B6B0A6]">Date & Window:</span>
                <span className="text-[#F3EFE7]">{result.preferredDate} · {result.preferredTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#B6B0A6]">Location:</span>
                <span className="text-[#F3EFE7]">{result.serviceLocation}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#38332E]">
                <span className="text-[#B6B0A6]">Estimated Total:</span>
                <span className="font-bold text-[#C69A72]">
                  {result.isQuoteRequired ? 'Custom Quote' : `$${result.estimatedTotal}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
