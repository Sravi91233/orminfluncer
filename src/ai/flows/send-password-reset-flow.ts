'use server';
/**
 * @fileOverview An AI agent that handles sending a password reset email.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { sendPasswordResetEmail } from '@/services/email-service';
import { SendPasswordResetInputSchema, SendPasswordResetOutputSchema, SendPasswordResetInput } from '@/types';
import { auth } from '@/lib/firebase';
import { generatePasswordResetLink } from 'firebase/auth';

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
      // Note: This generates a link that can be used to reset the password.
      // The default action is to redirect to a Firebase-hosted page.
      // For a production app, you might want to configure the Action URL
      // in the Firebase console to point to a custom page in your app.
      const resetLink = await generatePasswordResetLink(auth, email);
      await sendPasswordResetEmail({ to: email, resetLink });
      return { success: true, message: 'Password reset email has been sent.' };
    } catch (error: any) {
      console.error('Error in sendPasswordResetFlow:', error);
      // Don't leak information about whether the email exists or not.
      // Return a generic success message.
      if (error.code === 'auth/user-not-found') {
        console.log(`Password reset attempted for non-existent user: ${email}`);
        return { success: true, message: 'Password reset email has been sent.' };
      }
      return { success: false, message: error.message || 'Failed to send password reset email.' };
    }
  }
);
