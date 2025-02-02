import React, { useState, useEffect } from "react";
import Carousel from "@components/home/Carousel";
import { Textfield } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import AdvertisementPage from "@pages/ad";
import ApiController from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { User } from "lucide-react";
import {
  RecentlyViewedAds,
  saveRecentAd,
} from "@components/home/RecentlyViewedAds";

export async function getServerSideProps({ params, req, locale }) {
  // Initialize your API client
  const api = new ApiController();
  // Fetch id
  const id = params.slug;
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Set all costume props server side
  let isFavorite = false;
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const ad = await api.fetchAd(id);
  const favorites = await api.fetchFavorites(auth.token);
  if (favorites.length > 0) {
    isFavorite = !!favorites.find((f) => f._id === id);
  }
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      attributes,
      ad: ad.ad,
      nextAd: ad.nextAd,
      prevAd: ad.previousAd,
      initialIsFavorite: isFavorite,
    },
  };
}

const AdDetail = ({
  user,
  attributes,
  ad,
  nextAd,
  prevAd,
  initialIsFavorite,
}) => {
  // In your Ad component:
  useEffect(() => {
    saveRecentAd(ad);
  }, [ad]);
  const { t } = useTranslation("common");
  const { api } = useApi();
  const router = useRouter();
  const [isUser, setIsUser] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [editMode, setEditMode] = useState(false);
  const [activeType, setActiveType] = useState("contact");
  const [toggler, setToggler] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [message, setMessage] = useState();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!rating || !reviewText.trim()) {
      setError("Rating and review text are required");
      return;
    }

    setError("");

    try {
      const response = await api.addReview({
        userId: ad.user, // Assuming `user` contains `_id`
        rating,
        review: reviewText,
        name,
      });

      console.log("Review submitted successfully", response);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const reviews = await api.getUserReviews(ad.user); // Assuming `user` contains `_id`
      setUserReviews(reviews);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const average = await api.getUserAverageRating(ad.user); // Assuming `user` contains `_id`
      setAverageRating(average.averageRating); // Adjust field based on API response
    } catch (err) {
      console.error("Error fetching average rating:", err);
    }
  };

  useEffect(() => {
    fetchUserReviews();
    fetchAverageRating();
  }, [user._id]);
  console.log(user);
  console.log(ad);
  const tagIcon = "/assets/tag.png";
  const placeIcon = "/assets/place.png";
  const fav = "/assets/heart.png";
  const linedHeart = "/assets/lined-heart.png";
  const editing = "/assets/editing.png";
  const verified = "/assets/verified-v2.png";
  const smartphone = "/assets/smart-phone-white.png";
  const smartphoneBlue = "/assets/smart-phone.png";
  const webIcon = "/assets/web.png";
  const whatsapp = "/assets/whatsapp-white.png";
  const whatsappBlue = "/assets/whatsapp.png";
  const home = "/assets/menu.png";
  const video = "/assets/video-icon.png";
  const handleShare = () => {
    const message = `Check out this ad: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleReport = () => {
    const supportNumber = "+41772054730"; // Support number
    const message = `Inserat melden: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };
  useEffect(() => {
    if (user?._id === ad.user || user.email === "cyrill.mueller@onlyfriend.ch")
      setIsUser(true);
  }, [ad.user, user._id]);

  // Run on component mount to set initial state
  const nextAdSlugRegions = nextAd.regions
    ? nextAd.regions
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
  const prevAdSlugRegions = prevAd.regions
    ? prevAd.regions
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

  const navigateToPreviousAd = () => {
    if (prevAd) {
      router.push(
        `/${prevAdSlugRegions ? prevAdSlugRegions : ""}/${prevAd.slug}`,
      );
    }
  };

  const navigateToNextAd = () => {
    if (nextAd) {
      router.push(
        `/${nextAdSlugRegions ? nextAdSlugRegions : ""}/${nextAd.slug}`,
      );
    }
  };

  const toggleFavorite = () => {
    api.updateFavorite(ad._id);
    setIsFavorite(!isFavorite);
  };

  const sendMessage = (event) => {
    event.preventDefault();

    api.sendMessage(message, ad.user);
    setMessage("");
  };

  const areaCode =
    ad && ad.areaCode
      ? attributes &&
        attributes
          .find((a) => a.name === "areaCodes")
          ?.values.find((value) => value.id === ad.areaCode)?.code
      : null;

  const number = areaCode + (ad ? ad.phone?.replace(/-/g, "") : "");

  const switchSlide = (event, direction) => {
    const parent = event.target.parentNode;
    let offset = 0;
    const focus = parent.scrollLeft;
    const width = parent.children[1].clientWidth;

    offset = focus + direction * width;
    parent.scrollTo({
      left: offset,
      behavior: "smooth",
    });
  };
  const getAttributeValue = (name, key) => {
    const attribute = attributes.find((attr) => attr.name === name);
    return attribute?.values[key] || "";
  };

  const fields = [
    {
      icon: tagIcon,
      items: ad.tags,
      attributeName: "tags",
      alt: "tag",
    },
    {
      icon: placeIcon,
      items: ad.regions,
      attributeName: "regions",
      alt: "region",
    },
    {
      icon: <User size={20} />,
      items: ad.ethnicity ? [ad.ethnicity] : [],
      attributeName: "ethnicities",
      alt: "ethnicity",
    },
  ];
  const generateSearchLinks = (fields) => {
    const searchLinks = [];

    for (const field of fields) {
      if (field.attributeName === "regions") {
        for (const item of field.items) {
          const regionValue = getAttributeValue(
            field.attributeName,
            item,
          ).replace(/\s+/g, "-");
          console.log(field);
          searchLinks.push({
            label: regionValue,
            url: `https://onlyfriend.ch/filter/region/${field.items[0]}-${encodeURIComponent(regionValue)}`,
          });
        }
      } else if (field.attributeName === "tags") {
        for (const item of field.items) {
          const tagValue = getAttributeValue(field.attributeName, item).replace(
            /\s+/g,
            "-",
          );
          searchLinks.push({
            label: tagValue,
            url: `https://onlyfriend.ch/filter/tag/${field.items[0]}-${encodeURIComponent(tagValue)}`,
          });
        }
      }
    }

    return searchLinks;
  };
  const searchLinks = generateSearchLinks(fields);
  console.log(searchLinks);
  return (
    <>
      <Head>
        <title>OnlyFriend</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Onlyfriend" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      {editMode ? (
        <AdvertisementPage
          user={user}
          tempAd={ad}
          editMode={editMode}
          attributes={attributes}
        />
      ) : (
        <div className="adDetail">
          <div className="adDetail__titleSection">
            <div className="adDetail__verified"></div>

            <div className="adDetail__buttons">
              {isUser && (
                <Image
                  src={editing}
                  width={500}
                  height={500}
                  alt="delete"
                  className="delete-icon"
                  loading="lazy"
                  onClick={() => setEditMode(true)}
                />
              )}
            </div>
          </div>
          <h1 className="adDetail__title text-xl"> {ad.title}</h1>
          <div className="flex items-center justify-between">
            {!ad.verified && (
              <div className="adDetail__verifiedPart">
                <Image
                  src={verified}
                  width={500}
                  height={500}
                  alt="edit"
                  className="ad__verifiedDetail"
                  loading="lazy"
                />
                <p>{t("adDetail__verifiedImages")}</p>
              </div>
            )}
            {ad.video && (
              <div className="adDetail__container__images">
                <Image
                  src={video}
                  width={500}
                  height={500}
                  loading="lazy"
                  style={{
                    width: "20px",
                    height: "auto",
                    borderRadius: "10px",
                    color: "white",
                  }}
                />
                <p>{t("adDetail__videotext")}</p>
              </div>
            )}
          </div>{" "}
          <Carousel
            ad={ad}
            toggler={toggler}
            setToggler={setToggler}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            switchSlide={switchSlide}
          />
          <div className="adDetail__split">
            <div
              className="rounded-md bg-white p-6 m-4"
              style={{
                boxShadow: "0 0.3125rem 1.25rem rgba(53,58,62,0.1215686275)",
              }}
            >
              <div className="flex justify-center gap-4 mb-8">
                <button
                  className={`px-6 py-2 text-[16px] font-medium rounded-md ${
                    activeType === "contact"
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveType("contact")}
                >
                  Kontakt
                </button>
                <button
                  className={`px-6 py-2 text-[16px] font-medium rounded-md ${
                    activeType === "offer"
                      ? " bg-sky-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setActiveType("offer")}
                >
                  Angebote
                </button>
              </div>
              {activeType === "contact" ? (
                <div>
                  {user && (
                    <form
                      className="space-y-4 w-full flex flex-col justify-center items-center"
                      onSubmit={sendMessage}
                    >
                      <Textfield
                        id="tf-1-1"
                        name="tf-1-1"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        label="Nachricht"
                        required={true}
                        className="w-full border border-sky-500 "
                      />
                      <button
                        type="submit"
                        className="w-[50%]  bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
                      >
                        Senden
                      </button>
                    </form>
                  )}

                  <div className="mt-8 space-y-8">
                    {ad.phone && ad.areaCode && (
                      <p className="text-gray-900 text-2xl font-bold">
                        {areaCode} {ad.phone.replace(/-/g, " ")}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4">
                      {ad.phone && ad.areaCode && (
                        <div className="flex flex-col  items-center gap-3 w-full">
                          <a
                            href={`tel:${areaCode}${ad.phone}`}
                            className="flex  w-full md:min-w-64  justify-center border border-sky-500 rounded-md"
                          >
                            <button className="flex items-center gap-4 px-4 py-2  text-blue-600  ">
                              <Image
                                alt="support icon"
                                width={20}
                                height={20}
                                src={smartphoneBlue}
                              />
                              Anrufen
                            </button>
                          </a>
                          <a
                            href={`https://wa.me/${number.replace(
                              /\s/g,
                              "",
                            )}?text=%C2%ABHallo%20ich%20habe%20dein%20Inserat%20auf%20Onlyfriend.ch%20gesehen.%C2%BB`}
                            className="flex  w-full md:min-w-64  justify-center border border-sky-500 rounded-md"
                          >
                            <button className="ml-4 flex items-center gap-4 px-4 py-2  text-blue-600  ">
                              <Image
                                alt="support icon"
                                width={20}
                                height={20}
                                src={whatsappBlue}
                                className="h-6 w-6"
                              />
                              Whatsapp
                            </button>
                          </a>
                          {ad.website && (
                            <a
                              href={ad.website}
                              className="flex  w-full md:min-w-64  justify-center border border-sky-500 rounded-md"
                            >
                              <button className="flex items-center gap-4 px-4 py-2  text-blue-600  ">
                                <Image
                                  alt="website icon"
                                  width={100}
                                  height={100}
                                  src={webIcon}
                                  className="h-5 w-5"
                                />
                                Website
                              </button>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {ad.country || ad.city || ad.street || ad.postCode ? (
                    <div className="mt-6">
                      <p className="font-bold text-gray-900 text-base">
                        Adresse
                      </p>
                      {attributes.length > 0 &&
                        attributes.map((a, i) => {
                          if (a.name === "countries") {
                            const country = a.values.find(
                              (value) => value.id === ad.country,
                            );
                            if (country) {
                              return (
                                <p key={i} className="text-base text-gray-600">
                                  {country.name}
                                </p>
                              );
                            }
                          }
                          return null;
                        })}
                      <p className="text-base text-gray-600">{ad.street}</p>
                      <p className="text-base text-gray-600">{ad.city}</p>
                      <p className="text-base text-gray-600">{ad.postCode}</p>

                      {/* Google Maps Button */}
                      <button
                        className="flex  w-full md:min-w-64 p-3 my-2  justify-center border border-sky-500 rounded-md items-center gap-3"
                        onClick={() => {
                          const addressParts = [
                            ad.street,
                            ad.city,
                            ad.postCode,
                            attributes
                              .find((attr) => attr.name === "countries")
                              ?.values.find((value) => value.id === ad.country)
                              ?.name,
                          ];
                          const formattedAddress = addressParts
                            .filter((part) => part) // Exclude empty fields
                            .join(", "); // Join parts with commas

                          const googleMapsURL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress)}`;
                          window.open(googleMapsURL, "_blank");
                        }}
                      >
                        <img src={placeIcon} alt="place" className="h-5 w-5" />{" "}
                        Show on Google Maps
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className=" flex gap-4 flex-wrap max-w-[500px]">
                  {ad.offers &&
                    ad.offers.length > 0 &&
                    attributes.length > 0 &&
                    ad.offers.map((offer, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-600 border border-sky-500 rounded-md p-2 flex items-center "
                      >
                        {
                          attributes.find(
                            (attribute) => attribute.name === "offers",
                          ).values[offer]
                        }
                      </p>
                    ))}
                </div>
              )}
            </div>
            <div className="adDetail__right">
              <div className="adDetail__filters">
                {fields.map((field, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {field.icon && (
                      <span className="flex-shrink-0">
                        {typeof field.icon === "string" ? (
                          <Image
                            src={field.icon}
                            width={24}
                            height={24}
                            alt={field.alt}
                            className="w-6 h-6"
                            loading="lazy"
                          />
                        ) : (
                          field.icon
                        )}
                      </span>
                    )}
                    {field.items && field.items.length > 0 && (
                      <span className="flex flex-wrap items-center gap-x-1 text-base text-gray-700">
                        {field.items.map((item, i) => (
                          <span key={i} className="inline-block">
                            {getAttributeValue(field.attributeName, item)}
                            {i < field.items.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 justify-end pr-6 -mt-4">
                <span className="text-gray-700 text-sm font-medium">
                  {averageRating !== null && !isNaN(averageRating)
                    ? averageRating.toFixed(1)
                    : ""}{" "}
                </span>

                {/* Display Average Rating as Stars */}
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
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

              <div className="adDetail__description">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {ad.description}
                </pre>
              </div>

              {ad.phone && number && (
                <div className="sticky-buttons fixed bottom-4 flex items-center space-x-4 md:hidden px-8">
                  {ad.phone && (
                    <a href={`tel:${areaCode}${ad.phone}`}>
                      <Image
                        src={smartphone}
                        width={40}
                        height={40}
                        alt="smartphone"
                        className="w-6 h-8"
                        loading="lazy"
                      />
                    </a>
                  )}
                  {number && (
                    <a
                      href={`https://wa.me/${number.replace(
                        /\s/g,
                        "",
                      )}?text=%C2%ABHallo%20ich%20habe%20dein%20Inserat%20auf%20Onlyfriend.ch%20gesehen.%C2%BB`}
                    >
                      <Image
                        src={whatsapp}
                        width={40}
                        height={40}
                        alt="whatsapp"
                        className="w-8 h-8"
                      />
                    </a>
                  )}
                </div>
              )}
            </div>{" "}
          </div>
          <div className="mx-2 p-2 md:mx-auto flex w-full justify-between flex-col md:flex-row">
            <div>
              <div className="flex flex-col space-y-2 mb-4 rounded-lg shadow-md p-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">
                    {t("do_you_like_this_ad")}
                  </h2>
                </div>

                <button
                  className="text-sky-500 hover:text-gray-800 flex items-center gap-6"
                  onClick={handleShare}
                >
                  <Image
                    src={whatsappBlue}
                    width={100}
                    height={100}
                    alt="whatsapp"
                    className="h-5 w-5 mr-2"
                  />
                  {t("share_whatsapp")}
                </button>
                <hr className="my-4" />
                {user && (
                  <button className="text-sky-500 hover:text-gray-800 flex items-center gap-6">
                    <Image
                      src={isFavorite ? fav : linedHeart}
                      width={500}
                      height={500}
                      alt="lined heart"
                      className="h-5 w-5 mr-2"
                      loading="lazy"
                      onClick={toggleFavorite}
                    />
                    {t("save_ad")}
                  </button>
                )}
                <hr className="my-4" />

                <button
                  className="text-sky-500 hover:text-gray-800 flex items-center gap-6"
                  onClick={handleReport}
                >
                  <div className="h-5 w-5 mr-2 flex items-center justify-center">
                    <span role="img" aria-label="danger">
                      ⚠️
                    </span>
                  </div>
                  {t("report_ad")}
                </button>
              </div>
            </div>{" "}
            <div className="mb-4 rounded-lg shadow-md p-4">
              <h3 className="font-semibold mb-2">{t("interesting_link")}</h3>

              {/* Render Search Links */}
              <div className="mt-4 flex flex-wrap gap-2">
                {searchLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    className="px-3 py-1 text-sky-500 border-sky-500 rounded-md border-2 hover:bg-gray-100"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>{" "}
          </div>{" "}
          <div className="adDetail__arrowTitle flex justify-center items-center">
            <button
              className="pagination-arrow"
              aria-label="Previous page"
              onClick={navigateToNextAd}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <Image
              src={home}
              width={500}
              height={500}
              alt="arrow"
              className=" p-4 bg-slate-50 shadow-xl  rounded-full h-12 w-12 cursor-pointer"
              loading="lazy"
              onClick={() => router.push("/")}
            />
            <button
              className="pagination-arrow"
              aria-label="Next page"
              onClick={navigateToPreviousAd}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="my-6 px-4 md:px-6">
            <h2 className="text-xl font-bold text-gray-800">
              {t("user_reviews")}
            </h2>
            {userReviews?.length > 0 ? (
              userReviews.map((review) => (
                <div key={review._id} className="mt-4 border-b pb-4">
                  <p className="text-sm text-gray-800">
                    <strong>{review.name}</strong> - {review.review}
                  </p>
                  <div className="flex items-center mt-2 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ${
                          review.rating >= star
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-2 text-gray-600">{t("no_reviews")}</p>
            )}
          </div>{" "}
          <div className="mt-4 px-4 md:px-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("review_text")}
            </h3>
            {/* Star Rating */}
            <div className="flex items-center mt-2 space-x-1 ">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-6 h-6 flex justify-center items-center rounded-full border ${
                    rating >= star
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>
            {/* Review Text Input */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t("review_text")}
              maxLength={600}
              className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-sky-300"
              rows="4"
            />
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Name*")}
              className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-sky-300"
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-4 px-5 py-3 bg-sky-400 text-white font-semibold rounded-lg hover:bg-sky-500 focus:ring focus:ring-sky-300 focus:outline-none"
            >
              {t("submit_review")}
            </button>
          </div>
          <RecentlyViewedAds attributes={attributes} />
        </div>
      )}
    </>
  );
};

export default AdDetail;
