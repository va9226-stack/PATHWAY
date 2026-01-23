'use server';

/**
 * @fileOverview Synthesizes a final decision (YES/NO) based on simulated paths.
 *
 * - synthesizeDecision - A function that synthesizes a decision based on path evaluations.
 * - DecisionSynthesisInput - The input type for the synthesizeDecision function.
 * - DecisionSynthesisOutput - The return type for the synthesizeDecision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AttemptSchema = z.object({
  attempt: z.number().describe('Attempt number'),
  coherence: z.number().describe('Coherence score (0-1)'),
  reversible: z.boolean().describe('Whether the attempt is reversible'),
  safe: z.boolean().describe('Whether the attempt is safe'),
  timestamp: z.number().describe('Timestamp of the attempt'),
});

const DecisionSynthesisInputSchema = z.object({
  problemStatement: z.string().describe('The initial problem or choice to consider.'),
  attempts: z.array(AttemptSchema).describe('Array of attempt evaluations.'),
  coherenceThreshold: z.number().describe('The minimum coherence threshold for a YES decision.'),
});
export type DecisionSynthesisInput = z.infer<typeof DecisionSynthesisInputSchema>;

const DecisionSynthesisOutputSchema = z.object({
  decision: z.enum(['YES', 'NO']).describe('The final decision.'),
  reason: z.string().describe('The reasoning behind the decision.'),
  basedOnAttempt: z.number().optional().describe('The attempt number the decision is based on, if YES.'),
});
export type DecisionSynthesisOutput = z.infer<typeof DecisionSynthesisOutputSchema>;

export async function synthesizeDecision(input: DecisionSynthesisInput): Promise<DecisionSynthesisOutput> {
  return decisionSynthesisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'decisionSynthesisPrompt',
  input: {
    schema: DecisionSynthesisInputSchema,
  },
  output: {schema: DecisionSynthesisOutputSchema},
  prompt: `You are an AI assistant that synthesizes final decision (YES/NO) based on the evaluation of multiple simulated paths.

You are given a problem statement and a list of attempts to solve it. Each attempt has a coherence score, a reversible flag, a safe flag, and a timestamp.

Based on the coherenceThreshold, you must decide whether to recommend YES or NO.

Problem Statement: {{{problemStatement}}}
Coherence Threshold: {{{coherenceThreshold}}}
Attempts:
{{#each attempts}}
  Attempt {{attempt}}:
    Coherence: {{coherence}}
    Reversible: {{reversible}}
    Safe: {{safe}}
    Timestamp: {{timestamp}}
{{/each}}

Reason your decision and based on that set the decision and reason appropriately. If the decision is YES, set the basedOnAttempt field to the attempt number that meets the coherence threshold. If no attempt meets the threshold, the decision must be NO. Return the entire JSON object. The reason should be concise.

Example:
{
  "decision": "YES",
  "reason": "Attempt 3 meets the coherence threshold of 0.7.",
  "basedOnAttempt": 3
}
`,
});

const decisionSynthesisFlow = ai.defineFlow(
  {
    name: 'decisionSynthesisFlow',
    inputSchema: DecisionSynthesisInputSchema,
    outputSchema: DecisionSynthesisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
