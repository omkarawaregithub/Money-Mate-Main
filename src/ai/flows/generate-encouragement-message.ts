'use server';

/**
 * @fileOverview A personalized encouragement message generator for Copilot users.
 *
 * - generateEncouragementMessage - A function that generates an encouraging message.
 * - GenerateEncouragementMessageInput - The input type for the generateEncouragementMessage function.
 * - GenerateEncouragementMessageOutput - The return type for the generateEncouragementMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEncouragementMessageInputSchema = z.object({
  remainingAllowances: z
    .number()
    .describe('The number of Copilot allowances remaining.'),
  optimalUsageSuggestions: z
    .string()
    .describe('Suggestions for optimal Copilot usage.'),
});
export type GenerateEncouragementMessageInput = z.infer<
  typeof GenerateEncouragementMessageInputSchema
>;

const GenerateEncouragementMessageOutputSchema = z.object({
  encouragementMessage: z
    .string()
    .describe('A personalized, encouraging message for the user.'),
});
export type GenerateEncouragementMessageOutput = z.infer<
  typeof GenerateEncouragementMessageOutputSchema
>;

export async function generateEncouragementMessage(
  input: GenerateEncouragementMessageInput
): Promise<GenerateEncouragementMessageOutput> {
  return generateEncouragementMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEncouragementMessagePrompt',
  input: {schema: GenerateEncouragementMessageInputSchema},
  output: {schema: GenerateEncouragementMessageOutputSchema},
  prompt: `You are a helpful assistant designed to provide encouragement and helpful suggestions to users of Copilot.

  Generate a personalized encouraging message based on the user's remaining Copilot allowances and suggestions for optimal usage.

  Remaining Allowances: {{{remainingAllowances}}}
  Optimal Usage Suggestions: {{{optimalUsageSuggestions}}}

  Encouragement Message:`,
});

const generateEncouragementMessageFlow = ai.defineFlow(
  {
    name: 'generateEncouragementMessageFlow',
    inputSchema: GenerateEncouragementMessageInputSchema,
    outputSchema: GenerateEncouragementMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
