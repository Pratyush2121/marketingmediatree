import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Phone, Mail, MapPin } from 'lucide-react';
import logoImg from '../assets/image.png';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {/* Top CTA Banner */}
      <div className="footer-cta-banner">
        <div className="container footer-cta-container">
          <div className="cta-content">
            <h3 className="cta-title">Are You Ready To Start A New Project?</h3>
            <p className="cta-desc">
              Thank you for trusting Marketing Media Tree. We’re more than just a digital agency — we’re your growth partners. With passion, strategy, and creativity, we’re here to turn your vision into reality. Together, let’s create something remarkable and rise higher, every day!
            </p>
          </div>
          <Link to="/contact-us" className="btn btn-white btn-lg footer-cta-btn">
            Book Now
          </Link>
        </div>
      </div>

      {/* Main Footer Info */}
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-col branding-col">
            <Link to="/" className="footer-logo">
              <img src={logoImg} alt="Marketing Media Tree Logo" className="logo-img-asset" />
            </Link>
            <p className="branding-text">
              Dwarka Mor's premier results-driven marketing agency. Providing data-backed SEO, creative social media management, targeted PPC, and secure web development solutions.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/people/Marketing-Media-Tree/61573917923386/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
              </a>
              <a href="https://www.instagram.com/marketingmediatree/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://www.linkedin.com/company/marketing-media-tree/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col links-col">
            <h4 className="footer-heading">Useful Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/our-services">Our Services</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/blog">Blog Articles</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h4 className="footer-heading">Get in Touch</h4>
            <ul className="footer-contact-list">
              <li>
                <Phone size={18} className="contact-icon" />
                <a href="tel:+919696217440">+91 96962 17440</a>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <a href="mailto:info@marketingmediatree.com">info@marketingmediatree.com</a>
              </li>
              <li>
                <MapPin size={22} className="contact-icon" />
                <span>
                  Plot no 307 Third Floor, Kakrola Market 16/6 Housing Complex, Main Road, New Delhi 110078
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container">
          <p className="copyright-text">
            &copy; {currentYear} Marketing Media Tree. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
