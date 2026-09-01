import React, { useState, useEffect } from 'react';
import { Users, Briefcase, ExternalLink, Sparkles } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import './Portfolio.css';

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('clients'); // 'clients' | 'projects'
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/settings/clients').then(res => res.json()).catch(() => ({ success: false })),
      fetch('/api/settings/projects').then(res => res.json()).catch(() => ({ success: false }))
    ])
      .then(([clientsRes, projectsRes]) => {
        if (clientsRes.success && Array.isArray(clientsRes.data)) {
          setClients(clientsRes.data);
        }
        if (projectsRes.success && Array.isArray(projectsRes.data)) {
          setProjects(projectsRes.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useSEO();

  return (
    <div className="portfolio-page page-padding">
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">PORTFOLIO</span>
          <h1 className="page-title">Our Portfolio & Client Showcase</h1>
          <p className="page-subtitle">
            Explore our trusted client partnerships and high-impact digital marketing projects driving real business growth.
          </p>

          {/* Interactive Tab Switcher */}
          <div className="portfolio-tabs-container">
            <button
              className={`portfolio-tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveTab('clients')}
            >
              <Users size={18} />
              <span>Clients</span>
              {clients.length > 0 && <span className="tab-count">{clients.length}</span>}
            </button>
            <button
              className={`portfolio-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <Briefcase size={18} />
              <span>Projects</span>
              {projects.length > 0 && <span className="tab-count">{projects.length}</span>}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section portfolio-content-section">
        <div className="container">
          
          {/* CLIENTS TAB VIEW */}
          {activeTab === 'clients' && (
            <div className="clients-tab-view animate-fade-in">
              {clients.length > 0 ? (
                <div className="clients-rows-container">
                  {clients.map((client, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div 
                        key={client.id || client._id || index} 
                        className={`client-row-item ${isEven ? 'row-normal' : 'row-reverse'}`}
                      >
                        {/* Visual Image box */}
                        <div className="client-image-box animate-fade-in">
                          <img src={client.logoUrl} alt={client.name} className="client-row-img" />
                          <div className="client-row-glow" />
                        </div>

                        {/* Content description box */}
                        <div className="client-content-box animate-fade-in">
                          <span className="client-category-badge">OUR PARTNER</span>
                          <h2 className="client-row-heading">{client.name}</h2>
                          <p className="client-row-desc">{client.details || "Active digital marketing and search visibility growth partner."}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="portfolio-empty-state">
                  <Users size={40} style={{ marginBottom: '12px', opacity: 0.7 }} />
                  <h3>No Clients Listed</h3>
                  <p>Client profiles will appear here once added in the Admin Panel.</p>
                </div>
              )}
            </div>
          )}

          {/* PROJECTS TAB VIEW */}
          {activeTab === 'projects' && (
            <div className="projects-tab-view animate-fade-in">
              {projects.length > 0 ? (
                <div className="projects-grid-container">
                  {projects.map((project, index) => (
                    <div key={project.id || project._id || index} className="project-card animate-fade-in">
                      <div className="project-image-wrapper">
                        <img src={project.imageUrl} alt={project.title} className="project-card-img" />
                        {project.category && (
                          <span className="project-category-tag">{project.category}</span>
                        )}
                      </div>

                      <div className="project-card-body">
                        <h3 className="project-card-title">{project.title}</h3>
                        <p className="project-card-desc">{project.description}</p>
                        
                        {project.link && (
                          <div className="project-card-footer">
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="project-link-btn"
                            >
                              <span>View Project Details</span>
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="portfolio-empty-state">
                  <Briefcase size={40} style={{ marginBottom: '12px', opacity: 0.7 }} />
                  <h3>No Projects Showcase</h3>
                  <p>Projects will appear here once added in the Admin Panel.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
