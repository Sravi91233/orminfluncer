import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-search-terms.ts';
import '@/ai/flows/send-otp-flow.ts';
import '@/ai/flows/verify-otp-flow.ts';
import '@/ai/flows/send-password-reset-flow.ts';
import '@/ai/flows/search-influencers-flow.ts';
