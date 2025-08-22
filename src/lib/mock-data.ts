import type { Influencer, AppUser, AnalyticsData } from '@/types';

export const influencers: Influencer[] = [
  { id: 1, handle: '@stylemaven', platform: 'Instagram', followers: 150000, engagementRate: 3.5, bio: 'Fashion enthusiast & daily outfits.', city: 'New York', category: 'Fashion' },
  { id: 2, handle: '@fitlifejess', platform: 'TikTok', followers: 500000, engagementRate: 12.1, bio: 'Fitness tips and workout routines.', city: 'Los Angeles', category: 'Fitness' },
  { id: 3, handle: '@foodieadventures', platform: 'YouTube', followers: 75000, engagementRate: 5.2, bio: 'Exploring the best eats in town.', city: 'Chicago', category: 'Food' },
  { id: 4, handle: '@wanderlust_lisa', platform: 'Instagram', followers: 220000, engagementRate: 4.1, bio: 'Traveling the world one photo at a time.', city: 'London', category: 'Travel' },
  { id: 5, handle: '@tech_guru', platform: 'YouTube', followers: 1200000, engagementRate: 7.8, bio: 'Unboxing the latest gadgets.', city: 'San Francisco', category: 'Tech' },
  { id: 6, handle: '@citystyle', platform: 'Instagram', followers: 85000, engagementRate: 2.8, bio: 'Urban fashion inspiration from Paris.', city: 'Paris', category: 'Fashion' },
  { id: 7, handle: '@yogabunny', platform: 'Instagram', followers: 300000, engagementRate: 6.2, bio: 'Daily yoga flows and mindfulness.', city: 'Miami', category: 'Fitness' },
  { id: 8, handle: '@kitchenhacks', platform: 'TikTok', followers: 1200000, engagementRate: 15.3, bio: 'Simple recipes for busy people.', city: 'Toronto', category: 'Food' },
  { id: 9, handle: '@globetrotter_dave', platform: 'YouTube', followers: 95000, engagementRate: 4.5, bio: 'Backpacking across Southeast Asia.', city: 'Bangkok', category: 'Travel' },
  { id: 10, handle: '@gadgetgirl', platform: 'TikTok', followers: 800000, engagementRate: 10.5, bio: 'Cool tech you didnt know you needed.', city: 'Austin', category: 'Tech' },
  { id: 11, handle: '@tokyotrends', platform: 'Instagram', followers: 180000, engagementRate: 5.5, bio: 'Street style from the heart of Tokyo.', city: 'Tokyo', category: 'Fashion' },
  { id: 12, handle: '@marathonman', platform: 'Instagram', followers: 55000, engagementRate: 8.1, bio: 'Training for my next marathon.', city: 'Boston', category: 'Fitness' },
  { id: 13, handle: '@sweettooth', platform: 'TikTok', followers: 250000, engagementRate: 11.2, bio: 'Baking the most decadent desserts.', city: 'New York', category: 'Food' },
];

export const users: AppUser[] = [
  { id: 'user1', email: 'admin@example.com', role: 'admin', status: 'active' },
  { id: 'user2', email: 'user1@example.com', role: 'user', status: 'active' },
  { id: 'user3', email: 'user2@example.com', role: 'user', status: 'disabled' },
  { id: 'user4', email: 'user3@example.com', role: 'user', status: 'active' },
];

export const analytics: AnalyticsData = {
  totalUsers: 152,
  totalSearches: 4321,
  categoryDistribution: [
    { name: 'Fashion', value: 1234 },
    { name: 'Food', value: 987 },
    { name: 'Fitness', value: 876 },
    { name: 'Travel', value: 765 },
    { name: 'Tech', value: 459 },
  ],
};
