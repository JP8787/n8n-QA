import React from 'react';

export default function Metrics() {
  const stats = [
    {
      value: '10.6x',
      label: 'Faster regression cycles',
      description: 'End-to-end test execution via parallelized n8n execution nodes.'
    },
    {
      value: '99.4%',
      label: 'Flakiness reduction',
      description: 'Self-healing selector assertions and automated intelligent retries.'
    },
    {
      value: '4.8x',
      label: 'QA engineer bandwidth',
      description: 'Free engineering teams from repetitive manual test maintenance.'
    }
  ];

  return (
    <section className="metrics-section" id="metrics">
      <div className="container">
        <div className="metrics-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="metric-item">
              <span className="metric-number">{stat.value}</span>
              <span className="metric-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
