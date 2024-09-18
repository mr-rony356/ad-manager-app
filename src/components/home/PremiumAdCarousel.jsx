import React, { useState, useEffect } from "react";
import Ad from "@components/home/Ad";

const PremiumAdCarousel = ({ ads, attributes }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    setCurrentAdIndex(Math.floor(Math.random() * ads.length));
  }, [ads.length]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [ads.length]);

  return (
    <div>
      {ads.length > 0 && (
        <Ad ad={ads[currentAdIndex]} adList={true} attributes={attributes} />
      )}
      <div className="dot-navigation">
        {ads.map((ad, index) => (
          <div
            key={ad._id}
            className={`dot ${currentAdIndex === index ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PremiumAdCarousel;
