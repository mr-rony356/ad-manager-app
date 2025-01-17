import React, { useState } from "react";
import Verification from "@components/admin/Verification";
import ReviewVerification from "@components/admin/ReviewVerification";
import { Tab } from "@headlessui/react";
import { useApi } from "@contexts/APIContext";
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
  const ads = await api.fetchPendingAds(auth.token);
  const reviews = await api.getUserPendingReviews(user._id);
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
      user,
      attributes,
      ads,
      reviews,
    },
  };
}

const Verifications = ({
  user,
  attributes,
  ads: initialAds,
  reviews: initialReviews,
}) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [ads, setAds] = useState(initialAds);
  const [reviews, setReviews] = useState(initialReviews);

  const handleVerify = async (id) => {
    await api.verifyAd(id);
    setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
  };

  const handleDelete = async (id) => {
    await api.deleteAd(id);
    setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
  };

  const handleApproveReview = async (id) => {
    await api.updateReviewStatus(id, "approved");
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review._id !== id),
    );
  };

  const handleRejectReview = async (id) => {
    await api.updateReviewStatus(id, "rejected");
    setReviews((prevReviews) =>
      prevReviews.filter((review) => review._id !== id),
    );
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
        <Tab.Group>
          <Tab.List className="flex space-x-2">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded ${
                  selected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`
              }
            >
             Ads 
            </Tab>
            <Tab
              className={({ selected }) =>
                `px-4 py-2 rounded ${
                  selected
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`
              }
            >
             Reviews
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              {ads.length > 0 ? (
                ads
                  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                  .map((ad) => (
                    <Verification
                      key={ad._id}
                      id={ad._id}
                      ad={ad}
                      user={user}
                      handleDelete={handleDelete}
                      handleVerify={handleVerify}
                    />
                  ))
              ) : (
                <p className="ads__placeholderText">{t("no_verifications")}</p>
              )}
            </Tab.Panel>
            <Tab.Panel>
              <ReviewVerification
                reviews={reviews}
                handleApprove={handleApproveReview}
                handleReject={handleRejectReview}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default Verifications;
