'use server';

import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, getDocs, query, where } from 'firebase/firestore';
import type { Influencer } from '@/types';

/**
 * Saves or updates a list of influencers to Firestore using a batch write.
 * It uses { merge: true } to update existing documents or create new ones.
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
    // Sanitize the influencer handle to use as a document ID
    const docId = influencer.handle.replace(/[^a-zA-Z0-9_]/g, '_');
    const docRef = doc(db, 'influencers', cityStr, platformStr, docId);
    // Use set with merge:true to create or update.
    batch.set(docRef, influencer, { merge: true });
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


/**
 * Fetches influencers from Firestore for a given city and optional platform.
 *
 * @param city - The city to fetch influencers from.
 * @param platform - Optional: The specific platform to filter by.
 * @returns A promise that resolves to an array of influencer objects.
 */
export async function getInfluencersFromFirestore(city: string, platform?: string): Promise<Influencer[]> {
  const cityStr = city.toLowerCase();
  const platformStr = platform?.toLowerCase();

  console.log(`[getInfluencersFromFirestore] Fetching from cache for city: ${cityStr}` + (platformStr ? `, platform: ${platformStr}` : ''));

  try {
    let influencers: Influencer[] = [];
    
    if (platformStr) {
      // Fetch from a specific platform subcollection
      const collectionRef = collection(db, 'influencers', cityStr, platformStr);
      const snapshot = await getDocs(collectionRef);
      influencers = snapshot.docs.map(doc => doc.data() as Influencer);
    } else {
      // Fetch from all platform subcollections for the given city
      // This requires knowing the platform names. For now, we'll check the main ones.
      const platformsToQuery = ['instagram', 'tiktok', 'youtube']; 
      for (const p of platformsToQuery) {
        const collectionRef = collection(db, 'influencers', cityStr, p);
        const snapshot = await getDocs(collectionRef);
        snapshot.forEach(doc => {
            influencers.push(doc.data() as Influencer);
        });
      }
    }
    
    console.log(`[getInfluencersFromFirestore] Found ${influencers.length} influencers in cache.`);
    return influencers;
  } catch (error) {
    console.error('[getInfluencersFromFirestore] Error fetching from Firestore:', error);
    return [];
  }
}
