import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './Carousel.css';

export default function Carousel({ items, autoplaySpeed = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  }, [items.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, autoplaySpeed);
    return () => clearInterval(timer);
  }, [handleNext, autoplaySpeed]);

  return (
    <div className="carousel-wrapper">
      <div className="carousel-inner">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div 
              key={item.id || index} 
              className={`carousel-slide ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <div className="testimonial-card animate-fade-in">
                  <div className="rating-stars">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={18} fill="#ffb800" color="#ffb800" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{item.text}"</p>
                  <div className="testimonial-author">
                    <h4 className="author-name">{item.name}</h4>
                    <span className="author-role">{item.role}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Nav Controls */}
      <button className="carousel-control prev" onClick={handlePrev} aria-label="Previous Slide">
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-control next" onClick={handleNext} aria-label="Next Slide">
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
