'use server';

/**
 * @fileOverview An AI agent that suggests relevant search terms and filters based on current search criteria.
 *
 * - suggestSearchTerms - A function that suggests search terms.
 * - SuggestSearchTermsInput - The input type for the suggestSearchTerms function.
 * - SuggestSearchTermsOutput - The return type for the suggestSearchTerms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSearchTermsInputSchema = z.object({
  city: z.string().optional().describe('The city to search for influencers in.'),
  category: z.string().optional().describe('The category of influencers to search for.'),
  followerCount: z
    .number()
    .optional()
    .describe('The minimum follower count of influencers to search for.'),
  currentSearchTerms: z
    .string()
    .optional()
    .describe('The search terms currently used by the user.'),
});
export type SuggestSearchTermsInput = z.infer<typeof SuggestSearchTermsInputSchema>;

const SuggestSearchTermsOutputSchema = z.object({
  suggestedSearchTerms: z
    .array(z.string())
    .describe('An array of suggested search terms and filters.'),
});
export type SuggestSearchTermsOutput = z.infer<typeof SuggestSearchTermsOutputSchema>;

export async function suggestSearchTerms(input: SuggestSearchTermsInput): Promise<SuggestSearchTermsOutput> {
  return suggestSearchTermsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSearchTermsPrompt',
  input: {schema: SuggestSearchTermsInputSchema},
  output: {schema: SuggestSearchTermsOutputSchema},
  prompt: `You are an AI assistant that suggests relevant search terms and filters for finding influencers.

  Based on the current search criteria, suggest additional search terms and filters that the user might find helpful.

  Current search criteria:
  City: {{city}}
  Category: {{category}}
  Follower Count: {{followerCount}}
  Current Search Terms: {{currentSearchTerms}}

  Suggestions should be specific and actionable, and related to the current search.
  Return an array of suggested search terms and filters.
  Consider suggesting related categories, locations, or follower count ranges.
  Be concise and avoid repetition.
  Do not return any filler words such as "Here are" or "I suggest".
  `,
});

const suggestSearchTermsFlow = ai.defineFlow(
  {
    name: 'suggestSearchTermsFlow',
    inputSchema: SuggestSearchTermsInputSchema,
    outputSchema: SuggestSearchTermsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
