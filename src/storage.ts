/**
 * Local storage helpers for the challenge and dashboard data.
 *
 * LIMITATIONS:
 *   - Data is stored in the browser's localStorage.
 *   - Not shared across devices or browsers.
 *   - Not suitable for production campaign analytics.
 *   - Clearing browser data will erase all records.
 */

// ─── Challenge State ───────────────────────────────────────────

export interface ChallengeState {
  step: number;
  category: string;
  problemDescription: string;
  targetUser: string;
  whatShouldDo: string;
  userInput: string;
  expectedOutput: string;
  blueprint: GeneratedBlueprint | null;
  referralCode: string;
  completedAt: string | null;
}

export interface GeneratedBlueprint {
  projectTitle: string;
  problemStatement: string;
  targetUser: string;
  proposedSolution: string;
  coreFeatures: string[];
  userInputDescription: string;
  expectedOutputDescription: string;
  simplestFirstVersion: string;
  suggestedTools: string[];
  sixtyMinutePlan: string[];
  starterPrompt: string;
  limitation: string;
  nextStep: string;
}

const CHALLENGE_KEY = 'challenge_state';

export function saveChallengeState(state: ChallengeState): void {
  localStorage.setItem(CHALLENGE_KEY, JSON.stringify(state));
}

export function loadChallengeState(): ChallengeState | null {
  const raw = localStorage.getItem(CHALLENGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearChallengeState(): void {
  localStorage.removeItem(CHALLENGE_KEY);
}

export function createInitialChallengeState(): ChallengeState {
  return {
    step: 1,
    category: '',
    problemDescription: '',
    targetUser: '',
    whatShouldDo: '',
    userInput: '',
    expectedOutput: '',
    blueprint: null,
    referralCode: generateReferralCode(),
    completedAt: null,
  };
}

// ─── Dashboard State ───────────────────────────────────────────

export interface DashboardState {
  dailyActuals: number[]; // 7 days
  budgetSpend: { category: string; spent: number }[];
  sourceData: SourceRow[];
  lastUpdated: string;
}

export interface SourceRow {
  source: string;
  challengeStarts: number;
  blueprintCompletions: number;
  workshopClicks: number;
  confirmedRegistrations: number | null; // null = not connected
  spend: number;
}

const DASHBOARD_KEY = 'dashboard_state';

export function saveDashboardState(state: DashboardState): void {
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(state));
}

export function loadDashboardState(): DashboardState | null {
  const raw = localStorage.getItem(DASHBOARD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearDashboardState(): void {
  localStorage.removeItem(DASHBOARD_KEY);
}

export function createInitialDashboardState(): DashboardState {
  return {
    dailyActuals: [0, 0, 0, 0, 0, 0, 0],
    budgetSpend: [
      { category: 'Challenge Rewards', spent: 0 },
      { category: 'Ambassador Incentive Pool', spent: 0 },
      { category: 'Paid Promotion Test', spent: 0 },
      { category: 'Contingency', spent: 0 },
    ],
    sourceData: [
      { source: 'Student Ambassadors', challengeStarts: 0, blueprintCompletions: 0, workshopClicks: 0, confirmedRegistrations: null, spend: 0 },
      { source: 'College Communities', challengeStarts: 0, blueprintCompletions: 0, workshopClicks: 0, confirmedRegistrations: null, spend: 0 },
      { source: 'Peer Referrals', challengeStarts: 0, blueprintCompletions: 0, workshopClicks: 0, confirmedRegistrations: null, spend: 0 },
      { source: 'Organic Posts', challengeStarts: 0, blueprintCompletions: 0, workshopClicks: 0, confirmedRegistrations: null, spend: 0 },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

// ─── Helpers ───────────────────────────────────────────────────

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BMC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function exportDashboardCSV(state: DashboardState): string {
  let csv = 'Section,Field,Value\n';

  // Daily progress
  const targets = [30, 70, 140, 230, 320, 420, 500];
  for (let i = 0; i < 7; i++) {
    csv += `Daily Progress,Day ${i + 1} Target,${targets[i]}\n`;
    csv += `Daily Progress,Day ${i + 1} Actual,${state.dailyActuals[i]}\n`;
  }

  // Budget
  const allocations = [800, 500, 400, 300];
  for (let i = 0; i < state.budgetSpend.length; i++) {
    csv += `Budget,${state.budgetSpend[i].category} Allocated,${allocations[i]}\n`;
    csv += `Budget,${state.budgetSpend[i].category} Spent,${state.budgetSpend[i].spent}\n`;
  }

  // Sources
  for (const row of state.sourceData) {
    csv += `Source,${row.source} - Starts,${row.challengeStarts}\n`;
    csv += `Source,${row.source} - Blueprints,${row.blueprintCompletions}\n`;
    csv += `Source,${row.source} - CTA Clicks,${row.workshopClicks}\n`;
    csv += `Source,${row.source} - Registrations,${row.confirmedRegistrations ?? 'Not Connected'}\n`;
    csv += `Source,${row.source} - Spend,${row.spend}\n`;
  }

  return csv;
}
