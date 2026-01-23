'use server';

/**
 * @fileOverview Simulates multiple attempts to solve a problem, evaluating each attempt's coherence.
 *
 * - simulateAttemptEvaluation - A function that simulates the attempt evaluation process.
 * - SimulateAttemptEvaluationInput - The input type for the simulateAttemptEvaluation function.
 * - SimulateAttemptEvaluationOutput - The return type for the simulateAttemptEvaluation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateAttemptEvaluationInputSchema = z.object({
  problemStatement: z.string().describe('The initial problem or choice to consider.'),
  maxAttempts: z.number().int().min(1).max(10).default(5).describe('The maximum number of attempts to simulate.'),
  coherenceThreshold: z.number().min(0).max(1).default(0.6).describe('The minimum coherence score required for a successful attempt.'),
});
export type SimulateAttemptEvaluationInput = z.infer<typeof SimulateAttemptEvaluationInputSchema>;

const AttemptResultSchema = z.object({
  attemptNumber: z.number().int().describe('The attempt number.'),
  coherence: z.number().describe('The coherence score of the attempt (0-1).'),
  justification: z.string().describe('The justification for the coherence score.'),
  success: z.boolean().describe('Whether the attempt was successful based on the coherence threshold.'),
});

const SimulateAttemptEvaluationOutputSchema = z.object({
  decision: z.enum(['YES', 'NO']).describe('The final decision based on the simulation.'),
  reason: z.string().describe('The reason for the final decision.'),
  successfulAttempt: z.number().int().optional().describe('The attempt number that was successful, if any.'),
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
  prompt: `You are an AI assistant designed to simulate multiple attempts to solve a given problem and evaluate the coherence of each attempt.

Problem Statement: {{{problemStatement}}}
Max Attempts: {{{maxAttempts}}}
Coherence Threshold: {{{coherenceThreshold}}}

Simulate up to {{{maxAttempts}}} attempts to solve the problem. For each attempt, generate a coherence score between 0 and 1 and a justification for the score. Determine if the attempt was successful based on whether the coherence score meets or exceeds the specified coherence threshold.

Based on the results of the attempts, provide a final decision (YES or NO) and a reason for the decision. If any attempt was successful, the decision should be YES. If all attempts failed, the decision should be NO.

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
