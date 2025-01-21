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
  const { ads, totalCounts } = await api.fetchAdsByMe(auth.token, 50, 1);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      ads,
      totalCounts,
      attributes,
    },
  };
}

const AdManager = ({ user, attributes, ads: initialAds, totalCounts }) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("active");
  const [ads, setAds] = useState(initialAds);
  const [counts, setCounts] = useState(totalCounts);
  const [page, setPage] = useState(1);
  const [activeAdId, setActiveAdId] = useState(null);

  const api = new ApiController();

  const fetchAds = async (newPage) => {
    const { ads: newAds, totalCounts: updatedCounts } = await api.fetchAdsByMe(
      null,
      50,
      newPage,
    );
    setAds(newAds);
    setCounts(updatedCounts);
    setPage(newPage);
  };

  const toggleModal = (adId) => {
    setActiveAdId((prev) => (prev === adId ? null : adId));
  };

  const tabFilters = {
    active: (ad) => ad.endDate >= Date.now() && ad.active,
    pending: (ad) => !ad.endDate,
    inactive: (ad) => ad.active === false && ad.endDate >= Date.now(),
    expired: (ad) => ad.endDate < Date.now(),
  };

  useEffect(() => {
    if (ads.length === 0) fetchAds(1); // Ensure initial fetch
  }, []);

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
                      <p className="ad_count">{counts[tab] || 0}</p>
                      <p className="ad_tab__title">
                        {t(
                          `adManager__filter${
                            tab.charAt(0).toUpperCase() + tab.slice(1)
                          }`,
                        )}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="offerList adManager--offerList">
              {ads.length === 0 ? (
                <p>{t("adManager__noAds")}</p>
              ) : (
                ads
                  .filter(tabFilters[activeTab])
                  .map((ad) => (
                    <Ad
                      user={user}
                      key={ad._id}
                      ad={ad}
                      attributes={attributes}
                      isAdmin={true}
                      isModalOpen={activeAdId === ad._id}
                      toggleModal={toggleModal}
                    />
                  ))
              )}
            </div>

            <div className="pagination">
              <button onClick={() => fetchAds(page - 1)} disabled={page === 1}>
                {t("previous")}
              </button>
              <span>{page}</span>
              <button onClick={() => fetchAds(page + 1)}>{t("next")}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdManager;
