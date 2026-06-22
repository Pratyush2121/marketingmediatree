import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Carousel from '../components/Carousel';
import { servicesData, testimonialData } from '../data/mockData';
import useSEO from '../hooks/useSEO';
import './Services.css';

export default function Services() {
  useSEO();
  return (
    <div className="services-page page-padding">
      {/* Page Hero Banner */}
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">OUR SERVICES</span>
          <h1 className="page-title">Digital Solutions Built to Convert</h1>
          <p className="page-subtitle">
            Explore our core marketing and development services designed to drive traffic, increase visibility, and convert clicks into lifetime clients.
          </p>
        </div>
      </section>

      {/* Main Services List */}
      <section className="section services-list-section">
        <div className="container services-list-container">
          {servicesData.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={service.id} 
                className={`service-item-row ${isEven ? 'row-normal' : 'row-reverse'}`}
              >
                {/* Visual Image block */}
                <div className="service-image-box">
                  <img src={service.image} alt={service.title} className="service-row-img" />
                  <div className="service-row-glow" />
                </div>

                {/* Content description block */}
                <div className="service-content-box animate-fade-in">
                  <span className="service-category-badge">{service.title}</span>
                  <h2 className="service-row-heading">{service.title}</h2>
                  <p className="service-row-desc">{service.details}</p>
                  
                  <div className="service-benefits-list">
                    {service.benefits.slice(0, 4).map((benefit, bIndex) => (
                      <div key={bIndex} className="benefit-badge">
                        <Check size={16} className="benefit-icon" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="service-actions-row">
                    <Link to={`/our-services/${service.slug}`} className="btn btn-outline">
                      Read Full Guide
                    </Link>
                    <Link to="/contact-us" className="btn btn-primary">
                      Start a Project
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonial slider at the bottom */}
      <section className="section section-bg services-testimonials">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Client Success Stories</h2>
            <p className="section-subtitle">
              Read how our digital coordinates have fueled traffic growth and ROI parameters for active partners.
            </p>
          </div>
          <Carousel items={testimonialData} />
        </div>
      </section>
    </div>
  );
}
