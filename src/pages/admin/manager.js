import React, { useState } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import Ad from "@components/home/Ad";
import ApiController from "@utils/API";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale }) {
  // Initialize the API helper class
  const api = new ApiController();
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Redirect the user if he is not authenticated
  if (!user || user.err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const ads = await api.fetchAdsByMe(auth.token, 30);
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      ads,
      attributes,
    },
  };
}

const AdManager = ({ user, attributes, ads }) => {
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState("active");

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
              <h1 className="title manager--title"> {t("adManager__title")}</h1>
              <div className="tabs">
                <label
                  id="active"
                  onClick={() => setActiveTab("active")}
                  className={activeTab === "active" ? "tab active" : "tab"}
                >
                  {t("adManager__filterActive")}
                </label>
                <label
                  onClick={() => setActiveTab("pending")}
                  className={activeTab === "pending" ? "tab active" : "tab"}
                  id="pending"
                >
                  {t("adManager__filterPending")}
                </label>
                <label
                  onClick={() => setActiveTab("inactive")}
                  className={activeTab === "inactive" ? "tab active" : "tab"}
                  id="inactive"
                >
                  {t("adManager__filterInactive")}
                </label>
                <label
                  onClick={() => setActiveTab("expired")}
                  className={activeTab === "expired" ? "tab active" : "tab"}
                  id="expired"
                >
                  {t("adManager__filterExpired")}
                </label>
              </div>
            </div>
            <div className="offerList adManager--offerList">
              {ads && ads.length === 0 ? (
                <p>{t("adManager__noAds")}</p>
              ) : (
                ads &&
                ads.length > 0 &&
                ads
                  .filter((ad) => {
                    switch (activeTab) {
                      case "expired":
                        return ad.endDate < Date.now();
                      case "inactive":
                        return ad.active === false && ad.endDate >= Date.now();
                      case "pending":
                        return !ad.endDate;
                      case "active":
                        return ad.endDate >= Date.now();
                      default:
                        return null;
                    }
                  })
                  .map((ad) => (
                    <Ad
                      user={user}
                      key={ad._id}
                      ad={ad}
                      attributes={attributes}
                      isAdmin={true}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdManager;
