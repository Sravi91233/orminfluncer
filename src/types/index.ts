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
  id: number;
  handle: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  followers: number;
  engagementRate: number;
  bio: string;
  city: string;
  country?: string;
  category: 'Fashion' | 'Fitness' | 'Food' | 'Travel' | 'Tech';
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
