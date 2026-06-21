import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Check, ArrowLeft, Target, Award, ShieldCheck, Zap, Code, Search, Cpu } from 'lucide-react';
import { servicesData } from '../data/mockData';
import './ServiceDetail.css';

export default function ServiceDetail() {
  const { slug } = useParams();
  
  // Find matching service item
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/our-services" replace />;
  }

  // Common target niches for digital campaigns
  const industryNiches = [
    { name: "E-Commerce", desc: "Product conversion funnels, catalog schemas, and abandoned checkouts." },
    { name: "Healthcare & Clinics", desc: "HIPAA-aligned local listings, booking pages, and reputation loops." },
    { name: "Real Estate Agencies", desc: "Lead capture capture forms, PPC landing pages, and email notifications." },
    { name: "Educational Institutes", desc: "Academic calendars, enrollment campaigns, and course portals." },
    { name: "Food & Hospitality", desc: "Interactive menu listings, table reserves, and local map SEO." },
    { name: "Travel & Tours", desc: "Dynamic route builders, booking tables, and visual galleries." }
  ];

  // Tailored widget rendering based on service type
  const renderInteractiveWidget = () => {
    switch (service.id) {
      case 'seo':
        return (
          <div className="detail-widget seo-widget">
            <h3 className="widget-title"><Search size={22} className="widget-icon" /> Keyword Optimization Timeline</h3>
            <p className="widget-desc">Our keyword strategy maps targeted phrases based on user search volume and ranking difficulty:</p>
            <div className="seo-process-steps">
              <div className="seo-step">
                <span className="step-tag">Month 1</span>
                <h4>Technical Audit & Cleanup</h4>
                <p>Remediate crawl blocks, page speeds, and index schema headers.</p>
              </div>
              <div className="seo-step">
                <span className="step-tag">Month 2</span>
                <h4>Content Expansion</h4>
                <p>Publish targeted blog posts answering specific user search questions.</p>
              </div>
              <div className="seo-step">
                <span className="step-tag">Month 3</span>
                <h4>Link Acquisition</h4>
                <p>Nurture editorial connections to score authoritative backlink votes.</p>
              </div>
            </div>
          </div>
        );
      case 'web':
        return (
          <div className="detail-widget web-widget">
            <h3 className="widget-title"><Code size={22} className="widget-icon" /> Speed & Performance Mockup</h3>
            <p className="widget-desc">We compile code to maximize Core Web Vitals parameters:</p>
            <div className="mock-browser">
              <div className="browser-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <div className="browser-url">https://yourbrand.com</div>
              </div>
              <div className="browser-body">
                <div className="performance-score-grid">
                  <div className="score-circle">
                    <span className="score-val">100</span>
                    <span className="score-lbl">Performance</span>
                  </div>
                  <div className="score-circle">
                    <span className="score-val">98</span>
                    <span className="score-lbl">SEO</span>
                  </div>
                  <div className="score-circle">
                    <span className="score-val">100</span>
                    <span className="score-lbl">Best Practices</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ppc':
        return (
          <div className="detail-widget ppc-widget">
            <h3 className="widget-title"><Target size={22} className="widget-icon" /> Search Ad Copy Simulation</h3>
            <p className="widget-desc">Preview of a targeted search campaign designed for high conversion CTR:</p>
            <div className="search-ad-preview">
              <span className="ad-sponsored">Sponsored</span>
              <h4 className="ad-title">Premier Marketing Agency New Delhi | Expand Your Local Brand Equity</h4>
              <span className="ad-link">www.marketingmediatree.com/growth</span>
              <p className="ad-snippet">
                Grow your business with data-driven SEO, creative social campaigns, and high-performance React web development. Start your free consultation audit.
              </p>
              <div className="ad-sitelinks">
                <span>Book Call</span>
                <span>Our Services</span>
                <span>Case Studies</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="detail-widget general-widget">
            <h3 className="widget-title"><Cpu size={22} className="widget-icon" /> Campaign Execution Strategy</h3>
            <div className="strategy-grid">
              <div className="strategy-card">
                <Zap size={20} className="strat-icon" />
                <h4>Agile Delivery</h4>
                <p>Weekly updates and quick design adjustments.</p>
              </div>
              <div className="strategy-card">
                <Award size={20} className="strat-icon" />
                <h4>Proven Blueprints</h4>
                <p>Strategies adapted from successful client outcomes.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="service-detail-page page-padding">
      <div className="container">
        {/* Back Link */}
        <Link to="/our-services" className="back-link">
          <ArrowLeft size={16} />
          Back to All Services
        </Link>

        {/* Hero Section */}
        <section className="detail-hero">
          <div className="detail-hero-content animate-fade-in">
            <span className="section-badge">Service Spotlight</span>
            <h1 className="detail-title">{service.title}</h1>
            <p className="detail-tagline">{service.tagline}</p>
          </div>
        </section>

        {/* Core Layout Grid */}
        <div className="detail-body-grid">
          {/* Left: General info and widgets */}
          <div className="detail-main-content">
            <div className="detail-description-card">
              <h2>Overview of Deliverables</h2>
              <p className="overview-text">{service.details}</p>
            </div>

            {renderInteractiveWidget()}

            {/* Target niches grid */}
            <div className="niches-wrapper">
              <h2>Key Industry Focus Areas</h2>
              <p className="niches-intro">We tailor campaign layouts and database structures to align with sector-specific customer searches:</p>
              <div className="niches-grid">
                {industryNiches.map((niche, idx) => (
                  <div key={idx} className="niche-card">
                    <h4>{niche.name}</h4>
                    <p>{niche.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Key highlights sidebar */}
          <div className="detail-sidebar">
            <div className="sidebar-card benefits-card">
              <h3>What We Deliver</h3>
              <ul className="sidebar-benefits-list">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="sidebar-benefit-item">
                    <Check size={18} className="benefit-check-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card contact-cta-card">
              <h3>Ready to Grow?</h3>
              <p>Schedule a quick consultation with our campaign leads to coordinate target outputs.</p>
              <Link to="/contact-us" className="btn btn-white btn-block">
                Start Project Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
