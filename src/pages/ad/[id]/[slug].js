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
  const whatsapp = "/assets/whatsapp-white.png";
  const whatsappBlue = "/assets/whatsapp.png";
  const home = "/assets/menue.png";
  const [isMobileButtonVisible, setIsMobileButtonVisible] = useState(false);

  useEffect(() => {
    if (user._id === ad.user) setIsUser(true);
  }, [ad.user, user._id]);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobileButtonVisible(
          !window.matchMedia("(max-width: 820px)").matches,
        );
      }
    };

    // Run on component mount to set initial state
    handleResize();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

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
          <h1 className="adDetail__title"> {ad.title}</h1>
          {ad.verified && (
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

          <Carousel
            ad={ad}
            toggler={toggler}
            setToggler={setToggler}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            switchSlide={switchSlide}
          />
          <div className="adDetail__split">
            <div className="adDetail__left card">
              <div className="adDetail__splitButton">
                <button
                  className={
                    activeType === "contact" ? "button" : "button inactive"
                  }
                  onClick={() => setActiveType("contact")}
                >
                  Kontakt
                </button>
                <button
                  className={
                    activeType === "offer" ? "button" : "button inactive"
                  }
                  onClick={() => setActiveType("offer")}
                >
                  Angebote
                </button>
              </div>
              {activeType === "contact" ? (
                <div className="adDetail__contact">
                  {user && (
                    <form
                      className="adDetail__messageForm"
                      onSubmit={sendMessage}
                    >
                      <Textfield
                        id="tf-1-1"
                        name="tf-1-1"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        label="Nachricht"
                        required={true}
                      />
                      <button className="button" type="submit">
                        Senden
                      </button>
                    </form>
                  )}

                  <>
                    {ad.phone && ad.areaCode && (
                      <p className="adDetail__phoneNumber">
                        {areaCode} {ad.phone.replace(/-/g, " ")}
                      </p>
                    )}
                    <div className="adDetail__contactButtons">
                      {ad.phone && ad.areaCode && (
                        <>
                          <a href={`tel:${areaCode}${ad.phone}`}>
                            <button className="adDetail__supportButton">
                              {" "}
                              <Image
                                alt="support__icon"
                                width={500}
                                height={500}
                                src={smartphoneBlue}
                                className="support__icon"
                              />{" "}
                              Anrufen
                            </button>
                          </a>

                          <a
                            href={
                              "https://wa.me/" +
                              number.replace(/\s/g, "") +
                              "?text=%C2%ABHallo%20ich%20habe%20dein%20Inserat%20auf%20Onlyfriend.ch%20gesehen.%C2%BB"
                            }
                          >
                            <button className="adDetail__supportButton">
                              {" "}
                              <Image
                                alt="support__icon"
                                width={500}
                                height={500}
                                src={whatsappBlue}
                                className="support__icon"
                              />{" "}
                              Whatsapp
                            </button>
                          </a>
                        </>
                      )}
                      {ad.website && (
                        <a href={ad.website} className="button">
                          Website
                        </a>
                      )}
                    </div>
                  </>

                  {ad.country || ad.city || ad.street || ad.postCode ? (
                    <div className="adDetail__address">
                      <p className="adDetail__addressTitle">Adresse</p>
                      {attributes.length > 0 &&
                        attributes.map((a, i) => {
                          if (a.name === "countries") {
                            const country = a.values.find(
                              (value) => value.id === ad.country,
                            );
                            if (country) {
                              return (
                                <p key={i} className="adDetail__addressLine">
                                  {country.name}
                                </p>
                              );
                            }
                          }
                          return null;
                        })}

                      <p className="adDetail__addressLine">{ad.street}</p>

                      <p className="adDetail__addressLine">{ad.postCode}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="adDetail__offers">
                  {ad.offers &&
                    ad.offers.length > 0 &&
                    attributes.length > 0 &&
                    ad.offers.map((offer, i) => (
                      <p key={i} className="offer">
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
                <div className="adDetail__tags">
                  <Image
                    src={tagIcon}
                    width={500}
                    height={500}
                    alt="tag"
                    className="tag"
                    loading="lazy"
                  />
                  {ad.tags &&
                    ad.tags.length > 0 &&
                    attributes.length > 0 &&
                    ad.tags.map((tag, i) => (
                      <p key={i} className="adDetail__tag">
                        {
                          attributes.find(
                            (attribute) => attribute.name === "tags",
                          ).values[tag]
                        }
                        ,
                      </p>
                    ))}
                </div>

                <div className="adDetail__regions">
                  <Image
                    src={placeIcon}
                    width={500}
                    height={500}
                    alt="region"
                    className="region"
                    loading="lazy"
                  />
                  {ad.regions &&
                    ad.regions.length > 0 &&
                    attributes.length > 0 &&
                    ad.regions.map((region, i) => (
                      <p key={i} className="adDetail__region">
                        {
                          attributes.find(
                            (attribute) => attribute.name === "regions",
                          ).values[region]
                        }
                        ,
                      </p>
                    ))}
                </div>
              </div>

              <div className="adDetail__description">
                <pre style={{ whiteSpace: "break-spaces" }}>
                  {ad.description}
                </pre>
              </div>
              {ad.phone && number && (
                <div
                  className={`sticky-buttons ${
                    isMobileButtonVisible ? "mobile" : "desktop"
                  }`}
                  style={{ display: isMobileButtonVisible ? "none" : "auto" }}
                >
                  {ad.phone && (
                    <a href={`tel:${areaCode}${ad.phone}`}>
                      <Image
                        src={smartphone}
                        width={500}
                        height={500}
                        alt="smartphone"
                        className="stickyButtons__button"
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
                        width={500}
                        height={500}
                        alt="whatsapp"
                        className="stickyButtons__button"
                      />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdDetail;
