import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, FolderOpen, ArrowRight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import useSEO from '../hooks/useSEO';
import './Blog.css';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useSEO();

  // Load posts from Mongoose API
  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(resData => {
        setLoading(false);
        if (resData.success && resData.blogs) {
          setBlogs(resData.blogs);
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('Error loading blogs:', err);
      });
  }, []);

  // Filter posts based on search input and active category
  const filteredBlogs = blogs.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === '' || post.category === category;
    return matchesSearch && matchesCategory;
  });

  // Calculate pages
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage) || 1;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

  // Reset pagination index on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category]);

  return (
    <div className="blog-page page-padding">
      {/* Banner */}
      <section className="page-hero">
        <div className="container text-center">
          <span className="section-badge">INSIGHTS & BLOGS</span>
          <h1 className="page-title">Digital Marketing Knowledge Hub</h1>
          <p className="page-subtitle">
            Stay ahead with the latest algorithms updates, local search engine guidelines, and campaign automation ideas.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section blog-body-section">
        <div className="container blog-grid-layout">
          {/* Left: Posts listing */}
          <div className="blog-posts-column">
            {currentPosts.length > 0 ? (
              <div className="posts-list-grid">
                {currentPosts.map((post) => (
                  <article key={post.id} className="blog-post-card animate-fade-in">
                    {post.image && (
                      <div className="blog-card-image-wrapper">
                        <Link to={`/blog/${post.slug}`}>
                          <img src={post.image} alt={post.title} className="blog-card-image" />
                        </Link>
                      </div>
                    )}
                    <div className="blog-card-meta">
                      <span className="blog-card-category">
                        <FolderOpen size={12} style={{ marginRight: '5px' }} />
                        {post.category}
                      </span>
                      <span className="blog-card-date">
                        <Calendar size={12} style={{ marginRight: '5px' }} />
                        {post.date}
                      </span>
                    </div>
                    
                    <h2 className="blog-card-title">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    
                    <div className="blog-card-footer">
                      <div className="blog-card-author">
                        <User size={14} className="author-meta-icon" />
                        <span>{post.author}</span>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`} className="btn-read-more">
                        Read Full Post
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-posts-alert">
                <h3>No articles found</h3>
                <p>Try refining your search text or select a different category filter.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="blog-pagination">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button 
                    className="pagination-btn pagination-next"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <Sidebar 
            searchValue={search} 
            onSearchChange={setSearch} 
            activeCategory={category} 
            onCategorySelect={setCategory} 
          />
        </div>
      </section>
    </div>
  );
}
