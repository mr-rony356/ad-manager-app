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
  const user = await api.checkAuth(auth.token);
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const ads = await api.fetchAds(0);
  const premiumAds = await api.fetchPremiumAds(0);
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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });
  const [activeType, setActiveType] = useState(0);

  // Fetch ads based on activeType when it changes
  const fetchAds = async (tab) => {
    setActiveType(tab);

    const res = await api.fetchAds(tab);
    if (res.err) setAds([]);
    else setAds(res);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsFilterVisible(!window.matchMedia("(max-width: 820px)").matches);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, [isCookiesPopupOpen]);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <>
      <Head>
        <title>
          Erotische Anzeigen für Sexkontakte und Onlyfans Accounts in der
          Schweiz - Die besten Sex & Erotik Anzeigen der Schweiz: Für jeden
          Geschmack! onlyfriend.ch ▷ Das Schweizer Sex & Erotik Inserate Portal.
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Entdecken Sie auf unserer Webseite erotische Anzeigen für Sexkontake und Onlyfans Accounts in der Schweiz. Treffen Sie heiße Girls in Ihrer Nähe und erleben Sie prickelnde Abenteuer. Ohne Anmeldung können Sie direkt mit den Girls in Kontakt kommen."
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sex in Zürich, Blowjob in Zürich, Escort in Zürich, Gangbang in Zürich, Girlfriend Sex in Zürich, Striptease in Zürich, Sex in Aargau, Blowjob in Aargau, Escort in Aargau, Gangbang in Aargau, Girlfriend Sex in Aargau, Striptease in Aargau, Sex in Luzern, Blowjob in Luzern, Escort in Luzern, Gangbang in Luzern, Girlfriend Sex in Luzern, Striptease in Bern, Sex in Bern, Blowjob in Bern, Escort in Bern, Gangbang in Bern, Girlfriend Sex in Bern, Striptease in Bern, Sex in Basel, Blowjob in Basel, Escort in Basel, Gangbang in Basel, Girlfriend Sex in Basel, Striptease in Basel, Junge Frauen, Sexy Latinas, Escort, Sexy Studentin, Milf, Sextreffen, Webcam, Sexchat, Sexting, Cam2Cam, Erotik-Kleinanzeigen, Sexkontakte, Begleitservice, Callgirls, Escortservice, Erotische Massagen, Fetisch-Anzeigen, BDSM-Kontakte, Sexpartys, Swinger-Kontakte, Erotikjobs, Erotik-Shops, Webcam-Shows, Adult-Dating, Dominas, Bordell-Inserate, Stripper-Inserate, TS-Inserate, Onlyfans, Onlyfriends,"
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
            {isFilterVisible && (
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                attributes={attributes}
              />
            )}
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
                src={"/assets/filter.png"}
                width={500}
                height={500}
                alt="filter"
                className="filter"
                onClick={toggleFilter}
              />
            </div>
            <AdList
              user={user}
              className="home__ads"
              ads={ads}
              premiumAds={premiumAds}
              attributes={attributes}
            />
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
