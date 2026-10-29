import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Layers, Gift } from 'lucide-react';
import { trackEvent } from '../analytics';
import './HeroSection.css';

export default function HeroSection() {
  function handleStartClick() {
    trackEvent('challenge_started', { source: 'hero_cta' });
  }

  return (
    <section className="hero section">
      <div className="container">
        <div className="hero__content">
          <p className="section-eyebrow">A HANDS-ON AI CHALLENGE FOR STUDENTS</p>
          <h1 className="hero__headline">
            Your First AI Project<br />
            <span className="hero__headline-accent">Starts Here.</span>
          </h1>
          <p className="hero__subtitle">
            Pick a real problem, use AI to shape your solution, and create your first project blueprint
            or simple prototype. No perfect idea required.
          </p>

          <div className="hero__actions">
            <Link
              to="/challenge"
              className="btn btn--primary btn--lg"
              id="hero-start-challenge"
              onClick={handleStartClick}
            >
              Start My Challenge
              <ArrowRight size={20} />
            </Link>
            <a
              href="#how-it-works"
              className="btn btn--secondary btn--lg"
              id="hero-see-how"
            >
              See How It Works
            </a>
          </div>

          <div className="hero__badges">
            <span className="hero__badge">
              <Gift size={14} />
              Beginner-friendly
            </span>
            <span className="hero__badge">
              <Clock size={14} />
              Build at your own pace
            </span>
            <span className="hero__badge">
              <Layers size={14} />
              Free to try
            </span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__card hero__card--main">
            <div className="hero__card-header">
              <span className="hero__card-step">Step 3</span>
              <span className="badge badge--success">Blueprint Ready</span>
            </div>
            <h4 className="hero__card-title">AI Study Schedule Assistant</h4>
            <p className="hero__card-text">
              A tool that turns your subjects, deadlines and available hours into a personalised revision plan.
            </p>
            <div className="hero__card-features">
              <div className="hero__feature">✓ Topic prioritisation by exam date</div>
              <div className="hero__feature">✓ Day-by-day time blocks</div>
              <div className="hero__feature">✓ Built with HTML, JS and AI prompt</div>
            </div>
          </div>
          <div className="hero__card hero__card--secondary">
            <span className="hero__timer-label">Your 60-minute window</span>
            <div className="hero__timer">60:00</div>
          </div>
        </div>
      </div>
    </section>
  );
}
