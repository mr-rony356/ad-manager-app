import React, { useState, useEffect, useRef } from "react";
import { Slider, Textfield } from "@components/tags/Inputs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import FilterPopover from "@components/forms/FilterPopover";

const FilterForm = (props) => {
  const { t } = useTranslation("common");
  const { filters, setFilters, attributes } = props;
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showText, setShowText] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openFilter, setOpenFilter] = useState(null); // 'regions' | 'tags' | 'offers' | null
  const [showDistanceSlider, setShowDistanceSlider] = useState(false);
  const [distance, setDistance] = useState(1); // Distance in km (1-25)
  const [expandedSections, setExpandedSections] = useState({
    regions: false,
    tags: false,
    offers: false,
  });

  const regionsBtnRef = useRef(null);
  const tagsBtnRef = useRef(null);
  const offersBtnRef = useRef(null);
  const distanceBtnRef = useRef(null);
  const [pendingRegions, setPendingRegions] = useState([]);
  const [pendingTags, setPendingTags] = useState([]);
  const [pendingOffers, setPendingOffers] = useState([]);

  // Handle resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 570);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle scroll for text fade effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setShowText(false);
      } else {
        setShowText(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateFilters = (property, value) => {
    setFilters({
      ...filters,
      [property]: value,
    });
  };

  const doFilter = (event) => {
    event.preventDefault();

    const encodeFilterValue = (value) => {
      return encodeURIComponent(
        value
          .replace(/[\s_-]+/g, "-")
          .replace(/\//g, "-")
          .replace(/&/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, ""),
      );
    };

    let params = "";

    if (filters.regions?.length > 0) {
      params +=
        "/region/" +
        filters.regions
          .map((region) =>
            encodeFilterValue(
              region +
                "-" +
                attributes.find((attribute) => attribute.name === "regions")
                  .values[region],
            ),
          )
          .join(",");
    }

    if (filters.tags?.length > 0) {
      params +=
        "/tag/" +
        filters.tags
          .map((tag) =>
            encodeFilterValue(
              tag +
                "-" +
                attributes.find((attribute) => attribute.name === "tags")
                  .values[tag],
            ),
          )
          .join(",");
    }

    if (filters.offers?.length > 0) {
      params +=
        "/offer/" +
        filters.offers
          .map((offer) =>
            encodeFilterValue(
              offer +
                "-" +
                attributes.find((attribute) => attribute.name === "offers")
                  .values[offer],
            ),
          )
          .join(",");
    }

    if (filters.search) {
      params += "/search/" + encodeFilterValue(filters.search);
    }

    if (filters.verified) {
      params += "/feature/" + filters.verified;
    }

    router.push(params.length > 0 ? "/filter" + params : "/");
    setShowForm(false);
  };

  const regionOptions =
    attributes
      ?.find((a) => a.name === "regions")
      ?.values?.map((v, i) => ({ value: i, label: v })) || [];
  const tagOptions =
    attributes
      ?.find((a) => a.name === "tags")
      ?.values?.map((v, i) => ({ value: i, label: v })) || [];
  const offerOptions =
    attributes
      ?.find((a) => a.name === "offers")
      ?.values?.map((v, i) => ({ value: i, label: v })) || [];

  // initialize pending selections when a popover opens
  useEffect(() => {
    if (openFilter === "regions") setPendingRegions(filters.regions || []);
    if (openFilter === "tags") setPendingTags(filters.tags || []);
    if (openFilter === "offers") setPendingOffers(filters.offers || []);
  }, [openFilter]);

  // Handle click outside for distance slider
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDistanceSlider &&
        distanceBtnRef.current &&
        !distanceBtnRef.current.contains(event.target) &&
        !event.target.closest(".distance-slider-popover")
      ) {
        setShowDistanceSlider(false);
      }
    };

    if (showDistanceSlider) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDistanceSlider]);

  const togglePending = (key, value) => {
    const toggle = (arr) =>
      arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    if (key === "regions") setPendingRegions((prev) => toggle(prev));
    if (key === "tags") setPendingTags((prev) => toggle(prev));
    if (key === "offers") setPendingOffers((prev) => toggle(prev));
  };

  const arraysEqual = (a = [], b = []) =>
    a.length === b.length && a.every((v) => b.includes(v));

  // Handle distance slider change
  const handleDistanceChange = (value) => {
    setDistance(value);
    // Static backend log for now
    console.log("Distance selected:", value, "km");
  };

  // Distance markers: 1km, 5km, 10km, 15km, 20km, 25km
  const distanceMarkers = [1, 5, 10, 15, 20, 25];

  const applyAndNavigate = (updated) => {
    const encodeFilterValue = (value) =>
      encodeURIComponent(
        value
          .replace(/[\s_-]+/g, "-")
          .replace(/\//g, "-")
          .replace(/&/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, ""),
      );

    let params = "";
    if (updated.regions?.length > 0) {
      params +=
        "/region/" +
        updated.regions
          .map((region) =>
            encodeFilterValue(
              region +
                "-" +
                attributes.find((attribute) => attribute.name === "regions")
                  .values[region],
            ),
          )
          .join(",");
    }
    if (updated.tags?.length > 0) {
      params +=
        "/tag/" +
        updated.tags
          .map((tag) =>
            encodeFilterValue(
              tag +
                "-" +
                attributes.find((attribute) => attribute.name === "tags")
                  .values[tag],
            ),
          )
          .join(",");
    }
    if (updated.offers?.length > 0) {
      params +=
        "/offer/" +
        updated.offers
          .map((offer) =>
            encodeFilterValue(
              offer +
                "-" +
                attributes.find((attribute) => attribute.name === "offers")
                  .values[offer],
            ),
          )
          .join(",");
    }
    if (updated.search) {
      params += "/search/" + encodeFilterValue(updated.search);
    }
    if (updated.verified) {
      params += "/feature/" + updated.verified;
    }
    router.push(params.length > 0 ? "/filter" + params : "/");
  };

  return (
    <>
      {isMobile ? (
        // Mobile View
        <div className="fixed top-40 z-50 flex justify-end w-[98%]">
          <div
            className={`bg-sky-400 rounded-full p-4 px-6 shadow-lg cursor-pointer transition-all duration-300 ease-in-out ${showText ? "w-[98%]" : "w-[72px]"}`}
            onClick={() => setShowForm((prev) => !prev)}
          >
            <div className="flex items-center justify-between w-full">
              <p
                className={`text-white font-semibold mr-2 whitespace-nowrap overflow-hidden transition-all duration-200 ease-in-out w-full !text-lg ${
                  showText
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 max-w-0 translate-x-16"
                }`}
              >
                {t("filterForm__filterButton")}
              </p>
              <Image
                src="/assets/sliders.png"
                width={100}
                height={100}
                alt="filter"
                className="filter-icon-slider"
                priority
              />
            </div>
          </div>

          {/* Mobile Filter Form */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-[99999] flex items-center justify-center w-full h-full">
              <div className="bg-white rounded-lg p-4 w-full h-screen overflow-y-auto flex flex-col gap-7 items-center justify-center">
                <div className="bg-gray-800 fixed top-0 w-full flex justify-center p-4  py-6 items-center ">
                  <button className="text-white hover:text-gray-700 text-lg">
                    Filter
                  </button>
                </div>
                {/* Distance Search Section */}
                <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm px-4">
                  <button
                    type="button"
                    ref={distanceBtnRef}
                    onClick={() => {
                      setOpenFilter(null);
                      setShowDistanceSlider((prev) => !prev);
                    }}
                    className="w-full flex items-center justify-between py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-base font-semibold text-gray-800">
                      « In meiner Nähe suchen »
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 text-gray-600 transition-transform ${
                        showDistanceSlider ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {showDistanceSlider && (
                    <div className="distance-slider-popover pb-4 pt-3">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Radius: {distance} km
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="1"
                            max="25"
                            value={distance}
                            onChange={(e) =>
                              handleDistanceChange(Number(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((distance - 1) / 24) * 100}%, #e5e7eb ${((distance - 1) / 24) * 100}%, #e5e7eb 100%)`,
                            }}
                          />
                          {/* Distance markers */}
                          <div className="flex justify-between mt-3 text-xs text-gray-600">
                            {distanceMarkers.map((marker) => (
                              <span
                                key={marker}
                                className={`${
                                  distance >= marker
                                    ? "font-semibold text-sky-600"
                                    : ""
                                }`}
                              >
                                {marker}km
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form className="space-y-4 w-full px-4" onSubmit={doFilter}>
                  {/* Regions Selection Boxes */}
                  <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          regions: !prev.regions,
                        }))
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-800">
                          Region
                        </span>
                        {filters.regions?.length > 0 && (
                          <span className="px-2 py-0.5 bg-sky-400 text-white text-xs font-medium rounded-full">
                            {filters.regions.length}
                          </span>
                        )}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                          expandedSections.regions ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {expandedSections.regions && (
                      <div className="p-4 pt-3">
                        <div className="flex flex-wrap gap-2.5">
                          {regionOptions.map((option) => {
                            const isSelected = filters.regions?.includes(
                              option.value,
                            );
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  const currentRegions = filters.regions || [];
                                  const newRegions = isSelected
                                    ? currentRegions.filter(
                                        (r) => r !== option.value,
                                      )
                                    : [...currentRegions, option.value];
                                  updateFilters("regions", newRegions);
                                }}
                                className={`px-3.5 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "bg-sky-400 text-white border-sky-500 font-semibold shadow-sm"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags Selection Boxes */}
                  <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          tags: !prev.tags,
                        }))
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-800">
                          {t("rubricInput")}
                        </span>
                        {filters.tags?.length > 0 && (
                          <span className="px-2 py-0.5 bg-sky-400 text-white text-xs font-medium rounded-full">
                            {filters.tags.length}
                          </span>
                        )}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                          expandedSections.tags ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {expandedSections.tags && (
                      <div className="p-4 pt-3">
                        <div className="flex flex-wrap gap-2.5">
                          {tagOptions.map((option) => {
                            const isSelected = filters.tags?.includes(
                              option.value,
                            );
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  const currentTags = filters.tags || [];
                                  const newTags = isSelected
                                    ? currentTags.filter(
                                        (t) => t !== option.value,
                                      )
                                    : [...currentTags, option.value];
                                  updateFilters("tags", newTags);
                                }}
                                className={`px-3.5 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "bg-sky-400 text-white border-sky-500 font-semibold shadow-sm"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Offers Selection Boxes */}
                  <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          offers: !prev.offers,
                        }))
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-gray-800">
                          {t("offerInput")}
                        </span>
                        {filters.offers?.length > 0 && (
                          <span className="px-2 py-0.5 bg-sky-400 text-white text-xs font-medium rounded-full">
                            {filters.offers.length}
                          </span>
                        )}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 text-gray-600 transition-transform ${
                          expandedSections.offers ? "rotate-180" : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {expandedSections.offers && (
                      <div className="p-4 pt-3">
                        <div className="flex flex-wrap gap-2.5">
                          {offerOptions.map((option) => {
                            const isSelected = filters.offers?.includes(
                              option.value,
                            );
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  const currentOffers = filters.offers || [];
                                  const newOffers = isSelected
                                    ? currentOffers.filter(
                                        (o) => o !== option.value,
                                      )
                                    : [...currentOffers, option.value];
                                  updateFilters("offers", newOffers);
                                }}
                                className={`px-3.5 py-2 text-sm rounded-lg border-2 transition-all duration-200 ${
                                  isSelected
                                    ? "bg-sky-400 text-white border-sky-500 font-semibold shadow-sm"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Field */}
                  <div className="mb-4 px-4">
                    <Textfield
                      id="tf-1-1"
                      name="tf-1-1"
                      value={filters.search}
                      onChange={(event) =>
                        updateFilters("search", event.target.value)
                      }
                      placeholder={t("searchInput")}
                      className="w-full"
                    />
                  </div>

                  {/* Verified Slider */}
                  <div className="mb-4 px-4">
                    <Slider
                      id="sl-1-1"
                      name="sl-1-1"
                      value={filters.verified !== false}
                      tag="Nur verifizierte Angebote"
                      onChange={(event) =>
                        updateFilters("verified", !!event.target.checked)
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-400 text-white py-2 rounded-md hover:bg-sky-500 transition-colors"
                  >
                    {t("filterForm__filterButton")}
                  </button>
                </form>
                <div
                  className="bg-black fixed bottom-0 w-full flex justify-center p-4  py-6 items-center "
                  onClick={() => setShowForm(false)}
                >
                  <button className="text-white hover:text-gray-700 text-lg">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Desktop View - Keeping the original layout
        <form
          className="flex flex-col items-center w-full justify-center gap-6 "
          onSubmit={doFilter}
        >
          <div className="w-full relative flex flex-col items-center justify-center">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <button
                type="button"
                ref={regionsBtnRef}
                onClick={() => {
                  setShowDistanceSlider(false);
                  setOpenFilter((prev) =>
                    prev === "regions" ? null : "regions",
                  );
                }}
                className="lg:min-w-[200px] flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-white text-gray-800"
              >
                <span>Region</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${openFilter === "regions" ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                ref={tagsBtnRef}
                onClick={() => {
                  setShowDistanceSlider(false);
                  setOpenFilter((prev) => (prev === "tags" ? null : "tags"));
                }}
                className="lg:min-w-[200px] flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-white text-gray-800"
              >
                <span>{t("rubricInput")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${openFilter === "tags" ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                type="button"
                ref={offersBtnRef}
                onClick={() => {
                  setShowDistanceSlider(false);
                  setOpenFilter((prev) =>
                    prev === "offers" ? null : "offers",
                  );
                }}
                className="lg:min-w-[200px] flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-white text-gray-800"
              >
                <span>{t("offerInput")}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${openFilter === "offers" ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <Textfield
                id="tf-1-1"
                name="tf-1-1"
                value={filters.search}
                onChange={(event) =>
                  updateFilters("search", event.target.value)
                }
                placeholder={t("searchInput")}
                className="w-full lg:w-auto lg:min-w-[300px] border rounded-md px-3"
              />

              {/* Distance Search Button */}
              <div className="relative">
                <button
                  type="button"
                  ref={distanceBtnRef}
                  onClick={() => {
                    setOpenFilter(null);
                    setShowDistanceSlider((prev) => !prev);
                  }}
                  className="lg:min-w-[200px] flex items-center justify-between gap-2 px-3 py-2 rounded-md border bg-white text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <span>« In meiner Nähe suchen »</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${showDistanceSlider ? "rotate-180" : "rotate-0"}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Distance Slider Popover */}
                {showDistanceSlider && (
                  <div className="distance-slider-popover absolute left-0 right-0 top-[54px] z-[1000] bg-white rounded-md shadow-xl border border-gray-200">
                    <div className="p-4 py-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Radius: {distance} km
                        </label>
                        <div className="relative">
                          <input
                            type="range"
                            min="1"
                            max="25"
                            value={distance}
                            onChange={(e) =>
                              handleDistanceChange(Number(e.target.value))
                            }
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                            style={{
                              background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${((distance - 1) / 24) * 100}%, #e5e7eb ${((distance - 1) / 24) * 100}%, #e5e7eb 100%)`,
                            }}
                          />
                          {/* Distance markers */}
                          <div className="flex justify-between mt-3 text-xs text-gray-600">
                            {distanceMarkers.map((marker) => (
                              <span
                                key={marker}
                                className={`${
                                  distance >= marker
                                    ? "font-semibold text-sky-600"
                                    : ""
                                }`}
                              >
                                {marker}km
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end px-4 py-3 border-t bg-white rounded-b-md">
                      <button
                        type="button"
                        onClick={() => setShowDistanceSlider(false)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md"
                      >
                        {t("close")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <FilterPopover
              anchorRef={regionsBtnRef}
              isOpen={openFilter === "regions"}
              title={"In meiner Nähe (15km)"}
              options={regionOptions}
              selectedValues={pendingRegions}
              onToggle={(v) => togglePending("regions", v)}
              onReset={() => setPendingRegions([])}
              onClose={() => setOpenFilter(null)}
              applyVisible={!arraysEqual(pendingRegions, filters.regions || [])}
              onApply={() => {
                const updated = { ...filters, regions: pendingRegions };
                updateFilters("regions", pendingRegions);
                setOpenFilter(null);
                applyAndNavigate(updated);
              }}
            />
            <FilterPopover
              anchorRef={tagsBtnRef}
              isOpen={openFilter === "tags"}
              title={null}
              options={tagOptions}
              selectedValues={pendingTags}
              onToggle={(v) => togglePending("tags", v)}
              onReset={() => setPendingTags([])}
              onClose={() => setOpenFilter(null)}
              applyVisible={!arraysEqual(pendingTags, filters.tags || [])}
              onApply={() => {
                const updated = { ...filters, tags: pendingTags };
                updateFilters("tags", pendingTags);
                setOpenFilter(null);
                applyAndNavigate(updated);
              }}
            />
            <FilterPopover
              anchorRef={offersBtnRef}
              isOpen={openFilter === "offers"}
              title={null}
              options={offerOptions}
              selectedValues={pendingOffers}
              onToggle={(v) => togglePending("offers", v)}
              onReset={() => setPendingOffers([])}
              onClose={() => setOpenFilter(null)}
              applyVisible={!arraysEqual(pendingOffers, filters.offers || [])}
              onApply={() => {
                const updated = { ...filters, offers: pendingOffers };
                updateFilters("offers", pendingOffers);
                setOpenFilter(null);
                applyAndNavigate(updated);
              }}
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <Slider
              id="sl-1-1"
              name="sl-1-1"
              value={filters.verified !== false}
              tag="Nur verifizierte Angebote"
              onChange={(event) => {
                updateFilters("verified", !!event.target.checked);
              }}
              className="lg:ml-4"
            />
            <button
              type="submit"
              className="button-apply filter--butto text-white px-6 py-2 rounded-md shadow-md transition-all"
            >
              {t("filterForm__filterButton")}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default FilterForm;
