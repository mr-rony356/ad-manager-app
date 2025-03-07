import React, { useEffect, useState, useMemo, useCallback } from "react";
import PopUp from "@components/alerts/PopUp";
import AdModal from "@components/home/AdModal";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const Ad = ({ user, attributes, ad, isAdmin, isModalOpen, toggleModal }) => {
  const { t } = useTranslation("common");
  const [averageRating, setAverageRating] = useState(ad.averageRating);
  
  const [userReviews, setUserReviews] = useState(ad.reviews);
  const [isUser, setIsUser] = useState(false);
  const [pastTime, setPastTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [err, setErr] = useState("");
  const [displayModal, setDisplayModal] = useState("");
  useEffect(() => {
    if (user?._id === ad.user || user.email === "cyrill.mueller@onlyfriend.ch")
      setIsUser(true);
  }, [ad.user, user?._id]);

  const startDate = ad.startDate;

  const currentDate = new Date();
  const timeDifference = currentDate - new Date(startDate);

  const seconds = Math.floor((timeDifference / 1000) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  useMemo(() => {
    let pastTime = "";
    if (days) {
      pastTime += "vor " + days + (days === 1 ? " Tag" : " Tagen");
    } else if (hours) {
      pastTime += "vor " + hours + (hours === 1 ? " Stunde" : " Stunden");
    } else if (minutes) {
      pastTime += "vor " + minutes + (minutes === 1 ? " Minute" : " Minuten");
    } else {
      pastTime += "vor " + seconds + (seconds === 1 ? " Sekunde" : " Sekunden");
    }
    setPastTime(pastTime);
  }, [hours, minutes, days, seconds]);

  const title =
    displayModal === "boosted"
      ? "Das Inserat " + ad.title + " wurde auf den 1. Platz verschoben"
      : "Ad premium";

  const message = user ? user.credits + " Credits verbleibend" : "";

  const adSlugRegions = ad.regions
    ? ad.regions
        .map((region) => {
          // Find the attribute object with the name "regions"
          const attributeObj = attributes
            ? attributes.find((attribute) => attribute.name === "regions")
            : null;

          // If the attribute object exists, return the value at the index 'region'
          return attributeObj ? attributeObj.values[region] : null;
        })
        .join("-")
        .toLowerCase()
        .replace(/ü/g, "u") // Replace 'ü' with 'u'
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/ /g, "-") // Replace spaces with hyphens
        .replace(/^-+|-+$/g, "")
    : null;
  const isOwner = user.email === "cyrill.mueller@onlyfriend.ch";
  return (
    <Link
      href={{
        pathname: `${isAdmin ? "/admin" : ""}/${adSlugRegions ? adSlugRegions : ""}/${ad.slug}`,
      }}
    >
      <div className="ad ">
        <div style={{ position: "relative", width: "100%" }}>
          {ad.images && ad.images.length > 0 && (
            <Image
              src={API_ADDRESS + ad.images[ad.frontImage]}
              width={500}
              height={500}
              alt={ad.title}
              className="ad__image"
              loading="lazy"
            />
          )}
          {ad.verified && (
            <Image
              src={"/assets/verified-v2.png"}
              width={500}
              height={500}
              alt="edit"
              className="ad__verifiedPicture"
              loading="lazy"
            />
          )}
        </div>
        <PopUp
          onClose={() => setDisplayModal("")}
          isOpen={displayModal !== ""}
          title={title}
          message={message}
          setDisplayModal={setDisplayModal}
        />
        <div className="ad__content">
          <div className="ad__titleTime">
            {ad.endDate < Date.now() ? (
              <p className="ad__expired">Expired</p>
            ) : ad.premiumEndDate > Date.now() ? (
              <p className="ad__premium">Premium</p>
            ) : ad.active === false ? (
              <p className="ad__inactive">Inaktiv</p>
            ) : null}

            {isModalOpen && (
              <AdModal
                ad={ad}
                setShowModal={setShowModal}
                setErr={setErr}
                owner={isOwner}
                setDisplayModal={setDisplayModal}
              />
            )}
            {err && <p className="error">{err && err}</p>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {ad.verified ? (
              <Image
                src={"/assets/verified-v2.png"}
                width={500}
                height={500}
                alt="edit"
                className="ad__verified"
                loading="lazy"
              />
            ) : (
              <div className="spacer" style={{ flexGrow: 1 }}></div>
            )}
            <p className="ad__time text-sm">{pastTime}</p>
          </div>
          <div className="ad__timeEdit">
            <div className="titleContainer">
              <h1 className="ad__title font-bold" id="adTitle">
                {ad.title}
              </h1>
              {/* {ad.verified && (
                <img
                  loading="lazy"   
                  src={verified}
                  alt="edit"
                  className="ad__verified"
                />
              )} */}
              {isUser && ad.endDate && (
                <Image
                  src={"/assets/points.png"}
                  width={500}
                  height={500}
                  alt="edit"
                  className="ad__edit"
                  loading="lazy"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(!showModal);
                    toggleModal(ad._id);
                  }}
                />
              )}
            </div>
          </div>
          <p className="ad__text text-base " id="adText">
            {ad.description}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5em",
              marginTop: "0.5em",
            }}
          >
            <div
              className="ad__tags"
              style={{
                fontWeight: "bold",
              }}
            >
              <Image
                src={"/assets/tag.png"}
                width={500}
                height={500}
                alt="tag"
                className="tag"
                loading="lazy"
              />
              {ad.tags &&
                attributes &&
                ad.tags.length > 0 &&
                attributes.length > 0 && (
                  <p className="ad__tag text-sm">
                    {
                      attributes.find((attribute) => attribute.name === "tags")
                        .values[ad.tags[0]]
                    }
                    {ad.tags.length > 1 && " ..."}
                  </p>
                )}
            </div>

            <div
              className="ad__regions"
              style={{
                fontWeight: "bold",
              }}
            >
              <Image
                src={"/assets/place.png"}
                width={500}
                height={500}
                alt="region"
                className="region"
                loading="lazy"
              />
              {ad.regions &&
                attributes &&
                ad.regions.length > 0 &&
                attributes.length > 0 && (
                  <p className="ad__region text-sm">
                    {ad.regions.slice(0, 2).map((region, index) => (
                      <span key={index}>
                        {
                          attributes.find(
                            (attribute) => attribute.name === "regions",
                          ).values[region]
                        }
                        {index > 1 && ", "}
                      </span>
                    ))}
                    {ad.regions.length > 2 && " ..."}
                  </p>
                )}
            </div>
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <span className="text-gray-700 text-sm font-medium">
              {averageRating !== null && !isNaN(averageRating)
                ? ad.averageRating.toFixed(1)
                : ""}{" "}
            </span>

            {/* Display Average Rating as Stars */}
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ${
                  star <= Math.floor(averageRating)
                    ? "text-yellow-400"
                    : star - averageRating <= 0
                      ? "text-gray-300"
                      : star - averageRating < 1
                        ? "text-yellow-400"
                        : "text-gray-300"
                }`}
                fill={
                  star <= Math.floor(averageRating)
                    ? "currentColor"
                    : star - averageRating < 1
                      ? `url(#partial-fill-${Math.round((star - averageRating) * 100)})`
                      : "none"
                }
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <defs>
                  <linearGradient
                    id={`partial-fill-${Math.round((star - averageRating) * 100)}`}
                  >
                    <stop
                      offset={`${(1 - (star - averageRating)) * 100}%`}
                      stopColor="currentColor"
                    />
                    <stop
                      offset={`${(1 - (star - averageRating)) * 100}%`}
                      stopColor="transparent"
                    />
                  </linearGradient>
                </defs>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            {/* Display Numeric Average and Review Count */}
            <span className="text-gray-700 text-sm font-medium">
              {averageRating !== null && !isNaN(averageRating)
                ? userReviews.length
                : ""}{" "}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Ad;
