'use server';
/**
 * @fileOverview An AI agent that verifies a user-provided OTP.
 *
 * - verifyOtp - A function that checks if an OTP is valid.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { getAdminDb } from '@/lib/firebase-admin';
import { VerifyOtpInputSchema, VerifyOtpOutputSchema } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function verifyOtp(input: z.infer<typeof VerifyOtpInputSchema>): Promise<z.infer<typeof VerifyOtpOutputSchema>> {
  return verifyOtpFlow(input);
}

const verifyOtpFlow = ai.defineFlow(
  {
    name: 'verifyOtpFlow',
    inputSchema: VerifyOtpInputSchema,
    outputSchema: VerifyOtpOutputSchema,
  },
  async ({ email, otp }) => {
    const db = getAdminDb();
    const otpDocRef = db.collection('otp').doc(email);

    try {
      const otpDoc = await otpDocRef.get();

      if (!otpDoc.exists) {
        return { success: false, message: 'Invalid or expired OTP.' };
      }

      const data = otpDoc.data();
      const expiresAt = (data?.expiresAt as Timestamp).toDate();

      if (data?.otp !== otp || expiresAt < new Date()) {
        // For security, delete the invalid OTP attempt
        await otpDocRef.delete();
        return { success: false, message: 'Invalid or expired OTP.' };
      }

      // OTP is valid, delete it to prevent reuse
      await otpDocRef.delete();

      return { success: true, message: 'OTP verified successfully.' };
    } catch (error: any) {
      console.error('Error in verifyOtpFlow:', error);
      return { success: false, message: error.message || 'Failed to verify OTP.' };
    }
  }
);
