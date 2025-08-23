'use server';
/**
 * @fileOverview An AI agent that verifies a user-provided OTP.
 *
 * - verifyOtp - A function that checks if an OTP is valid.
 */
import { z } from 'genkit';
import { ai } from '@/ai/genkit';
import { VerifyOtpInputSchema, VerifyOtpOutputSchema } from '@/types';


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
    // This flow is now a placeholder as verification is handled on the client.
    // In a real-world scenario with a database, you would look up the OTP here.
    console.log(`Verifying OTP for ${email}`);
    // For now, we can return success as the real check is on the client.
    // A more robust solution might involve a temporary cache or other server-side check.
    return { success: true, message: 'OTP verified successfully (placeholder).' };
  }
);
