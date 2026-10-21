import React from 'react';
import { Plus, Check, ArrowRight, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface AddonsPricingProps {
  selectedCategory: string;
  selectedAddonIds: string[];
  onToggleAddon: (addonId: string) => void;
  onProceedToBooking: () => void;
}

export const AddonsPricing: React.FC<AddonsPricingProps> = ({
  selectedCategory,
  selectedAddonIds,
  onToggleAddon,
  onProceedToBooking,
}) => {
  const currentCategory =
    BUSINESS_CONFIG.vehicleCategories.find((c) => c.id === selectedCategory) ||
    BUSINESS_CONFIG.vehicleCategories[0];

  const addonsTotal = selectedAddonIds.reduce((sum, id) => {
    const addon = BUSINESS_CONFIG.addons.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const isQuoteRequired = currentCategory.isQuoteRequired || currentCategory.basePrice === null;
  const estimatedTotal = isQuoteRequired ? null : (currentCategory.basePrice || 0) + addonsTotal;

  return (
    <section id="pricing" className="py-24 bg-[#101010] border-b border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C69A72]" />
              <span>Tailored Enhancements</span>
              <span aria-hidden="true">·</span>
              <span>Transparent Rates</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3EFE7] tracking-tight">
              Optional Detailing Add-ons
            </h2>
          </div>
          <p className="text-sm text-[#B6B0A6] max-w-md">
            Customize your service with specialized treatment options. Add-on prices are flat-rate and clearly itemized.
          </p>
        </div>

        {/* 6 Add-ons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {BUSINESS_CONFIG.addons.map((addon) => {
            const isSelected = selectedAddonIds.includes(addon.id);
            return (
              <button
                key={addon.id}
                onClick={() => onToggleAddon(addon.id)}
                data-cursor="card"
                className={`service-card-lift text-left p-6 rounded-sm border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#201E1B] border-[#C69A72] shadow-md ring-1 ring-[#C69A72]/40'
                    : 'bg-[#171615] border-[#38332E] hover:border-[#C69A72]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-editorial text-2xl font-bold text-[#C69A72] tabular-nums">
                      +${addon.price}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-sm flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#C69A72] text-[#101010]'
                          : 'border border-[#38332E] text-[#B6B0A6]'
                      }`}
                    >
                      {isSelected ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#F3EFE7] mb-2">
                    {addon.name}
                  </h3>
                  <p className="text-xs text-[#B6B0A6] leading-relaxed">
                    {addon.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#38332E]/60 text-[11px] text-[#B6B0A6] flex items-center justify-between">
                  <span>{isSelected ? 'Selected' : 'Click to add'}</span>
                  <span className="font-mono text-[#C69A72]">{isSelected ? 'ACTIVE' : '+ ADD'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Transparent Interactive Estimation Bar */}
        <div className="bg-[#171615] border border-[#38332E] rounded-sm p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C69A72]">
                Instant Estimate Summary
              </span>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#F3EFE7]">
                <span className="font-semibold">{currentCategory.name}</span>
                <span className="text-[#B6B0A6]">
                  ({currentCategory.basePrice ? `$${currentCategory.basePrice}` : 'Custom Quote'})
                </span>
                {selectedAddonIds.length > 0 && (
                  <>
                    <span className="text-[#B6B0A6]">+</span>
                    <span>{selectedAddonIds.length} add-on{selectedAddonIds.length > 1 ? 's' : ''} (+${addonsTotal})</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#B6B0A6]">
                Final pricing may need verification based on vehicle condition upon arrival.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-left sm:text-right">
                <span className="text-xs uppercase tracking-wider text-[#B6B0A6] block">
                  Calculated Total
                </span>
                <span className="font-editorial text-3xl sm:text-4xl font-bold text-[#C69A72] tabular-nums">
                  {isQuoteRequired ? 'Custom Quote' : `$${estimatedTotal}`}
                </span>
              </div>

              <button
                onClick={onProceedToBooking}
                className="btn-champagne-sweep inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all"
              >
                <span>Proceed to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
