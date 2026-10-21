import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Car, Phone, Mail, User, CheckCircle2, AlertCircle, Send, Copy, Check, MessageSquare } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface BookingFormProps {
  selectedCategory: string;
  selectedAddonIds: string[];
  onCategoryChange: (categoryId: string) => void;
  onToggleAddon: (addonId: string) => void;
}

interface SubmittedReceipt {
  bookingId: string;
  estimatedTotal: number | null;
  isQuoteRequired: boolean;
  customerName: string;
  phone: string;
  email: string;
  vehicleCategoryLabel: string;
  vehicleDetails: string;
  serviceLocation: string;
  preferredDate: string;
  preferredTime: string;
  addonsList: string[];
  customerNotes: string;
  submittedAt: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedCategory,
  selectedAddonIds,
  onCategoryChange,
  onToggleAddon,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (8:00 AM – 11:00 AM)');
  const [customerNotes, setCustomerNotes] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<SubmittedReceipt | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const currentCategory =
    BUSINESS_CONFIG.vehicleCategories.find((c) => c.id === selectedCategory) ||
    BUSINESS_CONFIG.vehicleCategories[0];

  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const addon = BUSINESS_CONFIG.addons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const isQuoteRequired = currentCategory.isQuoteRequired || currentCategory.basePrice === null;
  const estimatedTotal = isQuoteRequired ? null : (currentCategory.basePrice || 0) + addonsTotal;

