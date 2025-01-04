import React, { useState, useEffect } from "react";
import { Slider, Textfield } from "@components/tags/Inputs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import Image from "next/image";

const FilterForm = (props) => {
  const { t } = useTranslation("common");
  const { filters, setFilters, attributes } = props;
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [showText, setShowText] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
      if (window.scrollY > 50) {
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
  };

  return (
    <>
      {isMobile ? (
        // Mobile View
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className="bg-sky-400 rounded-full p-3 shadow-lg cursor-pointer transition-all duration-300 ease-in-out"
            onClick={() => setShowForm((prev) => !prev)}
          >
            <div className="flex items-center">
              <p
                className={`text-white font-bold mr-2 transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
                  showText ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"
                }`}
              >
                {t("filterForm__filterButton")}
              </p>
              <Image
                src="/assets/sliders.png"
                width={24}
                height={24}
                alt="filter"
                className="filter-icon-slider"
                priority
              />
            </div>
          </div>

          {/* Mobile Filter Form */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-[99999] flex items-center justify-center w-full h-full">
              <div className="bg-white rounded-lg p-4 w-full h-screen overflow-y-auto flex !flex-col gap-7 items-center justify-center">
                <div className="bg-gray-800 fixed top-0 w-full flex justify-center p-4  py-6 items-center ">
                  <button className="text-white hover:text-gray-700 text-lg">
                    Filter
                  </button>
                </div>

                <form className="space-y-4 w-full" onSubmit={doFilter}>
                  <Select
                    id="dd-1-1"
                    className="mb-3"
                    value={filters.regions?.map((filter) => ({
                      value: filter,
                      label: attributes?.find(
                        (attribute) => attribute.name === "regions",
                      )?.values[filter],
                    }))}
                    onChange={(value) =>
                      updateFilters(
                        "regions",
                        value.map((v) => v.value),
                      )
                    }
                    placeholder="Region"
                    options={attributes
                      ?.find((attribute) => attribute.name === "regions")
                      ?.values.map((value, i) => ({ value: i, label: value }))}
                    isMulti
                  />

                  <Select
                    id="dd-1-2"
                    className="mb-3"
                    value={filters.tags?.map((filter) => ({
                      value: filter,
                      label: attributes?.find(
                        (attribute) => attribute.name === "tags",
                      )?.values[filter],
                    }))}
                    onChange={(value) =>
                      updateFilters(
                        "tags",
                        value.map((v) => v.value),
                      )
                    }
                    placeholder={t("rubricInput")}
                    options={attributes
                      ?.find((attribute) => attribute.name === "tags")
                      ?.values.map((value, i) => ({ value: i, label: value }))}
                    isMulti
                  />

                  <Select
                    id="dd-1-3"
                    className="mb-3"
                    value={filters.offers?.map((filter) => ({
                      value: filter,
                      label: attributes?.find(
                        (attribute) => attribute.name === "offers",
                      )?.values[filter],
                    }))}
                    onChange={(value) =>
                      updateFilters(
                        "offers",
                        value.map((v) => v.value),
                      )
                    }
                    placeholder={t("offerInput")}
                    options={attributes
                      ?.find((attribute) => attribute.name === "offers")
                      ?.values.map((value, i) => ({ value: i, label: value }))}
                    isMulti
                  />

                  <Textfield
                    id="tf-1-1"
                    name="tf-1-1"
                    value={filters.search}
                    onChange={(event) =>
                      updateFilters("search", event.target.value)
                    }
                    placeholder={t("searchInput")}
                    className="mb-3"
                  />

                  <Slider
                    id="sl-1-1"
                    name="sl-1-1"
                    value={filters.verified !== false}
                    tag="Nur verifizierte Angebote"
                    onChange={(event) =>
                      updateFilters("verified", !!event.target.checked)
                    }
                    className="mb-3"
                  />

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
        <form className="form form--filters" onSubmit={doFilter}>
          <Select
            id="dd-1-1"
            className="dd-1-1"
            value={
              filters.regions &&
              filters.regions.length > 0 &&
              filters.regions.map((filter) => {
                return {
                  value: filter,
                  label:
                    attributes &&
                    attributes.length > 0 &&
                    attributes.find((attribute) => attribute.name === "regions")
                      .values[filter],
                };
              })
            }
            onChange={(value) =>
              updateFilters(
                "regions",
                value.map((v) => v.value),
              )
            }
            placeholder="Region"
            options={
              attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "regions")
                ?.values.map((value, i) => ({ value: i, label: value }))
            }
            isMulti
          />
          <Select
            id="dd-1-2"
            className="dd-1-2"
            value={
              filters.tags &&
              filters.tags.length > 0 &&
              filters.tags.map((filter) => {
                return {
                  value: filter,
                  label:
                    attributes &&
                    attributes.length > 0 &&
                    attributes.find((attribute) => attribute.name === "tags")
                      .values[filter],
                };
              })
            }
            onChange={(value) =>
              updateFilters(
                "tags",
                value.map((v) => v.value),
              )
            }
            placeholder={t("rubricInput")}
            options={
              attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "tags")
                ?.values.map((value, i) => ({ value: i, label: value }))
            }
            isMulti
          />
          <Select
            id="dd-1-3"
            className="dd-1-3"
            value={
              filters.offers &&
              filters.offers.length > 0 &&
              filters.offers.map((filter) => {
                return {
                  value: filter,
                  label:
                    attributes &&
                    attributes.length > 0 &&
                    attributes.find((attribute) => attribute.name === "offers")
                      .values[filter],
                };
              })
            }
            onChange={(value) =>
              updateFilters(
                "offers",
                value.map((v) => v.value),
              )
            }
            placeholder={t("offerInput")}
            options={
              attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "offers")
                ?.values.map((value, i) => ({ value: i, label: value }))
            }
            isMulti
          />
          <Textfield
            id="tf-1-1"
            name="tf-1-1"
            value={filters.search}
            onChange={(event) => updateFilters("search", event.target.value)}
            placeholder={t("searchInput")}
          />
          <Slider
            id="sl-1-1"
            name="sl-1-1"
            value={filters.verified !== false}
            tag="Nur verifizierte Angebote"
            onChange={(event) => {
              updateFilters("verified", !!event.target.checked);
            }}
          />

          <button type="submit" className="button filter--button">
            {t("filterForm__filterButton")}
          </button>
        </form>
      )}
    </>
  );
};

export default FilterForm;
