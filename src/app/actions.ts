'use server';

import {
  simulateAttemptEvaluation,
  type SimulateAttemptEvaluationInput,
  type SimulateAttemptEvaluationOutput,
} from '@/ai/flows/attempt-evaluation-simulation';
import {
  synthesizeDecision,
  type DecisionSynthesisInput,
  type DecisionSynthesisOutput,
} from '@/ai/flows/decision-synthesis';

export type SimulationResult = SimulateAttemptEvaluationOutput & DecisionSynthesisOutput;

export async function runSimulation(
  input: SimulateAttemptEvaluationInput
): Promise<SimulationResult> {
  try {
    const simulationOutput = await simulateAttemptEvaluation(input);

    // Add a small artificial delay to make the loading state visible
    await new Promise(resolve => setTimeout(resolve, 500));

    const decisionInput: DecisionSynthesisInput = {
      problemStatement: input.problemStatement,
      coherenceThreshold: input.coherenceThreshold,
      attempts: simulationOutput.attemptResults.map(a => ({
        attempt: a.attemptNumber,
        coherence: a.coherence,
        reversible: a.reversible,
        safe: a.safe,
        timestamp: Date.now(),
      })),
    };

    const decisionOutput = await synthesizeDecision(decisionInput);

    // Add another small artificial delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      ...simulationOutput,
      ...decisionOutput,
    };
  } catch (error) {
    console.error('Error in simulation server action:', error);
    // In a real app, you might want to log this error to a service
    throw new Error('The AI simulation failed. Please check your API key and try again.');
  }
}
