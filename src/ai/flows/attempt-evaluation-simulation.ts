'use server';

/**
 * @fileOverview Simulates multiple attempts to solve a problem, evaluating each attempt's properties.
 *
 * - simulateAttemptEvaluation - A function that simulates attempts and evaluates them.
 * - SimulateAttemptEvaluationInput - The input type for the simulateAttemptEvaluation function.
 * - SimulateAttemptEvaluationOutput - The return type for the simulateAttemptEvaluation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateAttemptEvaluationInputSchema = z.object({
  problemStatement: z.string().describe('The initial problem or choice to consider.'),
  maxAttempts: z.number().int().min(1).max(10).default(5).describe('The maximum number of attempts to simulate.'),
  coherenceThreshold: z.number().min(0).max(1).default(0.6).describe('The minimum coherence score required for a successful attempt.'),
  intelligenceLevel: z.number().min(1).max(5).default(3).describe('The intelligence level of the AI particle (1-5). Higher levels produce more detailed analysis.'),
});
export type SimulateAttemptEvaluationInput = z.infer<typeof SimulateAttemptEvaluationInputSchema>;

const AttemptResultSchema = z.object({
  attemptNumber: z.number().int().describe('The attempt number.'),
  coherence: z.number().describe('The coherence score of the attempt (0-1).'),
  reversible: z.boolean().describe('Whether the attempt is reversible.'),
  safe: z.boolean().describe('Whether the attempt is safe.'),
  justification: z.string().describe('The justification for the scores.'),
  success: z.boolean().describe('Whether the attempt was successful based on the coherence threshold.'),
});

const SimulateAttemptEvaluationOutputSchema = z.object({
  attemptResults: z.array(AttemptResultSchema).describe('The results of each attempt.'),
});
export type SimulateAttemptEvaluationOutput = z.infer<typeof SimulateAttemptEvaluationOutputSchema>;

export async function simulateAttemptEvaluation(input: SimulateAttemptEvaluationInput): Promise<SimulateAttemptEvaluationOutput> {
  return simulateAttemptEvaluationFlow(input);
}

const simulateAttemptEvaluationPrompt = ai.definePrompt({
  name: 'simulateAttemptEvaluationPrompt',
  input: {schema: SimulateAttemptEvaluationInputSchema},
  output: {schema: SimulateAttemptEvaluationOutputSchema},
  prompt: `You are an AI assistant designed to simulate multiple attempts to solve a given problem and evaluate each attempt's properties. You are acting as an "AI Particle".

Your current intelligence level is {{{intelligenceLevel}}} out of 5.
- A lower intelligence level should result in more direct and simple justifications.
- A higher intelligence level should produce more nuanced, in-depth, and creative analysis for each attempt.

Problem Statement: {{{problemStatement}}}
Max Attempts: {{{maxAttempts}}}
Coherence Threshold: {{{coherenceThreshold}}}

Simulate up to {{{maxAttempts}}} attempts to solve the problem. For each attempt, generate:
1.  A coherence score (0-1) representing how well the attempt aligns with the problem.
2.  A reversible flag (boolean) indicating if the attempt's outcome can be easily undone.
3.  A safe flag (boolean) indicating if the attempt carries significant risk.
4.  A justification for these scores, adapting its detail to your intelligence level.
5.  A success flag (boolean) based on whether the coherence score meets or exceeds the coherence threshold.

Format your response as a valid JSON object conforming to the following schema:

${JSON.stringify(SimulateAttemptEvaluationOutputSchema.describe('The output schema.'))}

Make sure each element in the attemptResults array conforms to the following schema:
${JSON.stringify(AttemptResultSchema.describe('The schema for each attempt result.'))}
`,
});

const simulateAttemptEvaluationFlow = ai.defineFlow(
  {
    name: 'simulateAttemptEvaluationFlow',
    inputSchema: SimulateAttemptEvaluationInputSchema,
    outputSchema: SimulateAttemptEvaluationOutputSchema,
  },
  async input => {
    const {output} = await simulateAttemptEvaluationPrompt(input);
    return output!;
  }
);
