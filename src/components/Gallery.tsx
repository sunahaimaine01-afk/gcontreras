import React, { useState } from 'react';
import { Camera, ExternalLink, X, Instagram } from 'lucide-react';
import { BUSINESS_CONFIG, GalleryItem } from '../config/business';

export const Gallery: React.FC = () => {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-24 bg-[#101010] border-b border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C69A72] font-semibold mb-3">
              <Camera className="w-3.5 h-3.5 text-[#C69A72]" />
              <span>Mobile Detailing Work</span>
              <span aria-hidden="true">·</span>
              <span>Visual Gallery</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F3EFE7] tracking-tight">
              Craftsmanship & Rig
            </h2>
          </div>
          <div className="text-sm text-[#B6B0A6] max-w-md">
            <p>
              Genuine business updates from our official Instagram feed alongside illustrative detailing craftsmanship.
            </p>
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#C69A72] hover:underline mt-2 font-semibold"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>View live posts @gcontrerascarwash</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_CONFIG.gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              data-cursor="gallery"
              className="group cursor-pointer bg-[#171615] border border-[#38332E] hover:border-[#C69A72]/60 rounded-sm overflow-hidden flex flex-col transition-all duration-200"
            >
              <div className="relative aspect-[4/3] bg-[#201E1B] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent opacity-80" />
                
                {/* Badge indicating source */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-sm font-semibold tracking-wider uppercase ${
                      item.isGenuineBusinessPhoto
                        ? 'bg-[#C69A72] text-[#101010]'
                        : 'bg-[#101010]/80 text-[#B6B0A6] border border-[#38332E]'
                    }`}
                  >
                    {item.isGenuineBusinessPhoto ? 'Official Instagram' : 'Process Craft'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#C69A72] block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-semibold text-[#F3EFE7] mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#B6B0A6] line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#38332E]/60 flex items-center justify-between text-[11px] text-[#C69A72]">
                  <span>Click to expand</span>
                  <span>↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative bg-[#171615] border border-[#38332E] max-w-3xl w-full rounded-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-sm bg-[#101010]/80 text-[#F3EFE7] hover:text-[#C69A72] transition-colors"
              aria-label="Close image modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="max-h-[70vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#C69A72]">
                  {activeItem.category}
                </span>
                <span className="text-[#38332E]">·</span>
                <span className="text-xs text-[#B6B0A6]">
                  {activeItem.isGenuineBusinessPhoto ? 'Official Business Asset' : 'Illustrative Photography'}
                </span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-[#F3EFE7] mb-2">
                {activeItem.title}
              </h3>
              <p className="text-sm text-[#B6B0A6]">
                {activeItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
