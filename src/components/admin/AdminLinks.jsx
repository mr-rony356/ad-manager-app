import React, { useEffect, useState } from "react";
import { useApi } from "@contexts/APIContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const AdminLinks = ({ user }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    setActiveTab(router.pathname.split("/")[2]);
  }, [router.pathname]);

  const doLogout = () => {
    api.doLogout();
  };

  return (
    <div className="adminPage__contentLinks">
      <Link href="/admin">
        <h3 className="adminPage__contentTitle">{t("admin__linkTitle")}</h3>
      </Link>
      <div className="admin__links">
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <Link
            href="/ad?type=free"
            className="tab"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {t("navBar__adButton")}{" "}
            <span className="freeAdButtons">{t("FreeButton")}</span>
          </Link>
        </div>
        <Link
          href="/admin/manager"
          className={activeTab === "manager" ? "tab active" : "tab"}
        >
          {t("admin__linkOfferManager")}
        </Link>
        <div className="admin__linksCreditDiv">
          <Link
            href="/admin/credits"
            className={activeTab === "credits" ? "tab active" : "tab"}
          >
            {t("admin__linkCredits")}
          </Link>
          <p className="adModal__credits">{user && user.credits}</p>
        </div>
        <Link
          href="/admin/messages"
          className={activeTab === "messages" ? "tab active" : "tab"}
        >
          {t("admin__linkMessages")}
        </Link>
        <Link
          href="/admin/favorites"
          className={activeTab === "favorites" ? "tab active" : "tab"}
        >
          {t("admin__linkFavorites")}
        </Link>
        <Link
          href="/admin/settings"
          className={activeTab === "settings" ? "tab active" : "tab"}
        >
          {t("admin__linkSettings")}
        </Link>

        {user && user.email === "cyrill.mueller@onlyfriend.ch" && (
          <Link
            href="/admin/verifications"
            className={activeTab === "verifications" ? "tab active" : "tab"}
          >
            {t("admin__linkVerifications")}
          </Link>
        )}
        <Link href="/" className="button" onClick={doLogout}>
          {t("admin__linkLogout")}
        </Link>
      </div>
    </div>
  );
};

export default AdminLinks;
