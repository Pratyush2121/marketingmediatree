import React, { useState, useEffect } from 'react';
import BrandSlider from '../components/BrandSlider';
import useSEO from '../hooks/useSEO';
import './OurClients.css';

export default function OurClients() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch('/api/settings/clients')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setClients(data.data);
        }
      })
      .catch(err => console.error('Error fetching clients:', err));
  }, []);

  useSEO();

  return (
    <div className="our-clients-page page-padding">
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">OUR CLIENTS</span>
          <h1 className="page-title">Trusted by Industry Leaders</h1>
          <p className="page-subtitle">
            We collaborate with companies of all sizes to drive measurable organic visibility and digital conversion growth.
          </p>
        </div>
      </section>

      {/* Dynamic Marquee Section */}
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <BrandSlider clients={clients} />
      </div>

      {/* Clients Row List Section */}
      <section className="section clients-list-section">
        <div className="container clients-rows-container">
          {clients.map((client, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={client.id || index} 
                className={`client-row-item ${isEven ? 'row-normal' : 'row-reverse'}`}
              >
                {/* Visual Image block */}
                <div className="client-image-box animate-fade-in">
                  <img src={client.logoUrl} alt={client.name} className="client-row-img" />
                  <div className="client-row-glow" />
                </div>

                {/* Content description block */}
                <div className="client-content-box animate-fade-in">
                  <span className="client-category-badge">OUR PARTNER</span>
                  <h2 className="client-row-heading">{client.name}</h2>
                  <p className="client-row-desc">{client.details || "Active digital marketing and search visibility growth partner."}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
