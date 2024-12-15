import React, { useState, useEffect, useMemo, useCallback } from "react";
import AdList from "@components/home/AdList";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import useScrollRestoration from "@hooks/useScrollRestoration";
import { useRouter } from "next/router";

// Dynamic imports for non-critical components
const CookiesPopup = dynamic(() => import("@components/alerts/CookiesPopup"), {
  loading: () => null,
  ssr: false,
});
// Skeleton Loader Component
const AdSkeleton = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
    }}
  >
    <div
      style={{
        width: "100%",
        height: "200px",
        backgroundColor: "#d1d5db",
        marginBottom: "1rem",
        borderRadius: "0.375rem",
      }}
    ></div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          height: "1rem",
          backgroundColor: "#d1d5db",
          marginBottom: "0.5rem",
          borderRadius: "0.25rem",
        }}
      ></div>
      <div
        style={{
          height: "1rem",
          backgroundColor: "#d1d5db",
          width: "75%",
          borderRadius: "0.25rem",
        }}
      ></div>
    </div>
  </div>
);
const FilterForm = dynamic(() => import("@components/forms/FilterForm"), {
  loading: () => <div>Loading filters...</div>,
});

export async function getServerSideProps({ req, locale, query }) {
  const api = new ApiController();
  const page = parseInt(query.page, 10) || 1;
  const activeType = parseInt(query.type, 10) || 0;

  // Parallel data fetching with caching
  const [user, attributes, initialAds] = await Promise.all([
    api.checkAuth(req.cookies.Auth?.token),
    api.fetchAttributes(locale === "de" ? "de" : "en"),
    api.fetchAds(activeType, page), // Pass page and type to server-side fetch
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
      user,
      attributes,
      initialAds,
      initialPage: page,
      initialActiveType: activeType,
    },
  };
}

