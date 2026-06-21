import React from 'react';
import { ArrowDownToLine, Users, CheckCircle, ShieldCheck } from 'lucide-react';
import FlipCard from '../components/FlipCard';
import Carousel from '../components/Carousel';
import { teamData, testimonialData } from '../data/mockData';
import './About.css';

export default function About() {
  const profilePdf = "https://drive.google.com/file/d/1bBdYMbuNH8XDN6dl4VZ-4xbg98qmllWj/view?usp=sharing";

  const workflowSteps = [
    {
      step: "1",
      title: "Understand & Strategize",
      desc: "We dive deep into your market reality, conduct competitor auditing, and map keywords to draft a clear strategy roadmap."
    },
    {
      step: "2",
      title: "Create & Execute",
      desc: "Our visual designers and content specialists launch highly targeted ads, post copy, and clean page layouts."
    },
    {
      step: "3",
      title: "Monitor & Analyze",
      desc: "We perform real-time audit sweeps on traffic, conversion counts, bounce rates, and cost parameters."
    },
    {
      step: "4",
      title: "Optimize & Grow",
      desc: "We refine layouts, bid weights, and target phrases, pushing campaign performance continuously upward."
    }
  ];

  return (
    <div className="about-page page-padding">
      {/* Banner / Hero */}
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">ABOUT US</span>
          <h1 className="page-title">Growth Partners with One Clear Purpose</h1>
          <p className="page-subtitle">
            Learn how Marketing Media Tree turns digital challenges into structured customer acquisitions for brands worldwide.
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="section about-profile-section">
        <div className="container grid-2">
          <div className="profile-text-content">
            <h2 className="section-title-left">Who We Are & What We Stand For</h2>
            <p className="section-desc">
              At Marketing Media Tree, we’re not just another digital marketing agency. We’re growth partners committed to helping businesses design sustainable, long-term brand equity. Based in Kakrola Market, Dwarka Mor, New Delhi, we blend local local search engine insights with global analytics parameters.
            </p>
            <p className="section-desc">
              We specialize in constructing complete customer acquisition funnels, taking cold prospects and guiding them to become lifetime clients. By using advanced tracking systems, we offer full performance transparency, meaning you always know exactly how your budgets convert.
            </p>
            <div className="about-cta-wrapper">
              <a href={profilePdf} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <ArrowDownToLine size={18} style={{ marginRight: '8px' }} />
                Download Company Profile
              </a>
            </div>
          </div>
          <div className="profile-graphics-wrapper">
            <div className="graphics-card">
              <Users size={40} className="graphic-icon" />
              <h3>Data-Driven Team</h3>
              <p>Certified marketing engineers, front-end developers, and creative copywriters collaborating under one roof.</p>
            </div>
            <div className="graphics-card">
              <CheckCircle size={40} className="graphic-icon" />
              <h3>Quality Execution</h3>
              <p>Zero templates. Custom graphic components, unique content copies, and responsive development frameworks.</p>
            </div>
            <div className="graphics-card">
              <ShieldCheck size={40} className="graphic-icon" />
              <h3>Accountability</h3>
              <p>Clear dashboards, transparent dashboards, and direct phone lines to lead campaign engineers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Workflow */}
      <section className="section section-bg workflow-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Our Operational Blueprint</h2>
            <p className="section-subtitle">
              We eliminate guesswork. Our structured operational pipeline keeps layouts on time, messages transparent, and targets on focus.
            </p>
          </div>

          <div className="workflow-grid-about">
            {workflowSteps.map((item) => (
              <div key={item.step} className="workflow-card-about">
                <div className="workflow-number-badge">{item.step}</div>
                <h3 className="workflow-card-title">{item.title}</h3>
                <p className="workflow-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section team-section">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Meet Our Leadership Team</h2>
            <p className="section-subtitle">
              The creative minds and technical strategists guiding campaigns to success from our New Delhi headquarters.
            </p>
          </div>

          <div className="team-grid">
            {teamData.map((member) => (
              <FlipCard
                key={member.id}
                title={member.name}
                description={member.role}
                backTitle={member.name}
                backDescription={member.bio}
                iconName="User"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-bg testimonials-section-about">
        <div className="container">
          <div className="section-title-wrapper">
            <h2 className="section-title">Testimonials & Client Feedback</h2>
            <p className="section-subtitle">
              Hear from brand directors and retail entrepreneurs who expanded their reach with Marketing Media Tree.
            </p>
          </div>
          <Carousel items={testimonialData} />
        </div>
      </section>
    </div>
  );
}
