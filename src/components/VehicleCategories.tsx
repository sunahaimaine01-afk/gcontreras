import React from 'react';
import { Check, ArrowRight, Info, Shield } from 'lucide-react';
import { BUSINESS_CONFIG, VehicleCategory } from '../config/business';

interface VehicleCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onProceedToBooking: (categoryId: string) => void;
}

export const VehicleCategories: React.FC<VehicleCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
  onProceedToBooking,
}) => {
  const currentCategory =
    BUSINESS_CONFIG.vehicleCategories.find((c) => c.id === selectedCategory) ||
    BUSINESS_CONFIG.vehicleCategories[0];

  return (
    <section id="services" className="py-24 bg-[#171615] border-b border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-3">
              <span>Transparent Rates</span>
              <span aria-hidden="true">·</span>
              <span>Mobile Detailing Tiers</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3EFE7] tracking-tight">
              Vehicle Categories & Pricing
            </h2>
          </div>
          <p className="text-sm text-[#B6B0A6] max-w-md">
            Every category includes our complete signature 7-step mobile wash and wipe-down. Select your vehicle to view details.
          </p>
        </div>

        {/* Vehicle Category Selector Grid (Interactive Tabs / Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {BUSINESS_CONFIG.vehicleCategories.map((category) => {
            const isSelected = category.id === selectedCategory;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                data-cursor="card"
                className={`relative text-left p-4 rounded-sm border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#201E1B] border-[#C69A72] shadow-md ring-1 ring-[#C69A72]/50'
                    : 'bg-[#101010]/80 border-[#38332E] hover:border-[#C69A72]/40 hover:bg-[#101010]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#B6B0A6]">
                      Tier 0{BUSINESS_CONFIG.vehicleCategories.indexOf(category) + 1}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#C69A72]" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#F3EFE7] mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className="text-[12px] text-[#B6B0A6] line-clamp-2 mb-3">
                    {category.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#38332E]/60 flex items-baseline justify-between">
                  <span className="font-editorial text-lg font-bold text-[#C69A72]">
                    {category.priceDisplay}
                  </span>
                  <span className="text-[11px] text-[#B6B0A6]">base</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Feature Display (Signature Interaction B: Tactile Switch) */}
        <div className="bg-[#201E1B] border border-[#38332E] rounded-sm p-6 sm:p-8 mb-16 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Category Spec */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C69A72]">
                <span>Selected Vehicle Tier</span>
                <span aria-hidden="true">·</span>
                <span>{currentCategory.subtitle}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F3EFE7]">
                {currentCategory.name}
              </h3>

              <p className="text-sm sm:text-base text-[#B6B0A6] leading-relaxed">
                {currentCategory.description}
              </p>

              <div className="bg-[#171615] p-3.5 rounded-sm border border-[#38332E]/80 text-xs text-[#B6B0A6]">
                <span className="font-semibold text-[#F3EFE7]">Typical vehicles: </span>
                <span>{currentCategory.examples}</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onProceedToBooking(currentCategory.id)}
                  className="btn-champagne-sweep inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all"
                >
                  <span>Select For Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-[#B6B0A6]">
                  {currentCategory.isQuoteRequired
                    ? 'Final price confirmed upon review of vehicle condition & size.'
                    : 'Base rate guaranteed for standard vehicle condition.'}
                </span>
              </div>
            </div>

            {/* Right Column: Pricing & Confirmation Box */}
            <div className="lg:col-span-5 bg-[#171615] border border-[#38332E] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#38332E]">
                <span className="text-xs uppercase tracking-wider text-[#B6B0A6]">Base Service Fee</span>
                <span className="font-editorial text-2xl font-bold text-[#C69A72]">
                  {currentCategory.priceDisplay}
                </span>
              </div>

              <div className="space-y-2 text-xs text-[#B6B0A6]">
                <div className="flex items-center gap-2 text-[#F3EFE7]">
                  <Check className="w-3.5 h-3.5 text-[#C69A72] shrink-0" />
                  <span>On-site service in Bakersfield, Shafter, or Wasco</span>
                </div>
                <div className="flex items-center gap-2 text-[#F3EFE7]">
                  <Check className="w-3.5 h-3.5 text-[#C69A72] shrink-0" />
                  <span>Spot-free filtered water & self-powered wash</span>
                </div>
                <div className="flex items-center gap-2 text-[#F3EFE7]">
                  <Check className="w-3.5 h-3.5 text-[#C69A72] shrink-0" />
                  <span>Full exterior wash + wheels + interior wipe</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#B6B0A6]/80 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#C69A72] shrink-0 mt-0.5" />
                <span>Need stain extraction, pet hair removal, or engine bay clean? Add-ons available during booking.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Included Base Service (Inclusions Display) */}
        <div id="inclusions" className="pt-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-2">
              <Shield className="w-4 h-4 text-[#C69A72]" />
              <span>Standard On Every Detail</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F3EFE7]">
              Included Base Service Checklist
            </h3>
            <p className="text-xs sm:text-sm text-[#B6B0A6] mt-1">
              Every appointment includes this comprehensive 7-point hand-cleaning process.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BUSINESS_CONFIG.baseInclusions.map((inclusion, idx) => (
              <div
                key={inclusion.title}
                className="service-card-lift bg-[#201E1B] border border-[#38332E] p-5 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-[#C69A72]">
                      0{idx + 1}.
                    </span>
                    <Check className="w-4 h-4 text-[#C69A72]" />
                  </div>
                  <h4 className="text-sm font-semibold text-[#F3EFE7] mb-1.5">
                    {inclusion.title}
                  </h4>
                  <p className="text-xs text-[#B6B0A6] leading-relaxed">
                    {inclusion.detail}
                  </p>
                </div>
              </div>
            ))}

            {/* Final Highlight Card: Deionized Spot-Free Water */}
            <div className="bg-[#101010] border border-[#C69A72]/40 p-5 rounded-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-[#C69A72] uppercase tracking-wider block mb-2">
                  Key Guarantee
                </span>
                <h4 className="text-sm font-semibold text-[#F3EFE7] mb-1.5">
                  Spot-Free Solar Finish
                </h4>
                <p className="text-xs text-[#B6B0A6] leading-relaxed">
                  We use deionized filtered water to ensure no baked-on water mineral etching under hot Kern County sunshine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
