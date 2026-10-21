export interface VehicleCategory {
  id: string;
  name: string;
  subtitle: string;
  priceDisplay: string;
  basePrice: number | null; // null if quote required
  isQuoteRequired: boolean;
  description: string;
  examples: string;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
  isGenuineBusinessPhoto?: boolean;
}

export const BUSINESS_CONFIG = {
  name: "G Contreras Car Wash",
  tagline: "YOUR DRIVE. OUR DETAIL.",
  subheadline: "Professional mobile car washing and detailing that brings a cleaner finish straight to your location in Bakersfield, Shafter, and Wasco.",
  businessType: "Mobile Car Wash & Detailing",
  phone: "(661) 692-1044",
  phoneRaw: "6616921044",
  telLink: "tel:6616921044",
  instagramHandle: "@gcontrerascarwash",
  instagramUrl: "https://www.instagram.com/gcontrerascarwash/",
  serviceAreas: [
    { city: "Bakersfield", state: "California", highlights: "Driveway & workplace on-site mobile detailing" },
    { city: "Shafter", state: "California", highlights: "Mobile wash rig with spot-free water & power" },
    { city: "Wasco", state: "California", highlights: "Complete exterior & interior vehicle restoration" }
  ],
  promotion: {
    title: "¡El 5to Lavado es Gratis! / 5th Wash Free",
    description: "Loyalty reward for our recurring local clients. Mention this promotion when booking your appointment.",
    disclaimer: "Confirm applicable promotion terms, vehicle type qualification, and scheduling directly with the business."
  },
  baseInclusions: [
    { title: "Exterior Hand Wash", detail: "Delicate two-bucket hand wash with pH-neutral wash foam to safely lift road grime." },
    { title: "Wheels & Tires Cleaned", detail: "Brake dust dissolution, deep face and barrel scrubbing, tire sidewall degreasing." },
    { title: "Spot-Free Rinse", detail: "Deionized filtered water rinse preventing mineral water spotting in Valley heat." },
    { title: "Windows Cleaned", detail: "Streak-free clarity inside and out for optimal optical transparency." },
    { title: "Interior Wipe-Down", detail: "Thorough dust removal across dashboard, center console, door panels, and cup holders." },
    { title: "Door Jambs Cleaned", detail: "Wiped down to eliminate water drips, trapped silt, and road oil accumulation." },
    { title: "Tire Shine", detail: "Non-sling satin-gloss protective coating applied evenly to all four tires." }
  ],
  vehicleCategories: [
    {
      id: "small",
      name: "Small Vehicles",
      subtitle: "Sedans, Coupes & Compact Cars",
      priceDisplay: "$35",
      basePrice: 35,
      isQuoteRequired: false,
      description: "Complete mobile wash and interior wipe-down for compact vehicles, sports coupes, and hatchbacks.",
      examples: "Civic, Corolla, Model 3, Mustang, Accord, Camry"
    },
    {
      id: "midsize",
      name: "Mid-Size Vehicles",
      subtitle: "Four-Door Cars, Small Trucks & Non-Lifted SUVs",
      priceDisplay: "$45",
      basePrice: 45,
      isQuoteRequired: false,
      description: "Full exterior hand wash and cabin wipe-down for family sedans, crossovers, and stock small pickups.",
      examples: "RAV4, CR-V, Tacoma, Ranger, Colorado, Explorer"
    },
    {
      id: "large",
      name: "Large Trucks & SUVs",
      subtitle: "Lifted Trucks & Full-Size 3-Row SUVs",
      priceDisplay: "$50",
      basePrice: 50,
      isQuoteRequired: false,
      description: "Heavy-duty cleaning for full-size crew cabs, lifted suspensions, Suburbans, and oversized vehicles.",
      examples: "Silverado, F-150/250, Tahoe, Suburban, Escalade, Ram 1500"
    },
    {
      id: "rv",
      name: "RVs & Motorhomes",
      subtitle: "Campers, Class A/B/C Motorhomes & Trailers",
      priceDisplay: "Price varies — request a quote",
      basePrice: null,
      isQuoteRequired: true,
      description: "Custom quote based on overall exterior footage, fiberglass roof condition, and slide-out count.",
      examples: "Class A Motorhomes, 5th Wheels, Travel Trailers, Sprinter RVs"
    },
    {
      id: "semi",
      name: "Semi Trucks",
      subtitle: "Commercial Daycabs, Sleepers & Rig Fleets",
      priceDisplay: "Price varies — request a quote",
      basePrice: null,
      isQuoteRequired: true,
      description: "Commercial mobile detailing for working transport rigs, chrome polish needs, and fleet service.",
      examples: "Freightliner, Peterbilt, Kenworth, Volvo VNL"
    },
    {
      id: "utv",
      name: "UTVs — RZRs & Can-Ams",
      subtitle: "Side-by-Sides, Dune & Off-Road Buggies",
      priceDisplay: "$30 – $55",
      basePrice: null,
      isQuoteRequired: true,
      description: "Off-road power washing, suspension de-mudding, and cage cleaning tailored to dirt/sand condition.",
      examples: "Polaris RZR, Can-Am Maverick, Talon, Yamaha YXZ"
    }
  ] as VehicleCategory[],
  addons: [
    {
      id: "pet_hair",
      name: "Pet Hair Removal",
      price: 10,
      description: "Specialized rubber detailing brushes and pumice to extract embedded fur from carpets and seats."
    },
    {
      id: "seat_shampoo",
      name: "Seat Shampoo & Extraction",
      price: 20,
      description: "Hot water extraction and gentle fabric shampooing to lift spills, dirt, and light stains."
    },
    {
      id: "engine_bay",
      name: "Engine Bay Cleaning",
      price: 20,
      description: "Careful degreasing of underhood plastics, firewall, and engine covers with satin dressing."
    },
    {
      id: "wax_paint_protection",
      name: "Wax / Paint Protection",
      price: 25,
      description: "Hand-applied synthetic ceramic spray wax for hydrophobic water beading and UV paint defense."
    },
    {
      id: "deep_interior",
      name: "Deep Interior Cleaning",
      price: 30,
      description: "Steam sanitization, compressed air crevice purge, seat track cleaning, and leather conditioning."
    },
    {
      id: "headlight_restoration",
      name: "Headlight Restoration",
      price: 30,
      description: "Multi-stage wet sanding and UV sealant clear coat to eliminate yellow haze and oxidation."
    }
  ] as ServiceAddon[],
  gallery: [
    {
      id: "business-showcase",
      title: "G Contreras Mobile Detailing Service Rig & Fleet",
      category: "Verified Business Photo",
      image: "/assets/aistudio/Screenshot_2026-10-20-20-46-50-63_1c337646f29875672b5a61192b9010f9_7e68eb1b.jpg",
      caption: "Direct from our official @gcontrerascarwash profile: our dedicated white mobile wash rig, service pricing, and customer vehicles in Kern County.",
      isGenuineBusinessPhoto: true
    },
    {
      id: "foam-cannon-wash",
      title: "Two-Bucket Foam Cannon Wash",
      category: "Exterior Hand Wash",
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&q=80",
      caption: "Illustrative detailing craftsmanship: thick pH-neutral foam encapsulation preventing swirl marks.",
      isGenuineBusinessPhoto: false
    },
    {
      id: "wheel-detail",
      title: "Wheel & Tire Precision Scrub",
      category: "Wheel Detail & Tire Shine",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      caption: "Illustrative detailing craftsmanship: deep barrel brake dust removal and dry-to-the-touch satin tire coating.",
      isGenuineBusinessPhoto: false
    },
    {
      id: "interior-restoration",
      title: "Immaculate Cockpit Restoration",
      category: "Interior Detailing",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      caption: "Illustrative detailing craftsmanship: dust-free air vents, deep conditioning, and spot-free interior glass.",
      isGenuineBusinessPhoto: false
    }
  ] as GalleryItem[]
};
