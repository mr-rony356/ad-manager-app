import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function PopUp(props) {
  const { message, title, isOpen, onClose, type } = props;
  const route = useRouter();
  const { t } = useTranslation();
  const check = "/assets/check.png";

  useEffect(() => {
    const handleClick = (event) => {
      const modal = document.getElementById("myModal");
      const close = document.getElementById("close");

      if (event.target === modal || event.target === close) {
        onClose();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("click", handleClick);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("click", handleClick);
      }
    };
  }, [onClose]);

  return (
    <div
      id="myModal"
      className="modal"
      style={isOpen ? { display: "flex" } : { display: "none" }}
    >
      <div className="modal-content">
        <span
          id="close"
          className="close"
          onClick={(e) => {
            e.preventDefault(); // Prevent default anchor behavior
            e.stopPropagation(); // Stop event from bubbling to the Link
            onClose();
            // Add your button logic here
          }}
        >
          &times;
        </span>
        {type !== "twint" && (
          <Image
            src={check}
            width={500}
            height={500}
            alt="check"
            className="modal__check"
          />
        )}
        <p className="modal__title">{title}</p>
        <div className="modal__text">{message}</div>
        {type !== "verified" && type !== "twint" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              route.push("/admin/credits");
            }}
            className="button"
          >
            Credits Aufladen
          </button>
        ) : type !== "twint" ? (
          <button
            className="button form--button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              route.push("/login");
            }}
          >
            {t("login__button")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default PopUp;
