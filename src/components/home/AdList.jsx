import React from "react";
import Ad from "@components/home/Ad";
import PremiumAdCarousel from "@components/home/PremiumAdCarousel";
import { useTranslation } from "next-i18next";

const AdList = ({
  ads,
  premiumAds,
  attributes,
  user,
  totalAds,
  indexOfLastAd,
  indexOfFirstAd,
}) => {
  const { t } = useTranslation();

  return (
    <div className="ad__list">
      <div className="home__adsHeader">
        <h3>
          <span className="home__adsCount">
            {" "}
            {indexOfFirstAd + 1} - {indexOfLastAd}
          </span>{" "}
          out of {totalAds} {t("ads_count")}
        </h3>
      </div>
      {premiumAds && premiumAds.length > 0 && (
        <PremiumAdCarousel ads={premiumAds} attributes={attributes} />
      )}
      <div className="ads">
        {ads.map((ad) => (
          <Ad key={ad._id} user={user} ad={ad} attributes={attributes} />
        ))}
        {ads.length === 0 && (
          <p className="ads__placeholderText">{t("home__adPlaceholder")}</p>
        )}
      </div>
    </div>
  );
};

export default AdList;
