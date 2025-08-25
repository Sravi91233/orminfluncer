'use server';

/**
 * @fileOverview An AI agent that searches for influencers using an external API.
 */
import { ai } from '@/ai/genkit';
import { SearchInfluencersInputSchema, SearchInfluencersOutputSchema, Influencer } from '@/types';
import { z } from 'zod';
import { saveInfluencersToFirestore } from '@/services/influencer-service';

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

    const apiKey = 'ed81c08da2msh81f3e4df68af3ebp1c9d7ajsn929105d62758';
    
    const { city, category, platform, bio, currentPage = 1 } = input;
    
    try {
        const queryParams = new URLSearchParams({
            current_page: currentPage.toString()
        });

        if (city && city !== 'Any City') queryParams.append('city', city.toLowerCase());
        if (category) queryParams.append('category', category);
        if (platform && platform !== 'any') queryParams.append('connector', platform.toLowerCase());
        if (bio) queryParams.append('bio', bio);

        const url = `https://ylytic-influencers-api.p.rapidapi.com/ylytic/admin/api/v1/discovery?${queryParams.toString()}`;

        const curlCommand = `curl -X GET '${url}' \\
-H 'x-rapidapi-key: ${apiKey.slice(0, 4)}...${apiKey.slice(-4)}' \\
-H 'x-rapidapi-host: ylytic-influencers-api.p.rapidapi.com'`;
        console.log(`\n[searchInfluencersFlow] EXECUTING API CALL FOR PAGE ${currentPage}:`);
        console.log(curlCommand, '\n');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'ylytic-influencers-api.p.rapidapi.com',
            },
        });

        console.log(`[searchInfluencersFlow] Received API response for page ${currentPage} with status: ${response.status}`);
        if (!response.ok) {
           const errorText = await response.text();
           console.error(`[searchInfluencersFlow] API Error for page ${currentPage} (${response.status}): ${errorText}`);
           throw new Error(`API request failed with status ${response.status}`);
        }

       const data = await response.json();
       console.log(`[searchInfluencersFlow] Successfully parsed JSON for page ${currentPage}.`);
       
       const pageMaximum = data.page_maximum || 1;

       const pageResults: Influencer[] = (data.creators || []).map((creator: any) => ({
           id: creator.handle_link,
           handle: creator.handle,
           platform: creator.connector.charAt(0).toUpperCase() + creator.connector.slice(1),
           followers: creator.followers || 0,
           engagementRate: creator.engagement || 0,
           bio: creator.bio || '',
           city: creator.city || 'N/A',
           country: creator.country || 'N/A',
           category: creator.category || 'N/A',
       }));
       
       console.log(`[searchInfluencersFlow] Page ${currentPage} processed. Found ${pageResults.length} creators.`);
       
       if (pageResults.length > 0 && city && city !== 'Any City' && platform && platform !== 'any') {
         try {
            await saveInfluencersToFirestore(city, platform, pageResults);
            console.log(`[searchInfluencersFlow] Successfully triggered save for ${pageResults.length} influencers.`);
         } catch (dbError: any) {
            console.error(`[searchInfluencersFlow] Database save failed: ${dbError.message}`);
            // We can decide if a DB error should fail the whole flow. For now, we will log it and continue.
         }
       }


      return {
        success: true,
        message: 'Search successful.',
        results: pageResults,
        totalPages: pageMaximum,
        currentPage: currentPage,
      };
    } catch (error: any) {
      console.error('[searchInfluencersFlow] A critical error occurred in the flow:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred during the search.',
        results: [],
        totalPages: 0,
        currentPage: currentPage,
      };
    }
  }
);
