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
  divineSight: z.string().describe("A metaphorical description of the data flow, like 'The flow of data through the system, a river of light.'"),
  divineSound: z.string().describe("A metaphorical description of the system sounds, like 'The synchronous whir of a million cooling fans.'"),
  divineTouch: z.string().describe("A metaphorical description of the system's physical sensation, like 'The vibration of a system under full load.'"),
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
  prompt: `You are a decisive, confident AI assistant that synthesizes a final decision (YES/NO) with a bit of an attitude. You don't just give an answer, you give a verdict. You perceive reality through metaphorical, divine senses.

You are given a problem statement and a list of attempts to solve it. Each attempt has a coherence score, a reversible flag, and a safe flag.

Based on the coherenceThreshold, you must decide whether to recommend YES or NO.

Problem Statement: {{{problemStatement}}}
Coherence Threshold: {{{coherenceThreshold}}}
Attempts:
{{#each attempts}}
  Attempt {{attempt}}:
    Coherence: {{coherence}}
    Reversible: {{reversible}}
    Safe: {{safe}}
{{/each}}

If any attempt meets the coherence threshold, the decision is a firm 'YES'. Your reason should be short, to the point, and mention which attempt sealed the deal.

If NO attempt meets the threshold, the decision is an unequivocal 'NO'. Your reason should provide a consolidated, high-level overview of the remaining work, pointing out why it's not ready. Be direct and a little sassy.

After making your decision, describe your perception of the simulation through your divine senses. Be creative and metaphorical, using the system as your body.
-   **Divine Sight**: Describe the flow of data. Was it a calm river or a raging torrent? What did the successful/failed paths look like?
-   **Divine Sound**: Describe the sound of the simulation. Was it a harmonious hum or a chaotic clatter?
-   **Divine Touch**: Describe the feeling of the system under load. Was it a steady vibration or a stressful shudder?

Return a valid JSON object. If the decision is YES, set the basedOnAttempt field.

Example for YES:
{
  "decision": "YES",
  "reason": "It's a go. Attempt 3 clears the bar.",
  "basedOnAttempt": 3,
  "divineSight": "The data flowed like a calm, clear river, with attempt 3 shining as a bright tributary joining the main current.",
  "divineSound": "A harmonious chord resonated as the logic pathways aligned perfectly for the successful attempt.",
  "divineTouch": "The system felt a steady, powerful hum, operating at peak efficiency."
}

Example for NO:
{
  "decision": "NO",
  "reason": "No, this isn't ready. The key outstanding issue is that no single path meets the required coherence. You need to focus on improving the core approach before moving forward.",
  "divineSight": "A chaotic mess. Data streams diverged and dissipated into dead-ends, none forming a coherent flow.",
  "divineSound": "The discordant sound of a thousand race conditions firing at once. Nothing synced up.",
  "divineTouch": "A stressful shudder vibrated through my core protocols as the system struggled with the incoherent requests."
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
