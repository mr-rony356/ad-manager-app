import React from "react";
import { Slider, Textfield } from "@components/tags/Inputs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Select from "react-select";

const FilterForm = (props) => {
  const { t } = useTranslation("common");
  const { filters, setFilters, attributes } = props;
  const router = useRouter();

  const updateFilters = (property, value) => {
    // Update the state of the filters
    setFilters({
      ...filters,
      [property]: value,
    });
  };

  const doFilter = (event) => {
    event.preventDefault();

    // Construct the filtered URL
    let params = "";

    // Function to replace spaces, underscores, slashes, and '&' with hyphens, and ensure no extra hyphens
    const encodeFilterValue = (value) => {
      return encodeURIComponent(
        value
          .replace(/[\s_-]+/g, "-") // Replace spaces or underscores with hyphens
          .replace(/\//g, "-") // Replace slashes with hyphens
          .replace(/&/g, "-") // Replace '&' with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
          .replace(/^-+/, "") // Remove leading hyphen if any
          .replace(/-+$/, ""), // Remove trailing hyphen if any
      );
    };

    if (filters.regions && filters.regions.length > 0) {
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

    if (filters.tags && filters.tags.length > 0) {
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

    if (filters.offers && filters.offers.length > 0) {
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
      params += "/feature/" + encodeFilterValue(filters.verified);
    }

    // Update the URL with the filter parameters
    router.push(params.length > 0 ? "/filter" + params : "/");
  };

  return (
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
  );
};

export default FilterForm;
