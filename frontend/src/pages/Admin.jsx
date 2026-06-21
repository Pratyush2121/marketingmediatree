import React, { useState, useEffect } from 'react';
import { Mail, FileText, Send, Trash2, Plus, CheckCircle, Database } from 'lucide-react';
import { initialBlogsData } from '../data/mockData';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('submissions');
  const [submissions, setSubmissions] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('adminLoggedIn') === 'true'
  );
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Blog Form State
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'Digital Marketing',
    author: 'Mohit Kumar',
    excerpt: '',
    content: ''
  });
  
  const [postAdded, setPostAdded] = useState(false);

  // Load datasets on mount
  useEffect(() => {
    // 1. Submissions
    const localSubs = localStorage.getItem('contactSubmissions');
    if (localSubs) {
      setSubmissions(JSON.parse(localSubs));
    }

    // 2. Blogs
    const localBlogs = localStorage.getItem('blogPosts');
    if (localBlogs) {
      setBlogs(JSON.parse(localBlogs));
    } else {
      localStorage.setItem('blogPosts', JSON.stringify(initialBlogsData));
      setBlogs(initialBlogsData);
    }
  }, []);

  // Delete contact submission
  const handleDeleteSubmission = (id) => {
    const updated = submissions.filter((sub) => sub.id !== id);
    localStorage.setItem('contactSubmissions', JSON.stringify(updated));
    setSubmissions(updated);
  };

  // Delete blog post
  const handleDeletePost = (id) => {
    const updated = blogs.filter((post) => post.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(updated));
    setBlogs(updated);
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Login handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'jasmine') {
      setIsLoggedIn(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password. Please try again.');
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('adminLoggedIn');
  };

  // Submit new post
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.excerpt || !newPost.content) return;

    const postSlug = newPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const addedPost = {
      id: 'blog-' + Date.now(),
      slug: postSlug,
      title: newPost.title,
      category: newPost.category,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      author: newPost.author,
      excerpt: newPost.excerpt,
      content: newPost.content,
      comments: []
    };

    const updated = [addedPost, ...blogs];
    localStorage.setItem('blogPosts', JSON.stringify(updated));
    setBlogs(updated);

    // Reset Form
    setNewPost({
      title: '',
      category: 'Digital Marketing',
      author: 'Mohit Kumar',
      excerpt: '',
      content: ''
    });

    setPostAdded(true);
    setTimeout(() => setPostAdded(false), 4000);
  };

  // If not authenticated, render Login view
  if (!isLoggedIn) {
    return (
      <div className="admin-login-page page-padding">
        <div className="container login-container">
          <div className="login-card animate-fade-in">
            <div className="login-logo-header">
              <Trees className="login-logo-icon" />
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
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  required 
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  placeholder="Enter username"
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
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block login-btn">
                Log In
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
            Manage incoming lead submissions and edit articles directly from this local database workspace.
          </p>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }}>
            Log Out
          </button>
        </div>
      </section>

      <section className="section admin-dashboard-section">
        <div className="container admin-grid">
          {/* Left panel tabs */}
          <div className="admin-sidebar-menu">
            <button 
              className={`admin-menu-btn ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              <Mail size={18} />
              <span>Contact Messages ({submissions.length})</span>
            </button>
            <button 
              className={`admin-menu-btn ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              <FileText size={18} />
              <span>Manage Blog Posts ({blogs.length})</span>
            </button>
          </div>

          {/* Right panel details */}
          <div className="admin-content-panel">
            {/* SUBMISSIONS TAB */}
            {activeTab === 'submissions' && (
              <div className="tab-view submissions-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Contact Submissions Inbox</h2>
                  <span className="database-status"><Database size={14} /> Local Storage Log</span>
                </div>
                
                {submissions.length > 0 ? (
                  <div className="submissions-list-wrapper">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="submission-detail-card">
                        <div className="submission-card-header">
                          <div>
                            <h4>{sub.firstName} {sub.lastName}</h4>
                            <span className="submission-date-tag">{sub.date}</span>
                          </div>
                          <button 
                            className="delete-sub-btn"
                            onClick={() => handleDeleteSubmission(sub.id)}
                            aria-label="Delete Submission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="submission-card-body">
                          <p><strong>Email:</strong> <a href={"mailto:" + sub.email}>{sub.email}</a></p>
                          {sub.phone && <p><strong>Phone:</strong> <a href={"tel:" + sub.phone}>{sub.phone}</a></p>}
                          {sub.description && (
                            <div className="submission-desc-text">
                              <strong>Message Description:</strong>
                              <p>{sub.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-panel-alert">
                    <Mail size={40} className="empty-icon" />
                    <h3>Your Inbox is Empty</h3>
                    <p>No messages have been logged yet. Fill out the form on the Contact page or Home page to generate tests.</p>
                  </div>
                )}
              </div>
            )}

            {/* BLOGS TAB */}
            {activeTab === 'blogs' && (
              <div className="tab-view blogs-view animate-fade-in">
                <div className="panel-title-row">
                  <h2>Article Manager</h2>
                  <span className="database-status"><Database size={14} /> Blog Dataset</span>
                </div>

                {/* Add new post form */}
                <div className="add-post-accordion">
                  <h3 className="add-post-heading">
                    <Plus size={18} /> Write New Article
                  </h3>
                  
                  {postAdded ? (
                    <div className="post-success-alert animate-fade-in">
                      <CheckCircle size={20} />
                      <span>Article published and added to routing directory!</span>
                    </div>
                  ) : null}

                  <form onSubmit={handleAddPost} className="add-post-form">
                    <div className="form-group">
                      <label htmlFor="title">Post Title *</label>
                      <input 
                        type="text" 
                        id="title" 
                        name="title" 
                        required 
                        value={newPost.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Guide to local search engine rankings"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select 
                          id="category" 
                          name="category"
                          value={newPost.category}
                          onChange={handleInputChange}
                        >
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Email Marketing">Email Marketing</option>
                          <option value="PPC">PPC</option>
                          <option value="SEO">SEO</option>
                          <option value="Social Media Marketing">Social Media Marketing</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="author">Author *</label>
                        <input 
                          type="text" 
                          id="author" 
                          name="author" 
                          required 
                          value={newPost.author}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="excerpt">Excerpt Summary *</label>
                      <input 
                        type="text" 
                        id="excerpt" 
                        name="excerpt" 
                        required 
                        value={newPost.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief summary shown on listings..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="content">HTML Content *</label>
                      <textarea 
                        id="content" 
                        name="content" 
                        rows="6" 
                        required 
                        value={newPost.content}
                        onChange={handleInputChange}
                        placeholder="Write article details using paragraphs (<p>), titles (<h2>, <h3>) and lists (<ul><li>)..."
                      />
                    </div>

                    <button type="submit" className="btn btn-primary add-post-submit-btn">
                      Publish Post
                    </button>
                  </form>
                </div>

                {/* Listing of current posts */}
                <div className="admin-posts-list">
                  <h3>Active Articles Directory</h3>
                  {blogs.length > 0 ? (
                    <div className="admin-posts-table-wrapper">
                      <table className="admin-posts-table">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Author</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((post) => (
                            <tr key={post.id}>
                              <td className="table-post-title">
                                <Link to={`/blog/${post.slug}`} target="_blank">{post.title}</Link>
                              </td>
                              <td>{post.category}</td>
                              <td>{post.date}</td>
                              <td>{post.author}</td>
                              <td>
                                <button 
                                  className="delete-post-row-btn"
                                  onClick={() => handleDeletePost(post.id)}
                                  aria-label="Delete Article"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-posts-alert-admin">No active posts available. Create a new article above.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
