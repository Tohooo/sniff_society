export type FragranceCategory = 'Woody' | 'Oriental' | 'Fresh' | 'Floral' | 'Gourmand' | 'Leather';
export type FragranceGender = 'Unisex' | 'Pour Homme' | 'Pour Femme';
export type DecantSize = '2ml' | '3ml' | '5ml' | '10ml';

export interface OlfactoryPyramid {
  top: string[];
  mid: string[];
  base: string[];
}

export interface Fragrance {
  id: string;
  brand: string;
  name: string;
  subtitle?: string;
  category: FragranceCategory;
  gender: FragranceGender;
  concentration: string;
  image: string;
  notes: OlfactoryPyramid;
  perfumer: string;
  releaseYear: number;
  batchCode: string;
  originCountry: string;
  rating: number; // e.g. 4.8
  ratingCount: number;
  ratingsBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  votes: number;
  longevity: string; // e.g. "10-12 Jam"
  sillage: string; // e.g. "Strong / Room Filler"
  season: string; // e.g. "Fall / Winter / Night"
  decantPricing: Record<DecantSize, number>;
  shopeeUrl: string;
  isWinner?: boolean;
  winnerRank?: 1 | 2 | 3;
  description: string;
}

export interface Review {
  id: string;
  fragranceId: string;
  fragranceName: string;
  author: string;
  rating: number;
  date: string;
  longevityRating: 'Eterna (12h+)' | 'Long Lasting (8-10h)' | 'Moderate (4-6h)' | 'Intimate (2-4h)';
  sillageRating: 'Enormous' | 'Strong' | 'Moderate' | 'Intimate';
  comment: string;
  tags: string[];
  helpfulCount: number;
  verifiedDecantBuyer: boolean;
}

export interface Suggestion {
  id: string;
  author: string;
  title: string;
  description: string;
  upvotes: number;
  userUpvoted?: boolean;
  status: 'in_review' | 'planned' | 'implemented';
  category: 'Request Parfum' | 'Packaging & Botol' | 'Sistem Voting' | 'Layanan Shopee';
  date: string;
  adminReply?: string;
}

export interface UserProfile {
  role: 'guest' | 'member' | 'superadmin';
  name: string;
  email: string;
  phone: string;
  votedIds: string[]; // maximum 3 votes
  maxVotes: number;
  waSubscribed: boolean;
}
