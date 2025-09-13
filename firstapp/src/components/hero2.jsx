// src/components/Hero2.jsx
import React, { useState } from "react";
import './hero2.css';

function Hero2() {
  const [visibleIndex, setVisibleIndex] = useState(null);

  const features = [
    {
      title: "Unique Design",
      description: "Each piece is thoughtfully crafted to stand out from the crowd. Each piece is thoughtfully crafted to stand out from the crowd."
    },
    {
      title: "Hand Made",
      description: "Lovingly handmade by skilled artisans using premium materials. Each piece is thoughtfully crafted to stand out from the crowd."
    },
    {
      title: "Only For You",
      description: "Tailored designs that resonate with your personal style. Each piece is thoughtfully crafted to stand out from the crowd."
    }
  ];

  const toggleDescription = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <div className="hero2">
      <img src="/images/hero2.avif" alt="Tops Collection" />
      
      <div className="hero2-content">
        <h4>Tops Collection</h4>
        <h1>Browse our latest drop: unique pieces, truly stunning.</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
          accumsan elit. Vestibulum aliquet urna metus, tincidunt molestie eros
          rutrum sit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
          accumsan elit. Vestibulum aliquet urna metus, tincidunt molestie eros
          rutrum sit.
        </p>

        <div className="hero2-features">
          {features.map((feature, index) => (
            <div key={index} className="hero2-feature">
              <div className="feature-header">
                <h3>{feature.title}</h3>
                <button onClick={() => toggleDescription(index)}>
                  {visibleIndex === index ? '▲' : '▼'}
                </button>
              </div>
              {visibleIndex === index && (
                <p className="feature-description">{feature.description}</p>
                
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hero2;
