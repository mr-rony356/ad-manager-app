import React, { useEffect } from "react";
import { Files } from "@components/tags/Inputs";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const AdForm3 = (props) => {
  const {
    setBody,
    ad,
    attributes,
    updateProperty,
    deleteProperty,
    selectImage,
    createAd,
    updateAd,
    err,
    editMode,
    originalAd,
    formatError,
    type,
  } = props;
  const { t } = useTranslation("common");
  const router = useRouter();
  const deleteIcon = "/assets/delete.png";
  const heartIcon = "/assets/heart.png";
  const linedHeartIcon = "/assets/lined-heart.png";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateForm = (event) => {
    event.preventDefault();

    if (type === "free") {
      ad.credits = 0;
      console.log("form 3", ad.credits);
    }

    if (editMode) {
      updateAd();
    } else {
      createAd();
    }
  };
  console.log("form 3", type);
  return (
    <form className="form form--ad" onSubmit={validateForm}>
      <div className="form__section">
        <button
          className="button form--button"
          type="button"
          onClick={() => setBody(2)}
        >
          {t("backButton")}
        </button>
      </div>
      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm3__picturesTitle")}</h2>
          <p>{t("adForm3__picturesText")}</p>
          <div
            style={{
              display: "flex",
              gap: "0.2em",
              marginTop: "0.5em",
              alignItems: "center",
            }}
          >
            <Image
              src={heartIcon}
              width={500}
              height={500}
              alt="coverbild"
              className="icon"
            />
            <p>{t("adForm3__coverPictureTitle")}</p>
          </div>
        </div>
        <div className="form__sectionPart3">
          <div className="form__cardUpload">
            {ad.images.map((image, index) => (
              <div key={index} className="image-container">
                <button
                  onClick={() => selectImage(index)}
                  className="select-button"
                  type="button"
                >
                  {ad.frontImage === index ? (
                    <Image
                      src={heartIcon}
                      width={500}
                      height={500}
                      alt="selected"
                      className="select-icon"
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={linedHeartIcon}
                      width={500}
                      height={500}
                      alt="not-selected"
                      className="select-icon"
                      loading="lazy"
                    />
                  )}
                </button>
                <Image
                  key={index}
                  id={"iv-1-" + index}
                  name={"iv-1-" + index}
                  src={
                    typeof image === "string"
                      ? `${API_ADDRESS}${image}`
                      : URL.createObjectURL(image)
                  }
                  width={500}
                  height={500}
                  alt={image.name}
                  required={true}
                  loading="lazy"
                />
                <button
                  onClick={() => deleteProperty("images", index)}
                  className="delete-button"
                  type="button"
                >
                  <Image
                    src={deleteIcon}
                    width={500}
                    height={500}
                    alt="delete"
                    className="delete-icon"
                    loading="lazy"
                  />
                </button>
              </div>
            ))}
            <Files
              id="fu-1-1"
              name="fu-1-1"
              onChange={(event) =>
                updateProperty("images", -1, Array.from(event.target.files))
              }
              accept="image/png, image/PNG, image/jpeg, image/JPEG, image/jpg, image/JPG, image/gif, image/GIF"
              multiple={true}
            />
          </div>
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">{t("adForm3__videosTitle")}</h2>
          <p>{t("adForm3__videosText")}</p>
        </div>
        <div className="form__sectionPart3">
          <div className="form__cardUpload">
            {ad.video && (
              <div className="image-container">
                <video id={"vv-2-1"} name={"vv-2-1"} controls>
                  <source
                    src={
                      typeof ad.video === "string"
                        ? `${API_ADDRESS}${ad.video}`
                        : URL.createObjectURL(ad.video)
                    }
                    type={ad.video.type}
                  />
                </video>
                <button
                  onClick={() => deleteProperty("video", 0)}
                  className="delete-button"
                >
                  <Image
                    src={deleteIcon}
                    width={500}
                    height={500}
                    alt="delete"
                    className="delete-icon"
                    loading="lazy"
                  />
                </button>
              </div>
            )}
            <Files
              id="fu-2-1"
              name="fu-2-1"
              onChange={(event) =>
                updateProperty("video", -1, event.target.files[0])
              }
              accept="video/mp4, video/MP4, video/mpeg-4, video/MPEG-4, video/mov, video/MOV"
              multiple={false}
              required={false}
            />
          </div>
        </div>
      </div>

      <div className="form__sections">
        <div className="form__sectionDescription">
          <h2 className="form__section-title">
            {t("adForm3__verificationTitle")}
          </h2>
          <p>{t("adForm3__verificationText1")}</p>
          <br />
          <p>{t("adForm3__verificationText2")}</p>
          <br />
          <p>{t("adForm3__verificationText3")}</p>
          <br />
          <p>{t("adForm3__verificationText4")}</p>
          <br />
          <p>{t("adForm3__verificationText5")}</p>
          <p className="form__sevenDigitCode"> Code: {ad.verificationCode}</p>
        </div>
        <div className="form__sectionPart3">
          <div className="form__cardUpload">
            {ad.verificationImage && (
              <div className="image-container">
                <Image
                  id={"iv-3-1"}
                  name={"iv-3-1"}
                  src={
                    typeof ad.verificationImage === "string"
                      ? `${API_ADDRESS}${ad.verificationImage}`
                      : URL.createObjectURL(ad.verificationImage)
                  }
                  width={500}
                  height={500}
                  alt={ad.verificationImage.name}
                  loading="lazy"
                />
                <button
                  onClick={() => deleteProperty("verificationImage", 0)}
                  className="delete-button"
                >
                  <Image
                    src={deleteIcon}
                    width={500}
                    height={500}
                    alt="delete"
                    className="delete-icon"
                    loading="lazy"
                  />
                </button>
              </div>
            )}
            <div className="adForm3__verificationButton">
              <Files
                id="fu-3-1"
                name="fu-3-1"
                onChange={(event) =>
                  updateProperty("verificationImage", -1, event.target.files[0])
                }
                accept="image/png, image/PNG, image/jpeg, image/JPEG, image/jpg, image/JPG, image/gif, image/GIF"
                multiple={false}
                required={false}
              />
              <p>{t("adForm3__verificationText6")}</p>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5em", alignItems: "center" }}>
        <p className="error">{err && err}</p>
        <p className="error">{formatError && formatError}</p>
        {err && (
          <button
            onClick={() => router.push("/admin/credits")}
            className="button"
          >
            Guthaben aufladen
          </button>
        )}
      </div>

      <div className="form__section">
        <button
          className="button form--button"
          type="button"
          onClick={() => setBody(2)}
        >
          {t("backButton")}
        </button>
        {editMode ? (
          <button className="button form--button" type="submit">
            {t("saveAd")}
            {(ad.tags.length - originalAd.tags.length > 0
              ? (ad.tags.length - originalAd.tags.length) * 10
              : 0) +
              (ad.regions.length - originalAd.regions.length > 0
                ? (ad.regions.length - originalAd.regions.length) * 10
                : 0)}{" "}
            Credits
          </button>
        ) : type === "free" ? (
          <button className="button form--button" type="submit">
            {t("switchOn")} 0 Credits
          </button>
        ) : (
          <button className="button form--button" type="submit">
            {t("switchOn")}
            {attributes &&
              attributes.length > 0 &&
              attributes.find((attribute) => attribute.name === "durations")
                .values[ad.duration].credits +
                (ad.tags.length > 0 ? (ad.tags.length - 1) * 10 : 0) +
                (ad.regions.length > 0 ? (ad.regions.length - 1) * 10 : 0)}{" "}
            Credits
          </button>
        )}
      </div>
    </form>
  );
};

export default AdForm3;
