import React from 'react';
import './BrandSlider.css';

export default function BrandSlider() {
  const brands = [
    { name: "Acme Corp" },
    { name: "GlobalTech" },
    { name: "Vortex Co" },
    { name: "Innovate Ltd" },
    { name: "Synergy digital" },
    { name: "Apex Group" },
    { name: "Zenith Marketing" },
    { name: "Skyline Ventures" }
  ];

  // Duplicate items for loop
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <div className="brand-slider-container">
      <div className="brand-track">
        {displayBrands.map((brand, index) => (
          <div key={index} className="brand-logo-item">
            <span className="brand-logo-text">{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
