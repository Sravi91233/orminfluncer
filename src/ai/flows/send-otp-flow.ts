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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await sendOtpEmail({ to: email, otp });
      return { success: true, message: 'OTP has been sent to your email.', otp };
    } catch (error: any) {
      console.error('Error in sendOtpFlow:', error);
      return { success: false, message: error.message || 'Failed to send OTP.' };
    }
  }
);
