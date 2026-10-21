import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleCategories } from './components/VehicleCategories';
import { AddonsPricing } from './components/AddonsPricing';
import { PromotionBanner } from './components/PromotionBanner';
import { Gallery } from './components/Gallery';
import { ServiceAreas } from './components/ServiceAreas';
import { BookingForm } from './components/BookingForm';
import { Footer } from './components/Footer';
import { LookupModal } from './components/LookupModal';
import { AdminDashboard } from './components/AdminDashboard';
import { DetailingCursor } from './components/DetailingCursor';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('small');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleProceedToBooking = (categoryId?: string) => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    }
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#F3EFE7] selection:bg-[#C69A72]/30 selection:text-[#F3EFE7] flex flex-col">
      {/* Subtle Detailing Orbit Cursor */}
      <DetailingCursor />

      {/* Top Bar Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <VehicleCategories
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onProceedToBooking={handleProceedToBooking}
        />
        <AddonsPricing
          selectedCategory={selectedCategory}
          selectedAddonIds={selectedAddonIds}
          onToggleAddon={handleToggleAddon}
          onProceedToBooking={() => handleProceedToBooking()}
        />
        <PromotionBanner />
        <Gallery />
        <ServiceAreas />
        <BookingForm
          selectedCategory={selectedCategory}
          selectedAddonIds={selectedAddonIds}
          onCategoryChange={setSelectedCategory}
          onToggleAddon={handleToggleAddon}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* Modals */}
      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
