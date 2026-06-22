import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, FileText, Send, Trash2, Plus, CheckCircle, Database, 
  LayoutDashboard, Settings, Map, Search, Image, LogOut, 
  Globe, Lock, ExternalLink, FileSpreadsheet, Edit3, Eye, EyeOff, Clipboard, Upload
} from 'lucide-react';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Stats Data
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalLeads: 0,
    totalMedia: 0
  });

  // Blog Management State
  const [blogs, setBlogs] = useState([]);
  const [blogFormMode, setBlogFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Digital Marketing',
    author: 'Jasmine',
    image: '',
    excerpt: '',
    content: '',
    published: true,
    tags: '',
    metaTitle: '',
    metaDescription: ''
  });
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  // Leads State
  const [leads, setLeads] = useState([]);
  const [leadSearch, setLeadSearch] = useState('');

  // Settings State
  const [headerSettings, setHeaderSettings] = useState({
    logoUrl: '',
    email: '',
    phone: '',
    socialLinks: { instagram: '', facebook: '', linkedin: '' }
  });
  const [footerSettings, setFooterSettings] = useState({
    email: '',
    phone: '',
    address: '',
    copyright: '',
    socialLinks: { instagram: '', facebook: '', linkedin: '' }
  });
  const [contactInfo, setContactInfo] = useState({
    companyName: '',
    address: '',
    email: '',
    phone: '',
    whatsapp: ''
  });
  const [mapSettings, setMapSettings] = useState({
    embedUrl: '',
    iframeCode: ''
  });
  const [seoSettings, setSeoSettings] = useState({
    siteTitle: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogImageUrl: '',
    canonicalUrl: ''
  });

  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState('');

  // Media Library State
  const [mediaList, setMediaList] = useState([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Authentication check on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setIsVerifying(false);
          if (data.success) {
            setIsLoggedIn(true);
            loadDashboardData();
          } else {
            localStorage.removeItem('adminToken');
            setIsLoggedIn(false);
          }
        })
        .catch(err => {
          setIsVerifying(false);
          console.error('Token verification failed:', err);
          setIsLoggedIn(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, []);

  // Fetch Dashboard Stats & Related Datasets
  const loadDashboardData = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    // Fetch stats
    Promise.all([
      fetch('/api/blogs?all=true').then(res => res.json()),
      fetch('/api/contacts', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/media', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/settings/header').then(res => res.json()),
      fetch('/api/settings/footer').then(res => res.json()),
      fetch('/api/settings/contactinfo').then(res => res.json()),
      fetch('/api/settings/seo').then(res => res.json()),
      fetch('/api/maps').then(res => res.json())
    ])
      .then(([blogsData, leadsData, mediaData, headerData, footerData, contactData, seoData, mapsData]) => {
        if (blogsData.success) {
          setBlogs(blogsData.blogs);
        }
        if (leadsData.success) {
          setLeads(leadsData.submissions);
        }
        if (mediaData.success) {
          setMediaList(mediaData.media);
        }
        if (headerData.success && headerData.data) {
          setHeaderSettings(headerData.data);
        }
        if (footerData.success && footerData.data) {
          setFooterSettings(footerData.data);
        }
        if (contactData.success && contactData.data) {
          setContactInfo(contactData.data);
        }
        if (seoData.success && seoData.data) {
          setSeoSettings(seoData.data);
        }
        if (mapsData.success && mapsData.map) {
          setMapSettings({
            embedUrl: mapsData.map.embedUrl,
            iframeCode: mapsData.map.iframeCode
          });
        }

        setStats({
          totalBlogs: blogsData.count || 0,
          totalLeads: leadsData.count || 0,
          totalMedia: mediaData.count || 0
        });
      })
      .catch(err => console.error('Failed to load dashboard data:', err));
  };

  // Re-load tabs datasets when tabs switch
  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [activeTab, isLoggedIn]);

  // Auth Handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;

    setIsSubmittingLogin(true);
    setLoginError('');

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    })
      .then(res => res.json())
      .then(data => {
        setIsSubmittingLogin(false);
        if (data.success && data.token) {
          localStorage.setItem('adminToken', data.token);
          setIsLoggedIn(true);
          setLoginForm({ email: '', password: '' });
          loadDashboardData();
        } else {
          setLoginError(data.message || 'Invalid email or password');
        }
      })
      .catch(err => {
        setIsSubmittingLogin(false);
        console.error('Error logging in:', err);
        setLoginError('Error connecting to backend services.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  // File Upload Helper
  const handleImageUpload = async (file, onUploadSuccess) => {
    if (!file) return;
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success && data.media) {
        onUploadSuccess(data.media.url);
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading file to Database.');
    }
  };

  // --- BLOG MANAGEMENT HANDLERS ---
  const handleBlogFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateBlogBtn = () => {
    setBlogForm({
      title: '',
      category: 'Digital Marketing',
      author: 'Jasmine',
      image: '',
      excerpt: '',
      content: '',
      published: true,
      tags: '',
      metaTitle: '',
      metaDescription: ''
    });
    setBlogFormMode('add');
  };

  const handleEditBlogBtn = (post) => {
    setSelectedBlogId(post._id);
    setBlogForm({
      title: post.title,
      category: post.category,
      author: post.author,
      image: post.image || '',
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || ''
    });
    setBlogFormMode('edit');
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.excerpt || !blogForm.content) return;

    setIsSavingBlog(true);
    const token = localStorage.getItem('adminToken');
    const url = blogFormMode === 'add' ? '/api/blogs' : `/api/blogs/${selectedBlogId}`;
    const method = blogFormMode === 'add' ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blogForm)
    })
      .then(res => res.json())
      .then(data => {
        setIsSavingBlog(false);
        if (data.success) {
          setBlogFormMode('list');
          loadDashboardData();
          alert(blogFormMode === 'add' ? 'Blog created!' : 'Blog updated!');
        } else {
          alert('Save failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(err => {
        setIsSavingBlog(false);
        console.error('Error saving blog:', err);
        alert('Server connection error.');
      });
  };

  const handleDeleteBlog = (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    const token = localStorage.getItem('adminToken');

    fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadDashboardData();
          alert('Blog post deleted.');
        } else {
          alert('Delete failed: ' + data.message);
        }
      })
      .catch(err => console.error('Error deleting blog:', err));
  };

  const handleTogglePublish = (post) => {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/blogs/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ published: !post.published })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadDashboardData();
        } else {
          alert('Toggle failed: ' + data.message);
        }
      })
      .catch(err => console.error('Error toggling publish status:', err));
  };

  // --- LEADS MANAGEMENT HANDLERS ---
  const handleLeadSearchChange = (e) => {
    setLeadSearch(e.target.value);
  };

  const executeLeadSearch = () => {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/contacts?search=${leadSearch}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLeads(data.submissions);
        }
      })
      .catch(err => console.error('Error searching leads:', err));
  };

  const handleDeleteLead = (id) => {
    if (!window.confirm('Delete this lead registration?')) return;
    const token = localStorage.getItem('adminToken');

    fetch(`/api/contacts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadDashboardData();
          alert('Lead deleted.');
        }
      })
      .catch(err => console.error('Error deleting lead:', err));
  };

  const handleExportCSV = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/contacts/export', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch(err => console.error('Error exporting CSV leads:', err));
  };

  // --- SETTINGS SUBMIT HANDLERS ---
  const saveSettings = (key, dataPayload) => {
    const token = localStorage.getItem('adminToken');
    fetch(`/api/settings/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data: dataPayload })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettingsSuccessMsg(`${key.toUpperCase()} configurations updated successfully!`);
          setTimeout(() => setSettingsSuccessMsg(''), 4000);
          loadDashboardData();
        } else {
          alert('Update failed: ' + data.message);
        }
      })
      .catch(err => console.error('Error saving settings:', err));
  };

  const handleHeaderSettingsSubmit = (e) => {
    e.preventDefault();
    saveSettings('header', headerSettings);
  };

  const handleFooterSettingsSubmit = (e) => {
    e.preventDefault();
    saveSettings('footer', footerSettings);
  };

  const handleContactInfoSubmit = (e) => {
    e.preventDefault();
    saveSettings('contactinfo', contactInfo);
  };

  const handleMapSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    fetch('/api/maps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mapSettings)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSettingsSuccessMsg('Google Map configurations updated!');
          setTimeout(() => setSettingsSuccessMsg(''), 4000);
          loadDashboardData();
        }
      })
      .catch(err => console.error('Error saving map settings:', err));
  };

  const handleSeoSubmit = (e) => {
    e.preventDefault();
    saveSettings('seo', seoSettings);
  };

  // --- MEDIA LIBRARY HANDLERS ---
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingMedia(true);
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('file', file);

    fetch('/api/media/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        setIsUploadingMedia(false);
        if (data.success) {
          loadDashboardData();
          alert('Asset uploaded successfully!');
        } else {
          alert('Upload failed: ' + data.message);
        }
      })
      .catch(err => {
        setIsUploadingMedia(false);
        console.error('Media upload error:', err);
      });
  };

  const handleDeleteMedia = (id) => {
    if (!window.confirm('Permanently delete this asset?')) return;
    const token = localStorage.getItem('adminToken');

    fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadDashboardData();
          alert('Asset deleted.');
        }
      })
      .catch(err => console.error('Error deleting media:', err));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  // Render verifying spinner
  if (isVerifying) {
    return <div className="page-padding text-center">Verifying credentials session...</div>;
  }

  // If not authenticated, render Login view
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page page-padding">
        <div className="container login-container">
          <div className="login-card animate-fade-in">
            <div className="login-logo-header">
              <Lock className="login-logo-icon" />
              <h2>Marketing <span className="logo-highlight">Media Tree</span></h2>
              <p>Agency Dashboard Access</p>
            </div>
            
            {loginError && (
              <div className="login-error-alert animate-fade-in">
                <span>{loginError}</span>
              </div>
            )}
            
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="admin@marketingmediatree.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  required 
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block login-btn"
                disabled={isSubmittingLogin}
              >
                {isSubmittingLogin ? 'Verifying...' : 'Log In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page page-padding">
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">ADMIN CONTROL PANEL</span>
          <h1 className="page-title">Agency Dashboard</h1>
          <p className="page-subtitle">
            Configure metadata parameters, view incoming form leads, upload media assets, and manage blogs dynamically.
          </p>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
            <LogOut size={14} style={{ marginRight: '6px' }} /> Log Out
          </button>
        </div>
      </section>

      {settingsSuccessMsg && (
        <div className="container" style={{ marginBottom: '20px' }}>
          <div className="post-success-alert animate-fade-in">
            <CheckCircle size={20} />
            <span>{settingsSuccessMsg}</span>
          </div>
        </div>
      )}

      <section className="section admin-dashboard-section">
        <div className="container admin-grid">
          
          {/* Left Panel Sidebar Tabs */}
          <div className="admin-sidebar-menu">
            <button 
              className={`admin-menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => { setActiveTab('blogs'); setBlogFormMode('list'); }}
            >
              <FileText size={18} />
              <span>Blog Management</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              <Mail size={18} />
              <span>Contact Form Leads</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'header' ? 'active' : ''}`}
              onClick={() => setActiveTab('header')}
            >
              <Settings size={18} />
              <span>Header Settings</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'footer' ? 'active' : ''}`}
              onClick={() => setActiveTab('footer')}
            >
              <Settings size={18} />
              <span>Footer Settings</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'contactinfo' ? 'active' : ''}`}
              onClick={() => setActiveTab('contactinfo')}
            >
              <Mail size={18} />
              <span>Contact Coordinates</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'maps' ? 'active' : ''}`}
              onClick={() => setActiveTab('maps')}
            >
              <Map size={18} />
              <span>Google Map Settings</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'seo' ? 'active' : ''}`}
              onClick={() => setActiveTab('seo')}
            >
              <Globe size={18} />
              <span>SEO Meta Management</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              <Image size={18} />
              <span>Media Library</span>
            </button>
          </div>

          {/* Right Panel Main Dashboard Module Rendering */}
          <div className="admin-content-panel">
            
            {/* MODULE 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="tab-view dashboard-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>System Status & Statistics</h2>
                  <span className="database-status"><Database size={14} /> Database Online</span>
                </div>
                
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                  <div className="submission-detail-card text-center" style={{ padding: '30px' }}>
                    <FileText size={32} color="#c71585" style={{ marginBottom: '10px' }} />
                    <h3>{stats.totalBlogs}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Published Articles</p>
                  </div>
                  <div className="submission-detail-card text-center" style={{ padding: '30px' }}>
                    <Mail size={32} color="#c71585" style={{ marginBottom: '10px' }} />
                    <h3>{stats.totalLeads}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Inboxed Leads</p>
                  </div>
                  <div className="submission-detail-card text-center" style={{ padding: '30px' }}>
                    <Image size={32} color="#c71585" style={{ marginBottom: '10px' }} />
                    <h3>{stats.totalMedia}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Database Assets</p>
                  </div>
                </div>

                <div className="submission-detail-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Quick Settings Access</h3>
                  <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
                    Your website features are fully connected to MongoDB Atlas. Any update in settings, SEO parameters, social media coordinates, or articles will immediately synchronize with the user-facing layouts.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('blogs')}>Manage Articles</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('leads')}>View Form Submissions</button>
                    <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('media')}>Upload Images</button>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: BLOG MANAGEMENT */}
            {activeTab === 'blogs' && (
              <div className="tab-view blogs-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Articles Directory & Publisher</h2>
                  {blogFormMode === 'list' && (
                    <button className="btn btn-primary btn-sm" onClick={handleCreateBlogBtn}>
                      <Plus size={14} style={{ marginRight: '6px' }} /> Write Article
                    </button>
                  )}
                  {blogFormMode !== 'list' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => setBlogFormMode('list')}>
                      Back to Directory
                    </button>
                  )}
                </div>

                {/* BLOG FORM (CREATE / EDIT) */}
                {blogFormMode !== 'list' && (
                  <div className="add-post-accordion">
                    <h3>{blogFormMode === 'add' ? 'Write New Article' : 'Edit Article Details'}</h3>
                    <form onSubmit={handleSaveBlog} className="add-post-form" style={{ marginTop: '20px' }}>
                      <div className="form-group">
                        <label>Post Title *</label>
                        <input 
                          type="text" 
                          name="title" 
                          required 
                          value={blogForm.title} 
                          onChange={handleBlogFormChange}
                          placeholder="e.g. Dwyer Mor Marketing Strategies"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Category *</label>
                          <select name="category" value={blogForm.category} onChange={handleBlogFormChange}>
                            <option value="Digital Marketing">Digital Marketing</option>
                            <option value="Email Marketing">Email Marketing</option>
                            <option value="PPC">PPC</option>
                            <option value="SEO">SEO</option>
                            <option value="Social Media Marketing">Social Media Marketing</option>
                            <option value="Website Development">Website Development</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Author *</label>
                          <input type="text" name="author" required value={blogForm.author} onChange={handleBlogFormChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Featured Image URL (or upload below)</label>
                        <input 
                          type="text" 
                          name="image" 
                          value={blogForm.image} 
                          onChange={handleBlogFormChange} 
                          placeholder="https://images.unsplash.com/..."
                        />
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="blog-img-upload" 
                            style={{ display: 'none' }} 
                            onChange={(e) => handleImageUpload(e.target.files[0], (url) => setBlogForm(prev => ({ ...prev, image: url })))}
                          />
                          <label htmlFor="blog-img-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                            <Upload size={14} style={{ marginRight: '6px' }} /> Upload to Database
                          </label>
                          {blogForm.image && <span style={{ fontSize: '0.85rem', color: '#61CE70' }}>Image Ready!</span>}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Excerpt Summary *</label>
                        <input 
                          type="text" 
                          name="excerpt" 
                          required 
                          value={blogForm.excerpt} 
                          onChange={handleBlogFormChange}
                          placeholder="Brief preview text listed on frontend..."
                        />
                      </div>

                      <div className="form-group">
                        <label>HTML Content *</label>
                        <textarea 
                          name="content" 
                          rows="8" 
                          required 
                          value={blogForm.content} 
                          onChange={handleBlogFormChange}
                          placeholder="Write post using tags: <p>Paragraph</p>, <h2>Subtitle</h2>, <ul><li>Bullet</li></ul>"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Meta Title (SEO)</label>
                          <input type="text" name="metaTitle" value={blogForm.metaTitle} onChange={handleBlogFormChange} placeholder="Falls back to title" />
                        </div>
                        <div className="form-group">
                          <label>Meta Description (SEO)</label>
                          <input type="text" name="metaDescription" value={blogForm.metaDescription} onChange={handleBlogFormChange} placeholder="Falls back to excerpt" />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Tags (Comma-separated)</label>
                        <input type="text" name="tags" value={blogForm.tags} onChange={handleBlogFormChange} placeholder="SEO, marketing, Dwarka Mor" />
                      </div>

                      <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                        <input 
                          type="checkbox" 
                          id="published" 
                          name="published" 
                          checked={blogForm.published} 
                          onChange={handleBlogFormChange} 
                        />
                        <label htmlFor="published">Publish Article immediately (Visible to public)</label>
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }} disabled={isSavingBlog}>
                        {isSavingBlog ? 'Saving...' : 'Save Article'}
                      </button>
                    </form>
                  </div>
                )}

                {/* BLOG DIRECTORY TABLE */}
                {blogFormMode === 'list' && (
                  <div className="admin-posts-list">
                    {blogs.length > 0 ? (
                      <div className="admin-posts-table-wrapper">
                        <table className="admin-posts-table">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Category</th>
                              <th>Author</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogs.map((post) => (
                              <tr key={post._id}>
                                <td className="table-post-title">
                                  <Link to={`/blog/${post.slug}`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    {post.title} <ExternalLink size={12} />
                                  </Link>
                                </td>
                                <td>{post.category}</td>
                                <td>{post.author}</td>
                                <td>
                                  <button 
                                    onClick={() => handleTogglePublish(post)} 
                                    className="btn btn-sm"
                                    style={{
                                      backgroundColor: post.published ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                      color: post.published ? '#22c55e' : '#ef4444',
                                      borderRadius: '20px',
                                      padding: '4px 10px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      border: 'none',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                                    {post.published ? 'Published' : 'Draft'}
                                  </button>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                      className="delete-sub-btn" 
                                      onClick={() => handleEditBlogBtn(post)}
                                      style={{ color: '#C084FC' }}
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button className="delete-post-row-btn" onClick={() => handleDeleteBlog(post._id)}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="no-posts-alert-admin">No blogs recorded. Write one above to start!</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MODULE 3: CONTACT FORM LEADS */}
            {activeTab === 'leads' && (
              <div className="tab-view submissions-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Leads Inbox Manager</h2>
                  <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
                    <FileSpreadsheet size={14} style={{ marginRight: '6px' }} /> Export as CSV
                  </button>
                </div>

                {/* Search leads */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                  <div className="search-bar-wrapper" style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      placeholder="Search leads by name, email, phone or keywords..."
                      value={leadSearch} 
                      onChange={handleLeadSearchChange}
                      onKeyDown={(e) => e.key === 'Enter' && executeLeadSearch()}
                    />
                    <Search size={16} className="search-bar-icon" style={{ cursor: 'pointer' }} onClick={executeLeadSearch} />
                  </div>
                  <button className="btn btn-primary" onClick={executeLeadSearch}>Search</button>
                </div>

                {leads.length > 0 ? (
                  <div className="submissions-list-wrapper">
                    {leads.map((sub) => (
                      <div key={sub._id} className="submission-detail-card">
                        <div className="submission-card-header">
                          <div>
                            <h4>{sub.name}</h4>
                            <span className="submission-date-tag">{sub.date}</span>
                          </div>
                          <button className="delete-sub-btn" onClick={() => handleDeleteLead(sub._id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="submission-card-body">
                          <p><strong>Email:</strong> <a href={`mailto:${sub.email}`}>{sub.email}</a></p>
                          {sub.phone && <p><strong>Phone:</strong> <a href={`tel:${sub.phone}`}>{sub.phone}</a></p>}
                          <div className="submission-desc-text">
                            <strong>Message Description:</strong>
                            <p>{sub.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel-alert">
                    <Mail size={40} className="empty-icon" />
                    <h3>No lead logs recorded</h3>
                    <p>Submissions from the frontend contact boxes will automatically load here.</p>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 4: HEADER MANAGEMENT */}
            {activeTab === 'header' && (
              <div className="tab-view config-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Header Parameters Settings</h2>
                </div>
                <form onSubmit={handleHeaderSettingsSubmit} className="add-post-form">
                  <div className="form-group">
                    <label>Logo URL (Direct path or upload below)</label>
                    <input 
                      type="text" 
                      value={headerSettings.logoUrl || ''} 
                      onChange={(e) => setHeaderSettings({ ...headerSettings, logoUrl: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/..."
                    />
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="header-logo-upload" 
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e.target.files[0], (url) => setHeaderSettings({ ...headerSettings, logoUrl: url }))}
                      />
                      <label htmlFor="header-logo-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} style={{ marginRight: '6px' }} /> Upload Logo File
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Top bar Email</label>
                      <input 
                        type="email" 
                        value={headerSettings.email || ''} 
                        onChange={(e) => setHeaderSettings({ ...headerSettings, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Phone Number</label>
                      <input 
                        type="text" 
                        value={headerSettings.phone || ''} 
                        onChange={(e) => setHeaderSettings({ ...headerSettings, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="submission-detail-card" style={{ padding: '20px', marginTop: '10px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Social Media Channel Links</h4>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label>Instagram URL</label>
                      <input 
                        type="url" 
                        value={headerSettings.socialLinks?.instagram || ''} 
                        onChange={(e) => setHeaderSettings({
                          ...headerSettings,
                          socialLinks: { ...headerSettings.socialLinks, instagram: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label>Facebook URL</label>
                      <input 
                        type="url" 
                        value={headerSettings.socialLinks?.facebook || ''} 
                        onChange={(e) => setHeaderSettings({
                          ...headerSettings,
                          socialLinks: { ...headerSettings.socialLinks, facebook: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={headerSettings.socialLinks?.linkedin || ''} 
                        onChange={(e) => setHeaderSettings({
                          ...headerSettings,
                          socialLinks: { ...headerSettings.socialLinks, linkedin: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Save Header Configurations</button>
                </form>
              </div>
            )}

            {/* MODULE 5: FOOTER MANAGEMENT */}
            {activeTab === 'footer' && (
              <div className="tab-view config-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Footer Settings Manager</h2>
                </div>
                <form onSubmit={handleFooterSettingsSubmit} className="add-post-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Footer Email</label>
                      <input 
                        type="email" 
                        value={footerSettings.email || ''} 
                        onChange={(e) => setFooterSettings({ ...footerSettings, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Footer Phone</label>
                      <input 
                        type="text" 
                        value={footerSettings.phone || ''} 
                        onChange={(e) => setFooterSettings({ ...footerSettings, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Office Address text</label>
                    <input 
                      type="text" 
                      value={footerSettings.address || ''} 
                      onChange={(e) => setFooterSettings({ ...footerSettings, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Copyright text (without &copy; year prefix)</label>
                    <input 
                      type="text" 
                      value={footerSettings.copyright || ''} 
                      onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
                      required
                    />
                  </div>

                  <div className="submission-detail-card" style={{ padding: '20px', marginTop: '10px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Social Media Channel Links</h4>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label>Instagram URL</label>
                      <input 
                        type="url" 
                        value={footerSettings.socialLinks?.instagram || ''} 
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, instagram: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label>Facebook URL</label>
                      <input 
                        type="url" 
                        value={footerSettings.socialLinks?.facebook || ''} 
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, facebook: e.target.value }
                        })}
                      />
                    </div>
                    <div className="form-group">
                      <label>LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={footerSettings.socialLinks?.linkedin || ''} 
                        onChange={(e) => setFooterSettings({
                          ...footerSettings,
                          socialLinks: { ...footerSettings.socialLinks, linkedin: e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>Save Footer Configurations</button>
                </form>
              </div>
            )}

            {/* MODULE 6: CONTACT INFORMATION */}
            {activeTab === 'contactinfo' && (
              <div className="tab-view config-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Company Contact Information Coordinates</h2>
                </div>
                <form onSubmit={handleContactInfoSubmit} className="add-post-form">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input 
                      type="text" 
                      value={contactInfo.companyName || ''} 
                      onChange={(e) => setContactInfo({ ...contactInfo, companyName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Physical Address</label>
                    <input 
                      type="text" 
                      value={contactInfo.address || ''} 
                      onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Coordinates Email</label>
                      <input 
                        type="email" 
                        value={contactInfo.email || ''} 
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Coordinates Phone</label>
                      <input 
                        type="text" 
                        value={contactInfo.phone || ''} 
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>WhatsApp Number (Prefix with country code, e.g. 919696217440)</label>
                    <input 
                      type="text" 
                      value={contactInfo.whatsapp || ''} 
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                      placeholder="919696217440"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Coordinates Settings</button>
                </form>
              </div>
            )}

            {/* MODULE 7: GOOGLE MAP MANAGEMENT */}
            {activeTab === 'maps' && (
              <div className="tab-view config-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Google Maps Embed Settings</h2>
                </div>
                <form onSubmit={handleMapSubmit} className="add-post-form">
                  <div className="form-group">
                    <label>Complete Google Maps iframe Code</label>
                    <textarea 
                      rows="4" 
                      value={mapSettings.iframeCode || ''} 
                      onChange={(e) => setMapSettings({ ...mapSettings, iframeCode: e.target.value })}
                      placeholder='e.g. <iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                    />
                  </div>

                  <div style={{ textalign: 'center', margin: '10px 0', fontWeight: 'bold' }}>OR</div>

                  <div className="form-group">
                    <label>Google Maps Embed URL path directly</label>
                    <input 
                      type="text" 
                      value={mapSettings.embedUrl || ''} 
                      onChange={(e) => setMapSettings({ ...mapSettings, embedUrl: e.target.value })}
                      placeholder="https://www.google.com/maps/embed?..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save Map settings</button>
                </form>

                {/* Previews */}
                {(mapSettings.iframeCode || mapSettings.embedUrl) && (
                  <div className="submission-detail-card" style={{ marginTop: '30px', padding: '20px' }}>
                    <h4 style={{ marginBottom: '14px' }}>Google Maps Render Preview</h4>
                    <div style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden' }}>
                      {mapSettings.iframeCode ? (
                        <div dangerouslySetInnerHTML={{ __html: mapSettings.iframeCode }} style={{ width: '100%', height: '100%', border: 'none' }} />
                      ) : (
                        <iframe
                          src={mapSettings.embedUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          title="Preview Location"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODULE 8: SEO METADATA SETTINGS */}
            {activeTab === 'seo' && (
              <div className="tab-view config-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>SEO Metadata & OpenGraph settings</h2>
                </div>
                <form onSubmit={handleSeoSubmit} className="add-post-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Site base Title</label>
                      <input 
                        type="text" 
                        value={seoSettings.siteTitle || ''} 
                        onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Global Meta Title</label>
                      <input 
                        type="text" 
                        value={seoSettings.metaTitle || ''} 
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Global Meta Description</label>
                    <textarea 
                      rows="3" 
                      value={seoSettings.metaDescription || ''} 
                      onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Meta Keywords list (Comma separated)</label>
                    <input 
                      type="text" 
                      value={seoSettings.metaKeywords || ''} 
                      onChange={(e) => setSeoSettings({ ...seoSettings, metaKeywords: e.target.value })}
                      placeholder="digital marketing, seo agency, Dwarka Mor"
                    />
                  </div>

                  <div className="form-group">
                    <label>Open Graph (OG:Image) URL</label>
                    <input 
                      type="text" 
                      value={seoSettings.ogImageUrl || ''} 
                      onChange={(e) => setSeoSettings({ ...seoSettings, ogImageUrl: e.target.value })}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="seo-og-upload" 
                        style={{ display: 'none' }}
                        onChange={(e) => handleImageUpload(e.target.files[0], (url) => setSeoSettings({ ...seoSettings, ogImageUrl: url }))}
                      />
                      <label htmlFor="seo-og-upload" className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={14} style={{ marginRight: '6px' }} /> Upload OG Image
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Canonical Site Base URL</label>
                    <input 
                      type="url" 
                      value={seoSettings.canonicalUrl || ''} 
                      onChange={(e) => setSeoSettings({ ...seoSettings, canonicalUrl: e.target.value })}
                      placeholder="https://marketingmediatree.com"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>Save SEO configurations</button>
                </form>
              </div>
            )}

            {/* MODULE 9: MEDIA LIBRARY */}
            {activeTab === 'media' && (
              <div className="tab-view media-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Media Uploads & Assets Library</h2>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="media-uploader-input" 
                      style={{ display: 'none' }} 
                      onChange={handleMediaUpload}
                    />
                    <label htmlFor="media-uploader-input" className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
                      <Upload size={14} style={{ marginRight: '6px' }} /> Upload New Image
                    </label>
                  </div>
                </div>

                {isUploadingMedia && (
                  <div className="post-success-alert animate-fade-in" style={{ backgroundColor: 'rgba(192, 132, 252, 0.1)', color: '#C084FC', border: 'none' }}>
                    <span>Uploading asset file to Database...</span>
                  </div>
                )}

                {mediaList.length > 0 ? (
                  <div className="media-gallery" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px', marginTop: '24px' }}>
                    {mediaList.map((asset) => (
                      <div key={asset._id} className="submission-detail-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={asset.url} 
                            alt={asset.filename} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <p style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-muted)' }} title={asset.filename}>
                          {asset.filename}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '4px' }}>
                          <button 
                            className="btn btn-outline btn-sm" 
                            style={{ flex: 1, padding: '4px', fontSize: '0.7rem' }}
                            onClick={() => copyToClipboard(asset.url)}
                            title="Copy URL path"
                          >
                            <Clipboard size={10} style={{ marginRight: '4px' }} /> Copy URL
                          </button>
                          <button 
                            className="delete-post-row-btn" 
                            style={{ padding: '6px', color: '#ef4444' }}
                            onClick={() => handleDeleteMedia(asset._id)}
                            title="Delete permanently"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '20px' }}>No files uploaded yet in the Database repository.</p>
                )}
              </div>
            )}
            
          </div>
        </div>
      </section>
    </div>
  );
}
