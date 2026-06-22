import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    companyName: 'Marketing Media Tree',
    address: 'Plot no 307 Third Floor, Kakrola Market 16/6 Housing Complex, Main Road, New Delhi 110078',
    email: 'info@marketingmediatree.com',
    phone: '+91 96962 17440',
    whatsapp: '919696217440'
  });

  const [mapData, setMapData] = useState({
    embedUrl: '',
    iframeCode: ''
  });

  useEffect(() => {
    // Fetch Contact Coordinates
    fetch('/api/settings/contactinfo')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setContactInfo(prev => ({
            ...prev,
            ...resData.data
          }));
        }
      })
      .catch(err => console.error('Error fetching contact coordinates:', err));

    // Fetch Map Setup
    fetch('/api/maps')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.map) {
          setMapData({
            embedUrl: resData.map.embedUrl,
            iframeCode: resData.map.iframeCode
          });
        }
      })
      .catch(err => console.error('Error fetching map configuration:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;

    setIsSubmitting(true);

    fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmitting(false);
        if (data.success) {
          setFormSubmitted(true);
          
          // Reset inputs
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            description: ''
          });

          setTimeout(() => setFormSubmitted(false), 5000);
        } else {
          alert('Submission failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(err => {
        setIsSubmitting(false);
        console.error('Error submitting form:', err);
        alert('Error sending message. Please try again later.');
      });
  };

  // Helper to check if map is valid
  const hasMap = mapData.iframeCode || mapData.embedUrl;

  return (
    <div className="contact-page page-padding">
      {/* Hero Header */}
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">CONTACT US</span>
          <h1 className="page-title">Let’s Start the Conversation</h1>
          <p className="page-subtitle">
            Are you ready to start a new project? Have a project in mind or queries about our capabilities? Reach out to us, and we'll craft a custom roadmap for your brand.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section contact-body-section">
        <div className="container grid-2">
          {/* Left: Contact Coordinates */}
          <div className="contact-info-panel">
            <h2 className="info-panel-title">Get In Touch</h2>
            <p className="info-panel-desc">
              Visit our office or dial our support desk to coordinate with Mohit Kumar and our local campaign execution teams.
            </p>

            <div className="contact-info-cards">
              <div className="info-card">
                <Phone className="info-card-icon" />
                <div className="info-card-text">
                  <h3>Phone Number</h3>
                  <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`}>{contactInfo.phone}</a>
                  <p className="availability">Mon - Sat, 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="info-card">
                <Mail className="info-card-icon" />
                <div className="info-card-text">
                  <h3>Email Address</h3>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  <p className="availability">Direct support queries</p>
                </div>
              </div>

              <div className="info-card">
                <MapPin className="info-card-icon" />
                <div className="info-card-text">
                  <h3>Delhi Office Address</h3>
                  <span>{contactInfo.address}</span>
                  <p className="availability">Near Dwarka Mor Metro Station</p>
                </div>
              </div>
            </div>

            {/* Custom Map Area */}
            <div className="map-mockup-container">
              {hasMap ? (
                mapData.iframeCode ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: mapData.iframeCode }} 
                    style={{ width: '100%', height: '100%', border: 'none' }} 
                    className="map-iframe-wrapper"
                  />
                ) : (
                  <iframe
                    src={mapData.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Google Map Location"
                  />
                )
              ) : (
                /* Fallback Map Mockup */
                <>
                  <div className="map-badge">Interactive Map</div>
                  <div className="map-canvas">
                    <div className="map-grid-pattern"></div>
                    <div className="map-marker-glow animate-pulse"></div>
                    <div className="map-pin-badge">
                      <MapPin size={20} color="white" />
                      <span>{contactInfo.companyName}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Fluent Form */}
          <div className="contact-form-wrapper">
            <div className="form-header-card">
              <MessageSquare size={24} className="form-header-icon" />
              <h3>Send Us a Message</h3>
            </div>
            
            {formSubmitted ? (
              <div className="form-success-alert animate-fade-in">
                <Send size={48} className="success-icon animate-bounce" />
                <h3>Form Submitted Successfully!</h3>
                <p>We've logged your request into our database. An account lead will reply within 12 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-page-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Jane"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      placeholder="Smith"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="jane.smith@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Message Description</label>
                  <textarea 
                    id="description" 
                    name="description" 
                    rows="6" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Write detailed requirements here..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary form-submit-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
