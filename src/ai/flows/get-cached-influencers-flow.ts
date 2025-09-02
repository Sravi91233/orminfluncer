
'use server';

/**
 * @fileOverview A flow for fetching cached influencer data from Firestore.
 */

import { z } from 'zod';
import { ai } from '@/ai/genkit';
import { getInfluencersFromFirestore } from '@/services/influencer-service';
import { InfluencerSchema } from '@/types';

export const GetCachedInfluencersInputSchema = z.object({
  city: z.string().min(1, 'City is required.'),
  platform: z.string().optional(),
});

export const GetCachedInfluencersOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  results: z.array(InfluencerSchema),
});


export async function getCachedInfluencers(
  input: z.infer<typeof GetCachedInfluencersInputSchema>
): Promise<z.infer<typeof GetCachedInfluencersOutputSchema>> {
  return getCachedInfluencersFlow(input);
}


const getCachedInfluencersFlow = ai.defineFlow(
  {
    name: 'getCachedInfluencersFlow',
    inputSchema: GetCachedInfluencersInputSchema,
    outputSchema: GetCachedInfluencersOutputSchema,
  },
  async (input) => {
    try {
      const influencers = await getInfluencersFromFirestore(input.city, input.platform);
      return {
        success: true,
        message: 'Successfully fetched cached influencers.',
        results: influencers,
      };
    } catch (error: any) {
      console.error('[getCachedInfluencersFlow] Error fetching from Firestore:', error);
      return {
        success: false,
        message: 'Failed to fetch cached influencers.',
        results: [],
      };
    }
  }
);
