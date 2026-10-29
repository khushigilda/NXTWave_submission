/**
 * Analytics event tracking layer.
 *
 * For the MVP, all events are stored locally in localStorage.
 * The structure is designed so an external analytics service (e.g. Google Analytics,
 * Mixpanel, Amplitude) can be connected later by modifying the `sendToExternal` function.
 *
 * Events tracked:
 *   - landing_page_view
 *   - challenge_started
 *   - problem_submitted
 *   - blueprint_generated
 *   - blueprint_copied
 *   - blueprint_downloaded
 *   - workshop_cta_clicked
 *   - referral_link_copied
 *   - share_clicked
 *
 * No sensitive personal data is recorded.
 * Campaign source parameters (utm_source, ref) are captured on first page load.
 */

export interface AnalyticsEvent {
  name: string;
  timestamp: string;
  properties?: Record<string, string | number | boolean>;
  source?: string;
  referralCode?: string;
}

const STORAGE_KEY = 'challenge_analytics_events';
const SOURCE_KEY = 'challenge_campaign_source';

/**
 * Capture UTM/referral params from the current URL on first load.
 */
export function captureSourceParams(): void {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source') || params.get('source') || '';
  const ref = params.get('ref') || params.get('referral') || '';

  if (source || ref) {
    const existing = localStorage.getItem(SOURCE_KEY);
    if (!existing) {
      localStorage.setItem(
        SOURCE_KEY,
        JSON.stringify({ source, referralCode: ref, capturedAt: new Date().toISOString() })
      );
    }
  }
}

export function getCampaignSource(): { source: string; referralCode: string } | null {
  const raw = localStorage.getItem(SOURCE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Track an analytics event.
 */
export function trackEvent(name: string, properties?: Record<string, string | number | boolean>): void {
  const campaignSource = getCampaignSource();

  const event: AnalyticsEvent = {
    name,
    timestamp: new Date().toISOString(),
    properties,
    source: campaignSource?.source,
    referralCode: campaignSource?.referralCode,
  };

  // Store locally
  const events = getEvents();
  events.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

  // Placeholder for external analytics
  sendToExternal(event);
}

/**
 * Retrieve all stored events.
 */
export function getEvents(): AnalyticsEvent[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Clear all events.
 */
export function clearEvents(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get event counts grouped by event name.
 */
export function getEventCounts(): Record<string, number> {
  const events = getEvents();
  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.name] = (counts[e.name] || 0) + 1;
  }
  return counts;
}

/**
 * Get events filtered by source.
 */
export function getEventsBySource(): Record<string, AnalyticsEvent[]> {
  const events = getEvents();
  const bySource: Record<string, AnalyticsEvent[]> = {};
  for (const e of events) {
    const src = e.source || 'direct';
    if (!bySource[src]) bySource[src] = [];
    bySource[src].push(e);
  }
  return bySource;
}

/**
 * Placeholder for sending events to an external analytics service.
 * Currently a no-op. Replace with actual integration when ready.
 *
 * No events are sent to external services in this prototype.
 */
function sendToExternal(_event: AnalyticsEvent): void {
  // No-op for MVP.
  // Example integration:
  // gtag('event', event.name, event.properties);
  // mixpanel.track(event.name, event.properties);
}
