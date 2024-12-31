import React, { useEffect } from "react";
import {
  Textfield,
  Checkbox,
  TextFieldLong,
  TextfieldShort,
} from "@components/tags/Inputs";
import { useTranslation } from "next-i18next";
import Select from "react-select";

const AdForm2 = (props) => {
  const { t } = useTranslation("common");
  const { setBody, ad, attributes, updateProperty } = props;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateForm = (event) => {
    event.preventDefault();

    setBody(3);
  };

  return (
    <form className="form form--ad" onSubmit={validateForm}>
      <div className="form__section">
        <button
          className="button form--button"
          type="button"
          onClick={() => setBody(1)}
        >
          {t("backButton")}
        </button>

        <button className="button form--button" type="submit">
          {t("continueButton")}
        </button>
      </div>
      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm2__title")}</h2>
        </div>
        <div className="form__sectionPart">
          <div className="column">
            <div className="form__sectionTextCombo">
              <TextfieldShort
                id="tf-1-1"
                name="tf-1-1"
                value={ad.title}
                onChange={(event) =>
                  updateProperty("title", -1, event.target.value)
                }
                label={t("adForm2__offerTitle")}
                required={true}
              />

              <Textfield
                id="tf-1-2"
                name="tf-1-2"
                value={ad.name}
                onChange={(event) =>
                  updateProperty("name", -1, event.target.value)
                }
                label="Name"
                required={false}
              />
            </div>
            <TextFieldLong
              id="tf-1-3"
              name="tf-1-3"
              value={ad.description}
              onChange={(event) =>
                updateProperty("description", -1, event.target.value)
              }
              label="Text"
              required={true}
            />
          </div>
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">
            {t("adForm2__contactDataTitle")}
          </h2>
        </div>

        <div className="form__sectionPart">
          <div className="adForm2__number">
            <Select
              id="dd-2-1"
              name="dd-2-1"
              value={
                ad.areaCode !== undefined && {
                  value: ad.areaCode,
                  label:
                    attributes &&
                    attributes.length > 0 &&
                    attributes
                      .find((attribute) => attribute.name === "areaCodes")
                      .values.find((value) => value.id === ad.areaCode)
                      .country +
                      " " +
                      attributes
                        .find((attribute) => attribute.name === "areaCodes")
                        .values.find((value) => value.id === ad.areaCode).code,
                }
              }
              onChange={(value) => updateProperty("areaCode", -1, value.value)}
              placeholder={t("adForm2__dropdownTextAreaCode")}
              options={
                attributes &&
                attributes.length > 0 &&
                attributes
                  .find((attribute) => attribute.name === "areaCodes")
                  .values.map((value) => ({
                    value: value.id,
                    label: value.country + " " + value.code,
                  }))
              }
            />

            <Textfield
              id="tf-2-1"
              name="tf-2-1"
              value={ad.phone}
              onChange={(event) =>
                updateProperty("phone", -1, event.target.value.trim())
              }
              pattern="(\+(41|49|43|423)\s*)?[0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2,3}"
              placeholder="XX XXX XX XX"
              label={t("adForm2__inputNumber")}
              required={false}
            />
          </div>
          <Checkbox
            id="cb-2-1"
            name="cb-2-1"
            checked={ad.sms}
            onChange={() => updateProperty("sms", -1, !ad.sms)}
            label={t("adForm2__checkBoxSMS")}
          />
          <Checkbox
            id="cb-2-2"
            name="cb-2-2"
            checked={ad.whatsapp}
            onChange={() => updateProperty("whatsapp", -1, !ad.whatsapp)}
            label={t("adForm2__checkBoxWhatsapp")}
          />
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm2__locationTitle")}</h2>
        </div>
        <div className="form__sectionPart">
          <div className="form__sectionTextCombo">
            <Textfield
              id="tf-3-1"
              name="tf-3-1"
              value={ad.street}
              onChange={(event) =>
                updateProperty("street", -1, event.target.value)
              }
              label={t("adForm2__inputStreet")}
              required={false}
            />
            <Textfield
              id="tf-3-3"
              name="tf-3-3"
              value={ad.postCode}
              onChange={(event) =>
                updateProperty("postCode", -1, event.target.value)
              }
              label={t("adForm2__inputZIPCode")}
              required={false}
            />
            <Textfield
              id="tf-3-4"
              name="tf-3-4"
              value={ad.city}
              onChange={(event) =>
                updateProperty("city", -1, event.target.value)
              }
              label={t("adForm2__inputPlace")}
              required={false}
            />
            <Select
              id="dd-3-1"
              name="dd-3-1"
              value={
                ad.country !== undefined && {
                  value: ad.country,
                  label:
                    attributes &&
                    attributes.length > 0 &&
                    attributes
                      .find((attribute) => attribute.name === "countries")
                      .values.find((value) => value.id === ad.country).name,
                }
              }
              onChange={(value) => updateProperty("country", -1, value.value)}
              placeholder={t("adForm2__inputCountry")}
              options={
                attributes &&
                attributes.length > 0 &&
                attributes
                  .find((attribute) => attribute.name === "countries")
                  .values.map((value) => ({
                    value: value.id,
                    label: value.name,
                  }))
              }
            />
          </div>
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm2__websiteTitle")}</h2>
        </div>
        <div className="form__sectionPart">
          <Textfield
            id="tf-4-1"
            name="tf-4-1"
            value={ad.website}
            onChange={(event) =>
              updateProperty("website", -1, event.target.value)
            }
            placeholder="https://"
            label={t("adForm2__inputWebsite")}
            required={false}
          />
        </div>
      </div>
      <div className="form__section">
        <button
          className="button form--button"
          type="button"
          onClick={() => setBody(1)}
        >
          {t("backButton")}
        </button>

        <button className="button form--button" type="submit">
          {t("continueButton")}
        </button>
      </div>
    </form>
  );
};

export default AdForm2;
