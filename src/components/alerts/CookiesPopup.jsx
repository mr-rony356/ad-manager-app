import React from "react";
import Cookies from "js-cookie";

const CookiesPopup = (props) => {
  const { setIsCookiesPopupOpen } = props;
  const clickHandler = () => {
    setIsCookiesPopupOpen(false);
    Cookies.set("cookiesPopupShown", true);
  };

  return (
    <div className="cookies__popUp">
      <p className="cookies__title">We use Cookies</p>
      <div className="cookies__text">
        We use necessary cookies to enhance your browsing experience on our
        website.
      </div>
      <button onClick={() => clickHandler()}>Accept</button>
    </div>
  );
};

export default CookiesPopup;
