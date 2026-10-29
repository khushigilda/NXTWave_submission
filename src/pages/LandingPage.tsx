import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import CampaignStages from '../components/CampaignStages';
import HowItWorks from '../components/HowItWorks';
import ExampleProject from '../components/ExampleProject';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <CampaignStages />
        <HowItWorks />
        <ExampleProject />

        {/* Final CTA */}
        <section className="final-cta section" id="start-challenge">
          <div className="container">
            <div className="final-cta__card card">
              <p className="section-eyebrow">TAKE THE FIRST STEP</p>
              <h2>Ready to take the first step?</h2>
              <p className="final-cta__text">
                No prior AI experience required. Just a real problem you care about and 60 minutes to explore.
              </p>
              <Link
                to="/challenge"
                className="btn btn--primary btn--lg"
                id="final-cta-btn"
              >
                Start the 60-Minute Challenge
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <span className="footer__brand-name">60-Minute Build Challenge</span>
              <p className="footer__tagline">A growth campaign for the NxtWave workshop</p>
            </div>
            <div className="footer__links">
              <Link to="/challenge">Start Challenge</Link>
              <Link to="/dashboard">Campaign Dashboard</Link>
            </div>
          </div>
          <div className="footer__bottom">
            <p className="text-small text-muted">
              This is a prototype campaign tool. Registration data is not tracked server-side.
              Dashboard data is stored locally in this browser only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
