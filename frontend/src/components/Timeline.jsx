import React from 'react';
import './Timeline.css';

export default function Timeline({ steps }) {
  return (
    <div className="timeline-container">
      <div className="timeline-grid">
        {steps.map((step, index) => (
          <div key={index} className="timeline-card-item">
            <div className="timeline-badge">
              <span className="step-number">0{index + 1}</span>
            </div>
            <div className="timeline-content-wrapper">
              <h3 className="timeline-step-title">{step.title}</h3>
              <p className="timeline-step-desc">{step.description}</p>
            </div>
            {index < steps.length - 1 && <div className="timeline-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}
