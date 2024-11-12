import React, { useEffect, useState } from "react";
import CookiesPopup from "@components/alerts/CookiesPopup";
import FilterForm from "@components/forms/FilterForm";
import AdList from "@components/home/AdList";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { router } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useScrollRestoration from "src/hooks/useScrollRestoration";

export async function getServerSideProps({ req, locale }) {
  // Initialize the API helper class
  const api = new ApiController();
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = (await api.checkAuth(auth.token)) || null;
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = (await api.fetchAttributes(lang)) || null;
  const ads = (await api.fetchAds(0)) || null;
  const premiumAds = (await api.fetchPremiumAds(0)) || null;
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      attributes,
      initialAds: ads,
      premiumAds,
    },
  };
}

function HomePage({ user, attributes, initialAds, premiumAds }) {
  useScrollRestoration(router);
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [ads, setAds] = useState(initialAds);
  const [isCookiesPopupOpen, setIsCookiesPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });
  const [activeType, setActiveType] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [adsPerPage] = useState(50);

  const fetchAds = async (tab) => {
    setActiveType(tab);
    const res = await api.fetchAds(tab);
    if (res.err) setAds([]);
    else setAds(res);
  };

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, []);

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head>{/* ... */}</Head>
      <div className="page page--home">
        <h1 className="home__title">
          {t("home__title", { region: "Schweiz" })}
        </h1>
        <div className="home__content">
          <div className="home__left">
            <FilterForm
              filters={filters}
              setFilters={setFilters}
              attributes={attributes}
            />
          </div>
          <div className="home__right">
            <div className="button--inline">
              {attributes &&
                attributes.length > 0 &&
                attributes
                  .find((attribute) => attribute.name === "types")
                  .values.map((value) => (
                    <button
                      key={value.id}
                      className={
                        activeType === value.id ? "button" : "button inactive"
                      }
                      onClick={() => fetchAds(value.id)}
                    >
                      {value.name} {t("home__ad")}
                    </button>
                  ))}
              <Image
                src="/assets/filter.png"
                width={500}
                height={500}
                alt="filter"
                className="filter"
              />
            </div>
            <AdList
              user={user}
              className="home__ads"
              ads={currentAds}
              totalAds={ads.length}
              premiumAds={premiumAds}
              attributes={attributes}
              indexOfFirstAd={indexOfFirstAd}
              indexOfLastAd={indexOfLastAd}
            />
            {isCookiesPopupOpen && (
              <CookiesPopup setIsCookiesPopupOpen={setIsCookiesPopupOpen} />
            )}
          </div>
        </div>
        <div>{/* ... */}</div>
        <div className="pagination">
          {[...Array(Math.ceil(ads.length / adsPerPage)).keys()].map(
            (pageNumber) => (
              <button
                key={pageNumber + 1}
                className={currentPage === pageNumber + 1 ? "active" : ""}
                onClick={() => paginate(pageNumber + 1)}
              >
                {pageNumber + 1}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
