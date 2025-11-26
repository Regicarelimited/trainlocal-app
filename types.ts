export interface TrainerProfile {
  id: string | number;
  name: string;
  businessName: string;
  location: string;
  rating: number;
  reviews: number;
  specialisms: string[];
  image: string;
  logo?: string;
  logoImage?: string;
  customLogo?: React.ReactNode;
  logoColor?: string;
  price: string;
  bio: string;
  availability: string;
  voice?: string;
  email?: string;
  audioUrl?: string;
}

export interface Lead {
  id: number;
  name: string;
  date: string;
  interest: string;
  attended: boolean;
  signedUp: boolean;
  rating: number | null;
  review: string | null;
}

export type ViewState = 'home' | 'claim' | 'login' | 'dashboard' | 'how-it-works';

export interface BookingFormData {
  name: string;
  email: string;
  mobile: string;
  interests: string[];
  otherInterest: string;
  availability: string[];
  message: string;
  trainer: string;
  trainerId: string | number;
}
