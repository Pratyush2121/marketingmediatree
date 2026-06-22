import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Send, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import useSEO from '../hooks/useSEO';
import './BlogPost.css';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Comment Form State
  const [commentData, setCommentData] = useState({
    author: '',
    email: '',
    url: '',
    text: '',
    consent: false
  });
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  // Load blog details from API
  useEffect(() => {
    setLoading(true);
    fetch(`/api/blogs/slug/${slug}`)
      .then(res => res.json())
      .then(resData => {
        setLoading(false);
        if (resData.success && resData.blog) {
          setBlog(resData.blog);
        } else {
          setBlog(false); // Indicates blog not found
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('Error loading article:', err);
        setBlog(false);
      });
  }, [slug]);

  // Inject SEO metadata tags for this post dynamically
  useSEO(blog ? {
    metaTitle: blog.metaTitle || blog.title,
    metaDescription: blog.metaDescription || blog.excerpt,
    ogImageUrl: blog.image
  } : null);

  if (loading) {
    return <div className="page-padding text-center">Loading article details...</div>;
  }

  // Handle fallback redirect if slug not found
  if (blog === false) {
    return <Navigate to="/blog" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCommentData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentData.author || !commentData.text) return;

    fetch(`/api/blogs/slug/${slug}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        author: commentData.author,
        text: commentData.text
      })
    })
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setBlog(prev => ({
            ...prev,
            comments: resData.comments
          }));

          // Clear comment body only, optionally save credentials based on consent checkbox
          setCommentData((prev) => ({
            ...prev,
            text: '',
            author: prev.consent ? prev.author : '',
            email: prev.consent ? prev.email : '',
            url: prev.consent ? prev.url : ''
          }));

          setCommentSubmitted(true);
          setTimeout(() => setCommentSubmitted(false), 4000);
        } else {
          alert('Failed to post comment: ' + (resData.message || 'Unknown error'));
        }
      })
      .catch(err => {
        console.error('Error submitting comment:', err);
        alert('Error posting comment. Please try again.');
      });
  };

  return (
    <div className="blog-post-page page-padding">
      <div className="container">
        {/* Back Link */}
        <Link to="/blog" className="back-link">
          <ArrowLeft size={16} />
          Back to Blog Listing
        </Link>

        {blog && (
          <div className="blog-grid-layout">
            {/* Left: Article Details */}
            <div className="blog-article-column">
              <article className="single-article-card">
                <div className="article-meta">
                  <span className="article-category">{blog.category}</span>
                  <span className="article-meta-item">
                    <Calendar size={14} className="meta-icon" />
                    {blog.date}
                  </span>
                  <span className="article-meta-item">
                    <User size={14} className="meta-icon" />
                    By {blog.author}
                  </span>
                </div>

                <h1 className="article-title">{blog.title}</h1>
                
                {blog.image && (
                  <div className="single-article-image-wrapper">
                    <img src={blog.image} alt={blog.title} className="single-article-image" />
                  </div>
                )}
                
                {/* Safe HTML Content injection */}
                <div 
                  className="article-body-content"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </article>

              {/* Comments Section */}
              <div className="article-comments-section">
                <h3 className="comments-heading">
                  <MessageSquare size={20} className="comments-heading-icon" />
                  Comments ({blog.comments ? blog.comments.length : 0})
                </h3>

                {blog.comments && blog.comments.length > 0 ? (
                  <div className="comments-list">
                    {blog.comments.map((comment) => (
                      <div key={comment.id} className="single-comment-card">
                        <div className="comment-meta">
                          <h4 className="comment-author">{comment.author}</h4>
                          <span className="comment-date">{comment.date}</span>
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-comments-text">No comments published yet. Be the first to share your thoughts!</p>
                )}

                {/* Comment Form */}
                <div className="comment-form-wrapper-post">
                  <h3>Leave a Reply</h3>
                  <p className="comment-form-hint">Your email address will not be published. Required fields are marked *</p>

                  {commentSubmitted ? (
                    <div className="comment-success-alert animate-fade-in">
                      <Send size={20} className="success-check-icon" />
                      <span>Comment posted successfully!</span>
                    </div>
                  ) : null}

                  <form onSubmit={handleCommentSubmit} className="blog-comment-form">
                    <div className="form-group">
                      <label htmlFor="text">Comment *</label>
                      <textarea
                        id="text"
                        name="text"
                        rows="6"
                        required
                        value={commentData.text}
                        onChange={handleInputChange}
                        placeholder="Type here..."
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="author">Name *</label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          required
                          value={commentData.author}
                          onChange={handleInputChange}
                          placeholder="Your Name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={commentData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="url">Website</label>
                      <input
                        type="url"
                        id="url"
                        name="url"
                        value={commentData.url}
                        onChange={handleInputChange}
                        placeholder="https://yourbrand.com"
                      />
                    </div>

                    <div className="form-group-checkbox">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={commentData.consent}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="consent">
                        Save my name, email, and website in this browser for the next time I comment.
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary comment-submit-btn">
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <Sidebar />
          </div>
        )}
      </div>
    </div>
  );
}
