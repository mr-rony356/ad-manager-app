import React, { useState } from "react";
import Ad from "@components/home/Ad";
import PremiumAdCarousel from "@components/home/PremiumAdCarousel";
import { useTranslation } from "next-i18next";

const AdList = ({ ads, premiumAds, attributes, user, total }) => {
  const { t } = useTranslation();
  const [activeAdId, setActiveAdId] = useState(null);

  const toggleModal = (adId) => {
    setActiveAdId((prev) => (prev === adId ? null : adId));
  };
  return (
    <div className="ad__list w-full">
      <div className="home__adsHeader">
        <h4>
          {total} {t("ads_count")}
        </h4>
      </div>
      {premiumAds && premiumAds.length > 0 && (
        <PremiumAdCarousel ads={premiumAds} attributes={attributes} />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center">
        {ads
          // .slice()
          // .reverse()
          .map((ad) => (
            <Ad
              key={ad._id}
              user={user}
              ad={ad}
              attributes={attributes}
              isModalOpen={activeAdId === ad._id}
              toggleModal={toggleModal}
            />
          ))}
        {ads.length === 0 && (
          <p className="ads__placeholderText">{t("home__adPlaceholder")}</p>
        )}
      </div>
    </div>
  );
};

export default AdList;
