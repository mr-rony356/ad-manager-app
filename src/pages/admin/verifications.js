import React from "react";
import Verification from "@components/admin/Verification";
import { useApi } from "@contexts/APIContext";
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
  const ads = await api.fetchPendingAds(auth.token);
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      attributes,
      ads,
    },
  };
}

const Verifications = ({ user, attributes, ads }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();

  const handleVerify = (id) => {
    api.verifyAd(id);
  };

  const handleDelete = (id) => {
    api.deleteAd(id);
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

      <div className="verifications page">
        <h1 className="title favorites--title">
          {t("admin__verificationsTitle")}
        </h1>
        {ads && ads.length > 0 ? (
          ads
            .sort((a, b) =>
              new Date(a.startDate ? a.startDate : a.startDate) >
              new Date(b.startDate ? b.startDate : b.startDate)
                ? 1
                : -1,
            )
            .map((ad) => (
              <Verification
                handleDelete={handleDelete}
                handleVerify={handleVerify}
                key={ad._id + ad.verificationCode}
                id={ad._id}
                user={user}
                ad={ad}
              />
            ))
        ) : (
          <p className="ads__placeholderText">
            Momentan gibt es keine zu verifizieren
          </p>
        )}
      </div>
    </>
  );
};

export default Verifications;
