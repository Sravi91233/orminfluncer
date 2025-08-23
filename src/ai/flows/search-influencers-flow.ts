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
    // TODO: Replace this hardcoded key with a call to a secure Cloud Function
    // that retrieves the key from Firestore. This is a temporary fix to bypass
    // Firestore security rule issues during development.
    const apiKey = 'ed81c08da2msh81f3e4df68af3ebp1c9d7ajsn929105d62758';
    
    // The original call to get the key from Firestore. This will be restored
    // once a secure server-to-server authentication method is in place.
    // const apiKeyData = await getApiKey('x-rapidapi-key');
    // if (!apiKeyData) {
    //   return {
    //     success: false,
    //     message: 'API key for influencer search is not configured. Please contact support.',
    //     results: [],
    //   };
    // }

    const { city, category, platform, bio, currentPage = 1 } = input;
    
    const queryParams = new URLSearchParams({
        current_page: currentPage.toString()
    });

    if (city && city !== 'Any City') queryParams.append('country', city); // The API seems to use country filter for cities
    if (category) queryParams.append('category', category);
    if (platform && platform !== 'any') queryParams.append('connector', platform.toLowerCase());
    if (bio) queryParams.append('bio', bio);


    const url = `https://ylytic-influencers-api.p.rapidapi.com/ylytic/admin/api/v1/discovery?${queryParams.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
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

      // This will be re-enabled when the key is fetched from Firestore again.
      // updateApiKeyLastUsed(apiKeyData.id);

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
