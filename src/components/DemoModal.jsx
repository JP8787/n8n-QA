import React, { useState, useEffect } from 'react';

export default function DemoModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    framework: 'Playwright',
    webhookUrl: ''
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // simulate success
    }, 1000);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <div className="modal-header">
          <h3>Schedule an n8n QA Demo</h3>
          <p>
            Experience how autonomous n8n workflows transform your test suites,
            prevent flakiness, and eliminate release regressions.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              Demo Request Received!
            </h4>
            <p style={{ fontSize: '13.5px', color: '#575d6b', marginBottom: '24px' }}>
              We've dispatched your test environment configuration link to <strong>{formData.email || 'your email'}</strong>. Our QA engineering specialist will reach out shortly.
            </p>
            <button 
              type="button" 
              className="pill-button pill-button-primary"
              onClick={handleReset}
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                required 
                placeholder="Sarah Connor" 
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <input 
                type="email" 
                required 
                placeholder="sarah@engineering.co" 
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary QA Stack / Framework</label>
              <select 
                className="form-select"
                value={formData.framework}
                onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
              >
                <option value="Playwright">Playwright (E2E & Component)</option>
                <option value="Cypress">Cypress</option>
                <option value="REST/GraphQL">API Testing (Postman / REST / GraphQL)</option>
                <option value="Selenium">Selenium / Appium</option>
                <option value="Custom">Custom Internal Runner</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Optional: Your n8n Instance Webhook URL</label>
              <input 
                type="url" 
                placeholder="https://n8n.yourcompany.com/webhook/qa-runner" 
                className="form-input"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="pill-button pill-button-primary"
              style={{ marginTop: '8px', padding: '12px' }}
            >
              Request Access & Trigger Demo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
