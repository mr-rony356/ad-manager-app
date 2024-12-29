import React from "react";
import { useApi } from "@contexts/APIContext";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const AdModal = ({ ad, setShowModal, owner, setErr, setDisplayModal }) => {
  const { t } = useTranslation();
  const { api } = useApi();
  const router = useRouter();

  const deactivateAd = () => {
    const res = api.deactivateAd(ad._id);
    if (res.err) setErr(res);
    setShowModal(false);
    router.reload();
  };

  const activateAd = () => {
    const res = api.activateAd(ad._id);
    if (res.err) setErr(res);
    setShowModal(false);
    router.reload();
  };

  const boostAd = async () => {
    const res = await api.boostAd(ad._id);
    if (res.err) setErr(res.err);
    else setDisplayModal("boosted");
    setShowModal(false);
  };

  const premiumAd = async () => {
    const res = await api.premiumAd(ad._id);
    if (res.err) setErr(res.err);
    else setDisplayModal("premium");
    setShowModal(false);
  };

  const reactivateAd = async (durationId) => {
    const res = await api.reactivateAd(ad._id, durationId);
    if (res.err) setErr(res.err);
    else setDisplayModal("reactivated");
    setShowModal(false);
  };

  const deleteAd = () => {
    const res = api.deleteAd(ad._id);
    router.reload();

    if (res.err) setErr(res.err);
    setShowModal(false);
  };
  return (
    <div className="ad__menu">
      <div>
        <ul>
          {ad.endDate < Date.now() ? null : (
            <li>
              <a href="#0" className="link">
                {t("adModal__edit")}
              </a>
            </li>
          )}
          {ad.active === false || ad.endDate < Date.now() ? null : !owner ? (
            <>
              <li>
                <a
                  href="#0"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    premiumAd();
                  }}
                >
                  {t("adModal__premium")}
                </a>
              </li>
              <li>
                <a
                  href="#0"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    boostAd();
                  }}
                >
                  {t("admModal__first")}
                </a>
              </li>
            </>
          ) : null}
          {ad.endDate < Date.now() ? null : (
            <li>
              {ad.active === false ? (
                <a
                  href="#0"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    activateAd();
                  }}
                >
                  {t("adModal__active")}
                </a>
              ) : (
                <a
                  href="#0"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deactivateAd();
                  }}
                >
                  {t("adModal__inactive")}
                </a>
              )}
            </li>
          )}
          {ad.endDate > Date.now() && !owner ? null : (
            <>
              {!owner && (
                <li>
                  <p>{t("adModal__reactive")}</p>
                  <div className="link--group">
                    <a
                      href="#0"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reactivateAd(0);
                      }}
                    >
                      1 {t("adForm1__day")}
                    </a>
                    <a
                      href="#0"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reactivateAd(1);
                      }}
                    >
                      3 {t("adForm1__days")}
                    </a>
                    <a
                      href="#0"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reactivateAd(2);
                      }}
                    >
                      7 {t("adForm1__days")}
                    </a>
                    <a
                      href="#0"
                      className="link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        reactivateAd(3);
                      }}
                    >
                      31 {t("adForm1__days")}
                    </a>
                  </div>
                </li>
              )}
              <li>
                <a
                  href="#0"
                  className="link"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteAd();
                  }}
                >
                  {t("adModal__delete")}
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdModal;
