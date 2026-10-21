import React from 'react';
import { Phone, ArrowRight, Sparkles, MapPin, Droplets, Truck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-[#101010] border-b border-[#38332E]">
      {/* Background Media & Atmospheric Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=2000&q=80"
          alt="Cinematic luxury automotive detailing finish"
          className="w-full h-full object-cover object-center opacity-30 select-none filter brightness-90 contrast-105"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic dark scrim matching required palette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#101010] via-[#101010]/85 to-[#101010]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-center">
        {/* Quiet Editorial Kicker */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-6">
          <Truck className="w-4 h-4 text-[#C69A72]" />
          <span>Mobile Vehicle Detailing</span>
          <span aria-hidden="true" className="text-[#38332E]">·</span>
          <span>We Come To Your Location</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F3EFE7] max-w-4xl leading-[1.08] text-balance mb-6">
          YOUR DRIVE.<br />
          <span className="text-[#C69A72] italic font-normal">OUR DETAIL.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-lg md:text-xl text-[#B6B0A6] max-w-2xl leading-relaxed mb-10 font-normal">
          {BUSINESS_CONFIG.subheadline}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
          <a
            href="#booking"
            className="btn-champagne-sweep inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[#101010] bg-[#C69A72] hover:bg-[#d6aa82] rounded-sm shadow-md transition-all"
          >
            <span>Book Your Detail</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold tracking-wide text-[#F3EFE7] bg-[#171615] hover:bg-[#201E1B] border border-[#38332E] hover:border-[#C69A72]/60 rounded-sm transition-all"
          >
            <span>View Vehicle Rates</span>
          </a>

          <a
            href={BUSINESS_CONFIG.telLink}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold tracking-wide text-[#F3EFE7] hover:text-[#C69A72] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#C69A72]" />
            <span className="tabular-nums font-mono">{BUSINESS_CONFIG.phone}</span>
          </a>
        </div>

        {/* 4-Item Feature Strip: Proof & Mechanics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#38332E]/80">
          <div className="flex items-start gap-3 p-3 bg-[#171615]/60 rounded-sm border border-[#38332E]/50">
            <Truck className="w-5 h-5 text-[#C69A72] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F3EFE7] uppercase tracking-wide">100% Mobile</p>
              <p className="text-[12px] text-[#B6B0A6]">We bring spot-free water & power to you</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#171615]/60 rounded-sm border border-[#38332E]/50">
            <Droplets className="w-5 h-5 text-[#C69A72] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F3EFE7] uppercase tracking-wide">Spot-Free Water</p>
              <p className="text-[12px] text-[#B6B0A6]">Deionized water prevents mineral spots</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#171615]/60 rounded-sm border border-[#38332E]/50">
            <MapPin className="w-5 h-5 text-[#C69A72] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F3EFE7] uppercase tracking-wide">Service Areas</p>
              <p className="text-[12px] text-[#B6B0A6]">Bakersfield · Shafter · Wasco, CA</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-[#171615]/60 rounded-sm border border-[#38332E]/50">
            <Sparkles className="w-5 h-5 text-[#C69A72] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#F3EFE7] uppercase tracking-wide">5th Wash Free</p>
              <p className="text-[12px] text-[#B6B0A6]">Loyalty reward for recurring clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
