'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { ApiKey } from '@/types';

export async function getApiKey(serviceName: string): Promise<ApiKey | null> {
  try {
    const q = query(
      collection(db, 'APIKeys'), 
      where('serviceName', '==', serviceName), 
      where('status', '==', 'active'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.warn(`No active API key found for service: ${serviceName}`);
      return null;
    }

    const apiKeyDoc = querySnapshot.docs[0];
    return { id: apiKeyDoc.id, ...apiKeyDoc.data() } as ApiKey;

  } catch (error) {
    console.error(`Error fetching API key for ${serviceName}:`, error);
    return null;
  }
}

export async function updateApiKeyLastUsed(apiKeyId: string): Promise<void> {
  try {
    const keyRef = doc(db, 'APIKeys', apiKeyId);
    await updateDoc(keyRef, {
      lastUsed: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating lastUsed for API key ${apiKeyId}:`, error);
  }
}
