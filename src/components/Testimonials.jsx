import React from 'react';

export default function Testimonials() {
  return (
    <section className="testimonials-section" id="customers">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Trusted by leaders</h2>
          <p className="testimonials-subtitle">
            Run your automated test suites like the world's best engineering teams —
            without needing a 50+ person manual QA team.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Enterprise Spotlight */}
          <div className="bento-card bento-card-spotlight">
            <div className="spotlight-logo">
              <span>Qonto</span>
            </div>

            <div className="spotlight-metric">
              <div className="spotlight-metric-value">99.98%</div>
              <div className="spotlight-metric-label">
                Production release confidence across 12,000 daily automated runs.
              </div>
            </div>
          </div>

          {/* Card 2: QA Leader Headshot */}
          <div className="bento-card bento-card-photo">
            <img 
              src="/qa_leader.jpg" 
              alt="David Chen - VP of Quality Engineering" 
              loading="lazy"
            />
            <div className="photo-overlay">
              <div className="photo-name">David Chen</div>
              <div className="photo-role">VP of Quality Engineering, FinScale</div>
            </div>
          </div>

          {/* Card 3: Scenic Painted Testimonial Card */}
          <div className="bento-card bento-card-quote">
            <div className="quote-content">
              <div className="quote-header">
                <span className="quote-badge">CASE STUDY</span>
                <span className="quote-logo">PLAID</span>
              </div>

              <p className="quote-text">
                "Automated QA workflows with n8n turned our release cycle from days of
                exhausting manual checks into a 3-minute self-healing pipeline.
                Now quality is our biggest competitive advantage."
              </p>

              <div>
                <div className="quote-author">Zak Lambert</div>
                <div className="quote-role">QA Director EMEA, Plaid</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
