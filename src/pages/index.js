import React, { useEffect, useState } from "react";
import CookiesPopup from "@components/alerts/CookiesPopup";
import FilterForm from "@components/forms/FilterForm";
import AdList from "@components/home/AdList";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useScrollRestoration from "src/hooks/useScrollRestoration";

export async function getServerSideProps({ req, locale }) {
  const api = new ApiController();
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = (await api.checkAuth(auth.token)) || null;
  const lang = locale === "de" ? "de" : "en";
  const attributes = (await api.fetchAttributes(lang)) || null;
  const ads = (await api.fetchAds(0, 20)) || null; // Fetch first page with limit 20
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
  useScrollRestoration(useRouter());
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [ads, setAds] = useState(initialAds);
  const [isLoading, setIsLoading] = useState(false);
  const [isCookiesPopupOpen, setIsCookiesPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });
  const [activeType, setActiveType] = useState(0);
  const [page, setPage] = useState(1);

  const fetchAds = async (tab, limit = 20, newPage = 1) => {
    setIsLoading(true);
    setActiveType(tab);
    setPage(newPage);

    const res = await api.fetchAds(tab, limit, newPage);
    if (res?.err) {
      setAds([]);
    } else {
      setAds(newPage === 1 ? res : [...ads, ...res]);
    }
    setIsLoading(false);
  };

  const loadMoreAds = () => {
    fetchAds(activeType, 20, page + 1);
  };

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, []);

  return (
    <>
      <Head>{/* Meta and title tags remain the same */}</Head>
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
                attributes
                  .find((attribute) => attribute.name === "types")
                  .values.map((value) => (
                    <button
                      key={value.id}
                      className={
                        activeType === value.id ? "button" : "button inactive"
                      }
                      onClick={() => fetchAds(value.id, 20, 1)} // Reset to first page when switching tabs
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
                <span className="home__adsCount">{ads.length}</span>{" "}
                {t("ads_count")}
              </h3>
            </div>
            <AdList
              user={user}
              className="home__ads"
              ads={ads}
              premiumAds={premiumAds}
              attributes={attributes}
            />
            {isLoading && <div className="loading-spinner">Loading...</div>}
            {!isLoading && ads.length > 0 && (
              <button onClick={loadMoreAds} className="load-more">
                {t("load_more")}
              </button>
            )}
            {isCookiesPopupOpen && (
              <CookiesPopup setIsCookiesPopupOpen={setIsCookiesPopupOpen} />
            )}
          </div>
        </div>
        <div>
          <br />
          <br />
          <h3>
            Sextreffen in der Schweiz: die besten Sexinserate und Kontakte auf
            onlyfriend.ch - Onlyfriends
          </h3>
          <p>
            Onlyfriends ist ein Erotikportal, wo frei arbeitende Frauen ein
            Inserat erstellen und mit Kunden in Kontakt treten. Onlyfriends
            verfügt auch eine Verlinkung zu Onlyfans. Wenn man unter der Rubrik
            Onlyfans Inserate sucht, erscheinen Inserate, die eine direkte
            Verlinkung zu Ihrem Onlyfans Account haben. Onlyfriends bezieht sich
            somit auf Sex und Erotik Inserate und auch auf Onlyfans Inserate.
            Onlyfriends überprüft jedes Inserat nach Ihrer Echtheit und bei
            doppelter Überprüfung werden die Inserate noch verifiziert. Hierbei
            will Onlyfriends vermeiden, dass gefälschte Inserate erstellt
            werden. Du möchtest heisse Sextreffen in der Schweiz erleben? Bei
            uns findest du die besten Sexkontakte und Erotikanzeigen. Egal,
            welche Wünsche oder Neigungen du ausleben möchtest – bei
            onlyfriend.ch (Onlyfriends) ist für jeden Geschmack etwas dabei.
            Wähle aus verschiedenen Kategorien deine Vorliebe und finde private
            Sexkontakte.
          </p>
          <br />
          <br />
          <h3>Sexinserate für jeden Geschmack</h3>
          <p>
            Onlyfriends verfügt über ein breites Angebot an Services: Escort
            Service, Sextreffen, Erotik Massagen, Sex Beziehungen, Onlyfans
            Benutzer, Sexpartys, Callgirls, Erotikjobs und vieles mehr! Suchst
            du nach Escort Service in Zürich, Sextreffen in Aargau, Erotik
            Massage in Winterthur oder Sugar Babe treffen. Vielleicht suchst du
            nach einem Seriösen Begleitservice oder eine langfristige
            Sexbeziehung in der Schweiz. Onlyfriends verfügt auch über Adult
            Dating, Fetisch-Anzeigen und BDSM-Kontakte.
            <br />
            <br />
            Für sie, Erotikjobs <br /> Du wünschst dir einen dominanten Mann mit
            grossem Schwanz und Sixpack? Auf onlyfriend.ch - Onlyfriends findest
            du garantiert den passenden Sexpartner.
          </p>
          <br />
          <br />
          <h3>Sex und Escort in der Schweiz</h3>
          <p>
            Von Zürich über Aargau bis hin zu Zug – bei uns findest du
            Sexanzeigen von willigen Frauen in der gesamten Schweiz. So kannst
            du dich ganz nach deinen Wünschen befriedigen lassen – sowohl bei
            dir zu Hause als auch bei einem Sexpartner in deiner Nähe. Sexy
            Girls lassen deine Erotikträume wahr werden. In unserem Schweizer
            Sexforum kannst du dich ausserdem mit anderen Mitgliedern
            austauschen und erfährst alles über die besten Sexclubs und Escorts
            in deiner Region. Bestelle die schärfsten Sexpartner zu dir nach
            Hause oder besuche sie ganz privat für geilen Sex in der Schweiz.
          </p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
