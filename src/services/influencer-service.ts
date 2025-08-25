'use server';

import { db } from '@/lib/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Influencer } from '@/types';

/**
 * Saves a list of influencers to Firestore under a nested collection structure.
 * influencers -> {city} -> {platform} -> {influencerHandle}
 *
 * @param city - The city to save the influencers under.
 * @param platform - The platform (e.g., Instagram) to save the influencers under.
 * @param influencers - An array of influencer objects to save.
 * @returns A promise that resolves to true if the batch write is successful.
 */
export async function saveInfluencersToFirestore(city: string, platform: string, influencers: Influencer[]): Promise<boolean> {
  if (!city || !platform || influencers.length === 0) {
    console.warn('[saveInfluencersToFirestore] Missing city, platform, or influencers data. Skipping save.');
    return false;
  }

  const cityStr = city.toLowerCase();
  const platformStr = platform.toLowerCase();

  console.log(`[saveInfluencersToFirestore] Starting batch write for ${influencers.length} influencers to city: ${cityStr}, platform: ${platformStr}`);

  const batch = writeBatch(db);

  influencers.forEach((influencer) => {
    // Correctly construct the path for the nested collection
    const docRef = doc(db, 'influencers', cityStr, platformStr, influencer.handle);
    batch.set(docRef, influencer);
  });

  try {
    await batch.commit();
    console.log(`[saveInfluencersToFirestore] Successfully committed batch of ${influencers.length} influencers.`);
    return true;
  } catch (error) {
    console.error('[saveInfluencersToFirestore] Error committing batch:', error);
    throw new Error('Failed to save influencer data to the database.');
  }
}
