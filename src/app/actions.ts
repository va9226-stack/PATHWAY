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

    const decisionInput: DecisionSynthesisInput = {
      problemStatement: input.problemStatement,
      coherenceThreshold: input.coherenceThreshold,
      attempts: simulationOutput.attemptResults.map(a => ({
        attempt: a.attemptNumber,
        coherence: a.coherence,
        reversible: a.reversible,
        safe: a.safe,
      })),
    };

    const decisionOutput = await synthesizeDecision(decisionInput);

    return {
      ...simulationOutput,
      ...decisionOutput,
    };
  } catch (error) {
    // In a production app, you might want to log this error to a monitoring service.
    throw new Error('The AI simulation failed. Please check your API key and try again.');
  }
}
