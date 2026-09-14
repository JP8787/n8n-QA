import React from 'react';

export default function Features() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      title: 'Drive test velocity',
      description: "AETHER's n8n platform triggers headless test suites on every git commit, PR, or deployment. Engineered to eliminate release bottlenecks and deliver continuous quality feedback."
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: 'Future-proof visual pipelines',
      description: 'A visual low-code workflow engine connects UI tests, GraphQL assertions, REST APIs, and database state checks into self-healing, maintainable QA pipelines.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      title: 'Autonomous bug triage',
      description: 'Eliminate manual log inspections, chaotic spreadsheets, and slow triage meetings. AI-driven nodes analyze failure snapshots, correlate root causes, and draft reproducible tickets.'
    }
  ];

  return (
    <section className="features-section" id="product">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">
            Designed to detect. Built to scale.
          </h2>
        </div>

        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-col">
              <div className="feature-icon-wrap">
                {feature.icon}
              </div>
              <h3 className="feature-heading">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
