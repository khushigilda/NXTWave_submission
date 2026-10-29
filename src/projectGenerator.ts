/**
 * Project blueprint generator.
 *
 * Uses structured templates based on the selected problem category and user inputs
 * to produce a personalised project blueprint.
 *
 * This is a reliable, transparent fallback that does NOT call any external AI API.
 * It is clearly labelled as template-based in the UI.
 *
 * To integrate a real AI model later, replace the `generateBlueprint` function body
 * with a server-side API call and keep the same return type.
 */

import type { ChallengeState, GeneratedBlueprint } from './storage';

type CategoryTemplates = {
  [key: string]: (inputs: ChallengeState) => GeneratedBlueprint;
};

const templates: CategoryTemplates = {
  studying: (inputs) => ({
    projectTitle: `AI ${inputs.whatShouldDo || 'Study Assistant'} for ${inputs.targetUser || 'Students'}`,
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'College students preparing for exams',
    proposedSolution: `An AI-powered study assistant that takes ${inputs.userInput || 'a list of topics and available study hours'} and produces ${inputs.expectedOutput || 'a structured, prioritised revision schedule tailored to the student\'s deadlines'}.`,
    coreFeatures: [
      'Topic and deadline input form',
      'AI-generated revision schedule with time blocks',
      'Priority ranking based on difficulty and exam proximity',
    ],
    userInputDescription: inputs.userInput || 'Subject list, exam dates, available study hours per day',
    expectedOutputDescription: inputs.expectedOutput || 'Day-by-day revision plan with topic slots, breaks, and priority flags',
    simplestFirstVersion: 'A single-page form that accepts topics and hours, then displays a rule-based study schedule using plain JavaScript or Python. No AI needed for v1.',
    suggestedTools: ['HTML/CSS/JS (frontend form)', 'Python or Node.js (schedule logic)', 'Gemini API or OpenAI (optional AI personalisation in v2)'],
    sixtyMinutePlan: [
      '0–10 min: Sketch the input form (topics, dates, hours)',
      '10–25 min: Build the HTML form and basic styling',
      '25–40 min: Write the schedule-generation logic',
      '40–50 min: Display the output as a table or list',
      '50–60 min: Test with real data and polish the UI',
    ],
    starterPrompt: `"You are a study planner. Given the following subjects: [LIST], exam dates: [DATES], and available hours per day: [HOURS], create a day-by-day revision schedule that prioritises subjects by exam proximity and estimated difficulty. Output as a structured list."`,
    limitation: 'The schedule is only as good as the inputs. Students who underestimate study time or skip entries will receive an inaccurate plan. V1 does not account for learning pace.',
    nextStep: 'Register for the NxtWave workshop to learn how to connect a real AI model to personalise the schedule based on the student\'s actual performance.',
  }),

  'job-search': (inputs) => ({
    projectTitle: `AI ${inputs.whatShouldDo || 'Interview Coach'} for ${inputs.targetUser || 'Job Seekers'}`,
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'Final-year engineering students and recent graduates',
    proposedSolution: `An AI-powered interview preparation tool that takes ${inputs.userInput || 'a job role and skill list'} and produces ${inputs.expectedOutput || 'tailored interview questions with model answers and tips'}.`,
    coreFeatures: [
      'Job role and skill input',
      'Generated interview Q&A set',
      'Confidence rating and progress tracker',
    ],
    userInputDescription: inputs.userInput || 'Target job role, skills, experience level, company type',
    expectedOutputDescription: inputs.expectedOutput || '10 likely interview questions with structured model answers',
    simplestFirstVersion: 'A form that accepts a job role and generates a static list of common questions for that role. Add AI-personalised answers in v2.',
    suggestedTools: ['React or plain HTML (UI)', 'Gemini API (question generation)', 'localStorage (save progress)'],
    sixtyMinutePlan: [
      '0–10 min: Define 5–10 question categories (technical, HR, situational)',
      '10–25 min: Build the role-input form',
      '25–40 min: Hardcode 3 questions per category as a working demo',
      '40–55 min: Display questions with a "Show Answer" toggle',
      '55–60 min: Test and note improvements for v2',
    ],
    starterPrompt: `"You are an interview coach. Given the role: [ROLE] and skills: [SKILLS], generate 10 interview questions the candidate is likely to face. For each question, provide a strong model answer and one tip for delivery."`,
    limitation: 'Hardcoded questions may not match the specific company\'s interview style. Real preparation requires researching the actual employer.',
    nextStep: 'Join the NxtWave workshop to learn how to integrate AI APIs so the tool generates role-specific questions in real time.',
  }),

  'college-info': (inputs) => ({
    projectTitle: `AI ${inputs.whatShouldDo || 'College FAQ Bot'} for ${inputs.targetUser || 'Students'}`,
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'First-year and incoming college students',
    proposedSolution: `A conversational FAQ assistant that takes ${inputs.userInput || 'student questions about college processes'} and provides ${inputs.expectedOutput || 'clear, accurate answers from a structured knowledge base'}.`,
    coreFeatures: [
      'Question input and category selection',
      'Knowledge base of common FAQs',
      'Suggested follow-up questions',
    ],
    userInputDescription: inputs.userInput || 'Student question or topic (admissions, fees, hostel, exams)',
    expectedOutputDescription: inputs.expectedOutput || 'Clear answer with source reference and related questions',
    simplestFirstVersion: 'A search-and-display tool backed by a JSON file of Q&A pairs. No live AI needed for v1.',
    suggestedTools: ['HTML/JS (frontend)', 'JSON file (knowledge base)', 'Fuse.js (fuzzy search)', 'Gemini API (v2 conversational layer)'],
    sixtyMinutePlan: [
      '0–10 min: Collect 20 common college FAQs and answers',
      '10–20 min: Save them as a JSON file',
      '20–35 min: Build a search input that filters FAQs',
      '35–50 min: Display matching results with expandable answers',
      '50–60 min: Add a "Was this helpful?" button and test',
    ],
    starterPrompt: `"You are a helpful college information assistant. A student asks: [QUESTION]. Using the following knowledge base: [FAQ_DATA], provide a clear, friendly answer. If the answer is not in the knowledge base, say so honestly and suggest who the student should contact."`,
    limitation: 'The bot can only answer questions in its knowledge base. Outdated FAQ content will give wrong information. Content must be maintained manually.',
    nextStep: 'Attend the NxtWave workshop to learn how to build a real RAG (Retrieval-Augmented Generation) chatbot that answers from live documents.',
  }),

  productivity: (inputs) => ({
    projectTitle: `AI ${inputs.whatShouldDo || 'Task Prioritiser'} for ${inputs.targetUser || 'Students'}`,
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'Busy students managing coursework, projects and part-time work',
    proposedSolution: `A smart task management tool that takes ${inputs.userInput || 'a list of tasks with deadlines and effort estimates'} and produces ${inputs.expectedOutput || 'a prioritised daily to-do list with time blocks'}.`,
    coreFeatures: [
      'Task entry with deadline and effort rating',
      'AI-prioritised daily schedule',
      'Simple completion tracker',
    ],
    userInputDescription: inputs.userInput || 'Task name, deadline, estimated hours, priority (high/medium/low)',
    expectedOutputDescription: inputs.expectedOutput || 'Ordered daily task list with suggested time slots',
    simplestFirstVersion: 'A form that collects tasks and sorts them by deadline and priority using a simple algorithm. Display as a ranked list.',
    suggestedTools: ['React (UI)', 'localStorage (persistence)', 'Day.js (date handling)', 'Gemini API (optional natural language task entry)'],
    sixtyMinutePlan: [
      '0–10 min: Design the task input form',
      '10–25 min: Build the form with validation',
      '25–40 min: Write the priority-sorting algorithm',
      '40–55 min: Display tasks in a ranked, styled list',
      '55–60 min: Add a "Mark Done" button and test',
    ],
    starterPrompt: `"You are a productivity coach. Given these tasks: [TASK_LIST], each with a deadline and effort rating, create a prioritised daily schedule for the next 5 days. Explain why you placed each task in its slot."`,
    limitation: 'The prioritisation is rule-based and does not learn from the user\'s actual working style. It cannot predict interruptions or context switching.',
    nextStep: 'Register for the NxtWave workshop to learn how to add AI-powered natural language task entry so users can describe tasks in plain English.',
  }),

  finance: (inputs) => ({
    projectTitle: `AI ${inputs.whatShouldDo || 'Expense Tracker'} for ${inputs.targetUser || 'Students'}`,
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'College students managing a monthly allowance or stipend',
    proposedSolution: `A personal finance assistant that takes ${inputs.userInput || 'income, fixed expenses, and spending categories'} and produces ${inputs.expectedOutput || 'a monthly budget plan with savings targets and spending alerts'}.`,
    coreFeatures: [
      'Income and expense entry',
      'Category-wise spending breakdown',
      'Savings goal tracker',
    ],
    userInputDescription: inputs.userInput || 'Monthly income, fixed expenses (rent, fees), variable spending',
    expectedOutputDescription: inputs.expectedOutput || 'Budget summary, savings target, overspend warnings',
    simplestFirstVersion: 'A form that calculates income minus expenses and shows a simple pie chart breakdown using a canvas or SVG. No AI needed for v1.',
    suggestedTools: ['HTML/CSS/JS', 'Chart.js (visualisations)', 'localStorage (save entries)', 'Gemini API (optional spending advice in v2)'],
    sixtyMinutePlan: [
      '0–10 min: Define income and expense categories',
      '10–25 min: Build the entry form',
      '25–40 min: Calculate totals and savings',
      '40–55 min: Display a summary table and simple chart',
      '55–60 min: Add local storage persistence',
    ],
    starterPrompt: `"You are a personal finance advisor for students. Given monthly income: [INCOME] and expenses: [EXPENSES], provide a simple budget plan. Highlight where the student is overspending and suggest one concrete saving action."`,
    limitation: 'The tracker only knows what the user manually enters. It cannot connect to bank accounts or automatically categorise transactions.',
    nextStep: 'Join the NxtWave workshop to learn how to build a conversational AI that lets students log expenses using natural language.',
  }),

  other: (inputs) => ({
    projectTitle: inputs.whatShouldDo ? `AI ${inputs.whatShouldDo}` : 'My AI Project',
    problemStatement: inputs.problemDescription,
    targetUser: inputs.targetUser || 'People who experience this problem',
    proposedSolution: `An AI-powered tool that accepts ${inputs.userInput || 'information from the user'} and produces ${inputs.expectedOutput || 'a useful, actionable output'} to address: ${inputs.problemDescription}.`,
    coreFeatures: [
      `Core input: ${inputs.userInput || 'Relevant user data'}`,
      `Core output: ${inputs.expectedOutput || 'Processed result'}`,
      'Simple, clear interface for the target user',
    ],
    userInputDescription: inputs.userInput || 'Information the user provides to the tool',
    expectedOutputDescription: inputs.expectedOutput || 'The result the tool gives back',
    simplestFirstVersion: 'A single-page form that takes the key inputs, processes them with simple logic or rules, and displays a structured output. No AI required for v1.',
    suggestedTools: ['HTML/CSS/JS or React (frontend)', 'Python or Node.js (logic)', 'Gemini API (AI personalisation for v2)'],
    sixtyMinutePlan: [
      '0–10 min: Write down exactly what the user types in and what they get back',
      '10–25 min: Build the input form',
      '25–40 min: Write the core processing logic',
      '40–55 min: Display the output clearly',
      '55–60 min: Test with a real example and note improvements',
    ],
    starterPrompt: `"You are an AI assistant that helps with: ${inputs.problemDescription}. The user provides: [USER_INPUT]. Produce a clear, helpful, structured response that solves their problem."`,
    limitation: 'The first version will use simple rules, not real AI. It will only handle inputs similar to the ones you tested. Edge cases will need extra work.',
    nextStep: 'Register for the NxtWave workshop to learn how to replace rule-based logic with a real AI model that handles any input.',
  }),
};

/**
 * Generate a project blueprint from challenge inputs.
 * Returns a structured blueprint personalised to the user's inputs.
 */
export async function generateBlueprint(inputs: ChallengeState): Promise<GeneratedBlueprint> {
  // Simulate a brief generation delay for UX realism
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const categoryKey = inputs.category || 'other';
  const templateFn = templates[categoryKey] || templates['other'];
  const blueprint = templateFn(inputs);

  // Inject the actual user description to make output more specific
  if (inputs.problemDescription) {
    blueprint.problemStatement = inputs.problemDescription;
  }

  return blueprint;
}
