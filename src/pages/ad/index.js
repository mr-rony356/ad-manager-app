import React, { useState, useEffect } from "react";
import PopUp from "@components/alerts/PopUp";
import AdForm1 from "@components/forms/AdForm1";
import AdForm2 from "@components/forms/AdForm2";
import AdForm3 from "@components/forms/AdForm3";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale, query }) {
  const api = new ApiController();
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  if (!user || user.err) {
    return {
      redirect: {
        destination: "/ad",
        permanent: false,
      },
    };
  }

  const { tempAd, editMode } = query;
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      attributes,
      tempAd: tempAd ? JSON.parse(tempAd) : null,
      editMode: editMode ? JSON.parse(editMode) : false,
    },
  };
}

const AdvertisementPage = ({ user, attributes, tempAd, editMode }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const router = useRouter();
  const [body, setBody] = useState(1);
  const [displayModal, setDisplayModal] = useState(false);
  const [formatError, setFormatError] = useState(null);
  const [ad, setAd] = useState(
    tempAd || {
      type: null,
      tags: [],
      regions: [],
      offers: [],
      ethnicity: null,
      images: [],
      frontImage: 0,
      video: null,
      verificationImage: null,
      verificationCode: Math.floor(Math.random() * 10000000),
    },
  );
  const [err, setErr] = useState("");

  // Extract type from the query
  const { type } = router.query;

  // Update the ad state when type is present in the URL
  useEffect(() => {
    if (type) {
      setAd((prevAd) => ({
        ...prevAd,
        type: type || null,
      }));
    }
  }, [type]);
  console.log(type);
  console.log(ad);
  const updateProperty = (property, number, value) => {
    const oc = { ...ad };
    const allowedImageFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
    ];
    const allowedVideoFormats = [
      "video/mp4",
      "video/mpeg-4",
      "video/mov",
      "video/quicktime",
    ];

    const files = Array.isArray(value) ? value : [value];
    for (const file of files) {
      if (property === "images" || property === "verificationImage") {
        if (!allowedImageFormats.includes(file?.type)) {
          setFormatError(
            "Only PNG, JPEG, and GIF formats are allowed for images.",
          );
          return;
        }
      } else if (property === "video") {
        if (!allowedVideoFormats.includes(file?.type)) {
          setFormatError(
            "Only MP4, MPEG-4, and MOV formats are allowed for videos.",
          );
          return;
        }
      }
    }

    setFormatError(null);
    if (number === -1) {
      if (property === "images") oc[property] = [...ad.images, ...value];
      else oc[property] = value;
    }
    if (number >= 0) {
      const i = oc[property].indexOf(value);
      if (i === -1) oc[property].push(value);
      else oc[property].splice(i, 1);
    }
    setAd({ ...ad, [property]: oc[property] });
  };

  const deleteProperty = (property, index) => {
    const oc = { ...ad };
    if (property === "video") oc[property] = null;
    else if (property === "verificationImage") oc[property] = null;
    else oc[property].splice(index, 1);
    setAd({
      ...ad,
      [property]: oc[property],
      ...(oc.frontImage === index && { frontImage: 0 }),
    });
  };

  const selectImage = (index) => {
    setAd({ ...ad, frontImage: index });
  };

  const createAd = () => {
    const data = new FormData();
    ad.images.forEach((image) => data.append("image", image));
    data.append("video", ad.video);
    data.append("verificationImage", ad.verificationImage);
    data.append("ad", JSON.stringify(ad));

    if (type === "free") {
      ad.credits = 0;
    }

    api.createAd(data).then((res) => {
      if (res.err) setErr(res.err);
      else setDisplayModal(res.usedCredits);
    });
  };

  const updateAd = () => {
    const data = new FormData();
    if (tempAd.images !== ad.images) {
      ad.images.forEach((image) => {
        if (image instanceof File) {
          data.append("image", image);
          ad.images.splice(ad.images.indexOf(image), 1);
        }
      });
    }
    if (tempAd.video !== ad.video) data.append("video", ad.video);
    if (tempAd.verificationImage !== ad.verificationImage)
      data.append("verificationImage", ad.verificationImage);
    data.append("ad", JSON.stringify(ad));
    api.updateAd(ad._id, data).then((res) => {
      if (res.err) setErr(res.err);
      else {
        if (tempAd.title !== res.ad.title) {
          const slug = res.ad.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          router.reload("/ad/" + res.ad._id + "/" + slug);
        }
        window.location.reload(true);
      }
    });
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

      <div className="page">
        {displayModal && (
          <PopUp
            isOpen={!!displayModal}
            onClose={() => router.push("/")}
            displayModal={displayModal}
            title={"Erfolg"}
            message={
              <>
                <h1>
                  Für das Inserat {ad && ad.title} wurden {displayModal} Credits
                  von Ihrem Konto abgebucht.
                </h1>
                <br />
                <p> {user.credits} Credits verbleibend</p>
              </>
            }
            setDisplayModal={setDisplayModal}
          />
        )}
        <div className="adpage_title">
          {tempAd ? (
            <h1 className="advertisementPage__title">Inserat bearbeiten</h1>
          ) : (
            <h1 className="advertisementPage__title">Inserat aufgeben</h1>
          )}
          <p className="credits">
            {user && (
              <span>
                {t("credits")} {user.credits}
              </span>
            )}
          </p>
        </div>

        {body === 1 && (
          <AdForm1
            setBody={setBody}
            ad={ad}
            attributes={attributes}
            updateProperty={updateProperty}
            editMode={editMode}
            type={type || null}
          />
        )}
        {body === 2 && (
          <AdForm2
            setBody={setBody}
            ad={ad}
            attributes={attributes}
            updateProperty={updateProperty}
            type={type || null}
          />
        )}
        {body === 3 && (
          <AdForm3
            setBody={setBody}
            ad={ad}
            attributes={attributes}
            updateProperty={updateProperty}
            deleteProperty={deleteProperty}
            selectImage={selectImage}
            createAd={createAd}
            updateAd={updateAd}
            err={err}
            editMode={editMode}
            originalAd={tempAd}
            formatError={formatError}
            type={type || null}
          />
        )}
      </div>
    </>
  );
};

export default AdvertisementPage;
