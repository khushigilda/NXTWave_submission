/**
 * Central configuration for the 60-Minute Build Challenge application.
 *
 * WORKSHOP_REGISTRATION_URL:
 *   Replace the placeholder below with the official NxtWave workshop registration URL.
 *   While the placeholder is active, the registration button will show a development notice.
 */

export const WORKSHOP_REGISTRATION_URL: string = '__REPLACE_WITH_OFFICIAL_REGISTRATION_URL__';

export const IS_REGISTRATION_URL_CONFIGURED: boolean =
  WORKSHOP_REGISTRATION_URL !== '__REPLACE_WITH_OFFICIAL_REGISTRATION_URL__' &&
  WORKSHOP_REGISTRATION_URL.startsWith('http');

export const CAMPAIGN_BUDGET = 2000; // ₹2,000

export const DAILY_TARGETS = [30, 70, 140, 230, 320, 420, 500];

export const BUDGET_ALLOCATIONS = [
  { category: 'Challenge Rewards', allocated: 800 },
  { category: 'Ambassador Incentive Pool', allocated: 500 },
  { category: 'Paid Promotion Test', allocated: 400 },
  { category: 'Contingency', allocated: 300 },
];

export const PROBLEM_CATEGORIES = [
  { id: 'studying', label: 'Studying and exam preparation', icon: '📚' },
  { id: 'job-search', label: 'Job search and interview practice', icon: '💼' },
  { id: 'college-info', label: 'College information and FAQs', icon: '🎓' },
  { id: 'productivity', label: 'Productivity and time management', icon: '⏱️' },
  { id: 'finance', label: 'Personal finance and expense tracking', icon: '💰' },
  { id: 'other', label: 'Something else', icon: '✨' },
];
