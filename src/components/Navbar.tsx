import React, { useState } from 'react';
import { Phone, Instagram, Menu, X, ShieldCheck, Search } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenLookup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenLookup }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#101010]/95 backdrop-blur-md border-b border-[#38332E] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          className="group flex items-center gap-3 text-left whitespace-nowrap shrink-0 text-[#F3EFE7] hover:text-[#C69A72] transition-colors"
        >
          <div className="w-10 h-10 rounded-sm bg-[#171615] border border-[#38332E] flex items-center justify-center text-[#C69A72] group-hover:border-[#C69A72]/60 transition-colors">
            <span className="font-editorial text-xl font-bold tracking-wider">GC</span>
          </div>
          <div>
            <span className="block font-editorial text-lg sm:text-xl font-semibold tracking-wide text-[#F3EFE7] group-hover:text-[#C69A72] transition-colors">
              {BUSINESS_CONFIG.name}
            </span>
            <span className="block text-[11px] font-sans tracking-widest uppercase text-[#B6B0A6]">
              Mobile Detailing · Kern County
            </span>
          </div>
        </a>

        {/* Zone 2: Single-line Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#B6B0A6]">
          <a href="#services" className="hover:text-[#F3EFE7] transition-colors whitespace-nowrap shrink-0">
            Services
          </a>
          <a href="#pricing" className="hover:text-[#F3EFE7] transition-colors whitespace-nowrap shrink-0">
            Pricing
          </a>
          <a href="#inclusions" className="hover:text-[#F3EFE7] transition-colors whitespace-nowrap shrink-0">
            Inclusions
          </a>
          <a href="#gallery" className="hover:text-[#F3EFE7] transition-colors whitespace-nowrap shrink-0">
            Gallery
          </a>
          <a href="#service-areas" className="hover:text-[#F3EFE7] transition-colors whitespace-nowrap shrink-0">
            Service Areas
          </a>
        </nav>

        {/* Zone 3: Actions (Phone, Lookup, Booking CTA) */}
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <a
            href={BUSINESS_CONFIG.telLink}
            className="flex items-center gap-2 text-xs font-semibold text-[#F3EFE7] hover:text-[#C69A72] transition-colors px-3 py-2 rounded-sm border border-transparent hover:border-[#38332E]"
            title="Call G Contreras Car Wash directly"
          >
            <Phone className="w-3.5 h-3.5 text-[#C69A72]" />
            <span className="tabular-nums">{BUSINESS_CONFIG.phone}</span>
          </a>

          <button
            onClick={onOpenLookup}
            className="flex items-center gap-1.5 text-xs text-[#B6B0A6] hover:text-[#F3EFE7] px-2.5 py-1.5 transition-colors"
            title="Check status of existing booking"
          >
            <Search className="w-3.5 h-3.5 text-[#C69A72]" />
            <span className="hidden md:inline">Track Booking</span>
          </button>

          <a
            href="#booking"
            className="btn-champagne-sweep px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm transition-all shadow-sm"
          >
            Book Your Detail
          </a>

          <button
            onClick={onOpenAdmin}
            className="p-2 text-[#B6B0A6] hover:text-[#C69A72] transition-colors rounded-sm hover:bg-[#171615]"
            title="Owner Portal"
            aria-label="Owner Admin Login"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={BUSINESS_CONFIG.telLink}
            className="p-2 text-[#C69A72] border border-[#38332E] rounded-sm"
            aria-label="Call business"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#F3EFE7] hover:text-[#C69A72] border border-[#38332E] rounded-sm transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#171615] border-b border-[#38332E] px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-[#B6B0A6]">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE7] transition-colors"
            >
              Services & Vehicles
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE7] transition-colors"
            >
              Transparent Pricing
            </a>
            <a
              href="#inclusions"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE7] transition-colors"
            >
              What's Included
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE7] transition-colors"
            >
              Gallery & Work
            </a>
            <a
              href="#service-areas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE7] transition-colors"
            >
              Bakersfield, Shafter & Wasco
            </a>
          </nav>

          <div className="pt-3 border-t border-[#38332E] flex flex-col gap-2.5">
            <a
              href={BUSINESS_CONFIG.telLink}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#F3EFE7] bg-[#201E1B] border border-[#38332E] py-2.5 rounded-sm"
            >
              <Phone className="w-4 h-4 text-[#C69A72]" />
              Call {BUSINESS_CONFIG.phone}
            </a>
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs font-semibold text-[#B6B0A6] hover:text-[#C69A72] py-2"
            >
              <Instagram className="w-4 h-4" />
              Follow {BUSINESS_CONFIG.instagramHandle}
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLookup();
              }}
              className="flex items-center justify-center gap-2 text-xs text-[#B6B0A6] hover:text-[#F3EFE7] py-2"
            >
              <Search className="w-3.5 h-3.5 text-[#C69A72]" />
              Lookup Booking Status
            </button>
            <a
              href="#booking"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-champagne-sweep text-center py-3 text-xs font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] rounded-sm"
            >
              Book Your Detail
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-center text-xs text-[#B6B0A6]/70 py-1"
            >
              Owner Portal Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
