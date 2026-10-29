import './CampaignStages.css';

const stages = [
  {
    number: '01',
    label: 'ATTRACT',
    color: 'stage-1',
    description: 'A compelling challenge post introduces students to the opportunity.',
    icon: '📢',
  },
  {
    number: '02',
    label: 'ENGAGE',
    color: 'stage-2',
    description: 'Students take a short, beginner-friendly AI project activity.',
    icon: '⚡',
  },
  {
    number: '03',
    label: 'CONVERT',
    color: 'stage-3',
    description: 'Students receive a clear invitation to register for the official workshop.',
    icon: '🎯',
  },
  {
    number: '04',
    label: 'AMPLIFY',
    color: 'stage-4',
    description: 'Students invite friends through a shareable link or referral code.',
    icon: '🔗',
  },
];

export default function CampaignStages() {
  return (
    <section className="campaign-stages section--sm" id="campaign-stages">
      <div className="container">
        <div className="text-center mb-6">
          <p className="section-eyebrow">HOW THE CAMPAIGN WORKS</p>
          <h2 className="section-title">Four-Stage Growth Mechanism</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Each stage is designed to move students from discovery to action.
          </p>
        </div>

        <div className="stages-grid">
          {stages.map((stage) => (
            <div key={stage.number} className={`stage-card stage-card--${stage.color}`}>
              <div className="stage-card__number">{stage.number}</div>
              <div className="stage-card__icon">{stage.icon}</div>
              <div className="stage-card__label">{stage.label}</div>
              <p className="stage-card__description">{stage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
