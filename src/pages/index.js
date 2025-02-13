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
import Pagination from "@components/home/Pagination";

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
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
    api.checkAuth(JSON.parse(req.cookies.Auth || "{}")?.token),
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
  const adsPerPage = 26;

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
      const newQuery = { ...router.query, page: pageNumber };

      router.push({ pathname: router.pathname, query: newQuery }, undefined, {
        shallow: true,
      });

      // Scroll to top with slight delay
      window.scrollTo({ top: 300, left: 0, behavior: "auto" });

      // Fetch ads after a short delay to ensure smooth experience
      setTimeout(() => {
        fetchAds(activeType, pageNumber);
        setSkipRestore(false); // Reset the flag after the action is completed
      }, 300);
    },

    [router],
  );
  return (
    <>
      <Head>
        <title>
          Find erotic ads and sex meetings in Switzerland | Onlyfriend.ch
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
        <link
          rel="icon"
          href=" https://onlyfriend.ch/favicon.png"
          type="image/x-icon"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <div className="page page--home">
        <h1 className="home__title font-bold text-[32px]">
          {t("home__title", { region: "Schweiz" })}
        </h1>
        <FilterForm
          filters={filters}
          setFilters={setFilters}
          attributes={attributes}
        />
        <div className="">
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
            {/* <Image
                src="/assets/filter.png"
                width={500}
                height={500}
                alt="filter"
                className="filter"
                priority
              /> */}
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
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / adsPerPage)}
          onPageChange={paginate}
        />{" "}
        <div className="seo-content">
          <section className="seo-section">
            <h2 className="text-2xl font-bold mb-4">
              Sextreffen in der Schweiz: Die besten Sexinserate und Kontakte auf
              onlyfriend.ch
            </h2>
            <p className="mb-6">
              Du möchtest aufregende Sextreffen in der Schweiz erleben? Auf
              <strong> onlyfriend.ch</strong> findest du die besten Sexkontakte
              und Erotikanzeigen für jeden Geschmack. Egal, welche Wünsche,
              Fantasien oder Neigungen du ausleben möchtest – bei uns gibt es
              für alle etwas Passendes! Wähle aus verschiedenen Kategorien,
              entdecke private Sexkontakte und erlebe sinnliche Abenteuer.
            </p>
          </section>

          <section className="seo-section">
            <h2 className="text-2xl font-bold mb-4">
              onlyfriend.ch – Dein Erotikportal für diskrete Sextreffen und
              heisse Kontakte
            </h2>
            <p className="mb-6">
              <strong>onlyfriend.ch</strong> ist dein Schweizer Erotikportal für
              unverbindliche Sextreffen, diskrete Sexkontakte und aufregende
              Inserate. Unsere Plattform bietet dir eine grosse Auswahl an
              Angeboten – von privaten Erotikanzeigen bis hin zu exklusiven
              Verlinkungen zu deinem Lieblings-<strong>OnlyFans</strong>
              -Account. Mit uns kannst du schnell und einfach heisse Begegnungen
              arrangieren, die genau deinen Vorlieben entsprechen.
            </p>
            <p className="mb-6">
              Um höchste Qualität zu gewährleisten, überprüft unser Team jedes
              Inserat auf Echtheit und Verifizierung, damit du dich auf eine
              sichere und seriöse Plattform verlassen kannst.
            </p>
          </section>

          <section className="seo-section">
            <h2 className="text-2xl font-bold mb-4">
              Vielfältige Sexinserate für jeden Geschmack
            </h2>
            <p className="mb-4">
              Ob Escort-Service, erotische Massagen, Casual-Dates oder
              aufregende Fetisch-Abenteuer – bei onlyfriend.ch findest du alles,
              was das Herz begehrt. Hier sind einige Highlights unseres
              Angebots:
            </p>
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-center">
                <span className="font-bold mr-2">Escort-Service:</span>
                Finde diskrete Begleitungen in Städten wie Zürich
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">Erotik-Massagen:</span>
                Entspanne dich bei sinnlichen Massagen in deiner Nähe
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">OnlyFans-Verlinkungen:</span>
                Entdecke exklusive Inhalte von frei arbeitenden Frauen
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">Sextreffen & Abenteuer:</span>
                Plane aufregende Begegnungen in der ganzen Schweiz
              </li>
              <li className="flex items-center">
                <span className="font-bold mr-2">Fetisch & BDSM:</span>
                Tauche ein in eine Welt voller Fantasien und spezieller
                Vorlieben
              </li>
            </ul>
          </section>

          <section className="seo-section">
            <h2 className="text-2xl font-bold mb-4">
              Für jeden das passende Abenteuer
            </h2>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Für Ihn</h3>
              <p>
                Suchst du nach aufregendem Privatsex mit scharfen Girls, heißen
                MILFs oder erfahrenen Frauen? Möchtest du deine Fantasien bei
                Gangbangs, Gruppensex oder Fetisch-Treffen ausleben? Bei
                onlyfriend.ch findest du Frauen, die dir all das und mehr
                ermöglichen.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Für Sie</h3>
              <p>
                Du wünschst dir einen starken, dominanten Mann mit Ausstrahlung?
                Ob sinnliche Dates, leidenschaftliche Abenteuer oder wilder Sex
                – auf onlyfriend.ch findest du garantiert den richtigen Partner,
                der deine Wünsche wahr werden lässt.
              </p>
            </div>
          </section>

          <section className="seo-section">
            <h2 className="text-2xl font-bold mb-4">
              Warum Onlyfriend.ch für erotische Kontakte?
            </h2>
            <p className="mb-4">
              Onlyfriend.ch bietet Ihnen eine Plattform, die auf Diskretion und
              Sicherheit ausgelegt ist. Treffen Sie attraktive Kontakte ohne
              komplizierte Anmeldung. Unsere geprüften Anzeigen sorgen für ein
              hochwertiges Nutzererlebnis.
            </p>
            <h3 className="text-xl font-bold mb-2">Entdecken Sie:</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Erotische Massagen in Zürich und Genf</li>
              <li>Escort-Services für jeden Anlass</li>
              <li>Swinger- und Fetisch-Kontakte in Ihrer Region</li>
            </ul>
            <h3 className="text-xl font-bold mb-2">
              Sextreffen leicht gemacht – So funktioniert's
            </h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                <strong>Stöbern Sie durch unsere Kategorien:</strong> Wählen Sie
                aus einer Vielzahl von Anzeigen, die nach Ihren Vorlieben und
                Ihrem Standort sortiert sind.
              </li>
              <li>
                <strong>Kontakt aufnehmen – direkt und diskret:</strong> Ohne
                Anmeldung können Sie direkt über unsere Plattform mit den
                Anbietern in Kontakt treten.
              </li>
              <li>
                <strong>Treffen Sie Ihre Wahl:</strong> Entscheiden Sie sich für
                ein Treffen oder eine Interaktion Ihrer Wahl.
              </li>
              <li>
                <strong>Erleben Sie prickelnde Abenteuer:</strong> Genießen Sie
                Ihre Erfahrung mit einer Person, die Ihre Wünsche teilt.
              </li>
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}

export default HomePage;