function HomePage({
  user,
  attributes,
  initialAds,
  initialPage = 1,
  initialActiveType = 0,
}) {
  const router = useRouter();
  const [skipRestore, setSkipRestore] = useState(false); // Flag to control scroll restoration
  useScrollRestoration(router, skipRestore); // Pass skipRestore flag
  const { t } = useTranslation("common");
  const { api } = useApi();

  const [ads, setAds] = useState(initialAds.ads || []);
  const [totalPages, setTotalPages] = useState(initialAds.totalPages || 1);
  const [total, setTotal] = useState(initialAds.total || 1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState(initialActiveType);
  const [isCookiesPopupOpen, setIsCookiesPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });
  const adsPerPage = 50;

  // Enhanced route and page handling
  useEffect(() => {
    const handleRouteChange = (url) => {
      const urlParams = new URL(url, window.location.origin);
      const pageParam = urlParams.searchParams.get("page");
      const typeParam = urlParams.searchParams.get("type");

      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const type = typeParam ? parseInt(typeParam, 10) : activeType;

      if (page !== currentPage || type !== activeType) {
        setCurrentPage(page);
        setActiveType(type);
        fetchAds(type, page);
      }
    };

    // Add route change listener
    router.events.on("routeChangeComplete", handleRouteChange);

    // Cleanup listener
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, currentPage, activeType]);

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, []);

  // Efficient ad fetching (kept from original implementation)
  useEffect(() => {
    const pageFromQuery = parseInt(router.query.page, 10) || 1;
    setCurrentPage(pageFromQuery);
    fetchAds(activeType, pageFromQuery);
  }, [router.query.page, activeType]);

  const fetchAds = useCallback(
    async (tab, page = 1) => {
      setLoading(true);
      try {
        const res = await api.fetchAds(tab, page);
        if (res) {
          setAds(res.ads);
          setTotalPages(res.totalPages);
          setTotal(res.total);
        }
      } catch (error) {
        console.error("Failed to fetch ads", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  // Improved pagination handler
  const paginate = useCallback(
    (pageNumber) => {
      setSkipRestore(true); // Disable scroll restoration for pagination
      // Update URL with new page, preserving other query parameters
      const newQuery = {
        ...router.query,
        page: pageNumber,
      };

      router.push(
        {
          pathname: router.pathname,
          query: newQuery,
        },
        undefined,
        { shallow: true },
      );

      // Scroll to top with slight delay
      window.scrollTo({ top: 300, left: 0, behavior: "smooth" });

      // Fetch ads after a short delay to ensure smooth experience
      setTimeout(() => {
        fetchAds(activeType, pageNumber);
        setSkipRestore(false); // Reset the flag after the action is completed
        console.log("Ads fetched after pagination and skipped restoration");
      }, 300);
    },
    [router],
  );
  return (
    <>
      <Head>
        <title>
          Erotische Anzeigen in der Schweiz • Sextreffen und diskrete Kontakte
          in Zürich, Bern, Basel und mehr • Unsere Services: Von Escort bis
          erotische Massagen • Sicher, diskret und unkompliziert – Onlyfriend.ch
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Finden Sie erotische Anzeigen und Sextreffen in der Schweiz. Entdecken Sie diskrete Kontakte in Zürich, Bern oder Basel – unkompliziert auf Onlyfriend.ch!"
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
            <FilterForm
              filters={filters}
              setFilters={setFilters}
              attributes={attributes}
            />
          </div>{" "}
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
                      onClick={() => {
                        fetchAds(value.id);
                        setActiveType(value.id);
                      }}
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
                priority
              />
            </div>
            {loading ? (
              <div className="ads-skeleton-container">
                <h1
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#374151",
                    marginBottom: "1rem",
                  }}
                >
                  {t("skeleton_text")}
                </h1>

                {[...Array(5)].map((_, index) => (
                  <AdSkeleton key={index} />
                ))}
              </div>
            ) : (
              <AdList
                user={user}
                ads={ads}
                attributes={attributes}
                total={total}
              />
            )}{" "}
            {isCookiesPopupOpen && (
              <CookiesPopup setIsCookiesPopupOpen={setIsCookiesPopupOpen} />
            )}{" "}
          </div>
        </div>
        <div className="pagination">
          {[...Array(Math.ceil(total / adsPerPage)).keys()]
            .filter((pageNumber) => {
              const page = pageNumber + 1;
              const isStart = page <= 3; // Always show the first 3 pages
              const isEnd = page >= total / adsPerPage - 2; // Always show the last 3 pages
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
        </div>{" "}
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
          <h3>Warum Onlyfriend.ch für erotische Kontakte?</h3>
          <p>
            „Onlyfriend.ch bietet Ihnen eine Plattform, die auf Diskretion und
            Sicherheit ausgelegt ist. Treffen Sie attraktive Kontakte ohne
            komplizierte Anmeldung. Unsere geprüften Anzeigen sorgen für ein
            hochwertiges Nutzererlebnis.“
          </p>
          <h4>Entdecken Sie:</h4>
          <ul>
            <li>Erotische Massagen in Zürich und Genf</li>
            <li>Escort-Services für jeden Anlass</li>
            <li>Swinger- und Fetisch-Kontakte in Ihrer Region</li>
          </ul>
          <h4>Sextreffen leicht gemacht – So funktioniert's</h4>
          <ol>
            <li>
              <strong>Stöbern Sie durch unsere Kategorien:</strong> Wählen Sie
              aus einer Vielzahl von Anzeigen, die nach Ihren Vorlieben und
              Ihrem Standort sortiert sind.
            </li>
            <li>
              <strong>Kontakt aufnehmen – direkt und diskret:</strong> Ohne
              Anmeldung können Sie direkt über unsere Plattform mit den
              Anbietern in Kontakt treten. Alle Anzeigen sind klar und
              transparent gestaltet.
            </li>
            <li>
              <strong>Treffen Sie Ihre Wahl:</strong> Entscheiden Sie sich für
              ein Treffen oder eine Interaktion Ihrer Wahl. Unsere geprüften
              Anzeigen sorgen dafür, dass Sie sich auf Qualität und Diskretion
              verlassen können.
            </li>
            <li>
              <strong>Erleben Sie prickelnde Abenteuer:</strong> Genießen Sie
              Ihre Erfahrung mit einer Person, die Ihre Wünsche teilt – alles in
              einem sicheren und anonymen Rahmen.
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default HomePage;
