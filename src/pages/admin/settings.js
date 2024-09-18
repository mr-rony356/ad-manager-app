import React, { useState } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import PopUp from "@components/alerts/PopUp";
import { Textfield, Files } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import ApiController, { API_ADDRESS } from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale }) {
  // Initialize the API helper class
  const api = new ApiController();
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Redirect the user if he is not authenticated
  if (!user || user.err) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      initialUser: user,
      attributes,
    },
  };
}

const Settings = ({ initialUser }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [changePassword, setChangePassword] = useState(false);
  const [err, setErr] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState(initialUser);

  const updateUser = (event) => {
    event.preventDefault();
    // Create form data
    const data = new FormData();
    if (typeof user.image !== "string") {
      data.append("image", user.image);
    }
    data.append("user", JSON.stringify(user));

    api.updateUser(data).then((res) => {
      if (res.err) setErr(res.err);
      else localStorage.setItem("Auth", JSON.stringify(res));
    });
    setDisplayModal(true);
  };

  const closeHandler = () => {
    router.push("/admin/settings");
    setDisplayModal(false);
  };

  return (
    <>
      <Head>
        <title>OnlyFriend</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Onlyfriend" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="page">
        <h1 className="adminPage__activeUser">Hallo {user.name}</h1>

        <div className="adminPage__content">
          <AdminLinks user={user} />
          <div className="adminPage__contentComponents">
            <form className="form form--settings card" onSubmit={updateUser}>
              <div className="form__sectionsCredit">
                <h1 className="form__section-title">
                  {t("admin__settingsTitle")}
                </h1>
              </div>
              <div className="form__sectionsCredit">
                <p>{t("admin__settingsSubTitle1")}</p>
                {user.image && (
                  <Image
                    src={
                      typeof user.image === "string"
                        ? API_ADDRESS + user.image
                        : URL.createObjectURL(user.image)
                    }
                    width={500}
                    height={500}
                    alt="avatar"
                    className="form__avatar"
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      objectFit: "contain",
                    }}
                    loading="lazy"
                  />
                )}
                <Files
                  id="fu-7-1"
                  name="fu-7-1"
                  onChange={(event) =>
                    setUser({ ...user, image: event.target.files[0] })
                  }
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>

              <div className="form__sectionsCredit">
                <div className="form__sectionsCredit">
                  <h2 className="form__section-title">
                    {t("admin__settingsSubTitle2")}
                  </h2>
                  <Textfield
                    id="tf-2-1"
                    name="tf-2-1"
                    value={user.name}
                    onChange={(event) =>
                      setUser({ ...user, name: event.target.value })
                    }
                    label="Name"
                    required={true}
                  />
                  <Textfield
                    id="tf-2-2"
                    name="tf-2-2"
                    value={user.email}
                    onChange={(event) =>
                      setUser({ ...user, email: event.target.value })
                    }
                    label="Email"
                    required={true}
                  />
                </div>
                <p
                  className="lineButton"
                  onClick={() => setChangePassword(!changePassword)}
                >
                  {t("admin__settingsChangePasswordButton")}
                </p>
                {changePassword && (
                  <div className="form__sectionsCredit">
                    <Textfield
                      id="tf-2-3"
                      name="tf-2-3"
                      type="password"
                      value={user.currentPassword}
                      onChange={(event) =>
                        setUser({
                          ...user,
                          currentPassword: event.target.value,
                        })
                      }
                      label={t("admin__settingsCurrentPassword")}
                      required={true}
                    />
                    <Textfield
                      id="tf-2-4"
                      name="tf-2-4"
                      type="password"
                      value={user.password}
                      onChange={(event) =>
                        setUser({ ...user, password: event.target.value })
                      }
                      label={t("admin__settingsNewPassword")}
                      required={true}
                    />
                    <Textfield
                      id="tf-2-5"
                      name="tf-2-5"
                      type="password"
                      value={user.password2}
                      onChange={(event) =>
                        setUser({ ...user, password2: event.target.value })
                      }
                      label={t("admin__settingsConfirmNewPassword")}
                      required={true}
                    />
                  </div>
                )}
                <button type="submit" className="button">
                  {t("admin__settingsSaveButton")}
                </button>
              </div>
              {err && <p>{err}</p>}
              <PopUp
                onClose={() => closeHandler()}
                isOpen={displayModal === "settings"}
                title="Ihre Kontoeinstellungen wurden erfolgrteich geändert"
                message="Sie können nun mit Ihren neuen Einstellungen fortfahren."
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
