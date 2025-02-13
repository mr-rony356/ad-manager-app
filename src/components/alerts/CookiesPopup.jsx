import React from "react";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";
export async function getServerSideProps({ req, locale }) {
  // Initialize your API client
  const api = new ApiController();
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Redirect the user if he is already authenticated
  if (user && !user.err) {
    return {  
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
    },
  };
}

const CookiesPopup = (props) => {
  const { t } = useTranslation("common");
  const { setIsCookiesPopupOpen } = props;
  const clickHandler = () => {
    setIsCookiesPopupOpen(false);
    Cookies.set("cookiesPopupShown", true);
  };

  return (
    <div className="cookies__popUp !z-[99999999] w-[95%] md:w-[20em]">
      <p className="cookies__title">{t("cookiesPopup.title")}</p>
      <div className="cookies__text">{t("cookiesPopup.text")}</div>
      <button
        onClick={() => clickHandler()}
        className="bg-white text-black rounded-md p-2"
      >
        {t("cookiesPopup.accept")}
      </button>
    </div>
  );
};

export default CookiesPopup;
