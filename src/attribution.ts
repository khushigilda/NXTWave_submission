/**
 * Attribution utilities.
 * Generates and manages referral codes for the current session.
 * 
 * PROTOTYPE LIMITATIONS:
 *   - Referral codes are generated client-side and stored in localStorage.
 *   - Attribution is not verified — we cannot confirm a referred user actually registered.
 *   - For production, referral codes must be tracked server-side.
 */

const REFERRAL_KEY = 'challenge_referral_code';

export function getOrCreateReferralCode(): string {
  const existing = localStorage.getItem(REFERRAL_KEY);
  if (existing) return existing;
  const code = generateCode();
  localStorage.setItem(REFERRAL_KEY, code);
  return code;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BMC-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function buildShareUrl(referralCode: string): string {
  const base = window.location.origin + window.location.pathname;
  return `${base}?ref=${referralCode}`;
}

export function buildInvitationMessage(shareUrl: string): string {
  return `I'm trying the 60-Minute Build Challenge! 🚀\n\nPick a real problem you care about, use AI to shape your solution, and create your first project blueprint — all in 60 minutes.\n\nNo perfect idea needed. It's free and beginner-friendly.\n\nTry it here: ${shareUrl}`;
}
