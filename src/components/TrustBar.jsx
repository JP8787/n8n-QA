import React from 'react';

export default function TrustBar() {
  return (
    <section className="trust-section" id="customers">
      <div className="container">
        <p className="trust-title">
          Built for engineering and QA teams where software quality matters
        </p>

        <div className="trust-logos">
          {/* n8n */}
          <div className="logo-item" title="n8n Automation">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="12" r="3.5" fill="currentColor" />
              <circle cx="18" cy="12" r="3.5" fill="currentColor" />
              <path d="M9.5 12h5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span>n8n</span>
          </div>

          {/* Plaid */}
          <div className="logo-item" title="Plaid">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>PLAID</span>
          </div>

          {/* Playwright */}
          <div className="logo-item" title="Playwright">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 10h6M9 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>playwright</span>
          </div>

          {/* Cypress */}
          <div className="logo-item" title="Cypress">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M15 9a4.5 4.5 0 1 0 0 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>cypress</span>
          </div>

          {/* GitHub */}
          <div className="logo-item" title="GitHub">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>GitHub</span>
          </div>

          {/* Docker */}
          <div className="logo-item" title="Docker">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 14h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-2z" fill="none" stroke="currentColor" strokeWidth="2"/>
              <rect x="5" y="9" width="3" height="3" rx="0.5"/>
              <rect x="9" y="9" width="3" height="3" rx="0.5"/>
              <rect x="13" y="9" width="3" height="3" rx="0.5"/>
            </svg>
            <span>docker</span>
          </div>
        </div>
      </div>
    </section>
  );
}
