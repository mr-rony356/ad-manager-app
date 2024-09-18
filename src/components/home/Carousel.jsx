import React, { useState } from "react";
import { API_ADDRESS } from "@utils/API";
import FsLightbox from "fslightbox-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({
  ad,
  toggler,
  setToggler,
  setCurrentSlide,
  currentSlide,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const simpleSettings = {
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1297,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          variableWidth: false,
          centerMode: false,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: false,
          centerMode: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: false,
          centerMode: true,
        },
      },
    ],
    beforeChange: () => setIsDragging(true),
    afterChange: (current) => {
      setIsDragging(false);
      setCurrentSlide(current);
    },
  };

  return (
    <>
      <Slider className="carousel" {...simpleSettings}>
        {ad.video && (
          <div>
            <video
              controls
              onClick={() => setToggler(!toggler)}
              className="ad__video"
              preload="auto"
              playsInline
              autoPlay
              muted
            >
              <source src={API_ADDRESS + ad.video} type="video/mp4" />
            </video>
          </div>
        )}
        {ad.images &&
          ad.images.map((image, i) => (
            <div key={i}>
              <Image
                src={API_ADDRESS + image}
                width={500}
                height={500}
                alt={`Bild ${i}`}
                className="carousel__image"
                loading="lazy"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (!isDragging) {
                    setToggler(!toggler);
                    setCurrentSlide(i);
                  }
                }}
              />
            </div>
          ))}
      </Slider>

      <FsLightbox
        toggler={toggler}
        sources={[
          ad.video ? API_ADDRESS + ad.video : null,
          ...ad.images.map((image) => API_ADDRESS + image),
        ].filter(Boolean)}
        slide={currentSlide + 1}
      />
    </>
  );
};

export default Carousel;
