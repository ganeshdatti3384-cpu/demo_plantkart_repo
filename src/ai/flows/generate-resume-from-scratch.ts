'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate a resume from scratch based on a job description.
 *
 * - generateResumeFromScratch - A function that generates a resume from scratch.
 * - GenerateResumeFromScratchInput - The input type for the generateResumeFromScratch function.
 * - GenerateResumeFromScratchOutput - The return type for the generateResumeFromScratch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeFromScratchInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for which the resume should be tailored.'),
});
export type GenerateResumeFromScratchInput = z.infer<
  typeof GenerateResumeFromScratchInputSchema
>;

const GenerateResumeFromScratchOutputSchema = z.object({
  resume: z
    .string()
    .describe(
      'The generated resume tailored to the provided job description.'
    ),
});
export type GenerateResumeFromScratchOutput = z.infer<
  typeof GenerateResumeFromScratchOutputSchema
>;

export async function generateResumeFromScratch(
  input: GenerateResumeFromScratchInput
): Promise<GenerateResumeFromScratchOutput> {
  return generateResumeFromScratchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeFromScratchPrompt',
  input: {schema: GenerateResumeFromScratchInputSchema},
  output: {schema: GenerateResumeFromScratchOutputSchema},
  prompt: `You are a professional resume writer specializing in the Australian market. Using Australian English, create a complete, well-formatted resume from scratch tailored to the following job description. Highlight transferable skills and use a professional tone. The output should be a full resume, not just a summary.

Job Description: {{{jobDescription}}}

`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const generateResumeFromScratchFlow = ai.defineFlow(
  {
    name: 'generateResumeFromScratchFlow',
    inputSchema: GenerateResumeFromScratchInputSchema,
    outputSchema: GenerateResumeFromScratchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
