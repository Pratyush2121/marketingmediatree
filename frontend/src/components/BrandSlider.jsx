import React from 'react';
import './BrandSlider.css';

export default function BrandSlider({ clients = [] }) {
  const defaultBrands = [
    { name: "Acme Corp" },
    { name: "GlobalTech" },
    { name: "Vortex Co" },
    { name: "Innovate Ltd" },
    { name: "Synergy digital" },
    { name: "Apex Group" },
    { name: "Zenith Marketing" },
    { name: "Skyline Ventures" }
  ];

  const displayClients = clients && clients.length > 0 ? clients : defaultBrands;

  // Duplicate items for loop
  const displayBrands = [...displayClients, ...displayClients, ...displayClients];

  return (
    <div className="brand-slider-container">
      <div className="brand-track">
        {displayBrands.map((brand, index) => (
          <div key={index} className="brand-logo-item">
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="brand-logo-image" />
            ) : (
              <span className="brand-logo-text">{brand.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
