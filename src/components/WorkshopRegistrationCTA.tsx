import { ExternalLink, AlertTriangle } from 'lucide-react';
import { WORKSHOP_REGISTRATION_URL, IS_REGISTRATION_URL_CONFIGURED } from '../config';
import { trackEvent, getCampaignSource } from '../analytics';
import './WorkshopRegistrationCTA.css';

export default function WorkshopRegistrationCTA() {
  function handleRegisterClick() {
    trackEvent('workshop_cta_clicked', {
      configured: IS_REGISTRATION_URL_CONFIGURED,
    });

    if (!IS_REGISTRATION_URL_CONFIGURED) return;

    // Append campaign attribution params without altering the core URL
    const campaignSource = getCampaignSource();
    let url = WORKSHOP_REGISTRATION_URL;
    try {
      const parsed = new URL(url);
      if (campaignSource?.source) parsed.searchParams.set('utm_source', campaignSource.source);
      if (campaignSource?.referralCode) parsed.searchParams.set('ref', campaignSource.referralCode);
      parsed.searchParams.set('utm_campaign', '60min-build-challenge');
      url = parsed.toString();
    } catch {
      // If URL parsing fails, use the raw URL
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="workshop-cta card">
      <div className="workshop-cta__inner">
        <div className="workshop-cta__content">
          <p className="section-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
            OFFICIAL NXTWAVE WORKSHOP
          </p>
          <h2 className="workshop-cta__heading">
            You've taken the first step.<br />
            Ready to build your first AI project?
          </h2>
          <p className="workshop-cta__text">
            Continue your learning with the workshop designed around building your first AI project in 60 minutes.
          </p>

          <div className="workshop-cta__title-block">
            <div className="workshop-cta__workshop-label">Workshop</div>
            <div className="workshop-cta__workshop-name">
              Build Your First AI Project in 60 Minutes
            </div>
          </div>

          {IS_REGISTRATION_URL_CONFIGURED ? (
            <button
              id="workshop-register-btn"
              className="btn btn--primary btn--lg"
              onClick={handleRegisterClick}
            >
              Register for the Workshop
              <ExternalLink size={18} />
            </button>
          ) : (
            <div className="workshop-cta__dev-notice">
              <AlertTriangle size={16} />
              <div>
                <strong>Developer notice:</strong> The registration URL has not been configured.
                Set <code>WORKSHOP_REGISTRATION_URL</code> in <code>src/config.ts</code> to activate this button.
              </div>
            </div>
          )}
        </div>

        <div className="workshop-cta__decoration" aria-hidden="true">
          <div className="workshop-cta__circle workshop-cta__circle--1" />
          <div className="workshop-cta__circle workshop-cta__circle--2" />
          <div className="workshop-cta__icon-box">🚀</div>
        </div>
      </div>
    </div>
  );
}
