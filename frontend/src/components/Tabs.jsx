import React, { useState } from 'react';
import './Tabs.css';

export default function Tabs({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-container">
      {/* Tabs Menu Header */}
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-btn ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content Panel */}
      <div className="tabs-body">
        {tabs.map((tab, index) => (
          <div 
            key={index} 
            className={`tab-panel ${activeTab === index ? 'active' : ''}`}
          >
            {activeTab === index && (
              <div className="tab-panel-inner animate-fade-in">
                {typeof tab.content === 'string' ? (
                  <p className="tab-text">{tab.content}</p>
                ) : (
                  tab.content
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
