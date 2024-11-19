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

  const indexOfFirstAd = (currentPage - 1) * adsPerPage;
  const indexOfLastAd = Math.min(indexOfFirstAd + adsPerPage, ads.length);
  const currentAds = ads.reverse().slice(indexOfFirstAd, indexOfLastAd);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 300,
      left: 0,
      behavior: "smooth",
    });
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
      </Head>{" "}
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
        <div className="pagination">
          {[...Array(Math.ceil(ads.length / adsPerPage)).keys()]
            .filter((pageNumber) => {
              const page = pageNumber + 1;
              const isStart = page <= 3; // Always show the first 3 pages
              const isEnd = page >= ads.length / adsPerPage - 2; // Always show the last 3 pages
              const isNearCurrent =
                page >= currentPage - 1 && page <= currentPage + 1; // Show current page and its neighbors

              return isStart || isEnd || isNearCurrent;
            })
            .map((pageNumber, index, filteredArray) => {
              const page = pageNumber + 1;
              const isEllipsis =
                index > 0 && filteredArray[index - 1] + 1 !== pageNumber; // Check for gaps

              return (
                <React.Fragment key={page}>
                  {isEllipsis && <span className="ellipsis">...</span>}
                  <button
                    className={currentPage === page ? "active" : ""}
                    onClick={() => paginate(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>
        <div>
          <br />
          <br />
          <h3>
            Sextreffen in der Schweiz: Die besten Sexinserate und Kontakte auf
            onlyfriend.ch
          </h3>
          <br />
          <p>
            Du möchtest aufregende Sextreffen in der Schweiz erleben? Auf
            <strong> onlyfriend.ch</strong> findest du die besten Sexkontakte
            und Erotikanzeigen für jeden Geschmack. Egal, welche Wünsche,
            Fantasien oder Neigungen du ausleben möchtest – bei uns gibt es für
            alle etwas Passendes! Wähle aus verschiedenen Kategorien, entdecke
            private Sexkontakte und erlebe sinnliche Abenteuer.{" "}
          </p>
          <br />
          <br />
          <h3>
            onlyfriend.ch – Dein Erotikportal für diskrete Sextreffen und heisse
            Kontakte
          </h3>
          <br />
          <p>
            <strong> onlyfriend.ch</strong> ist dein Schweizer Erotikportal für
            unverbindliche Sextreffen, diskrete Sexkontakte und aufregende
            Inserate. Unsere Plattform bietet dir eine grosse Auswahl an
            Angeboten – von privaten Erotikanzeigen bis hin zu exklusiven
            Verlinkungen zu deinem Lieblings-<strong>OnlyFans</strong>-Account.
            Mit uns kannst du schnell und einfach heisse Begegnungen
            arrangieren, die genau deinen Vorlieben entsprechen.
            <br />
            <br />
            Um höchste Qualität zu gewährleisten, überprüft unser Team jedes
            Inserat auf Echtheit und Verifizierung, damit du dich auf eine
            sichere und seriöse Plattform verlassen kannst.
          </p>
          <br />
          <br />
          <h3>Vielfältige Sexinserate für jeden Geschmack</h3> <br />
          <br />
          <p>
            Ob Escort-Service, erotische Massagen, Casual-Dates oder aufregende
            Fetisch-Abenteuer – bei onlyfriend.ch findest du alles, was das Herz
            begehrt. Hier sind einige Highlights unseres Angebots:
            <br />
            <br />
            <ui>
              <li>
                <strong>Escort-Service </strong> : Finde diskrete Begleitungen
                in Städten wie Zürich,
              </li>
              <li>
                <strong>Erotik-Massagen </strong> : Entspanne dich bei
                sinnlichen Massagen in deiner Nähe.
              </li>
              <li>
                <strong>OnlyFans-Verlinkungen </strong> : Entdecke exklusive
                Inhalte von frei arbeitenden Frauen.
              </li>
              <li>
                <strong>Sextreffen & Abenteuer </strong> : Plane aufregende
                Begegnungen in der ganzen Schweiz.
              </li>
              <li>
                <strong>Fetisch & BDSM </strong> : Tauche ein in eine Welt
                voller Fantasien und spezieller Vorlieben.
              </li>
            </ui>
            <br />
            Unser breites Angebot umfasst auch Sexpartys, Callgirls,
            Sugar-Babe-Dates und vieles mehr. Finde jetzt deine Vorliebe und
            erlebe unvergleichliche Stunden.
          </p>
          <br />
          <h3>Für jeden das passende Abenteuer: unser Angebot </h3>
          <br />
          <strong>Für inh</strong>
          <p>
            Suchst du nach aufregendem Privatsex mit scharfen Girls, heißen
            MILFs oder erfahrenen Frauen? Möchtest du deine Fantasien bei
            Gangbangs, Gruppensex oder Fetisch-Treffen ausleben? Bei
            onlyfriend.ch findest du Frauen, die dir all das und mehr
            ermöglichen.{" "}
          </p>
          <br /> <strong>Für sie</strong>
          <p>
            Du wünschst dir einen starken, dominanten Mann mit Ausstrahlung? Ob
            sinnliche Dates, leidenschaftliche Abenteuer oder wilder Sex – auf
            onlyfriend.ch findest du garantiert den richtigen Partner, der deine
            Wünsche wahr werden lässt.
          </p>
          <br />
          <h3>Erotik und Abenteuer in deiner Nähe </h3>
          <br />
          <p>
            Von Zürich über Aargau bis hin zu Zug – bei uns findest du Inserate
            von sexhungrigen Frauen und Männern in der ganzen Schweiz. Bestelle
            dir deinen Wunsch- partner direkt nach Hause oder triff dich in
            einem privaten Umfeld für heiße Stunden.
            <br />
            <br />
            In unserem <strong> Schweizer Erotikforum</strong> kannst du dich
            ausserdem mit anderen Mitgliedern austauschen und alles über die
            besten Clubs und Events in deiner Re- gion erfahren. Von Bordellen
            über Swingerclubs bis hin zu Domina-Studios – entdecke jetzt die
            heissesten Locations für deine Fantasien.
            <br />
            <br />
            <strong>Deine Plattform für Erotik, Sex und Leidenschaft</strong>
            <br />
            Erlebe unverbindliche Abenteuer, entdecke spannende Inserate und
            geniesse aufregende Treffen – alles diskret und sicher. Besuche
            jetzt <strong> onlyfriend.ch</strong> und finde deinen perfekten
            Sexpartner. Deine Erotikträume warten nur darauf, wahr zu werden!{" "}
          </p>
          <br />
          <br />
          <h3>Keywords für dein Erotikabenteuer in der Schweiz </h3>
          <br />
          <p>
            Auf <strong> onlyfriend.ch</strong> findest du eine grosse Auswahl
            an Erotik-Kleinanzeigen und Sexinseraten für jede Vorliebe. Ob du
            nach Callgirls, Escortservice, eroti- schen Massagen,
            Fetisch-Anzeigen oder BDSM-Kontakten suchst – bei uns bist du
            richtig. Unsere Plattform bietet zusätzlich Inserate für Sexpartys,
            Swin- ger-Kontakte, Adult-Dating, Dominas, Webcam-Shows und mehr.{" "}
            <br />
            <br />
            Finde private <strong> Sexkontakte </strong> in Städten wie{" "}
            <strong> Zürich, Luzern, Aargau</strong> oder anderen Regionen der
            Schweiz. Lass dich von aufregenden{" "}
            <strong>Sexpartys, Stripper-Inse- raten,</strong> oder diskreten
            TS-Inseraten inspirieren. Onlyfriend.ch ist dein verlässlicher
            Begleiter für <strong> Bordell-Inserate, Erotikjobs</strong> und
            alle anderen erotischen Aben- teuer. <br />
            <br />
            Erlebe prickelnde Stunden, entdecke die besten{" "}
            <strong>Erotik-Shops</strong> und genieße eine diskrete Atmosphäre –
            sicher, einfach und aufregend. Starte noch heute und entdecke deine
            Fantasien auf <strong> onlyfriend.ch</strong> .{" "}
          </p>
          <br />
        </div>
      </div>
    </>
  );
}

export default HomePage;
