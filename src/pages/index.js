import React, { useState, useEffect, useCallback, useRef } from "react";
import AdList from "@components/home/AdList";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useScrollRestoration from "@hooks/useScrollRestoration";
// Dynamic imports for non-critical components
const CookiesPopup = dynamic(() => import("@components/alerts/CookiesPopup"), {
  loading: () => null,
  ssr: false,
});

// Skeleton Loader Component (kept from original implementation)
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

  const [user, attributes, initialAds] = await Promise.all([
    api.checkAuth(req.cookies.Auth?.token),
    api.fetchAttributes(locale === "de" ? "de" : "en"),
    api.fetchAds(activeType, page),
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
  const { t } = useTranslation("common");
  const { api } = useApi();
  useScrollRestoration(router);

  // Caching mechanism
  const [adCache, setAdCache] = useState({
    [initialActiveType]: {
      [initialPage]: initialAds.ads || [],
    },
  });

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

  const loadMoreTriggerRef = useRef(null);
  const observerRef = useRef(null);

  // Cached fetch ads method
  const fetchAds = useCallback(
    async (tab, page = 1) => {
      // Check if ads are already in cache
      const cachedAds = adCache[tab]?.[page];
      if (cachedAds) {
        setAds(cachedAds);
        return cachedAds;
      }

      setLoading(true);
      try {
        const res = await api.fetchAds(tab, page);
        if (res) {
          // Update cache
          setAdCache((prevCache) => ({
            ...prevCache,
            [tab]: {
              ...(prevCache[tab] || {}),
              [page]: res.ads,
            },
          }));

          setAds(res.ads);
          setTotalPages(res.totalPages);
          setTotal(res.total);
          return res.ads;
        }
      } catch (error) {
        console.error("Failed to fetch ads", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    },
    [api, adCache],
  );

  // Fetch more ads with caching
  const fetchMoreAds = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;

    const nextPage = currentPage + 1;

    // Check cache first
    const cachedNextPageAds = adCache[activeType]?.[nextPage];
    if (cachedNextPageAds) {
      setAds((prevAds) => [...prevAds, ...cachedNextPageAds]);
      setCurrentPage(nextPage);
      return;
    }

    setLoading(true);
    try {
      const res = await api.fetchAds(activeType, nextPage);

      if (res && res.ads.length > 0) {
        // Update cache
        setAdCache((prevCache) => ({
          ...prevCache,
          [activeType]: {
            ...(prevCache[activeType] || {}),
            [nextPage]: res.ads,
          },
        }));

        setAds((prevAds) => [...prevAds, ...res.ads]);
        setCurrentPage(nextPage);
        setTotalPages(res.totalPages);
        setTotal(res.total);

        // Update URL with new page
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, page: nextPage },
          },
          undefined,
          { shallow: true },
        );
      }
    } catch (error) {
      console.error("Failed to fetch more ads", error);
    } finally {
      setLoading(false);
    }
  }, [api, activeType, currentPage, loading, totalPages, router, adCache]);

  // Existing route change and other effects remain the same
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

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, currentPage, activeType, fetchAds]);

  // Intersection Observer for infinite scroll (mostly unchanged)
  useEffect(() => {
    if (!loadMoreTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && currentPage < totalPages) {
          fetchMoreAds();
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current = observer;
    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreTriggerRef.current) {
        observerRef.current.unobserve(loadMoreTriggerRef.current);
      }
    };
  }, [fetchMoreAds, currentPage, totalPages]);

  // Rest of the component remains the same as in your original implementation
  return (
    <>
      <Head>{/* Existing head content */}</Head>
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
            {!loading && ads.length === 0 ? (
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
              <>
                <AdList
                  user={user}
                  ads={ads}
                  attributes={attributes}
                  total={total}
                />
                {loading && (
                  <div className="loading-more">
                    {[...Array(3)].map((_, index) => (
                      <AdSkeleton key={index} />
                    ))}
                  </div>
                )}
                {currentPage < totalPages && (
                  <div
                    ref={loadMoreTriggerRef}
                    style={{ height: "20px", visibility: "visible" }}
                  />
                )}
              </>
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
