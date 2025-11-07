"use client";
import React, { useEffect } from "react";
import Image from "next/image";

function SmallPopUp({ isOpen, onClose, title, message, iconSrc }) {
  const icon = iconSrc || "/FINAL/11.png";
  useEffect(() => {
    const handleClick = (event) => {
      const modal = document.getElementById("smallModal");
      const close = document.getElementById("smallClose");
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
      id="smallModal"
      className="modal"
      style={isOpen ? { display: "flex" } : { display: "none" }}
    >
      <div className="modal-content" style={{ maxWidth: "520px" }}>
        <span id="smallClose" className="close" onClick={onClose}>
          &times;
        </span>
        <Image
          src={icon}
          width={80}
          height={80}
          alt="info"
          className="modal__check"
        />
        <p className="modal__title">{title}</p>
        <div className="modal__text" style={{ whiteSpace: "pre-line" }}>
          {message}
        </div>
      </div>
    </div>
  );
}

export default SmallPopUp;
