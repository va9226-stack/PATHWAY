'use server';

import {
  simulateAttemptEvaluation,
  type SimulateAttemptEvaluationInput,
  type SimulateAttemptEvaluationOutput,
} from '@/ai/flows/attempt-evaluation-simulation';
import { useToast } from '@/hooks/use-toast';

export async function runSimulation(
  input: SimulateAttemptEvaluationInput
): Promise<SimulateAttemptEvaluationOutput> {
  try {
    const output = await simulateAttemptEvaluation(input);
    // Add a small artificial delay to make the loading state visible
    await new Promise(resolve => setTimeout(resolve, 1000));
    return output;
  } catch (error) {
    console.error('Error in simulation server action:', error);
    // In a real app, you might want to log this error to a service
    throw new Error('The AI simulation failed. Please check your API key and try again.');
  }
}
