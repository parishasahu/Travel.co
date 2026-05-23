export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Stay {
  name: string;
  image: string;
  price: string;
  amenities: string[];
  rating: number;
}

export interface Guide {
  bestPlaces: string[];
  restaurants: string[];
  hiddenGems: string[];
  activities: string[];
  culture: string;
  weather: string;
  tips: string[];
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  date: string;
  profileImage: string;
}

export interface DestinationDetail {
  id: string;
  title: string;
  tagline: string;
  heroImage: string;
  introduction: string;
  packageOverview: {
    duration: string;
    startingPrice: string;
    bestSeason: string;
    idealFor: string;
    luxuryRating: string;
  };
  experienceIncludes: string[];
  itinerary: ItineraryDay[];
  gallery: string[];
  guide: Guide;
  stays: Stay[];
  reviews: {
    averageRating: string;
    totalReviews: string;
    items: Review[];
  };
}

export const destinationDetails: Record<string, DestinationDetail> = {
  maldives: {
    id: 'maldives',
    title: 'MALDIVES',
    tagline: 'Where the ocean becomes your private sanctuary.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80',
    introduction: 'Escape to a world of unparalleled luxury where overwater villas meet bioluminescent shores. The Maldives offers an exclusive retreat designed for those seeking ultimate privacy and bespoke ocean experiences.',
    packageOverview: {
      duration: '7 Days / 6 Nights',
      startingPrice: '$15,000 per couple',
      bestSeason: 'November to April',
      idealFor: 'Honeymoons, Ultimate Relaxation, Diving',
      luxuryRating: '5/5 (Ultra Premium)'
    },
    experienceIncludes: [
      'Private overwater villa with infinity pool',
      'Round-trip seaplane transfers',
      '24/7 personal butler service',
      'Daily champagne breakfast',
      'Private sandbank dining experience',
      'Guided marine biology snorkeling',
      'Couples spa journey'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Welcome', description: 'Arrive in Malé, VIP fast-track immigration, followed by a scenic seaplane transfer to your private island resort. Evening welcome champagne reception.' },
      { day: 2, title: 'Ocean Immersion', description: 'Morning guided snorkeling on the house reef. Afternoon at leisure in your overwater villa. Sunset dolphin cruise on a luxury yacht.' },
      { day: 3, title: 'Culinary Journey', description: 'Private cooking masterclass with the Executive Chef. Evening underwater dining experience at the exclusive submerged restaurant.' },
      { day: 4, title: 'Wellness Retreat', description: 'Full day dedicated to rejuvenation with bespoke spa treatments utilizing local indigenous ingredients and holistic therapies.' },
      { day: 5, title: 'Castaway Experience', description: 'Helicopter drop-off on a deserted sandbank for a private picnic. The afternoon is yours to swim and relax in total seclusion.' },
      { day: 6, title: 'Farewell Gala', description: 'A final day of leisure followed by a spectacular beachfront private barbecue beneath the stars.' },
      { day: 7, title: 'Departure', description: 'Leisurely breakfast before your private seaplane transfer back to Malé for your onward journey.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
      'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1573273181829-4d6b63d9da1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    guide: {
      bestPlaces: ['Baa Atoll Biosphere Reserve', 'Vaadhoo Island (Bioluminescent Beach)', 'Underwater Restaurants'],
      restaurants: ['Ithaa Undersea Restaurant', 'Subsix', '5.8 Undersea Restaurant'],
      hiddenGems: ['Hanifaru Bay for manta rays', 'Local island cultural tours'],
      activities: ['Night snorkeling', 'Big game fishing', 'Coral planting'],
      culture: 'Maldivian culture is a rich blend of South Indian, Sinhalese, and Arab influences, deeply connected to the sea.',
      weather: 'Tropical year-round. Dry season is Nov-April, making it the perfect winter escape.',
      tips: ['Pack reef-safe sunscreen', 'Bring an underwater camera', 'Respect local customs if visiting inhabited islands']
    },
    stays: [
      {
        name: 'The St. Regis Vommuli Resort',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        price: '$2,500 / night',
        amenities: ['Private Pool', 'Butler', 'Iridium Spa', 'House Reef'],
        rating: 5
      },
      {
        name: 'Soneva Jani',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        price: '$3,200 / night',
        amenities: ['Water Slide', 'Retractable Roof', 'Cinema Paradiso', 'Observatory'],
        rating: 5
      }
    ],
    reviews: {
      averageRating: '4.9',
      totalReviews: '2,400+',
      items: [
        {
          id: 'r1',
          name: 'Eleanor Thompson',
          country: 'United Kingdom',
          rating: 5,
          text: 'One of the most breathtaking luxury experiences we’ve ever had. From the moment the seaplane touched down, the service was flawless. The overwater villa was a sanctuary of peace.',
          date: 'March 2026',
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'r2',
          name: 'James Reynolds',
          country: 'United States',
          rating: 5,
          text: 'The private villa and underwater dining were unforgettable. Our concierge anticipated every need before we even voiced it. A true masterclass in luxury hospitality.',
          date: 'February 2026',
          profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'r3',
          name: 'Sophia Chen',
          country: 'Singapore',
          rating: 5,
          text: 'Everything felt cinematic and deeply personalized. The sunset yacht cruise and the exclusive spa treatments made our honeymoon absolutely magical.',
          date: 'January 2026',
          profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  },
  santorini: {
    id: 'santorini',
    title: 'SANTORINI',
    tagline: 'Aegean sunsets and white cliffside architecture.',
    heroImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    introduction: 'Immerse yourself in the mythic beauty of the Cyclades. Santorini offers a dramatic landscape of volcanic cliffs, azure waters, and an ambiance steeped in ancient romance.',
    packageOverview: {
      duration: '5 Days / 4 Nights',
      startingPrice: '$8,500 per couple',
      bestSeason: 'May to October',
      idealFor: 'Romance, Photography, Gastronomy',
      luxuryRating: '4.8/5 (Premium)'
    },
    experienceIncludes: [
      'Luxury cliffside suite in Oia',
      'Private catamaran sunset cruise',
      'Exclusive wine tasting at an ancient vineyard',
      'Helicopter tour of the caldera',
      'Private dining overlooking the Aegean'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Oia', description: 'Private transfer to your cliffside suite. Enjoy a welcome dinner featuring modern Greek gastronomy.' },
      { day: 2, title: 'Caldera Cruise', description: 'Morning at leisure. Afternoon private catamaran charter exploring the volcanic hot springs, culminating in a sunset dinner on board.' },
      { day: 3, title: 'Wine & Heritage', description: 'Exclusive tour of Santorini\'s ancient vineyards, learning about the unique volcanic terroir, followed by a sommelier-led tasting.' },
      { day: 4, title: 'Helicopter Views', description: 'A thrilling morning helicopter flight over the caldera. Afternoon free for shopping in Fira.' },
      { day: 5, title: 'Departure', description: 'Farewell breakfast before a private transfer to the airport.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1516483638261-f40af5ff0961?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    guide: {
      bestPlaces: ['Oia Castle', 'Akrotiri Archaeological Site', 'Amoudi Bay'],
      restaurants: ['Ambrosia', 'Lycabettus', 'Sunset Ammoudi by Paraskevas'],
      hiddenGems: ['Megalochori village', 'Eros Beach'],
      activities: ['Wine tasting', 'Sailing', 'Photography tours'],
      culture: 'Rooted in ancient Minoan civilization, influenced by centuries of Venetian and Ottoman rule.',
      weather: 'Mediterranean climate. Hot, dry summers and mild winters.',
      tips: ['Wear comfortable walking shoes for the cobblestones', 'Book dinner reservations months in advance']
    },
    stays: [
      {
        name: 'Canaves Oia Epitome',
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        price: '$1,800 / night',
        amenities: ['Private Plunge Pool', 'Sunset Views', 'Fine Dining', 'Spa'],
        rating: 5
      }
    ],
    reviews: {
      averageRating: '4.8',
      totalReviews: '1,200+',
      items: [
        {
          id: 's1',
          name: 'Charlotte Dubois',
          country: 'France',
          rating: 5,
          text: 'The view from our private plunge pool in Oia was unrivaled. The team curated an exceptional private dining experience under the stars.',
          date: 'April 2026',
          profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 's2',
          name: 'Mark & Sarah Henderson',
          country: 'Australia',
          rating: 5,
          text: 'Our catamaran sunset cruise was the highlight of our trip. The attention to detail and luxury touches made it feel like a dream.',
          date: 'May 2026',
          profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  },
  kyoto: {
    id: 'kyoto',
    title: 'KYOTO',
    tagline: 'Ancient tranquility in cinematic street scenes.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    introduction: 'Step into a world where time stands still. Kyoto is the cultural heart of Japan, offering exclusive access to hidden temples, private tea ceremonies, and unparalleled hospitality.',
    packageOverview: {
      duration: '8 Days / 7 Nights',
      startingPrice: '$14,000 per couple',
      bestSeason: 'March-May (Spring) or Oct-Nov (Autumn)',
      idealFor: 'Culture, Serenity, Culinary Arts',
      luxuryRating: '5/5 (Ultra Premium)'
    },
    experienceIncludes: [
      'Luxury traditional ryokan stay',
      'Private tea ceremony with a Geisha',
      'Exclusive after-hours temple access',
      'Michelin-starred Kaiseki dining',
      'Guided Zen meditation session'
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Omotenashi', description: 'Arrive via bullet train. Private transfer to a luxury ryokan. Experience traditional Japanese hospitality and a multi-course kaiseki dinner.' },
      { day: 2, title: 'Eastern Kyoto', description: 'Private tour of Kiyomizu-dera and the historic Higashiyama district. Evening geisha performance in Gion.' },
      { day: 3, title: 'Zen & Gardens', description: 'Early morning private meditation session at a Zen temple. Afternoon exploring the Arashiyama bamboo grove.' },
      { day: 4, title: 'Culinary Deep Dive', description: 'Visit Nishiki Market with a master chef followed by a private cooking class. Evening at leisure.' },
      { day: 5, title: 'Hidden Temples', description: 'Exclusive access to temples usually closed to the public. Afternoon private tea ceremony.' },
      { day: 6, title: 'Art & Craft', description: 'Meet with local artisans specializing in ceramics and textiles. Shopping in luxury boutiques.' },
      { day: 7, title: 'Farewell Dinner', description: 'A spectacular farewell dinner at a 3-Michelin star restaurant overlooking the Kamo River.' },
      { day: 8, title: 'Departure', description: 'Private transfer back to the station or airport.' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      'https://images.unsplash.com/photo-1558862107-d49ef2a04d72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ],
    guide: {
      bestPlaces: ['Kinkaku-ji (Golden Pavilion)', 'Fushimi Inari Taisha', 'Arashiyama Bamboo Grove'],
      restaurants: ['Kikunoi', 'Hyotei', 'Gion Sasaki'],
      hiddenGems: ['Otagi Nenbutsu-ji', 'Shoren-in Temple'],
      activities: ['Tea ceremony', 'Kimono wearing', 'Zazen meditation'],
      culture: 'The epicenter of traditional Japanese culture, steeped in Buddhism and Shintoism.',
      weather: 'Distinct four seasons. Spring and Autumn are stunning but crowded.',
      tips: ['Respect photography rules in temple grounds', 'Always carry cash for smaller artisans']
    },
    stays: [
      {
        name: 'Aman Kyoto',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        price: '$2,800 / night',
        amenities: ['Onsen', 'Forest Setting', 'Minimalist Design', 'Exceptional Dining'],
        rating: 5
      }
    ],
    reviews: {
      averageRating: '5.0',
      totalReviews: '850+',
      items: [
        {
          id: 'k1',
          name: 'David & Emily Foster',
          country: 'Canada',
          rating: 5,
          text: 'The private tea ceremony was a transcendent experience. We felt completely immersed in Kyoto’s heritage, yet surrounded by ultimate luxury.',
          date: 'November 2025',
          profileImage: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  }
};

// Fallback for missing destinations
const fallbackDetails: DestinationDetail = {
  id: 'fallback',
  title: 'LUXURY ESCAPE',
  tagline: 'An unforgettable journey into the extraordinary.',
  heroImage: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?ixlib=rb-4.0.3&auto=format&fit=crop&w=2159&q=80',
  introduction: 'Discover a destination that redefines luxury. From breathtaking landscapes to world-class hospitality, this bespoke experience is crafted for those who demand nothing but the best.',
  packageOverview: {
    duration: '7 Days / 6 Nights',
    startingPrice: '$10,000 per couple',
    bestSeason: 'Year-round',
    idealFor: 'Adventure, Relaxation, Cultural Immersion',
    luxuryRating: '4.9/5 (Premium)'
  },
  experienceIncludes: [
    '5-star accommodation',
    'Private airport transfers',
    'Personal concierge service',
    'Curated local experiences',
    'Gourmet dining reservations'
  ],
  itinerary: [
    { day: 1, title: 'Arrival', description: 'VIP airport arrival and private transfer to your luxury accommodation.' },
    { day: 2, title: 'Exploration', description: 'A guided tour of the region\'s most iconic sights with a private expert.' },
    { day: 3, title: 'Leisure', description: 'A day at your own pace, enjoying the premium amenities of your resort.' },
    { day: 4, title: 'Culinary Delight', description: 'An exclusive dining experience featuring local gastronomy.' },
    { day: 5, title: 'Adventure', description: 'A curated excursion tailored to your interests.' },
    { day: 6, title: 'Relaxation', description: 'Spa and wellness treatments to rejuvenate.' },
    { day: 7, title: 'Departure', description: 'Private transfer for your journey home.' }
  ],
  gallery: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
  ],
  guide: {
    bestPlaces: ['Iconic Landmarks', 'Exclusive Reserves'],
    restaurants: ['Michelin-starred venues', 'Chef\'s table experiences'],
    hiddenGems: ['Private estates', 'Secret viewpoints'],
    activities: ['Private tours', 'Helicopter flights'],
    culture: 'Rich local traditions and vibrant modern lifestyle.',
    weather: 'Favorable conditions year-round for luxury travel.',
    tips: ['Pack elegant evening wear', 'Trust your concierge for recommendations']
  },
  stays: [
    {
      name: 'The Grand Reserve',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      price: '$1,500 / night',
      amenities: ['Spa', 'Infinity Pool', 'Fine Dining', 'Butler'],
      rating: 5
    }
  ],
  reviews: {
    averageRating: '4.9',
    totalReviews: '1,500+',
    items: [
      {
        id: 'f1',
        name: 'Luxury Traveler',
        country: 'Global',
        rating: 5,
        text: 'An absolutely flawless execution of bespoke travel. Every detail was meticulously planned.',
        date: 'Recent',
        profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      }
    ]
  }
};

export const getDestinationDetails = (id: string): DestinationDetail => {
  return destinationDetails[id] || { ...fallbackDetails, id, title: id.toUpperCase() };
};
