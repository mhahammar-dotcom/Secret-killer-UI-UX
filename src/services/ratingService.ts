import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface RatingPayload {
  rating: number;
  feedback: string;
  category?: string;
  appVersion?: string;
  language?: 'ar' | 'en';
}

/**
 * Submits player feedback and star rating to Firestore.
 * Generates an alphanumeric ID to satisfy strict schema rules.
 */
export async function submitRatingToFirestore(payload: RatingPayload): Promise<boolean> {
  try {
    const ratingId = `rating_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const ratingDocRef = doc(collection(db, 'ratings'), ratingId);

    const docData: Record<string, any> = {
      rating: payload.rating,
      feedback: (payload.feedback || '').trim().slice(0, 1000),
      createdAt: new Date().toISOString(),
      category: payload.category || 'general',
      appVersion: payload.appVersion || '1.0.0',
      language: payload.language || 'ar'
    };

    await setDoc(ratingDocRef, docData);
    return true;
  } catch (error) {
    console.error('Failed to submit rating to Firestore:', error);
    // Fallback: save locally so feedback is never permanently lost if offline
    try {
      const localBackup = JSON.parse(localStorage.getItem('sk_saved_ratings_backup') || '[]');
      localBackup.push({
        ...payload,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('sk_saved_ratings_backup', JSON.stringify(localBackup));
    } catch {
      // ignore storage errors
    }
    return false;
  }
}
