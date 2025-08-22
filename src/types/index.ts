import { FieldValue } from "firebase/firestore";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
  password_confirm?: string;
}

export interface Influencer {
  id: number;
  handle: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  followers: number;
  engagementRate: number;
  bio: string;
  city: string;
  category: 'Fashion' | 'Fitness' | 'Food' | 'Travel' | 'Tech';
}

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  status?: 'active' | 'disabled';
  createdAt: FieldValue;
  photoURL?: string | null;
}

export interface AnalyticsData {
  totalUsers: number;
  totalSearches: number;
  categoryDistribution: { name: string; value: number }[];
}
