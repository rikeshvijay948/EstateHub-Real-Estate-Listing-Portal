/**
 * EstateHub - Initial Dataset
 * Contains realistic sample properties, agent profiles, and demo users.
 */

const INITIAL_PROPERTIES = [
  {
    id: "prop-1",
    title: "Luxurious 4 BHK Sea-Facing Penthouse",
    description: "Experience unparalleled luxury living with breathtaking panoramic views of the Arabian Sea. This bespoke penthouse features Italian marble flooring, a private sky deck with an infinity plunge pool, smart home automation, and double-height living ceilings. Situated in prime Worli, close to top luxury hotels, fine dining, and seamless connectivity to South Mumbai and BKC.",
    listingType: "sale", // 'sale' or 'rent'
    propertyType: "Penthouse", // 'Apartment', 'Villa', 'Penthouse', 'Studio', 'Commercial', 'Plot'
    price: 185000000, // ₹18.5 Cr
    city: "Mumbai",
    state: "Maharashtra",
    address: "Sea Face Enclave, Worli",
    pincode: "400018",
    bedrooms: 4,
    bathrooms: 5,
    area: 4850, // sqft
    yearBuilt: 2023,
    parking: "3 Covered Slots",
    furnishedStatus: "Fully Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Air Conditioning",
      "Security",
      "Balcony",
      "Garden",
      "WiFi",
      "Parking",
      "Clubhouse",
      "Power Backup"
    ],
    features: [
      "Private Sky Terrace",
      "Italian Marble Flooring",
      "Smart Home Automation",
      "Direct Sea View",
      "Private Elevator Access",
      "Servant Quarters"
    ],
    agent: {
      id: "agent-1",
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    },
    createdAt: "2026-08-15T10:30:00Z"
  },
  {
    id: "prop-2",
    title: "Contemporary 3 BHK Gated Community Villa",
    description: "A masterfully designed private villa nestled inside an ultra-exclusive gated enclave in Whitefield, Bangalore. Features a private landscaped zen garden, solar-powered water heating, modular German kitchen with built-in appliances, and expansive terrace. Located within 10 minutes of major IT tech parks, international schools, and metro stations.",
    listingType: "sale",
    propertyType: "Villa",
    price: 24500000, // ₹2.45 Cr
    city: "Bangalore",
    state: "Karnataka",
    address: "Palm Meadows Boulevard, Whitefield",
    pincode: "560066",
    bedrooms: 3,
    bathrooms: 4,
    area: 3200,
    yearBuilt: 2022,
    parking: "2 Covered Slots",
    furnishedStatus: "Semi-Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Security",
      "Garden",
      "Balcony",
      "WiFi",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Private Zen Garden",
      "Solar Water Heating",
      "Gated Community Security",
      "Clubhouse Access",
      "Vastu Compliant"
    ],
    agent: {
      id: "agent-2",
      name: "Pooja Hegde",
      role: "Senior Real Estate Advisor",
      phone: "+91 99450 88712",
      email: "pooja.hegde@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      rating: 4.8,
      reviewsCount: 29
    },
    createdAt: "2026-08-20T14:15:00Z"
  },
  {
    id: "prop-3",
    title: "Elegant 3 BHK High-Rise Apartment in OMR",
    description: "Stunning East-facing 3-bedroom apartment on the 18th floor offering sweeping skyline views. Packed with premium lifestyle amenities including Olympic-sized swimming pool, badminton courts, clubhouse, rooftop jogging track, and multi-tier security. Strategically situated right on OMR IT Corridor with quick access to Tidal Park and ECR beaches.",
    listingType: "sale",
    propertyType: "Apartment",
    price: 8800000, // ₹88 Lakhs
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Skyline Towers, OMR IT Expressway, Sholinganallur",
    pincode: "600119",
    bedrooms: 3,
    bathrooms: 3,
    area: 1720,
    yearBuilt: 2024,
    parking: "1 Covered + 1 Open",
    furnishedStatus: "Semi-Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Security",
      "Balcony",
      "Air Conditioning",
      "Parking",
      "Power Backup"
    ],
    features: [
      "18th Floor Horizon View",
      "100% Power Backup",
      "Rooftop Jogging Track",
      "High Speed Elevators",
      "Near IT Parks"
    ],
    agent: {
      id: "agent-3",
      name: "Karthik Subramanian",
      role: "Chennai Regional Head",
      phone: "+91 94440 12987",
      email: "karthik.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 52
    },
    createdAt: "2026-08-25T09:00:00Z"
  },
  {
    id: "prop-4",
    title: "Premium 2 BHK Modern Apartment for Rent in Hitec City",
    description: "Furnished to perfection, this modern 2-bedroom home in Hitec City is ideal for working tech professionals and modern couples. Features high-speed fiber internet, modular kitchen with dishwasher, split ACs in all rooms, and a scenic balcony overlooking green gardens. Includes access to clubhouse, tennis court, and infinity pool.",
    listingType: "rent",
    propertyType: "Apartment",
    price: 45000, // ₹45,000 / month
    city: "Hyderabad",
    state: "Telangana",
    address: "Cyber Heights Residency, Madhapur, Hitec City",
    pincode: "500081",
    bedrooms: 2,
    bathrooms: 2,
    area: 1250,
    yearBuilt: 2023,
    parking: "1 Dedicated Slot",
    furnishedStatus: "Fully Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1502005229762-ee1b2b814a66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Air Conditioning",
      "WiFi",
      "Gym",
      "Swimming Pool",
      "Security",
      "Balcony",
      "Parking"
    ],
    features: [
      "Walk-in Wardrobe",
      "Modern Smart TV & Appliances",
      "5 Mins from Metro Station",
      "24/7 Security & Concierge"
    ],
    agent: {
      id: "agent-4",
      name: "Ananya Reddy",
      role: "Rental Specialist",
      phone: "+91 98490 65432",
      email: "ananya.reddy@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
      rating: 4.7,
      reviewsCount: 22
    },
    createdAt: "2026-09-01T11:20:00Z"
  },
  {
    id: "prop-5",
    title: "Charming 4 BHK Independent Spanish Villa",
    description: "An architectural masterpiece in Koregaon Park with Spanish revival arches, terracotta roof tiles, lush private courtyard, heated swimming pool, and guest suite. Designed with expansive floor-to-ceiling French windows, custom teakwood finishes, and manicured lawns. A tranquil sanctuary in one of Pune's most coveted upscale neighborhoods.",
    listingType: "sale",
    propertyType: "Villa",
    price: 49500000, // ₹4.95 Cr
    city: "Pune",
    state: "Maharashtra",
    address: "Lane 5, Koregaon Park North",
    pincode: "411001",
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    yearBuilt: 2021,
    parking: "3 Cars",
    furnishedStatus: "Semi-Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Gym",
      "Air Conditioning",
      "Security",
      "Balcony",
      "Parking",
      "WiFi"
    ],
    features: [
      "Spanish Architecture",
      "Private Heated Pool",
      "Landscaped Courtyard",
      "Independent Servant Quarters",
      "Solar Power Backup"
    ],
    agent: {
      id: "agent-1",
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    },
    createdAt: "2026-09-03T16:00:00Z"
  },
  {
    id: "prop-6",
    title: "Ultra-Modern 1 BHK Studio Apartment in Indiranagar",
    description: "Compact yet masterfully engineered designer studio apartment in buzzing Indiranagar. Boasts custom multi-functional modular furniture, smart keyless entry, ambient lighting presets, sound-insulated double-glazed windows, and high-speed gigabit Wi-Fi. Ideal for young founders, creators, and single professionals seeking an energetic lifestyle.",
    listingType: "rent",
    propertyType: "Studio",
    price: 32000, // ₹32,000 / month
    city: "Bangalore",
    state: "Karnataka",
    address: "100ft Road, 12th Main, Indiranagar",
    pincode: "560038",
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    yearBuilt: 2024,
    parking: "1 Bike + 1 Compact Car",
    furnishedStatus: "Fully Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Security",
      "Balcony",
      "Parking",
      "Gym"
    ],
    features: [
      "Smart Keyless Lock",
      "Foldaway Murphy Bed",
      "Walking Distance to Top Cafes",
      "In-Unit Laundry"
    ],
    agent: {
      id: "agent-2",
      name: "Pooja Hegde",
      role: "Senior Real Estate Advisor",
      phone: "+91 99450 88712",
      email: "pooja.hegde@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      rating: 4.8,
      reviewsCount: 29
    },
    createdAt: "2026-09-05T08:45:00Z"
  },
  {
    id: "prop-7",
    title: "Grade-A Commercial Office Space in Golf Course Ext Road",
    description: "Premium plug-and-play corporate commercial office floor on Golf Course Extension Road, Gurgaon. Fitted with 120 workstations, 4 executive director cabins, 2 board rooms with AV videoconferencing, reception lounge, cafeteria, and dedicated server room. LEED Gold certified building with central chiller HVAC and ample multi-level basement parking.",
    listingType: "rent",
    propertyType: "Commercial",
    price: 380000, // ₹3.8 Lakhs / month
    city: "Delhi",
    state: "NCR",
    address: "Signature Corporate Tower, Golf Course Ext Road, Sector 65, Gurgaon",
    pincode: "122018",
    bedrooms: 0,
    bathrooms: 4,
    area: 5200,
    yearBuilt: 2023,
    parking: "8 Dedicated Slots",
    furnishedStatus: "Fully Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Air Conditioning",
      "Security",
      "WiFi",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Plug & Play Ready",
      "120 Ergonomic Workstations",
      "LEED Gold Green Certified",
      "High Speed Elevators",
      "Cafeteria & Pantry"
    ],
    agent: {
      id: "agent-5",
      name: "Vikram Singhania",
      role: "Commercial Real Estate Lead",
      phone: "+91 98110 99887",
      email: "vikram.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 45
    },
    createdAt: "2026-09-08T13:10:00Z"
  },
  {
    id: "prop-8",
    title: "Scenic 3 BHK Coastal Holiday Villa with Pool",
    description: "An idyllic Portuguese-styled luxury holiday retreat in Candolim, North Goa. Features exposed laterite stone walls, high timber ceilings, private sparkling pool surrounded by coconut palms, outdoor BBQ bar, and open-air gazebo. Generating lucrative short-term rental yields and perfect as a peaceful personal vacation paradise.",
    listingType: "sale",
    propertyType: "Villa",
    price: 36000000, // ₹3.6 Cr
    city: "Goa",
    state: "Goa",
    address: "Nerul Road, Near Candolim Beach",
    pincode: "403515",
    bedrooms: 3,
    bathrooms: 3,
    area: 2850,
    yearBuilt: 2023,
    parking: "2 Cars",
    furnishedStatus: "Fully Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Air Conditioning",
      "WiFi",
      "Balcony",
      "Security",
      "Parking"
    ],
    features: [
      "5 Mins to Candolim Beach",
      "Private Plunge Pool & Deck",
      "High Rental ROI (Airbnb Ready)",
      "Outdoor Barbecue Lounge",
      "Heritage Portuguese Architecture"
    ],
    agent: {
      id: "agent-1",
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    },
    createdAt: "2026-09-10T12:00:00Z"
  },
  {
    id: "prop-9",
    title: "Prime DTCP Approved Residential Villa Plot",
    description: "Clear-title residential corner plot located in an upscale gated layout on Avinashi Road, Coimbatore. 40ft wide blacktop approach roads, underground drainage, street lighting, abundant groundwater, and fully fenced perimeter. Ready for immediate villa construction with 100% bank loan approval from top nationalized banks.",
    listingType: "sale",
    propertyType: "Plot",
    price: 6800000, // ₹68 Lakhs
    city: "Coimbatore",
    state: "Tamil Nadu",
    address: "Greenwood Enclave, Avinashi Road, Peelamedu",
    pincode: "641004",
    bedrooms: 0,
    bathrooms: 0,
    area: 2400, // sqft
    yearBuilt: 2025,
    parking: "Road Access",
    furnishedStatus: "Unfurnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Security",
      "Garden"
    ],
    features: [
      "Corner Plot with Dual Road Access",
      "DTCP & RERA Approved",
      "Underground Cabling & Drainage",
      "High Growth Appreciation Zone"
    ],
    agent: {
      id: "agent-3",
      name: "Karthik Subramanian",
      role: "Chennai & TN Regional Head",
      phone: "+91 94440 12987",
      email: "karthik.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 52
    },
    createdAt: "2026-09-11T15:30:00Z"
  },
  {
    id: "prop-10",
    title: "Premium 3 BHK Apartment in Banjara Hills",
    description: "Graceful 3-bedroom residence in the heart of elite Banjara Hills, Hyderabad. Offers expansive living rooms with Italian floor tiling, large west-facing sunset balconies, modular island kitchen, and dedicated servant room. Close proximity to GVK One mall, multi-specialty hospitals, and top consulates.",
    listingType: "sale",
    propertyType: "Apartment",
    price: 16500000, // ₹1.65 Cr
    city: "Hyderabad",
    state: "Telangana",
    address: "Road No. 12, Banjara Hills",
    pincode: "500034",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    yearBuilt: 2023,
    parking: "2 Covered Slots",
    furnishedStatus: "Semi-Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2b814a66?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Gym",
      "Swimming Pool",
      "Security",
      "Balcony",
      "Air Conditioning",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Prime Banjara Hills Address",
      "Sunset View Balcony",
      "Modern Island Kitchen",
      "24/7 Treated Water & Backup"
    ],
    agent: {
      id: "agent-4",
      name: "Ananya Reddy",
      role: "Rental & Sales Specialist",
      phone: "+91 98490 65432",
      email: "ananya.reddy@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
      rating: 4.7,
      reviewsCount: 22
    },
    createdAt: "2026-09-12T10:00:00Z"
  },
  {
    id: "prop-11",
    title: "Spacious 2 BHK Family Home for Rent in Viman Nagar",
    description: "Well-ventilated and sunlit 2 BHK flat situated in a prime gated community in Viman Nagar, Pune. Features two attached balconies, wooden flooring in master bedroom, modular kitchen with piped natural gas (PNG), and children's play park. Just 5 minutes from Pune International Airport and Phoenix Marketcity.",
    listingType: "rent",
    propertyType: "Apartment",
    price: 28000, // ₹28,000 / month
    city: "Pune",
    state: "Maharashtra",
    address: "Sky Vista Towers, Near Symbiosis Campus, Viman Nagar",
    pincode: "411014",
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    yearBuilt: 2022,
    parking: "1 Covered Car Parking",
    furnishedStatus: "Semi-Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Security",
      "Balcony",
      "Gym",
      "Garden",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Piped Gas Connection",
      "Children Play Area",
      "Walking Distance to Symbiosis",
      "Close to Airport"
    ],
    agent: {
      id: "agent-1",
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    },
    createdAt: "2026-09-13T17:00:00Z"
  },
  {
    id: "prop-12",
    title: "Luxury 5 BHK Triplex Penthouse in South City",
    description: "A trophy property overlooking Prince Anwar Shah Road with unmatched skyline vistas of Kolkata. Spanning three luxurious floors with internal private glass elevator, expansive double-height glass facade, banquet lounge, screening cinema room, and private open terrace with jacuzzi.",
    listingType: "sale",
    propertyType: "Penthouse",
    price: 32000000, // ₹3.2 Cr
    city: "Kolkata",
    state: "West Bengal",
    address: "South City Residencies, Prince Anwar Shah Road",
    pincode: "700068",
    bedrooms: 5,
    bathrooms: 6,
    area: 5600,
    yearBuilt: 2023,
    parking: "3 Covered Slots",
    furnishedStatus: "Fully Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Air Conditioning",
      "Balcony",
      "Security",
      "Garden",
      "WiFi",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Private Triplex Elevator",
      "Private Roof Jacuzzi",
      "Home Cinema Screening Room",
      "Direct South City Mall Access"
    ],
    agent: {
      id: "agent-5",
      name: "Vikram Singhania",
      role: "Commercial & Luxury Lead",
      phone: "+91 98110 99887",
      email: "vikram.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 45
    },
    createdAt: "2026-09-14T11:45:00Z"
  },
  {
    id: "prop-13",
    title: "Sprawling 4 BHK Independent Eco-Villa in ECR",
    description: "Beachfront independent luxury villa on East Coast Road, Chennai. Featuring direct private path access to the sandy beach, solar grid connectivity, rainwater harvesting system, private swimming pool, open terrace gym, and lush tropical coconut grove.",
    listingType: "sale",
    propertyType: "Villa",
    price: 38500000, // ₹3.85 Cr
    city: "Chennai",
    state: "Tamil Nadu",
    address: "Sea Breeze Avenue, Injambakkam, ECR",
    pincode: "600115",
    bedrooms: 4,
    bathrooms: 4,
    area: 3900,
    yearBuilt: 2024,
    parking: "3 Cars",
    furnishedStatus: "Semi-Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Garden",
      "Air Conditioning",
      "Security",
      "Balcony",
      "WiFi",
      "Parking"
    ],
    features: [
      "Direct Beach Access",
      "Zero-Carbon Solar Architecture",
      "Private Swimming Pool",
      "Spacious Outdoor Barbecue Deck"
    ],
    agent: {
      id: "agent-3",
      name: "Karthik Subramanian",
      role: "Chennai & TN Regional Head",
      phone: "+91 94440 12987",
      email: "karthik.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 52
    },
    createdAt: "2026-09-15T09:15:00Z"
  },
  {
    id: "prop-14",
    title: "Chic 1 BHK Fully Furnished Flat in Bandra West",
    description: "Super trendy 1 BHK apartment situated right on Pali Hill, Bandra West. Designed with Scandinavian minimalist aesthetics, ambient lighting, high ceilings, Italian modular kitchen, and smart entertainment system. Seconds from top celebrity cafes, yoga studios, and Carter Road promenade.",
    listingType: "rent",
    propertyType: "Apartment",
    price: 65000, // ₹65,000 / month
    city: "Mumbai",
    state: "Maharashtra",
    address: "Pali Hill Promenade, Bandra West",
    pincode: "400050",
    bedrooms: 1,
    bathrooms: 1,
    area: 680,
    yearBuilt: 2023,
    parking: "1 Reserved Slot",
    furnishedStatus: "Fully Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502005229762-ee1b2b814a66?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Air Conditioning",
      "WiFi",
      "Security",
      "Balcony",
      "Parking"
    ],
    features: [
      "Pali Hill Prime Address",
      "Designer Scandinavian Interiors",
      "Close to Carter Road Promenade",
      "Soundproof Acoustical Windows"
    ],
    agent: {
      id: "agent-1",
      name: "Rohit Malhotra",
      role: "Luxury Property Consultant",
      phone: "+91 98201 54321",
      email: "rohit.malhotra@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 38
    },
    createdAt: "2026-09-16T14:30:00Z"
  },
  {
    id: "prop-15",
    title: "Prime Commercial Retail Showroom on MG Road",
    description: "Unbeatable high-visibility ground floor retail commercial showroom on MG Road, Bangalore. 50-feet prominent glass frontage, 14-feet clear ceiling height, heavy foot traffic zone, centralized AC ducting, and dedicated rear loading dock. Ideal for luxury retail brands, electronics flagships, or high-end banking branches.",
    listingType: "rent",
    propertyType: "Commercial",
    price: 450000, // ₹4.5 Lakhs / month
    city: "Bangalore",
    state: "Karnataka",
    address: "MG Road Central Plaza, Near Trinity Metro Station",
    pincode: "560001",
    bedrooms: 0,
    bathrooms: 2,
    area: 3400,
    yearBuilt: 2024,
    parking: "4 Dedicated Slots + Valet",
    furnishedStatus: "Semi-Furnished",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Air Conditioning",
      "Security",
      "Parking",
      "WiFi",
      "Power Backup"
    ],
    features: [
      "50ft Main Road Glass Frontage",
      "Opposite Trinity Metro Station",
      "High Footfall Commercial Hotspot",
      "Dedicated Loading Bay"
    ],
    agent: {
      id: "agent-5",
      name: "Vikram Singhania",
      role: "Commercial Real Estate Lead",
      phone: "+91 98110 99887",
      email: "vikram.s@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      rating: 4.9,
      reviewsCount: 45
    },
    createdAt: "2026-09-17T09:40:00Z"
  },
  {
    id: "prop-16",
    title: "Luxury 3 BHK High-Rise Flat in Gachibowli",
    description: "Premium sun-drenched 3-bedroom apartment with panoramic skyline views of Hyderabad's financial district. Equipped with smart lighting, imported sanitaryware, modular kitchen, and double balconies. Amenities include temperature-controlled swimming pool, squash court, bowling alley, and 3-acre podium garden.",
    listingType: "sale",
    propertyType: "Apartment",
    price: 13500000, // ₹1.35 Cr
    city: "Hyderabad",
    state: "Telangana",
    address: "Financial District Boulevard, Gachibowli",
    pincode: "500032",
    bedrooms: 3,
    bathrooms: 3,
    area: 1950,
    yearBuilt: 2024,
    parking: "2 Covered Slots",
    furnishedStatus: "Semi-Furnished",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: [
      "Swimming Pool",
      "Gym",
      "Security",
      "Balcony",
      "Air Conditioning",
      "Garden",
      "Parking",
      "Power Backup"
    ],
    features: [
      "Panoramic Financial District View",
      "Temperature Controlled Indoor Pool",
      "Squash Court & Bowling Alley",
      "3-Acre Podium Green Park"
    ],
    agent: {
      id: "agent-4",
      name: "Ananya Reddy",
      role: "Rental & Sales Specialist",
      phone: "+91 98490 65432",
      email: "ananya.reddy@estatehub.com",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
      rating: 4.7,
      reviewsCount: 22
    },
    createdAt: "2026-09-18T10:15:00Z"
  }
];

