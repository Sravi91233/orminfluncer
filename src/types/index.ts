import { FieldValue } from "firebase/firestore";
import { z } from 'zod';

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
  password_confirm?: string;
  otp?: string;
  otpForVerification?: string;
}

export interface Influencer {
  id: string;
  handle: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | string;
  followers: number;
  engagementRate: number;
  bio: string;
  city: string;
  country?: string;
  category: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  status?: 'active' | 'disabled';
  subscription?: 'Free' | 'Premium';
  lastLogin?: string;
  createdAt: FieldValue;
  photoURL?: string | null;
}

export interface AppCity {
  id: string;
  name: string;
  state: string;
}

export interface ApiKey {
  id: string;
  serviceName: string;
  keyValue: string;
  status: 'active' | 'expired';
  lastUsed: FieldValue;
}


export interface AnalyticsData {
  totalUsers: number;
  totalSearches: number;
  categoryDistribution: { name: string; value: number }[];
}

// Schema for sending OTP
export const SendOtpInputSchema = z.object({
  email: z.string().email(),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

export const SendOtpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  otp: z.string().optional(),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;


// Schema for verifying OTP
export const VerifyOtpInputSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpInputSchema>;

export const VerifyOtpOutputSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});
export type VerifyOtpOutput = z.infer<typeof VerifyOtpOutputSchema>;


export const SendPasswordResetInputSchema = z.object({
  email: z.string().email(),
});
export type SendPasswordResetInput = z.infer<typeof SendPasswordResetInputSchema>;

export const SendPasswordResetOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendPasswordResetOutput = z.infer<typeof SendPasswordResetOutputSchema>;

export const InfluencerSchema = z.object({
    id: z.string(),
    handle: z.string(),
    platform: z.string(),
    followers: z.number(),
    engagementRate: z.number(),
    bio: z.string(),
    city: z.string(),
    country: z.string().optional(),
    category: z.string(),
});

// Schema for influencer search
export const SearchInfluencersInputSchema = z.object({
  city: z.string().optional(),
  category: z.string().optional(),
  platform: z.string().optional(),
  bio: z.string().optional(),
  currentPage: z.number().optional(),
});
export type SearchInfluencersInput = z.infer<typeof SearchInfluencersInputSchema>;

export const SearchInfluencersOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  results: z.array(InfluencerSchema),
  totalPages: z.number(),
  currentPage: z.number(),
});
export type SearchInfluencersOutput = z.infer<typeof SearchInfluencersOutputSchema>;


// Schema for fetching cached influencers
export const GetCachedInfluencersInputSchema = z.object({
  city: z.string().min(1, 'City is required.'),
  platform: z.string().optional(),
});
export type GetCachedInfluencersInput = z.infer<typeof GetCachedInfluencersInputSchema>;

export const GetCachedInfluencersOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  results: z.array(InfluencerSchema),
});
export type GetCachedInfluencersOutput = z.infer<typeof GetCachedInfluencersOutputSchema>;
