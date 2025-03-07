import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const logo = "/assets/logo.png";
  const whatsapp = "/assets/whatsapp.png";

  return (
    <footer className="footer">
      <Link href="/">
        <Image
          src={logo}
          width={500}
          height={500}
          alt="logo"
          className="logo__support"
          loading="lazy"
        />
      </Link>
      <div className=" text-white text-[16px]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="footer__links flex flex-wrap gap-4">
            <Link
              href="/ad?type=free"
              className="footer__link  hover:underline"
            >
              Inserataufgeben
            </Link>
            <Link
              href="/ad-price"
              className="footer__link  hover:underline"
            >
              Preise Inserate
            </Link>
            <Link href="/faq" className="footer__link  hover:underline">
              Fragen & Antworten (FAQ)
            </Link>
            <Link href="/support" className="footer__link  hover:underline">
              Support
            </Link>
            <Link href="/blogs" className="footer__link  hover:underline">
              Blogs
            </Link>
          </div>
        </div>
      </div>
      <div
        style={{ width: "fit-content" }}
        className="support__content bg-gray-800 rounded-md"
      >
        <div className="support__oppening">
          <h3 style={{ color: "white" }}>Support-Hotline</h3>
          <p style={{ color: "white" }} className="support__oppeningHours">
            (Montag - Freitag 09:00 - 18:00 Uhr){" "}
          </p>
        </div>
        <Link
          style={{ display: "inline-flex", width: "100%" }}
          className="lineButton support__number"
          href={`tel:+41772054730`}
        >
          {"Tel. +41 77 205 47 30"}
        </Link>
        <Link href={"https://wa.me/+41772054730"}>
          <button className="support__button">
            {" "}
            <Image
              alt="support__icon"
              width={500}
              height={500}
              src={whatsapp}
              className="support__icon"
            />{" "}
            Whatsapp
          </button>
        </Link>
      </div>
      <div className="footer__links">
        <Link href={"/imprint"} className="footer__link">
          Impressum
        </Link>
        <Link href={"/privacy"} className="footer__link">
          Datenschutzerklärung
        </Link>
        <Link href={"/pageAgb"} className="footer__link">
          AGB
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
