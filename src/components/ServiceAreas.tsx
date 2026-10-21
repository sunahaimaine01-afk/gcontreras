import React from 'react';
import { MapPin, Check, Phone } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

export const ServiceAreas: React.FC = () => {
  return (
    <section id="service-areas" className="py-24 bg-[#171615] border-b border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Context & Mobile Assurance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#C69A72]" />
              <span>Kern County Coverage</span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3EFE7] tracking-tight">
              Mobile Detailing Straight to You
            </h2>

            <p className="text-sm sm:text-base text-[#B6B0A6] leading-relaxed">
              We operate exclusively as a mobile car wash and detailing service. There is no storefront to visit—our specialized mobile rig brings filtered deionized water, electric power, commercial pressure washers, and detailing equipment directly to your driveway, office parking space, or commercial facility.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#C69A72] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm text-[#F3EFE7]">
                  <strong>Zero hassle:</strong> You do not need to provide water hookups or extension cords; our mobile truck is fully self-contained.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-[#C69A72] shrink-0 mt-1" />
                <p className="text-xs sm:text-sm text-[#F3EFE7]">
                  <strong>Flexible scheduling:</strong> Morning, midday, and afternoon arrival windows available Monday through Sunday.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={BUSINESS_CONFIG.telLink}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#C69A72] hover:underline"
              >
                <Phone className="w-4 h-4" />
                <span>Call {BUSINESS_CONFIG.phone} to inquire about your location</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3 Cities Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BUSINESS_CONFIG.serviceAreas.map((area) => (
              <div
                key={area.city}
                className="service-card-lift bg-[#201E1B] border border-[#38332E] p-6 rounded-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-sm bg-[#171615] border border-[#38332E] flex items-center justify-center text-[#C69A72] mb-4">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C69A72] block mb-1">
                    {area.state}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#F3EFE7] mb-2">
                    {area.city}
                  </h3>
                  <p className="text-xs text-[#B6B0A6] leading-relaxed">
                    {area.highlights}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#38332E]/60 flex items-center justify-between text-[11px] text-[#C69A72]">
                  <span>Active Service Zone</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
