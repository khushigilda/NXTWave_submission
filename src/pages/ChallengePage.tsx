import Navbar from '../components/Navbar';
import ChallengeWizard from '../components/ChallengeWizard';
import './ChallengePage.css';

export default function ChallengePage() {
  return (
    <div className="challenge-page">
      <Navbar />
      <main id="main-content" className="challenge-page__main">
        <div className="challenge-page__bg-decoration" aria-hidden="true" />
        <ChallengeWizard />
      </main>
    </div>
  );
}