  // Phone input formatting helper
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    let formatted = raw;
    if (raw.length > 6) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
    } else if (raw.length > 3) {
      formatted = `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    } else if (raw.length > 0) {
      formatted = `(${raw}`;
    }
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number so we can confirm your detail.');
      return;
    }

    if (!vehicleDetails.trim()) {
      setErrorMessage('Please provide your vehicle make and model (e.g. 2022 Chevy Silverado).');
      return;
    }

    if (!serviceLocation.trim()) {
      setErrorMessage('Please provide your service address or cross streets in Bakersfield, Shafter, or Wasco.');
      return;
    }

    if (!preferredDate) {
      setErrorMessage('Please choose your preferred appointment date.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate clean unique booking ID purely on client
      const stamp = Date.now().toString(36).toUpperCase().slice(-4);
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
      const bookingId = `GCB-${stamp}-${rand}`;

      const chosenAddons = selectedAddonIds
        .map((id) => BUSINESS_CONFIG.addons.find((a) => a.id === id)?.name)
        .filter(Boolean) as string[];

      const newReceipt: SubmittedReceipt = {
        bookingId,
        estimatedTotal,
        isQuoteRequired,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        vehicleCategoryLabel: currentCategory.name,
        vehicleDetails: vehicleDetails.trim(),
        serviceLocation: serviceLocation.trim(),
        preferredDate,
        preferredTime,
        addonsList: chosenAddons,
        customerNotes: customerNotes.trim(),
        submittedAt: new Date().toISOString(),
      };

      // Save locally to browser storage for client demo / history
      try {
        const stored = JSON.parse(localStorage.getItem('gcontreras_bookings') || '[]');
        stored.unshift(newReceipt);
        localStorage.setItem('gcontreras_bookings', JSON.stringify(stored));
      } catch {
        // Ignore localStorage errors if cookies disabled
      }

      setReceipt(newReceipt);
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred. Please call (661) 692-1044 directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(receipt.bookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Generate WhatsApp pre-filled draft
  const getWhatsAppUrl = () => {
    if (!receipt) return '#';
    const text = encodeURIComponent(
      `Hello G Contreras Car Wash! I am requesting a mobile detailing appointment:\n\n` +
      `Booking Ref: ${receipt.bookingId}\n` +
      `Name: ${receipt.customerName}\n` +
      `Phone: ${receipt.phone}\n` +
      `Vehicle: ${receipt.vehicleDetails} (${receipt.vehicleCategoryLabel})\n` +
      `Date & Window: ${receipt.preferredDate} (${receipt.preferredTime})\n` +
      `Location: ${receipt.serviceLocation}\n` +
      `Add-ons: ${receipt.addonsList.join(', ') || 'None'}\n` +
      `Estimated Rate: ${receipt.isQuoteRequired ? 'Custom Quote' : `$${receipt.estimatedTotal}`}`
    );
    return `https://wa.me/16616921044?text=${text}`;
  };

  // Generate SMS draft link
  const getSmsUrl = () => {
    if (!receipt) return '#';
    const body = encodeURIComponent(
      `G Contreras Car Wash Booking (${receipt.bookingId}): ${receipt.customerName}, ${receipt.vehicleDetails}, ${receipt.preferredDate} at ${receipt.preferredTime}, ${receipt.serviceLocation}. Total: ${receipt.isQuoteRequired ? 'Quote' : `$${receipt.estimatedTotal}`}`
    );
    return `sms:16616921044?body=${body}`;
  };

  // Get minimum date (today)
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <section id="booking" className="py-24 bg-[#101010] border-b border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#C69A72]" />
            <span>Mobile Detailing Appointment</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3EFE7] tracking-tight mb-4">
            Book Your Detail
          </h2>
          <p className="text-sm sm:text-base text-[#B6B0A6]">
            Submit your vehicle information and preferred schedule below. We bring our mobile wash rig directly to your location in Bakersfield, Shafter, and Wasco.
          </p>
        </div>

        {receipt ? (
          /* Booking Confirmation Card */
          <div className="max-w-3xl mx-auto bg-[#171615] border border-[#C69A72] rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Subtle champagne ripple glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#C69A72]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#38332E]">
              <div className="w-12 h-12 rounded-sm bg-[#C69A72] text-[#101010] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#C69A72] font-semibold">
                  Booking Request Ready
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#F3EFE7]">
                  Thank You, {receipt.customerName}!
                </h3>
              </div>
            </div>

            {/* Reference Badge */}
            <div className="bg-[#201E1B] border border-[#38332E] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <span className="text-xs text-[#B6B0A6] uppercase tracking-wider block">Your Booking Reference</span>
                <span className="font-mono text-xl font-bold text-[#C69A72] tracking-wider">{receipt.bookingId}</span>
              </div>
              <button
                onClick={handleCopyId}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-[#171615] hover:bg-[#101010] text-[#F3EFE7] border border-[#38332E] rounded-sm transition-colors"
              >
                {copiedId ? <Check className="w-3.5 h-3.5 text-[#C69A72]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId ? 'Copied Reference' : 'Copy Reference'}</span>
              </button>
            </div>

            {/* Summary Details */}
            <div className="space-y-3 text-sm text-[#F3EFE7] mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#38332E]/60">
                <div>
                  <span className="text-xs text-[#B6B0A6] block">Vehicle:</span>
                  <span className="font-semibold">{receipt.vehicleDetails}</span> ({receipt.vehicleCategoryLabel})
                </div>
                <div>
                  <span className="text-xs text-[#B6B0A6] block">Contact Phone:</span>
                  <span className="font-semibold font-mono">{receipt.phone}</span>
                </div>
                <div>
                  <span className="text-xs text-[#B6B0A6] block">Requested Date & Window:</span>
                  <span className="font-semibold">{receipt.preferredDate}</span> · {receipt.preferredTime}
                </div>
                <div>
                  <span className="text-xs text-[#B6B0A6] block">Service Location:</span>
                  <span className="font-semibold">{receipt.serviceLocation}</span>
                </div>
              </div>

              {receipt.addonsList.length > 0 && (
                <div className="pb-4 border-b border-[#38332E]/60">
                  <span className="text-xs text-[#B6B0A6] block mb-1">Included Add-ons:</span>
                  <div className="flex flex-wrap gap-2">
                    {receipt.addonsList.map((addon) => (
                      <span key={addon} className="text-xs bg-[#201E1B] border border-[#38332E] px-2.5 py-1 rounded-sm text-[#C69A72]">
                        + {addon}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs uppercase tracking-wider text-[#B6B0A6]">Total Service Estimate:</span>
                <span className="font-editorial text-2xl font-bold text-[#C69A72]">
                  {receipt.isQuoteRequired ? 'Custom Quote Required' : `$${receipt.estimatedTotal}`}
                </span>
              </div>
            </div>

            {/* Direct Instant Dispatch Options for Client */}
            <div className="bg-[#101010] p-4 rounded-sm border border-[#38332E] text-xs text-[#B6B0A6] space-y-2 mb-8">
              <div className="flex items-center gap-2 text-[#F3EFE7] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#C69A72]" />
                <span>Next Step: Instant Confirmation Available</span>
              </div>
              <p>
                You can immediately dispatch this booking directly to our mobile team via WhatsApp or SMS, or call us directly. We will confirm your exact arrival time.
              </p>
            </div>

            {/* Actions for customer */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp to Business</span>
              </a>

              <a
                href={getSmsUrl()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-[#F3EFE7] bg-[#201E1B] border border-[#38332E] hover:border-[#C69A72] rounded-sm transition-all"
              >
                <span>Send SMS Text</span>
              </a>

              <a
                href={BUSINESS_CONFIG.telLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold text-[#F3EFE7] bg-[#201E1B] border border-[#38332E] hover:border-[#C69A72] rounded-sm transition-all"
              >
                <Phone className="w-4 h-4 text-[#C69A72]" />
                <span>Call ({BUSINESS_CONFIG.phone})</span>
              </a>

              <button
                onClick={() => setReceipt(null)}
                className="text-xs text-[#B6B0A6] hover:text-[#F3EFE7] py-2 sm:ml-auto underline"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          /* Actual Form */
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto bg-[#171615] border border-[#38332E] rounded-sm p-6 sm:p-10 shadow-xl"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-sm bg-[#762B35]/30 border border-[#762B35] text-xs text-[#F3EFE7] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#C69A72] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Booking Notice</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Full Name <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Gabriel Contreras"
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Phone Number <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(661) 000-0000"
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Email Address <span className="text-[#B6B0A6]/60 text-[10px] normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm transition-colors"
                  />
                </div>
              </div>

              {/* Vehicle Category Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Vehicle Category <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm appearance-none transition-colors"
                  >
                    {BUSINESS_CONFIG.vehicleCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.priceDisplay})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vehicle Make & Model Description */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Vehicle Make, Model & Color <span className="text-[#C69A72]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={vehicleDetails}
                  onChange={(e) => setVehicleDetails(e.target.value)}
                  placeholder="e.g. 2021 White Chevy Silverado 1500 Crew Cab"
                  className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] px-4 py-3 text-sm rounded-sm transition-colors"
                />
              </div>

              {/* Service Location / Address */}
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Mobile Service Address / Location <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <input
                    type="text"
                    required
                    value={serviceLocation}
                    onChange={(e) => setServiceLocation(e.target.value)}
                    placeholder="e.g. 1234 Olive Dr, Bakersfield, CA (Home driveway or workplace)"
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[#B6B0A6] mt-1">
                  Serving Bakersfield, Shafter, and Wasco, California.
                </p>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Preferred Date <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <input
                    type="date"
                    required
                    min={todayString}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm transition-colors"
                  />
                </div>
              </div>

              {/* Preferred Time Window */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                  Arrival Time Window <span className="text-[#C69A72]">*</span>
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B6B0A6]" />
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] pl-10 pr-4 py-3 text-sm rounded-sm appearance-none transition-colors"
                  >
                    <option value="Morning (8:00 AM – 11:00 AM)">Morning (8:00 AM – 11:00 AM)</option>
                    <option value="Midday (11:00 AM – 2:00 PM)">Midday (11:00 AM – 2:00 PM)</option>
                    <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                    <option value="Flexible All Day">Flexible Anytime on Selected Day</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Add-ons Checkboxes */}
            <div className="mb-8 pt-6 border-t border-[#38332E]">
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-3">
                Include Optional Add-on Services:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUSINESS_CONFIG.addons.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-start gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#201E1B] border-[#C69A72]'
                          : 'bg-[#101010] border-[#38332E] hover:border-[#C69A72]/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleAddon(addon.id)}
                        className="mt-0.5 accent-[#C69A72] w-4 h-4 rounded-sm"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#F3EFE7]">{addon.name}</span>
                          <span className="text-xs font-mono text-[#C69A72]">+${addon.price}</span>
                        </div>
                        <p className="text-[11px] text-[#B6B0A6] line-clamp-1">{addon.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#B6B0A6] mb-2">
                Additional Notes / Special Instructions <span className="text-[#B6B0A6]/60 text-[10px] normal-case">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Mention gate codes, heavy mud/sand, specific stains, or 5th wash promotion..."
                className="w-full bg-[#101010] border border-[#38332E] focus:border-[#C69A72] focus:outline-none text-[#F3EFE7] p-3 text-sm rounded-sm transition-colors resize-none"
              />
            </div>

            {/* Price Preview & Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-6 border-t border-[#38332E]">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#B6B0A6] block">
                  Estimated Total for {currentCategory.name}:
                </span>
                <span className="font-editorial text-3xl font-bold text-[#C69A72] tabular-nums">
                  {isQuoteRequired ? 'Custom Quote Required' : `$${estimatedTotal}`}
                </span>
                <span className="text-[11px] text-[#B6B0A6] block mt-0.5">
                  Final price confirmed upon vehicle review. No upfront payment required to book.
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-champagne-sweep inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] disabled:opacity-60 rounded-sm shadow-md transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Booking Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
