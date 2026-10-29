import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    number: 1,
    title: 'Choose a Real Problem',
    description: 'Select a challenge that actually affects you or people you know. Real problems lead to more useful solutions.',
  },
  {
    number: 2,
    title: 'Shape a Solution with AI',
    description: 'Use our structured prompts and idea-shaping tool to develop a practical project concept around your chosen problem.',
  },
  {
    number: 3,
    title: 'Create a Blueprint or Prototype',
    description: 'Generate a complete project blueprint — including tools, steps, and a starter prompt — that you can actually use.',
  },
  {
    number: 4,
    title: 'Submit and Explore the Workshop',
    description: 'Share your blueprint, invite friends, and explore the NxtWave workshop for a guided path to building the real thing.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works section" id="how-it-works">
      <div className="container">
        <div className="text-center mb-6">
          <p className="section-eyebrow">THE STUDENT JOURNEY</p>
          <h2 className="section-title">How the Challenge Works</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Four clear steps from idea to blueprint. No prior AI experience required.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, idx) => (
            <div key={step.number} className="how-step">
              <div className="how-step__number">
                <span>{step.number}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="how-step__connector" aria-hidden="true">
                  <ChevronRight size={20} />
                </div>
              )}
              <div className="how-step__content">
                <h3 className="how-step__title">{step.title}</h3>
                <p className="how-step__description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-7">
          <Link to="/challenge" className="btn btn--primary btn--lg" id="how-start-cta">
            Start My Challenge
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
