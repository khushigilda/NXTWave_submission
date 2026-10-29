import { useState } from 'react';
import { Share2, Copy, Check, Users } from 'lucide-react';
import { buildShareUrl, buildInvitationMessage } from '../attribution';
import { trackEvent } from '../analytics';
import './ReferralShare.css';

interface Props {
  referralCode: string;
}

export default function ReferralShare({ referralCode }: Props) {
  const [copied, setCopied] = useState<'link' | 'message' | null>(null);

  const shareUrl = buildShareUrl(referralCode);
  const invitationMessage = buildInvitationMessage(shareUrl);

  async function copyToClipboard(text: string, type: 'link' | 'message') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      trackEvent(type === 'link' ? 'referral_link_copied' : 'referral_link_copied', { type });
      setTimeout(() => setCopied(null), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(type);
      setTimeout(() => setCopied(null), 2500);
    }
  }

  async function handleShare() {
    trackEvent('share_clicked');
    if (navigator.share) {
      try {
        await navigator.share({
          title: '60-Minute Build Challenge',
          text: invitationMessage,
          url: shareUrl,
        });
      } catch {
        // User cancelled — not an error
      }
    } else {
      copyToClipboard(invitationMessage, 'message');
    }
  }

  return (
    <div className="referral card">
      <div className="referral__header">
        <div className="referral__icon">
          <Users size={22} />
        </div>
        <div>
          <h3 className="referral__title">Know a friend who would enjoy this?</h3>
          <p className="referral__subtitle">Share the challenge and invite them to take the first step too.</p>
        </div>
      </div>

      <div className="referral__code-block">
        <span className="referral__code-label">Your referral code</span>
        <span className="referral__code">{referralCode}</span>
      </div>

      <div className="referral__url">
        <span className="referral__url-text">{shareUrl}</span>
        <button
          className={`btn btn--sm ${copied === 'link' ? 'btn--success' : 'btn--secondary'}`}
          onClick={() => copyToClipboard(shareUrl, 'link')}
          id="copy-referral-link"
          aria-label="Copy referral link"
        >
          {copied === 'link' ? <Check size={15} /> : <Copy size={15} />}
          {copied === 'link' ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

      <div className="referral__actions">
        <button
          className="btn btn--primary"
          onClick={handleShare}
          id="share-challenge-btn"
        >
          <Share2 size={16} />
          Share Challenge
        </button>
        <button
          className={`btn ${copied === 'message' ? 'btn--success' : 'btn--secondary'}`}
          onClick={() => copyToClipboard(invitationMessage, 'message')}
          id="copy-invitation-btn"
        >
          {copied === 'message' ? <Check size={16} /> : <Copy size={16} />}
          {copied === 'message' ? 'Copied!' : 'Copy Invitation'}
        </button>
      </div>

      <div className="prototype-notice mt-4">
        <span>ℹ️</span>
        <span>
          <strong>Prototype note:</strong> Referral codes are generated locally. Attribution is not
          server-verified in this prototype. Actual conversion impact cannot be confirmed without a
          backend registration system.
        </span>
      </div>
    </div>
  );
}
