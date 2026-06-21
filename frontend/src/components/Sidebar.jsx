import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, FolderOpen, ArrowRight } from 'lucide-react';
import { initialBlogsData } from '../data/mockData';
import './Sidebar.css';

export default function Sidebar({ 
  searchValue = '', 
  onSearchChange = () => {}, 
  activeCategory = '', 
  onCategorySelect = () => {} 
}) {
  
  const categories = [
    "All Categories",
    "Digital Marketing",
    "Email Marketing",
    "PPC",
    "SEO",
    "Social Media Marketing"
  ];

  const archives = [
    "June 2026",
    "May 2026",
    "April 2026",
    "March 2026"
  ];

  // Get recent 3 posts
  const recentPosts = initialBlogsData.slice(0, 3);

  return (
    <aside className="blog-sidebar">
      {/* Search Widget */}
      <div className="sidebar-widget search-widget">
        <h3 className="widget-heading">Search Articles</h3>
        <div className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder="Type search terms..." 
            value={searchValue} 
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search size={18} className="search-bar-icon" />
        </div>
      </div>

      {/* Categories Widget */}
      <div className="sidebar-widget categories-widget">
        <h3 className="widget-heading">Categories</h3>
        <ul className="categories-list">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat || (cat === "All Categories" && activeCategory === "");
            return (
              <li key={cat}>
                <button
                  className={`category-filter-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onCategorySelect(cat === "All Categories" ? "" : cat)}
                >
                  <span className="cat-name-box">
                    <FolderOpen size={16} className="cat-icon" />
                    {cat}
                  </span>
                  <ArrowRight size={14} className="cat-arrow" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent Posts Widget */}
      <div className="sidebar-widget recent-posts-widget">
        <h3 className="widget-heading">Recent Posts</h3>
        <div className="recent-posts-list">
          {recentPosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="recent-post-link">
              <h4 className="recent-post-title">{post.title}</h4>
              <span className="recent-post-date">
                <Calendar size={12} style={{ marginRight: '6px' }} />
                {post.date}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Archives Widget */}
      <div className="sidebar-widget archives-widget">
        <h3 className="widget-heading">Archives</h3>
        <ul className="archives-list">
          {archives.map((archive) => (
            <li key={archive} className="archive-item">
              <Calendar size={14} className="archive-icon" />
              <span>{archive}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
