# Lucidity Lens: AI-Powered Decision Synthesis

Lucidity Lens is a web application designed to bring clarity to complex decisions. Instead of providing a single, black-box answer, it simulates multiple potential solutions or "paths" for a given problem, analyzes their properties, and presents a comprehensive overview to the user. This approach transforms the AI from a simple oracle into a partner in reasoning, empowering users to understand the landscape of possibilities and make more informed choices.

## How It Works

The core of Lucidity Lens is a two-stage simulation process powered by Google's Gemini model through the Genkit framework.

1.  **Attempt Evaluation Simulation**: When a user submits a "Problem Statement" (e.g., "Should I launch my new product in Q3 or wait until Q4?"), the first AI flow begins. It acts as an "AI Particle," simulating a series of attempts to solve the problem. For each attempt, it evaluates key properties:
    *   **Coherence**: How well does this path align with the problem's goals? (A score from 0 to 1).
    *   **Reversibility**: Can the consequences of this path be easily undone?
    *   **Safety**: Does this path carry significant risk?
    *   **Justification**: A detailed rationale for the above scores. The nuance of this text is determined by the "AI Particle Intelligence" level set by the user.

2.  **Decision Synthesis**: The results of the first simulation are fed into a second, more decisive AI flow. This flow analyzes the attempts against the user-defined "Coherence Threshold" to render a final verdict:
    *   **Decision**: A firm 'YES' or 'NO'. A 'YES' is given if at least one attempt meets the threshold.
    *   **Reason**: A concise, high-level summary explaining the verdict.
    *   **Sensory Synthesis**: A unique feature where the AI describes its metaphorical perception of the simulation process through "Divine Senses" (Sight, Sound, and Touch), adding a layer of creative insight.

The front-end then visualizes all this data, using charts to compare attempt coherence and an interactive accordion to explore the detailed justifications for each path.

## Key Features

*   **Iterative Exploration**: The simulation doesn't have to end after one run. Users can click the **"Explore this Path"** button on any given attempt to use its justification as the problem statement for a new, more refined simulation. This creates a continuous feedback loop for drilling down into complex decisions.
*   **Adjustable AI Intelligence**: A slider allows the user to control the "AI Particle Intelligence" level (from 1 to 5). Higher levels produce more detailed, nuanced, and creative analysis, while lower levels provide more direct and simple justifications.
*   **Dynamic Visualization**: Results are presented in an easy-to-understand format, including a bar chart that visually compares the coherence of each simulated path against the required threshold.
*   **Metaphorical Feedback**: The unique "Sensory Synthesis" provides a creative, intuitive feel for the simulation's internal dynamics, offering a different kind of insight beyond pure logic.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **AI**: [Google Gemini](https://deepmind.google/technologies/gemini/)
*   **AI Framework**: [Genkit](https://firebase.google.com/docs/genkit)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/hosting)

## Getting Started

To run or deploy this application, you will need a Google Gemini API key.

1.  Obtain an API key from [Google AI Studio](https://makersuite.google.com/).
2.  Set the API key as an environment variable named `GEMINI_API_KEY` in your development or deployment environment. For Firebase App Hosting, this should be configured as a secret.

---
*This application was co-created with the Firebase Studio AI assistant.*