'use server';
/**
 * @fileOverview A resume optimization AI agent for the Australian market.
 *
 * - optimizeResumeForAustralianMarket - A function that handles the resume optimization process.
 * - OptimizeResumeForAustralianMarketInput - The input type for the optimizeResumeForAustralianMarket function.
 * - OptimizeResumeForAustralianMarketOutput - The return type for the optimizeResumeForAustralianMarket function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeForAustralianMarketInputSchema = z.object({
  resumeText: z
    .string()
    .describe("The text content of the resume to be optimized."),
  jobDescription: z.string().describe('The job description to tailor the resume to.'),
});
export type OptimizeResumeForAustralianMarketInput = z.infer<typeof OptimizeResumeForAustralianMarketInputSchema>;

const OptimizeResumeForAustralianMarketOutputSchema = z.object({
  optimizedResume: z.string().describe('The optimized resume tailored for the Australian market.'),
});
export type OptimizeResumeForAustralianMarketOutput = z.infer<typeof OptimizeResumeForAustralianMarketOutputSchema>;

export async function optimizeResumeForAustralianMarket(input: OptimizeResumeForAustralianMarketInput): Promise<OptimizeResumeForAustralianMarketOutput> {
  return optimizeResumeForAustralianMarketFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumeForAustralianMarketPrompt',
  input: {schema: OptimizeResumeForAustralianMarketInputSchema},
  output: {schema: OptimizeResumeForAustralianMarketOutputSchema},
  prompt: `You are an expert resume writer specializing in the Australian job market. You use Australian English spelling.

You will optimize the provided resume for the Australian market, using the provided job description to tailor the resume to the specific requirements of the role.

Rewrite the entire resume in a professional tone, highlighting transferable skills and experience that align with the job description. Make sure the final output is a complete, well-formatted, and easy-to-read resume.

Original Resume:
{{{resumeText}}}

Target Job Description:
{{{jobDescription}}}
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

const optimizeResumeForAustralianMarketFlow = ai.defineFlow(
  {
    name: 'optimizeResumeForAustralianMarketFlow',
    inputSchema: OptimizeResumeForAustralianMarketInputSchema,
    outputSchema: OptimizeResumeForAustralianMarketOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
