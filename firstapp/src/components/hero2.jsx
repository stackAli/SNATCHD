// src/components/Hero2.jsx
import React, { useState } from "react";
import "./hero2.css";

function Hero2() {
  const [visibleIndex, setVisibleIndex] = useState(null);

  const features = [
    {
      title: "Sustainably Sourced",
      description:
        "Every item in our collection has been carefully handpicked to reduce waste and promote mindful fashion. We believe in giving beautiful clothes a second life.",
    },
    {
      title: "One-of-a-Kind Finds",
      description:
        "Each thrifted piece carries its own history and charm — no two items are ever the same. Discover something that truly speaks to your individual style.",
    },
    {
      title: "Consciously Curated",
      description:
        "From vintage gems to modern reworks, our pieces are chosen for their quality, story, and potential to inspire a more sustainable way of dressing.",
    },
  ];

  const toggleDescription = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  return (
    <div className="hero2">
      <img src="/images/hero2.jpg" alt="Thrifted Clothing Collection" />

      <div className="hero2-content">
        <h4>Thrifted Collection</h4>
        <h1>Rewear. Reuse. Relove.</h1>
        <p>
          Discover pre-loved fashion that feels brand new — thoughtfully chosen and beautifully revived for the modern wardrobe. Each piece in our thrifted collection carries its own story, from timeless vintage staples to unique contemporary finds.

          We handpick every item with care, focusing on quality, sustainability, and individuality — because great style doesn’t have to come at the cost of the planet. Whether you’re searching for a rare treasure or simply a new favorite, our curated collection invites you to shop consciously, dress boldly, and give clothing a second life filled with new memories.
        </p>

        <div className="hero2-features">
          {features.map((feature, index) => (
            <div key={index} className="hero2-feature">
              <div className="feature-header">
                <h3>{feature.title}</h3>
                <button onClick={() => toggleDescription(index)}>
                  {visibleIndex === index ? "▲" : "▼"}
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
