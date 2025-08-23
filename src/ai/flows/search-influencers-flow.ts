'use server';

/**
 * @fileOverview An AI agent that searches for influencers using an external API.
 */
import { ai } from '@/ai/genkit';
import { getApiKey, updateApiKeyLastUsed } from '@/services/api-key-service';
import { SearchInfluencersInputSchema, SearchInfluencersOutputSchema, Influencer } from '@/types';
import { z } from 'zod';

export async function searchInfluencers(
  input: z.infer<typeof SearchInfluencersInputSchema>
): Promise<z.infer<typeof SearchInfluencersOutputSchema>> {
  return searchInfluencersFlow(input);
}

const searchInfluencersFlow = ai.defineFlow(
  {
    name: 'searchInfluencersFlow',
    inputSchema: SearchInfluencersInputSchema,
    outputSchema: SearchInfluencersOutputSchema,
  },
  async (input) => {
    const apiKeyData = await getApiKey('x-rapidapi-key');

    if (!apiKeyData) {
      return {
        success: false,
        message: 'API key for influencer search is not configured. Please contact support.',
        results: [],
      };
    }

    const { city, category, platform, bio, currentPage = 1 } = input;
    
    const queryParams = new URLSearchParams({
        current_page: currentPage.toString()
    });

    if (city && city !== 'Any City') queryParams.append('country', city); // The API seems to use country filter for cities
    if (category) queryParams.append('category', category);
    if (platform && platform !== 'Any Platform') queryParams.append('connector', platform.toLowerCase());
    if (bio) queryParams.append('bio', bio);


    const url = `https://ylytic-influencers-api.p.rapidapi.com/ylytic/admin/api/v1/discovery?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKeyData.keyValue,
          'x-rapidapi-host': 'ylytic-influencers-api.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error (${response.status}): ${errorText}`);
        throw new Error(`Failed to fetch influencers. Status: ${response.status}`);
      }

      const data = await response.json();

      const results: Influencer[] = (data.creators || []).map((creator: any, index: number) => ({
        id: creator.handle_link || index, // Use handle_link as a unique ID
        handle: creator.handle,
        platform: creator.connector.charAt(0).toUpperCase() + creator.connector.slice(1),
        followers: creator.followers || 0,
        engagementRate: creator.engagement || 0,
        bio: creator.bio || '',
        city: creator.city || 'N/A',
        country: creator.country || 'N/A',
        category: creator.category || 'N/A',
      }));

      // Update the lastUsed timestamp without waiting for it to complete
      updateApiKeyLastUsed(apiKeyData.id);

      return {
        success: true,
        message: 'Search successful.',
        results,
      };
    } catch (error: any) {
      console.error('Error in searchInfluencersFlow:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred during the search.',
        results: [],
      };
    }
  }
);
