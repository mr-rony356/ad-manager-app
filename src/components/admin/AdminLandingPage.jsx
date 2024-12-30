import React, { useState } from "react";
import Ad from "@components/home/Ad";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const AdminLandingPage = ({ user, attributes, ad, message }) => {
  const { t } = useTranslation();
  const userIcon = "/assets/user-icon.png";
  const [activeAdId, setActiveAdId] = useState(null);

  const toggleModal = (adId) => {
    setActiveAdId((prev) => (prev === adId ? null : adId));
  };

  return (
    <div className="admin">
      <div className="adminCard adminLandingPage__section card">
        <h1 className="title adminLandingPage__title">
          {t("adminLandingPage__titleCredits")}
        </h1>
        <div className="text adminLandingPage__text">
          {t("adminLandingPage__textCredit1")}
          <strong>
            {user.credits} {t("adminLandingPage__credits")}
          </strong>
          {t("adminLandingPage__textCredit2")}
        </div>
        <Link href="/admin/credits" className="button">
          {t("adminLandingPage__creditsButton")}
        </Link>
      </div>
      <div className=" adminCard adminLandingPage__section card">
        <h1 className="title adminLandingPage__title">
          {t("adminLandingPage__titleOffer")}
        </h1>
        <div className="text adminLandingPage__advertisements">
          {ad ? (
            <Ad
              key={ad._id}
              user={user}
              attributes={attributes}
              ad={ad}
              isAdmin={true}
              isModalOpen={activeAdId === ad._id}
              toggleModal={toggleModal}
            />
          ) : (
            <p>{t("adminLandingPage__textOffer")}</p>
          )}
        </div>
        <Link href="/admin/manager" className="button">
          {t("adminLandingPage__offersButton")}
        </Link>
      </div>
      <div className="card">
        <h1 className="title messages--title">{t("admin__messagesTitle")}</h1>
        <div className="messages">
          <div className="message">
            {message ? (
              <Link
                key={message._id}
                href={{
                  pathname: `/admin/messages/${message.from[0]._id}`,
                }}
              >
                <div className="card ">
                  <div className="messages__flex">
                    <Image
                      src={
                        message.from[0].image
                          ? API_ADDRESS + message.from[0].image
                          : userIcon
                      }
                      width={500}
                      height={500}
                      alt="user-icon"
                      className={
                        message.from[0].image
                          ? "messages__userImage"
                          : "messages__userIcon"
                      }
                      loading="lazy"
                    />
                    <div>
                      <span>
                        {new Intl.DateTimeFormat("de-CH", {
                          hour: "numeric",
                          minute: "numeric",
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                        }).format(message.timestamp)}
                      </span>
                      <h2>{message.from[0].name}</h2>
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <p>{t("admin__messagesText")}</p>
            )}
          </div>
        </div>
        <Link href="/admin/messages" className="button">
          {t("adminLandingPage__messagesButton")}
        </Link>
      </div>
    </div>
  );
};

export default AdminLandingPage;
