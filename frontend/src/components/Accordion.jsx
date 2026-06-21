import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export default function Accordion({ items }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion-wrapper">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;
        return (
          <div key={index} className={`accordion-item ${isOpen ? 'open' : ''}`}>
            <button 
              className="accordion-header" 
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
            >
              <span className="accordion-question">{item.question}</span>
              <ChevronDown className="accordion-icon" size={20} />
            </button>
            <div className="accordion-collapse">
              <div className="accordion-content">
                <p className="accordion-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
