import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowDownToLine, Trees } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import logoImg from '../assets/image.png';
import './Header.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const [headerSettings, setHeaderSettings] = useState({
    logoUrl: '',
    email: 'info@marketingmediatree.com',
    phone: '+91 96962 17440',
    socialLinks: {
      instagram: 'https://www.instagram.com/marketingmediatree/',
      facebook: 'https://www.facebook.com/people/Marketing-Media-Tree/61573917923386/',
      linkedin: 'https://www.linkedin.com/company/marketing-media-tree/?viewAsMember=true'
    }
  });

  useEffect(() => {
    fetch('/api/settings/header')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setHeaderSettings(prev => ({
            ...prev,
            ...resData.data
          }));
        }
      })
      .catch(err => console.error('Error loading header settings:', err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/our-services' },
    { name: 'Our Clients', path: '/our-clients' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact-us' }
  ];

  const ebookUrl = "https://drive.google.com/file/d/1bBdYMbuNH8XDN6dl4VZ-4xbg98qmllWj/view?pli=1";

  return (
    <>
      <div className="header-top-bar">
        <div className="container header-top-bar-inner">
          <div className="top-bar-left">
            <span className="top-bar-text">{headerSettings.email}</span>
          </div>
          <div className="top-bar-right">
            {headerSettings.socialLinks?.instagram && (
              <a href={headerSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><FaInstagram size={16} /></a>
            )}
            {headerSettings.socialLinks?.facebook && (
              <a href={headerSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><FaFacebookF size={16} /></a>
            )}
            {headerSettings.socialLinks?.linkedin && (
              <a href={headerSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn"><FaLinkedinIn size={16} /></a>
            )}
          </div>
        </div>
      </div>
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container header-container">
          <Link to="/" className="header-logo">
            <img src={headerSettings.logoUrl || logoImg} alt="Marketing Media Tree Logo" className="logo-img-asset" />
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <ul className="nav-list">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path ||
                  (link.path !== '/' && location.pathname.startsWith(link.path));
                return (
                  <li key={link.name}>
                    <Link to={link.path} className={`nav-link ${isActive ? 'active' : ''}`}>
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-actions">
            <a href={ebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm e-book-btn">
              <ArrowDownToLine size={16} style={{ marginRight: '8px' }} />
              Download E-book
            </a>

            {/* Mobile Menu Button */}
            <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-list">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <li key={link.name}>
                  <Link to={link.path} className={`mobile-nav-link ${isActive ? 'active' : ''}`}>
                    {link.name}
                  </Link>
                </li>
              );
            })}
            <li>
              <a href={ebookUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mobile-ebook-btn">
                <ArrowDownToLine size={16} style={{ marginRight: '8px' }} />
                Download E-book
              </a>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
}
