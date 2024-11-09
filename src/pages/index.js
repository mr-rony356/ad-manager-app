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
import SkeletonLoader from "@components/home/SkeletonLoader";

export async function getServerSideProps({ req, locale }) {
  const api = new ApiController();
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = (await api.checkAuth(auth.token)) || null;
  const lang = locale === "de" ? "de" : "en";
  const attributes = (await api.fetchAttributes(lang)) || null;
  const ads = (await api.fetchAds(0)) || null;
  const premiumAds = (await api.fetchPremiumAds(0)) || null;

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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });
  const [activeType, setActiveType] = useState(0);

  const fetchAds = async (tab) => {
    setLoading(true);
    setActiveType(tab);
    const res = await api.fetchAds(tab);
    if (res.err) setAds([]);
    else setAds(res);
    setLoading(false);
  };

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          Erotische Anzeigen für Sexkontakte und Onlyfans Accounts in der
          Schweiz
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Entdecken Sie auf unserer Webseite erotische Anzeigen für Sexkontake und Onlyfans Accounts in der Schweiz."
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sexkontakte, Onlyfans, Schweiz"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
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
            <div className="home__adsHeader">
              <h3>
                <span className="home__adsCount">{ads.length} </span>
                {t("ads_count")}
              </h3>
            </div>
            {loading ? (
              <SkeletonLoader /> // Show the skeleton while loading
            ) : (
              <AdList
                user={user}
                className="home__ads"
                ads={ads}
                premiumAds={premiumAds}
                attributes={attributes}
              />
            )}
            {isCookiesPopupOpen && (
              <CookiesPopup setIsCookiesPopupOpen={setIsCookiesPopupOpen} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
