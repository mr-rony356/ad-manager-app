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
        {/* ... rest of your existing meta tags ... */}
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
      </div>
    </>
  );
}

export default HomePage;
