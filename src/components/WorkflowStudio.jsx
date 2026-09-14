import React, { useState } from 'react';

export default function WorkflowStudio() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(5); // default completed
  const [logs, setLogs] = useState([
    { time: '14:28:01', text: '[Webhook] GitHub PR #204 event received: Branch "feat/checkout-redesign"', type: 'info' },
    { time: '14:28:02', text: '[Orchestrator] Spawned 3 worker pods. Loading browser context...', type: 'info' },
    { time: '14:28:04', text: '[Playwright] 42/42 assertions passed. Zero DOM selector regressions.', type: 'success' },
    { time: '14:28:05', text: '[AI Triage] Anomaly score: 0.01 (Clean). Verified against baseline v2.4.', type: 'info' },
    { time: '14:28:06', text: '[Dispatcher] GitHub Check "AETHER QA: Passed" registered in 4.8s.', type: 'success' },
  ]);

  const nodes = [
    {
      id: 1,
      type: 'Trigger',
      title: 'GitHub Webhook',
      subtitle: 'PR / Push Event',
      badge: 'HTTP Listener'
    },
    {
      id: 2,
      type: 'Workflow',
      title: 'n8n QA Router',
      subtitle: 'Matrix Parallelizer',
      badge: 'Core Logic'
    },
    {
      id: 3,
      type: 'Execution',
      title: 'Playwright & API',
      subtitle: '42 Assertions',
      badge: 'Test Runner'
    },
    {
      id: 4,
      type: 'AI Node',
      title: 'Flake Analyzer',
      subtitle: 'Gemini Root-Cause',
      badge: 'ML Engine'
    },
    {
      id: 5,
      type: 'Action',
      title: 'Slack & Jira Sync',
      subtitle: 'Instant Alert',
      badge: 'Notification'
    }
  ];

  const handleRunWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setLogs([{ time: new Date().toLocaleTimeString(), text: '[Trigger] Executing n8n QA test sequence...', type: 'info' }]);

    const stepDelays = [700, 1500, 2400, 3200, 4000];

    stepDelays.forEach((delay, index) => {
      setTimeout(() => {
        const stepIndex = index + 1;
        setActiveStep(stepIndex);

        if (stepIndex === 1) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: '[Webhook] Incoming payload verified. Secret HMAC valid.', type: 'info' }]);
        } else if (stepIndex === 2) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: '[n8n Router] Split into parallel Chromium & Firefox headless workers.', type: 'info' }]);
        } else if (stepIndex === 3) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: '[Playwright] End-to-end flows executed in 1,240ms. 0 failures.', type: 'success' }]);
        } else if (stepIndex === 4) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: '[AI Engine] Zero regressions found in DOM layout & API latency.', type: 'success' }]);
        } else if (stepIndex === 5) {
          setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: '[Slack/Jira] QA Report dispatched to #deployments. All systems green.', type: 'success' }]);
          setIsRunning(false);
        }
      }, delay);
    });
  };

  return (
    <section className="studio-section" id="studio">
      <div className="container">
        <div className="studio-card">
          <div className="studio-header">
            <div className="studio-title-group">
              <h3>
                <span style={{ color: '#22c55e' }}>●</span>
                Interactive n8n QA Workflow Canvas
              </h3>
              <p>Visual, autonomous orchestration connecting git events to automated test assertions.</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="pill-button pill-button-primary"
                onClick={handleRunWorkflow}
                disabled={isRunning}
                style={{ opacity: isRunning ? 0.7 : 1 }}
              >
                {isRunning ? 'Running QA Pipeline...' : '▶ Run Test Pipeline'}
              </button>
            </div>
          </div>

          {/* Node Canvas */}
          <div className="workflow-canvas">
            {nodes.map((node, index) => {
              const isCurrent = activeStep === node.id;
              const isPassed = activeStep >= node.id;

              return (
                <React.Fragment key={node.id}>
                  <div className={`node-item ${isCurrent && isRunning ? 'running' : ''} ${isPassed ? 'active' : ''}`}>
                    <div className="node-top">
                      <span className="node-type-badge">{node.badge}</span>
                      <span className={`node-status-indicator ${isPassed ? 'success' : ''} ${isCurrent && isRunning ? 'processing' : ''}`}></span>
                    </div>
                    <div className="node-title">{node.title}</div>
                    <div className="node-subtitle">{node.subtitle}</div>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className={`connector-line ${activeStep > node.id ? 'active' : ''}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Live Execution Console */}
          <div className="studio-console">
            <div className="console-header">
              <span>Execution Output Console (n8n Node Execution Log)</span>
              <span>Status: {isRunning ? 'EXECUTING' : 'IDLE / READY'}</span>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="console-log-line">
                <span className="console-timestamp">{log.time}</span>
                <span className={`console-text ${log.type}`}>{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
