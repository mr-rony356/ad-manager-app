import React, { useState, useEffect } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import Ad from "@components/home/Ad";
import ApiController from "@utils/API";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale }) {
  const api = new ApiController();
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);

  if (!user || user.err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const initialData = await api.fetchAdsByMe(auth.token, 1, "active");

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user: {
        ...user,
        _id: user._id.toString(),
      },
      initialAds: initialData.ads,
      attributes: attributes || {},
      initialTotalCounts: initialData.totalCounts,
      initialTotalPages: initialData.totalPages,
    },
  };
}

const AdManager = ({
  user,
  attributes,
  initialAds,
  initialTotalCounts,
  initialTotalPages,
}) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("active");
  const [activeAdId, setActiveAdId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Separate pagination state for each status
  const [paginationState, setPaginationState] = useState({
    active: { page: 1, totalPages: initialTotalPages },
    pending: { page: 1, totalPages: 1 },
    inactive: { page: 1, totalPages: 1 },
    expired: { page: 1, totalPages: 1 },
  });

  const [ads, setAds] = useState(initialAds);
  const [totalCounts, setTotalCounts] = useState(initialTotalCounts);

  const api = new ApiController();

  const toggleModal = (adId) => {
    setActiveAdId((prev) => (prev === adId ? null : adId));
  };

  const fetchAds = async (status, page) => {
    setLoading(true);
    try {
      const response = await api.fetchAdsByMe(null, page, status);
      setAds(response.ads);
      setTotalCounts(response.totalCounts);
      setPaginationState((prev) => ({
        ...prev,
        [status]: {
          page: response.currentPage,
          totalPages: response.totalPages,
        },
      }));
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
    setLoading(false);
  };

  const handlePageChange = async (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPaginationState((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], page: newPage },
    }));
    await fetchAds(activeTab, newPage);
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    await fetchAds(tab, paginationState[tab].page);
  };

  const currentPagination = paginationState[activeTab];

  return (
    <>
      <Head>
        <title>OnlyFriend</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Onlyfriend" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="page">
        <h1 className="adminPage__activeUser">Hallo {user.name}</h1>
        <div className="adminPage__content">
          <AdminLinks user={user} />
          <div className="adminPage__contentComponents">
            <div className="adminCardNavigation">
              <h1 className="title manager--title">{t("adManager__title")}</h1>
              <div className="tabs">
                {Object.keys(paginationState).map((tab) => (
                  <label
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`tab ${activeTab === tab ? "active" : ""}`}
                  >
                    <div className="ad_tab_content">
                      <p className="ad_count">{totalCounts[tab]}</p>
                      <p className="ad_tab__title">
                        {t(
                          `adManager__filter${tab.charAt(0).toUpperCase() + tab.slice(1)}`,
                        )}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="offerList adManager--offerList">
              {loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : ads.length === 0 ? (
                <p>{t("adManager__noAds")}</p>
              ) : (
                <>
                  {ads.map((ad) => (
                    <Ad
                      key={ad._id}
                      user={user}
                      ad={ad}
                      attributes={attributes}
                      isAdmin={true}
                      isModalOpen={activeAdId === ad._id}
                      toggleModal={toggleModal}
                    />
                  ))}

                  <div className="pagination">
                    <button
                      onClick={() =>
                        handlePageChange(currentPagination.page - 1)
                      }
                      disabled={currentPagination.page === 1 || loading}
                      className="pagination__button"
                    >
                      {t("previous")}
                    </button>

                    <span className="pagination__info">
                      {t("page")} {currentPagination.page} {t("of")}{" "}
                      {currentPagination.totalPages}
                    </span>

                    <button
                      onClick={() =>
                        handlePageChange(currentPagination.page + 1)
                      }
                      disabled={
                        currentPagination.page ===
                          currentPagination.totalPages || loading
                      }
                      className="pagination__button"
                    >
                      {t("next")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #666;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
          padding: 1rem;
        }

        .pagination__button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination__button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination__button:hover:not(:disabled) {
          background: #f5f5f5;
        }

        .pagination__info {
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default AdManager;
