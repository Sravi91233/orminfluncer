'use server';
/**
 * @fileOverview An AI agent that handles sending an OTP to a user's email.
 *
 * - sendOtp - A function that generates and emails an OTP.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { sendOtpEmail } from '@/services/email-service';
import { SendOtpInputSchema, SendOtpOutputSchema } from '@/types';

// This flow is now only responsible for sending the email.
// The database write is handled on the client.
export async function sendOtp(input: z.infer<typeof SendOtpInputSchema>): Promise<z.infer<typeof SendOtpOutputSchema>> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ email, otp }) => {
    if (!otp) {
        return { success: false, message: 'OTP is required.' };
    }
    try {
      // Send the OTP via email
      await sendOtpEmail({ to: email, otp });
      return { success: true, message: 'OTP has been sent to your email.' };
    } catch (error: any) {
      console.error('Error in sendOtpFlow:', error);
      return { success: false, message: error.message || 'Failed to send OTP.' };
    }
  }
);
