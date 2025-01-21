import React, { useState } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import Ad from "@components/home/Ad";
import ApiController from "@utils/API";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale, query }) {
  const api = new ApiController();
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  const page = parseInt(query.page) || 1;

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

  // Fetch ads with proper error handling
  const adsResponse = await api.fetchAdsByMe(auth.token, page);

  // Ensure all fields are serializable
  const serializedAds = adsResponse.ads.map((ad) => ({
    ...ad,
    _id: ad._id.toString(), // Convert ObjectId to string if needed
    startDate: ad.startDate ? new Date(ad.startDate).getTime() : null,
    endDate: ad.endDate ? new Date(ad.endDate).getTime() : null,
    active: ad.active ?? true, // Use nullish coalescing for default value
    user: ad.user ? ad.user.toString() : null, // Convert ObjectId to string if needed
    // Add any other fields that need serialization
  }));

  // Ensure counts are numbers or zero
  const serializedCounts = {
    active: adsResponse.totalCounts?.active || 0,
    pending: adsResponse.totalCounts?.pending || 0,
    inactive: adsResponse.totalCounts?.inactive || 0,
    expired: adsResponse.totalCounts?.expired || 0,
  };

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user: {
        ...user,
        _id: user._id.toString(), // Convert ObjectId to string
        // Add other user fields that need serialization
      },
      ads: serializedAds,
      attributes: attributes || {},
      totalCounts: serializedCounts,
      currentPage: page,
      totalPages: adsResponse.totalPages || 1,
    },
  };
}
const AdManager = ({ user, attributes, ads, totalCounts, currentPage }) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("active");
  const [activeAdId, setActiveAdId] = useState(null);
  const ITEMS_PER_PAGE = 50;

  const tabFilters = {
    active: (ad) => ad.endDate >= Date.now() && ad.active,
    pending: (ad) => !ad.endDate,
    inactive: (ad) => ad.active === false && ad.endDate >= Date.now(),
    expired: (ad) => ad.endDate < Date.now(),
  };

  const toggleModal = (adId) => {
    setActiveAdId((prev) => (prev === adId ? null : adId));
  };

  const filteredAds = ads.filter(tabFilters[activeTab]);
  const totalPages = Math.ceil(totalCounts[activeTab] / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    window.location.href = `/admin/ads?page=${newPage}&tab=${activeTab}`;
  };

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
                {Object.keys(tabFilters).map((tab) => (
                  <label
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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
              {filteredAds.length === 0 ? (
                <p>{t("adManager__noAds")}</p>
              ) : (
                <>
                  {filteredAds.map((ad) => (
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
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination__button"
                    >
                      {t("previous")}
                    </button>

                    <span className="pagination__info">
                      {t("page")} {currentPage} {t("of")} {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
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
    </>
  );
};

export default AdManager;
