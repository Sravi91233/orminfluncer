'use server';
/**
 * @fileOverview An AI agent that handles sending a password reset email.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { SendPasswordResetInputSchema, SendPasswordResetOutputSchema, SendPasswordResetInput } from '@/types';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export async function sendPasswordReset(input: SendPasswordResetInput): Promise<z.infer<typeof SendPasswordResetOutputSchema>> {
  return sendPasswordResetFlow(input);
}

const sendPasswordResetFlow = ai.defineFlow(
  {
    name: 'sendPasswordResetFlow',
    inputSchema: SendPasswordResetInputSchema,
    outputSchema: SendPasswordResetOutputSchema,
  },
  async ({ email }) => {
    try {
      // Use Firebase's built-in password reset email functionality.
      // This will use the SMTP settings configured in the Firebase Console.
      await sendPasswordResetEmail(auth, email);
      
      console.log(`Password reset email requested for ${email}. Firebase will handle sending.`);

      return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
    } catch (error: any) {
      console.error('Error in sendPasswordResetFlow:', error);
      // To prevent user enumeration attacks, we don't reveal if the email exists or not.
      // We return a success message even if there was a known error (e.g. user not found).
      return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
    }
  }
);
