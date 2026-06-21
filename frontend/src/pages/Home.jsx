import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, BarChart2, Star, Send, Trees } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import FlipCard from '../components/FlipCard';
import Timeline from '../components/Timeline';
import Tabs from '../components/Tabs';
import Carousel from '../components/Carousel';
import Accordion from '../components/Accordion';
import BrandSlider from '../components/BrandSlider';
import { servicesData, faqData, testimonialData } from '../data/mockData';
import heroVideo from '../assets/WhatsApp Video 2026-06-18 at 19.39.57.mp4';
import imageHome from '../assets/imagehome.png';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.png';
import img4 from '../assets/img4.png';
import img5 from '../assets/img5.png';
import './Home.css';

const AnimatedCircularStat = ({ stat }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = stat.value;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = end / steps;
      const stepTime = duration / steps;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setValue(end);
          clearInterval(timer);
        } else {
          setValue(Math.floor(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [inView, stat.value]);

  const isCompleted = value === stat.value;
  const pathColor = isCompleted ? '#61CE70' : '#C084FC'; // Green when loaded, light purple while loading

  return (
    <div className="stat-card" ref={ref}>
      <div className="circular-progress-container">
        <CircularProgressbar
          value={value}
          maxValue={stat.maxValue}
          text={`${value}${stat.suffix}`}
          styles={buildStyles({
            pathColor: pathColor,
            textColor: '#ffffff',
            trailColor: 'rgba(255, 255, 255, 0.1)',
            textSize: '18px',
            pathTransition: 'none',
          })}
        />
      </div>
      <div className="stat-icon-box">{stat.icon}</div>
      <p className="stat-label">{stat.label}</p>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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

    // Retrieve existing submissions or initialize empty array
    const existingSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const newSubmission = {
      id: Date.now(),
      ...formData,
      date: new Date().toLocaleString()
    };

    localStorage.setItem('contactSubmissions', JSON.stringify([...existingSubmissions, newSubmission]));
    setFormSubmitted(true);

    // Clear Form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      description: ''
    });

    setTimeout(() => setFormSubmitted(false), 5000);
  };


  const stepsData = [
    {
      title: "Discovery & Strategy",
      description: "We start by understanding your business goals and target audience. Our team conducts in-depth research to craft a data-driven strategy."
    },
    {
      title: "Creative Planning",
      description: "With the strategy in place, we develop compelling content, eye-catching visuals, and campaigns designed to captivate your audience."
    },
    {
      title: "Implementation",
      description: "Our experts bring the plan to life, leveraging cutting-edge platforms for seamless execution across SEO, social, PPC, and development."
    },
    {
      title: "Performance Monitoring",
      description: "We track and measure campaign performance in real-time, using advanced analytics to ensure every effort delivers maximum return."
    }
  ];

  const beliefsTabs = [
    {
      label: "Who We Are",
      content: "At Marketing Media Tree, we're not just a digital marketing agency—we're a team of passionate creatives, strategists, data geeks, and growth architects with one clear purpose: helping brands like yours grow, thrive, and lead in the digital world. Based in Dwarka Mor, New Delhi, we provide personalized strategies designed to address the specific market challenges of retail, e-commerce, and service sectors."
    },
    {
      label: "Our Mission",
      content: "To empower businesses with innovative, data-driven digital marketing solutions that deliver measurable results, build meaningful brand connections, and fuel long-term organic success. We focus on bridging the gap between local retail footprints and online brand loyalty."
    },
    {
      label: "Our Vision",
      content: "We envision a digital landscape where brands, no matter their size or industry, have equal access to creative, powerful, and performance-based marketing. We aim to be the globally recognized growth engine that transforms local businesses into household names."
    },
    {
      label: "Our Approach",
      content: "At the heart of our approach lies a commitment to clarity, collaboration, and custom strategy. We don't believe in one-size-fits-all marketing—every brand has its own story, challenges, and goals. We combine rigorous keyword analytics with conversion-focused visual layout to maximize return on effort."
    }
  ];

  const stats = [
    { value: 250, maxValue: 250, suffix: "+", label: "Projects Completed", icon: <Trophy size={28} /> },
    { value: 96, maxValue: 100, suffix: "%", label: "Client Satisfaction", icon: <Star size={28} /> },
    { value: 10, maxValue: 10, suffix: "+", label: "Industries Served", icon: <Users size={28} /> },
    { value: 13, maxValue: 15, suffix: "+", label: "Marketing Awards", icon: <BarChart2 size={28} /> }
  ];

  const presentationPdf = "https://drive.google.com/file/d/1i4SEiT_rElCs12LCbeIuyA6-rkctC3E9/view?usp=sharing";

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <video className="hero-bg-video" src={heroVideo} autoPlay loop muted playsInline />
        <div className="hero-overlay" />
        <div className="container hero-container">
          <div className="hero-content float-animation">
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section what-we-do-section">
        <div className="container grid-2">
          <div className="what-we-do-grid-images">
            <img src={img2} alt="Creative Branding" className="what-we-do-grid-img" />
            <img src={img3} alt="Social Campaigns" className="what-we-do-grid-img" />
            <img src={img4} alt="Search Optimization" className="what-we-do-grid-img" />
            <img src={img5} alt="Responsive Web Development" className="what-we-do-grid-img" />
          </div>
          <div className="what-we-do-content">
            <span className="section-badge">WHAT WE DO?</span>
            <h2 className="section-heading">Transforming Your Online Potential into Real Business Success</h2>
            <p className="section-desc">
              At Marketing Media Tree, we empower businesses to thrive online. As a trusted Marketing Agency, we specialize in data-driven digital marketing strategies. We offer SEO, social media management, content creation, pay-per-click (PPC) advertising, and web development services tailored to amplify your brand’s presence.
            </p>
            <p className="section-desc">
              Our expertise in harnessing analytics and trends ensures measurable results, driving traffic, engagement, and conversions. As a full-service Marketing Agency, we craft personalized campaigns to suit your goals, fostering meaningful connections between brands and their audiences.
            </p>
            <Link to="/about-us" className="btn btn-primary">
              Explore More
            </Link>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="section section-bg how-we-work-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">How We Work</h2>
            <p className="section-subtitle">
              Our process is simple, strategic, and transparent. From discovery to delivery, we collaborate closely to turn your goals into measurable success.
            </p>
          </div>
          <Timeline steps={stepsData} />
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Our Core Services</h2>
            <p className="section-subtitle">
              Explore our core marketing and development coordinates built to drive high-intent leads and search engine visibility.
            </p>
          </div>
          <div className="services-grid">
            {servicesData.map((service) => (
              <FlipCard
                key={service.id}
                title={service.title}
                description={service.description}
                backTitle={service.title}
                backDescription={service.tagline}
                iconName={service.iconName}
                linkTo={`/our-services`}
                buttonText="Learn Details"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Grid */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((stat, index) => (
            <AnimatedCircularStat key={index} stat={stat} />
          ))}
        </div>
      </section>

      {/* Core Beliefs Section */}
      <section className="section core-beliefs-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Core Beliefs & Approach</h2>
            <p className="section-subtitle">
              Discover what fuels our passion—values-driven strategies, purposeful creativity, and a tailored approach that transforms brands and drives results.
            </p>
          </div>
          <div className="beliefs-cards-grid">
            {beliefsTabs.map((belief, index) => (
              <div key={index} className="belief-rectangle-card">
                <h3 className="belief-card-title-text">{belief.label}</h3>
                <p className="belief-card-content-text">{belief.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Brand Scroll slider */}
      <BrandSlider />

      {/* Testimonials section */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">
              Real feedback from our valued clients sharing their experiences, success stories, and the impact our strategies have made on their growth.
            </p>
          </div>
          <Carousel items={testimonialData} />
        </div>
      </section>

      {/* FAQs Section */}
      <section className="section section-bg faqs-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Answers to Common Questions</h2>
            <p className="section-subtitle">
              Find quick answers to the most frequently asked questions about our services, process, timelines, and how we help your brand grow.
            </p>
          </div>
          <Accordion items={faqData} />
        </div>
      </section>

      {/* Form Submission Section */}
      <section className="section contact-form-section">
        <div className="container grid-2">
          <div className="contact-form-info">
            <span className="section-badge">GET IN TOUCH</span>
            <h2 className="section-heading-form">Let’s Start the Conversation</h2>
            <p className="contact-form-desc">
              Are you ready to start a new project? Have a project in mind or questions about our services? Reach out to us—we’re here to help you grow your brand.
            </p>
            <div className="form-info-card">
              <Trees size={32} className="info-icon" />
              <div className="info-text-box">
                <h4>Growth Consultations</h4>
                <p>Book a free 30-minute analysis strategy audit. We'll inspect your Google business placement and outline conversion paths.</p>
              </div>
            </div>
          </div>

          <div className="contact-form-card">
            {formSubmitted ? (
              <div className="form-success-alert animate-fade-in">
                <Send size={48} className="success-icon animate-bounce" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. A growth partner from Marketing Media Tree will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="home-contact-form">
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
                      placeholder="John"
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
                      placeholder="Doe"
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
                    placeholder="john@example.com"
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
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Tell Us About Your Project</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your business goals and services needed..."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block form-submit-btn">
                  Submit Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
