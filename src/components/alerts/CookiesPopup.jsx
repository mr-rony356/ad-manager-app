import React from "react";
import Cookies from "js-cookie";

const CookiesPopup = (props) => {
  const { setIsCookiesPopupOpen } = props;
  const clickHandler = () => {
    setIsCookiesPopupOpen(false);
    Cookies.set("cookiesPopupShown", true);
  };

  return (
    <div className="cookies__popUp !z-[99999999] w-[95%] md:w-[20em]">
      <p className="cookies__title">We use Cookies</p>
      <div className="cookies__text">
        We use necessary cookies to enhance your browsing experience on our
        website.
      </div>
      <button
        onClick={() => clickHandler()}
        className="bg-white text-black rounded-md p-2"
      >
        Accept
      </button>
    </div>
  );
};

export default CookiesPopup;
