import React from 'react';
import { Phone, Instagram, MapPin, ShieldCheck, ArrowUp } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenLookup }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#101010] border-t border-[#38332E] pt-16 pb-12 text-[#B6B0A6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-[#171615] border border-[#38332E] flex items-center justify-center text-[#C69A72]">
                <span className="font-editorial text-lg font-bold">GC</span>
              </div>
              <span className="font-editorial text-xl font-bold text-[#F3EFE7]">
                {BUSINESS_CONFIG.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#B6B0A6] leading-relaxed max-w-sm">
              Professional mobile vehicle cleaning and detailing bringing showroom finishes straight to customer locations in Bakersfield, Shafter, and Wasco.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-semibold text-[#F3EFE7]">
              <a
                href={BUSINESS_CONFIG.telLink}
                className="flex items-center gap-2 hover:text-[#C69A72] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C69A72]" />
                <span className="font-mono">{BUSINESS_CONFIG.phone}</span>
              </a>
              <a
                href={BUSINESS_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#C69A72] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C69A72]" />
                <span>{BUSINESS_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C69A72] block">
              Quick Navigation
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#F3EFE7] transition-colors">
                  Vehicle Categories & Rates
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#F3EFE7] transition-colors">
                  Detailing Add-ons & Pricing
                </a>
              </li>
              <li>
                <a href="#inclusions" className="hover:text-[#F3EFE7] transition-colors">
                  Included Base Service Checklist
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#F3EFE7] transition-colors">
                  Craftsmanship Gallery & Rig
                </a>
              </li>
              <li>
                <a href="#service-areas" className="hover:text-[#F3EFE7] transition-colors">
                  Service Areas (Bakersfield / Shafter / Wasco)
                </a>
              </li>
              <li>
                <button onClick={onOpenLookup} className="hover:text-[#C69A72] transition-colors text-left">
                  Track Booking Status
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Service Areas & Mobile Guarantee */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C69A72] block">
              Mobile Service Guarantee
            </span>
            <p className="text-xs text-[#B6B0A6] leading-relaxed">
              We bring our self-contained mobile wash rig equipped with spot-free deionized water, high-pressure equipment, and power directly to you. No customer water or electrical hookup required.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#F3EFE7]">
              <MapPin className="w-3.5 h-3.5 text-[#C69A72]" />
              <span>Serving Bakersfield, Shafter & Wasco, CA</span>
            </div>
          </div>
        </div>

        {/* Privacy Notice Box */}
        <div className="bg-[#171615] border border-[#38332E] p-4 rounded-sm mb-8 text-[11px] leading-relaxed text-[#B6B0A6]">
          <strong className="text-[#F3EFE7]">Privacy & Booking Information Notice: </strong>
          Contact details and addresses submitted through our booking form are used exclusively by G Contreras Car Wash for scheduling, dispatching, and confirming your mobile vehicle detail. We do not sell, share, or disclose client information to any third parties.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#38332E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B6B0A6]">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.</span>
            <span className="text-[#38332E]">·</span>
            <button
              onClick={onOpenAdmin}
              className="hover:text-[#C69A72] flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C69A72]" />
              <span>Owner Portal</span>
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#C69A72] transition-colors"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