// Preconfigured demo user accounts for instant testing
const INITIAL_USERS = [
  {
    id: "user-agent-1",
    fullName: "Aarav Sharma",
    email: "aarav.agent@estatehub.com",
    phone: "+91 98765 43210",
    password: "password123",
    role: "agent",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    createdAt: "2026-08-01T00:00:00Z"
  },
  {
    id: "user-buyer-1",
    fullName: "Priya Sundaram",
    email: "priya.buyer@estatehub.com",
    phone: "+91 91234 56789",
    password: "password123",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    createdAt: "2026-08-10T00:00:00Z"
  }
];

// Preconfigured sample inquiries
const INITIAL_INQUIRIES = [
  {
    id: "inq-1",
    propertyId: "prop-1",
    propertyTitle: "Luxurious 4 BHK Sea-Facing Penthouse",
    propertyPrice: 185000000,
    propertyImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    senderName: "Siddharth Oberoi",
    senderEmail: "siddharth.o@gmail.com",
    senderPhone: "+91 98210 99881",
    message: "Hi Rohit, I am interested in scheduling a private site visit for this penthouse this upcoming Saturday morning. Please confirm availability.",
    createdAt: "2026-09-19T14:20:00Z",
    status: "new"
  },
  {
    id: "inq-2",
    propertyId: "prop-4",
    propertyTitle: "Premium 2 BHK Modern Apartment for Rent in Hitec City",
    propertyPrice: 45000,
    propertyImage: "https://images.unsplash.com/photo-1502005229762-ee1b2b814a66?auto=format&fit=crop&w=600&q=80",
    senderName: "Meera Krishnan",
    senderEmail: "meera.k@gmail.com",
    senderPhone: "+91 97001 23456",
    message: "Hello Ananya, is this 2 BHK apartment available for immediate occupancy? What is the expected security deposit?",
    createdAt: "2026-09-20T09:15:00Z",
    status: "replied"
  }
];

// Initial favorite IDs for demo experience
const INITIAL_FAVORITES = ["prop-1", "prop-2", "prop-4"];
