import React, { useEffect } from "react";
import { Checkbox, Radio } from "@components/tags/Inputs";
import { useTranslation } from "next-i18next";
import Select from "react-select";

const AdForm1 = (props) => {
  const { t, i18n } = useTranslation("common");
  const { setBody, ad, attributes, updateProperty, editMode, type } = props;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateForm = (event) => {
    event.preventDefault();

    // If the type is free, set the credit amount to 0
    if (type === "free") {
      updateProperty("credits", -1, 0);
    }
    console.log(event);
    setBody(2);
  };

  return (
    <form className="form form--ad" onSubmit={validateForm}>
      {!editMode && (
        <div className="form__sections">
          <div className="form__sectionDescription">
            <h2 className="form__section-title">{t("adForm1__title-left")}</h2>
          </div>
          <div className="form__sectionPart">
            {attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "durations")
                .values.map((value, i) => (
                  <Radio
                    key={i}
                    id={"rb-1-" + i}
                    name="rb-1"
                    checked={ad.duration === i}
                    onChange={() => updateProperty("duration", -1, i)}
                    label={
                      <>
                        <p className="radio__title">
                          {value.duration > 1
                            ? value.duration + " " + t("adForm1__days")
                            : value.duration + " " + t("adForm1__day")}
                        </p>
                        <p>
                          {type === "free"
                            ? t("FreeButton")
                            : `${value.credits} ${t("adForm1__credits")}`}
                        </p>
                      </>
                    }
                    required={true}
                  />
                ))}
          </div>
        </div>
      )}

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm1__title-right")}</h2>
          <p>{t("adForm1__textType")}</p>
        </div>

        <div className="form__sectionPart">
          {attributes &&
            attributes.length > 0 &&
            attributes
              .find((attribute) => attribute.name === "types")
              .values.map((value, i) => (
                <Radio
                  key={i}
                  id={"rb-2-" + i}
                  name="rb-2"
                  checked={ad.type === i}
                  onChange={() => updateProperty("type", -1, i)}
                  label={<p>{value.name}</p>}
                  required={true}
                />
              ))}
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm1__titleRubric")}</h2>
          <p>{t("adForm1__textRubric")}</p>
        </div>

        <div className="form__sectionPart">
          {attributes &&
            attributes.length > 0 &&
            attributes
              .find((attribute) => attribute.name === "tags")
              ?.values?.map((value, i) => (
                <Checkbox
                  key={i}
                  id={"cb-1-" + i}
                  name={"cb-1-" + i}
                  value={i}
                  checked={ad.tags.includes(i)}
                  onChange={(event) =>
                    updateProperty("tags", i, +event.target.value)
                  }
                  label={value}
                />
              ))}
        </div>
      </div>

      {ad.type === 0 && (
        <div className="form__sections">
          <div className="form__sectionDescription">
            <h2 className="form__section-title">{t("adForm1__titleRegion")}</h2>
            <p>{t("adForm1__textRegion")}</p>
          </div>

          <div className="form__sectionPart">
            {attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "regions")
                ?.values.map((value, i) => (
                  <Checkbox
                    key={i}
                    id={"cb-2-" + i}
                    name={"cb-2-" + i}
                    value={i}
                    checked={ad.regions.includes(i)}
                    onChange={(event) =>
                      updateProperty("regions", i, +event.target.value)
                    }
                    label={value}
                  />
                ))}
          </div>
        </div>
      )}

      <div className="form__sections">
        <div className="form__sectionDescription">
          <div className="form__offer ">
            <h2 className="form__section-title">{t("adForm1__titleOffer")}</h2>
            <button
              type="button"
              className="lineButton"
              onClick={() =>
                updateProperty(
                  "offers",
                  -1,
                  Array.from(
                    {
                      length: attributes.find(
                        (attribute) => attribute.name === "offers",
                      ).values.length,
                    },
                    (_, i) => i++,
                  ),
                )
              }
            >
              Alle selektieren
            </button>
          </div>
        </div>

        <div className="form__sectionPart">
          {attributes &&
            attributes.length > 0 &&
            attributes
              .find((attribute) => attribute.name === "offers")
              ?.values.map((value, i) => (
                <Checkbox
                  key={i}
                  id={"cb-3-" + i}
                  name={"cb-3-" + i}
                  value={i}
                  checked={ad.offers.includes(i)}
                  onChange={(event) =>
                    updateProperty("offers", i, +event.target.value)
                  }
                  label={value}
                />
              ))}
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm1__titleType")}</h2>
        </div>
        <div className="form__sectionPart">
          <Select
            id="dd-1-1"
            name="dd-1-1"
            value={
              ad.ethnicity !== null && {
                value: ad.ethnicity,
                label:
                  attributes &&
                  attributes.length > 0 &&
                  attributes.find(
                    (attribute) => attribute.name === "ethnicities",
                  ).values[ad.ethnicity],
              }
            }
            onChange={(value) => updateProperty("ethnicity", -1, value.value)}
            placeholder={t("adForm1__chooseType")}
            options={
              attributes &&
              attributes.length > 0 &&
              attributes
                .find((attribute) => attribute.name === "ethnicities")
                ?.values.map((value, i) => ({ value: i, label: value }))
            }
            menuPlacement="auto"
            required
          />
        </div>
      </div>

      <button className="button form--button" type="submit">
        {t("continueButton")}
      </button>
    </form>
  );
};

export default AdForm1;
