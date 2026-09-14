import React from 'react';

export default function TrustBar() {
  return (
    <section className="trust-section" id="stack-trust">
      <div className="container">
        <p className="trust-title">
          Arquitectura Integrada con el Ecosistema de Automatización
        </p>

        <div className="trust-logos">
          {/* n8n */}
          <div className="logo-item n8n-brand" title="n8n Workflow Automation">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="12" r="3.5" fill="#ea4b71" />
              <circle cx="18" cy="12" r="3.5" fill="#ea4b71" />
              <path d="M9.5 12h5" stroke="#ea4b71" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span style={{ fontWeight: 800, color: '#1e293b' }}>n8n</span>
          </div>

          {/* Google Gemini */}
          <div className="logo-item" title="Google Gemini 1.5/2.0 API">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" stroke="#2563eb">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Google Gemini</span>
          </div>

          {/* Google Sheets API */}
          <div className="logo-item" title="Google Sheets API v4">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" stroke="#107c41">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/>
              <line x1="9" y1="9" x2="9" y2="21" strokeWidth="2"/>
            </svg>
            <span>Google Sheets API</span>
          </div>

          {/* OpenRouter */}
          <div className="logo-item" title="OpenRouter AI Fallback">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" stroke="#7c3aed">
              <circle cx="12" cy="12" r="9" strokeWidth="2"/>
              <path d="M8 12h8M12 8v8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>OpenRouter</span>
          </div>

          {/* Node.js / JavaScript */}
          <div className="logo-item" title="Node.js & JavaScript JSON Schema Sanitizer">
            <svg className="logo-mark" viewBox="0 0 24 24" fill="none" stroke="#059669">
              <polyline points="16 18 22 12 16 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="8 6 2 12 8 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Node.js Code Node</span>
          </div>
        </div>
      </div>
    </section>
  );
}
