
export enum Language {
  ITALIAN = 'it',
  ENGLISH = 'en',
  ENGLISH_UK = 'en-GB',
  ENGLISH_US = 'en-US',
  GREEK = 'el',
  POLISH = 'pl',
  FRENCH = 'fr',
  SPANISH = 'es'
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Announcement {
  id: string;
  text: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
}

export interface VideoItem {
  url: string;
  borderColor?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface LandingPageContent {
  title: string;
  description: string;
  ctaText: string;
  features: string[];
  sellingPoints?: string[];
  videoUrls?: string[]; 
  videoBorderColor?: string; 
  videoItems?: VideoItem[];
  reviews: Review[];
  announcements?: Announcement[];
  announcementInterval?: number; // in secondi
  topBannerText?: string; 
  urgencyText?: string;
  price?: string;
  oldPrice?: string;
  discountLabel?: string;
  guaranteeText?: string;
  socialProofText?: string;
  socialProofName?: string;
  socialProofCount?: number;
  timelineSteps?: string[];
  purchaseFormHtml?: string;
  stockCount?: number;
  popupCount?: number;
  popupInterval?: number;
}

export interface LandingPage {
  id: string;
  slug: string;
  productName: string;
  imageUrl: string;
  additionalImages?: string[];
  buyLink: string;
  baseLanguage: Language;
  niche?: string;
  targetAudience?: string;
  tone?: string;
  translations: Record<string, LandingPageContent>;
  createdAt: string;
}

export interface AppState {
  pages: LandingPage[];
}
