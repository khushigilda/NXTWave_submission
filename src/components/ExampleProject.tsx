import './ExampleProject.css';

export default function ExampleProject() {
  return (
    <section className="example-project section--sm" id="example-project">
      <div className="container">
        <div className="text-center mb-6">
          <p className="section-eyebrow">EXAMPLE OUTPUT</p>
          <h2 className="section-title">What a Blueprint Looks Like</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            This is a sample blueprint to show you what the challenge produces. It is not a completed student submission.
          </p>
        </div>

        <div className="example-card">
          <div className="example-card__badge">
            <span className="badge badge--muted">Example — Not a Real Submission</span>
          </div>

          <h3 className="example-card__title">AI Exam Preparation Assistant</h3>

          <div className="example-grid">
            <div className="example-section">
              <div className="example-section__label">Problem</div>
              <p className="example-section__text">
                Students struggle to organise revision across multiple subjects and deadlines, often leaving preparation too late.
              </p>
            </div>

            <div className="example-section">
              <div className="example-section__label">Possible Solution</div>
              <p className="example-section__text">
                An assistant that turns a list of topics, available study hours and exam dates into a prioritised revision plan.
              </p>
            </div>

            <div className="example-section">
              <div className="example-section__label">First Version to Build</div>
              <p className="example-section__text">
                A simple form that accepts topics and available time, then displays a structured revision schedule — no AI required for the first version.
              </p>
            </div>

            <div className="example-section">
              <div className="example-section__label">Suggested Tools</div>
              <ul className="example-list">
                <li>HTML, CSS, JavaScript</li>
                <li>A Gemini or OpenAI prompt for schedule personalisation</li>
                <li>LocalStorage to save the plan</li>
              </ul>
            </div>

            <div className="example-section">
              <div className="example-section__label">Starter Prompt</div>
              <div className="example-prompt">
                "You are a study planner. Given subjects [LIST], exam dates [DATES], and available hours [HOURS], create a day-by-day revision schedule that prioritises by exam proximity."
              </div>
            </div>

            <div className="example-section">
              <div className="example-section__label">One Realistic Limitation</div>
              <p className="example-section__text">
                The schedule is only as accurate as the inputs. Students who underestimate study time will receive an unrealistic plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
