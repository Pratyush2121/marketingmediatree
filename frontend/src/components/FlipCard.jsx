import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import './FlipCard.css';

export default function FlipCard({ 
  title, 
  description, 
  backTitle, 
  backDescription, 
  iconName, 
  linkTo, 
  buttonText = "Learn More" 
}) {
  // Dynamically resolve Lucide Icon
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  return (
    <div className="flip-card-container">
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="card-icon-wrapper">
            <IconComponent size={40} className="card-icon" />
          </div>
          <h3 className="card-title">{title}</h3>
          <p className="card-desc">{description}</p>
          <div className="hover-indicator">Hover to Flip</div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <h3 className="card-title-back">{backTitle || title}</h3>
          <p className="card-desc-back">{backDescription || description}</p>
          {linkTo && (
            <Link to={linkTo} className="btn btn-white btn-sm card-btn">
              {buttonText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
