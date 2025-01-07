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
  const id = params.id;
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

  const tagIcon = "/assets/tag.png";
  const placeIcon = "/assets/place.png";
  const fav = "/assets/heart.png";
  const linedHeart = "/assets/lined-heart.png";
  const arrow = "/assets/arrow-left-v2.png";
  const editing = "/assets/editing.png";
  const verified = "/assets/verified-v2.png";
  const smartphone = "/assets/smart-phone-white.png";
  const smartphoneBlue = "/assets/smart-phone.png";
  const webIcon = "/assets/web.png";
  const whatsapp = "/assets/whatsapp-white.png";
  const whatsappBlue = "/assets/whatsapp.png";
  const home = "/assets/menue.png";
  const video = "/assets/video-icon.png";

  useEffect(() => {
    if (user?._id === ad.user || user.email === "cyrill.mueller@onlyfriend.ch")
      setIsUser(true);
  }, [ad.user, user._id]);

  // Run on component mount to set initial state

  const prevAdSlug =
    prevAd &&
    prevAd.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const nextAdSlug =
    nextAd &&
    nextAd.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const navigateToPreviousAd = () => {
    if (prevAd) {
      router.push(`/ad/${prevAd._id}/${prevAdSlug}`);
    }
  };

  const navigateToNextAd = () => {
    if (nextAd) {
      router.push(`/ad/${nextAd._id}/${nextAdSlug}`);
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
            <div className="adDetail__arrowTitle">
              <Image
                src={arrow}
                width={500}
                height={500}
                alt="arrow"
                className="adDetail__backArrow"
                loading="lazy"
                onClick={navigateToNextAd}
              />
              <Image
                src={home}
                width={500}
                height={500}
                alt="arrow"
                className="adDetail__homeIcon"
                loading="lazy"
                onClick={() => router.push("/")}
              />
              <Image
                src={arrow}
                width={500}
                height={500}
                alt="arrow"
                className="adDetail__nextArrow"
                loading="lazy"
                onClick={navigateToPreviousAd}
              />
              <div className="adDetail__verified"></div>
            </div>
            <div className="adDetail__buttons">
              {user && (
                <Image
                  src={isFavorite ? fav : linedHeart}
                  width={500}
                  height={500}
                  alt="lined heart"
                  className="adDetail__titleImage"
                  loading="lazy"
                  onClick={toggleFavorite}
                />
              )}
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
          <div className="adDetail__split ">
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
                      className="space-y-4 w-full flex !flex-col justify-center items-center"
                      onSubmit={sendMessage}
                    >
                      <Textfield
                        id="tf-1-1"
                        name="tf-1-1"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        label="Nachricht"
                        required={true}
                        className="w-full"
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
                        <div className="flex !flex-col  items-center gap-3 w-full">
                          <a
                            href={`tel:${areaCode}${ad.phone}`}
                            className="flex  min-w-44 md:min-w-64  justify-center border border-sky-500 rounded-md"
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
                            className="flex  min-w-44 md:min-w-64  justify-center border border-sky-500 rounded-md"
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
                              className="flex  min-w-44 md:min-w-64  justify-center border border-sky-500 rounded-md"
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
                      <p className="text-base text-gray-600">{ad.postCode}</p>
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
          <RecentlyViewedAds attributes={attributes} />
        </div>
      )}
    </>
  );
};

export default AdDetail;
