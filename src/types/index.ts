export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials extends LoginCredentials {
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
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
}

export interface AnalyticsData {
  totalUsers: number;
  totalSearches: number;
  categoryDistribution: { name: string; value: number }[];
}
