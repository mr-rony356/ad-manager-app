import React from "react";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";

const CookiesPopup = (props) => {
  const { t } = useTranslation("common");
  const { setIsCookiesPopupOpen } = props;
  const clickHandler = () => {
    setIsCookiesPopupOpen(false);
    Cookies.set("cookiesPopupShown", true);
  };

  return (
    <div className="cookies__popUp !z-[99999999] w-[95%] md:w-[20em]">
      <div className="cookies__title">{t("cookiesPopup__title")}</div>
      <div className="cookies__text">{t("cookiesPopup__text")}</div>
      <button
        onClick={() => clickHandler()}
        className="bg-white text-black rounded-md p-2"
      >
        {t("cookiesPopup__accept")}
      </button>
    </div>
  );
};

export default CookiesPopup;
