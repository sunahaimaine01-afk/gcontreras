import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export const PromotionBanner: React.FC = () => {
  return (
    <section className="bg-[#171615] border-b border-[#38332E] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#201E1B] border border-[#C69A72]/40 rounded-sm p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
          {/* Subtle warm champagne accent element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#C69A72]/10 to-transparent pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-sm bg-[#101010] border border-[#C69A72]/50 flex items-center justify-center shrink-0 text-[#C69A72]">
              <Award className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C69A72]">
                Customer Loyalty Reward
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#F3EFE7]">
                {BUSINESS_CONFIG.promotion.title}
              </h3>
              <p className="text-sm text-[#B6B0A6] leading-relaxed">
                {BUSINESS_CONFIG.promotion.description}
              </p>
              <p className="text-[11px] text-[#B6B0A6]/80 pt-1">
                Note: {BUSINESS_CONFIG.promotion.disclaimer}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="#booking"
              className="btn-champagne-sweep inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all"
            >
              <span>Schedule Next Wash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
