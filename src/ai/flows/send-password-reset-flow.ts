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
      // This will use Firebase's built-in email sending capabilities.
      // For this to work, ensure your Firebase project is configured to send emails.
      // You might need to set up an SMTP server or a third-party email service in the Firebase console.
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email has been sent.' };
    } catch (error: any) {
      console.error('Error in sendPasswordResetFlow:', error);
      // To prevent user enumeration attacks, we don't reveal if the email exists or not.
      // We return a success message even if the user is not found.
      if (error.code === 'auth/user-not-found') {
        console.log(`Password reset attempted for non-existent user: ${email}`);
        return { success: true, message: 'Password reset email has been sent.' };
      }
      // For other errors, we return a generic failure message.
      return { success: false, message: 'Failed to send password reset email.' };
    }
  }
);
