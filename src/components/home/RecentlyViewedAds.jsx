import React, { useEffect, useState } from "react";
import Link from "next/link";
import { API_ADDRESS } from "@utils/API";
import { useTranslation } from "react-i18next";

// Utility functions for localStorage management
const STORAGE_KEY = "recentlyViewedAds";
const MAX_RECENT_ADS = 4;

const getRecentAds = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

const saveRecentAd = (ad) => {
  try {
    let recentAds = getRecentAds();

    // Remove duplicate if exists
    recentAds = recentAds.filter((savedAd) => savedAd._id !== ad._id);

    // Add new ad to beginning
    recentAds.unshift({
      _id: ad._id,
      title: ad.title,
      images: ad.images,
      regions: ad.regions,
      startDate: ad.startDate,
      // Add other essential properties you want to track
    });

    // Keep only the most recent ads
    recentAds = recentAds.slice(0, MAX_RECENT_ADS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentAds));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// React component for Recently Viewed Ads
const RecentlyViewedAds = ({ attributes }) => {
  const [recentAds, setRecentAds] = useState([]);
  const { t } = useTranslation("common");

  useEffect(() => {
    setRecentAds(getRecentAds());
  }, []);

  if (recentAds.length === 0) {
    return null;
  }
  return (
    <div className="my-4 px-4 md:px-6">
      <h1 className="text-xl font-bold my-4">{t("recently_viewed")}</h1>
      <div className="flex items-center gap-4">
        {recentAds.map((ad) => (
          <Link
            key={ad._id}
            href={{
              pathname: `/ad/${ad._id}/${generateAdSlug(ad, attributes)}`,
            }}
            className="block hover:opacity-80 transition-opacity"
          >
            <div className="rounded-lg">
              {ad.images && ad.images.length > 0 && (
                <img
                  src={API_ADDRESS + ad.images[0]}
                  alt={ad.title}
                  className="h-[120px] md:h-[300px]  md:w-[200px] w-[150px] rounded-md object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Helper function to generate slug (reused from your existing code)
const generateAdSlug = (ad, attributes) => {
  const adSlugRegions = ad.regions
    ? ad.regions
        .map((region) => {
          const attributeObj = attributes
            ? attributes.find((attribute) => attribute.name === "regions")
            : null;
          return attributeObj ? attributeObj.values[region] : null;
        })
        .join("-")
        .toLowerCase()
        .replace(/ü/g, "u")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : null;

  const adSlug = ad.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${adSlugRegions ? adSlugRegions + "-" : ""}${adSlug}`;
};

export { RecentlyViewedAds, saveRecentAd };
