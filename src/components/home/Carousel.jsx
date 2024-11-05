import React, { useState, useCallback } from "react";
import { API_ADDRESS } from "@utils/API";
import FsLightbox from "fslightbox-react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ ad }) => {
  const [toggler, setToggler] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sources = [
    ad.video ? API_ADDRESS + ad.video : null,
    ...ad.images.map((image) => API_ADDRESS + image),
  ].filter(Boolean);

  const types = [
    ad.video ? "video" : null,
    ...ad.images.map(() => "image"),
  ].filter(Boolean);

  const handleImageClick = useCallback(
    (index) => {
      if (!isDragging) {
        setCurrentSlide(index);
        setToggler(!toggler);
      }
    },
    [isDragging, toggler],
  );

  const settings = {
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
          variableWidth: true,
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
      <link rel="preload" as="image" href={API_ADDRESS + ad.images[0]} />

      <Slider className="carousel" {...settings}>
        {ad.video && (
          <div>
            <video
              controls
              onClick={() => handleImageClick(0)}
              className="ad__video"
              preload="auto"
              playsInline
              autoPlay
              muted
              loading="lazy"
            >
              <source src={API_ADDRESS + ad.video} type="video/mp4" />
            </video>
          </div>
        )}
        {ad.images.map((image, i) => (
          <div key={i}>
            <Image
              src={API_ADDRESS + image}
              width={100}
              height={100}
              alt={`Bild ${i + 1}`}
              className="carousel__image"
              loading={i === 0 ? "eager" : "lazy"}
              priority={i === 0}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleImageClick(i + (ad.video ? 1 : 0))}
            />
          </div>
        ))}
      </Slider>

      <FsLightbox
        toggler={toggler}
        sources={sources}
        types={types}
        slide={currentSlide + 1}
      />
    </>
  );
};

export default Carousel;
