'use server';
/**
 * @fileOverview An AI agent that handles sending a password reset email.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { SendPasswordResetInputSchema, SendPasswordResetOutputSchema, SendPasswordResetInput } from '@/types';
import { sendPasswordResetEmail as sendCustomPasswordResetEmail } from '@/services/email-service';


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
      // We will now use our custom email service instead of Firebase's.
      // This gives us control over email delivery.
      // Note: In a real app, we'd generate a secure, single-use token and link.
      // For now, we'll send a simple instructional email.
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/forgot-password`;
      await sendCustomPasswordResetEmail({ to: email, resetLink });
      
      return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
    } catch (error: any) {
      console.error('Error in sendPasswordResetFlow:', error);
      // To prevent user enumeration attacks, we don't reveal if the email exists or not.
      // We return a success message even if there was an error sending the email.
      return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
    }
  }
);
