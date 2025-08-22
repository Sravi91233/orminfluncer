'use server';
/**
 * @fileOverview An AI agent that handles sending an OTP to a user's email.
 *
 * - sendOtp - A function that generates and emails an OTP.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { getAdminDb } from '@/lib/firebase-admin';
import { sendOtpEmail } from '@/services/email-service';
import { SendOtpInputSchema, SendOtpOutputSchema } from '@/types';

export async function sendOtp(input: z.infer<typeof SendOtpInputSchema>): Promise<z.infer<typeof SendOtpOutputSchema>> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email }) => {
    const db = getAdminDb();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    try {
      // Store OTP in the top-level 'otp' collection
      await db.collection('otp').doc(email).set({
        email,
        otp,
        expiresAt,
      });

      // Send the OTP via email
      await sendOtpEmail({ to: email, otp });

      return { success: true, message: 'OTP has been sent to your email.' };
    } catch (error: any) {
      console.error('Error in sendOtpFlow:', error);
      // In a real app, you'd want more specific error handling
      return { success: false, message: error.message || 'Failed to send OTP.' };
    }
  }
);
