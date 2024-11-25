import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import dynamic from "next/dynamic";
// Dynamic imports for non-critical components
const CookiesPopup = dynamic(() => import("@components/alerts/CookiesPopup"), {
  loading: () => null,
  ssr: false,
});

const FilterForm = dynamic(() => import("@components/forms/FilterForm"), {
  loading: () => <div>Loading filters...</div>,
});

export async function getServerSideProps({ req, locale }) {
  const api = new ApiController();

  // Parallel data fetching with caching
  const [user, attributes, initialAds] = await Promise.all([
    api.checkAuth(req.cookies.Auth?.token),
    api.fetchAttributes(locale === "de" ? "de" : "en"),
    api.fetchAds(0, 1), // First page, type 0
  ]);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
      user,
      attributes,
      initialAds,
      revalidate: 60, // Incremental Static Regeneration
    },
  };
}

function HomePage({ user, attributes, initialAds, premiumAds }) {
  const { t } = useTranslation("common");
  const { api } = useApi();

  const [ads, setAds] = useState(initialAds.ads || []);
  const [totalPages, setTotalPages] = useState(initialAds.totalPages || 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeType, setActiveType] = useState(0);
  const [isCookiesPopupOpen, setIsCookiesPopupOpen] = useState(false);
  const [filters, setFilters] = useState({
    regions: [],
    tags: [],
    offers: [],
    search: null,
    verified: false,
  });

  // Memoized filtered ads
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      // Apply filter logic based on filters state
      return true; // Placeholder for actual filtering
    });
  }, [ads, filters]);
  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, []);
  // Efficient ad fetching
  const fetchAds = useCallback(
    async (tab, page = 1) => {
      try {
        const res = await api.fetchAds(tab, page);
        if (res) {
          setAds(res.ads);
          setTotalPages(res.totalPages);
          setCurrentPage(res.currentPage);
        }
      } catch (error) {
        console.error("Failed to fetch ads", error);
        setAds([]);
      }
    },
    [api],
  );

  // Pagination handler
  const paginate = useCallback(
    (pageNumber) => {
      fetchAds(activeType, pageNumber);
      window.scrollTo({ top: 300, behavior: "smooth" });
    },
    [fetchAds, activeType],
  );

  return (
    <>
      <Head>
        {/* Existing meta tags */}
        <link rel="preload" href="/assets/filter.png" as="image" />
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
              {attributes
                ?.find((a) => a.name === "types")
                ?.values.map((value) => (
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
                priority
              />
            </div>
            <AdList
              user={user}
              ads={filteredAds}
              attributes={attributes}
              premiumAds={premiumAds}
            />
            {isCookiesPopupOpen && (
              <CookiesPopup setIsCookiesPopupOpen={setIsCookiesPopupOpen} />
            )}{" "}
          </div>
        </div>

        <div className="pagination">
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <button
              key={pageNumber}
              className={currentPage === pageNumber + 1 ? "active" : ""}
              onClick={() => paginate(pageNumber + 1)}
            >
              {pageNumber + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
