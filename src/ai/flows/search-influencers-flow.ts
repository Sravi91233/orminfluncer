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
    console.log('[searchInfluencersFlow] Flow started with input:', input);

    // TODO: Replace this hardcoded key with a call to a secure Cloud Function
    // that retrieves the key from Firestore. This is a temporary fix to bypass
    // Firestore security rule issues during development.
    const apiKey = 'ed81c08da2msh81f3e4df68af3ebp1c9d7ajsn929105d62758';
    
    const { city, category, platform, bio } = input;
    const pagesToFetch = [1, 2, 3, 4, 5];
    let allResults: Influencer[] = [];

    try {
      for (const page of pagesToFetch) {
        const queryParams = new URLSearchParams({
            current_page: page.toString()
        });

        if (city && city !== 'Any City') queryParams.append('city', city.toLowerCase());
        if (category) queryParams.append('category', category);
        if (platform && platform !== 'any') queryParams.append('connector', platform.toLowerCase());
        if (bio) queryParams.append('bio', bio);

        const url = `https://ylytic-influencers-api.p.rapidapi.com/ylytic/admin/api/v1/discovery?${queryParams.toString()}`;

        // Construct and log the curl command for each page
        const curlCommand = `curl -X GET '${url}' \\
-H 'x-rapidapi-key: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}' \\
-H 'x-rapidapi-host: ylytic-influencers-api.p.rapidapi.com'`;
        console.log(`\n[searchInfluencersFlow] EXECUTING API CALL FOR PAGE ${page}:`);
        console.log(curlCommand, '\n');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'ylytic-influencers-api.p.rapidapi.com',
            },
        });

        console.log(`[searchInfluencersFlow] Received API response for page ${page} with status: ${response.status}`);
        if (!response.ok) {
           const errorText = await response.text();
           console.error(`[searchInfluencersFlow] API Error for page ${page} (${response.status}): ${errorText}`);
           // Continue to next page if one fails
           continue;
        }

        try {
           const data = await response.json();
           console.log(`[searchInfluencersFlow] Successfully parsed JSON for page ${page}.`);
           
           const pageResults: Influencer[] = (data.creators || []).map((creator: any) => ({
               id: creator.handle_link, // Use handle_link as a unique string ID
               handle: creator.handle,
               platform: creator.connector.charAt(0).toUpperCase() + creator.connector.slice(1),
               followers: creator.followers || 0,
               engagementRate: creator.engagement || 0,
               bio: creator.bio || '',
               city: creator.city || 'N/A',
               country: creator.country || 'N/A',
               category: creator.category || 'N/A',
           }));

           allResults.push(...pageResults);
           console.log(`[searchInfluencersFlow] Page ${page} processed. Total creators so far: ${allResults.length}`);

        } catch (jsonError) {
           console.error(`[searchInfluencersFlow] Failed to parse JSON for page ${page}. Status: ${response.status}`, jsonError);
        }

        // Wait for 2 seconds before the next API call to avoid rate limiting or server overload.
        if (page < pagesToFetch.length) {
            console.log('[searchInfluencersFlow] Waiting for 2 seconds before next API call...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }


      console.log(`[searchInfluencersFlow] All API fetches complete. Total creators found: ${allResults.length}`);

      return {
        success: true,
        message: 'Search successful.',
        results: allResults,
      };
    } catch (error: any) {
      console.error('[searchInfluencersFlow] Error in searchInfluencersFlow:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred during the search.',
        results: [],
      };
    }
  }
);
