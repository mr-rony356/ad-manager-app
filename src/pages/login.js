import React, { useState } from "react";
import ForgotPasswordForm from "@components/forms/ForgotPasswordForm";
import LoginForm from "@components/forms/LoginForm";
import ResetPasswordForm from "@components/forms/ResetPasswordForm";
import SignupForm from "@components/forms/SignupForm";
import ApiController from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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

const LoginPage = () => {
  const { t } = useTranslation();
  const [body, setBody] = useState("Login");

  const toggleBody = (body) => setBody(body);

  const renderBody = () => {
    switch (body) {
      case "Login":
        return <LoginForm />;
      case "Signup":
        return <SignupForm setBody={setBody} />;
      case "ForgotPassword":
        return <ForgotPasswordForm />;
      case "ResetPassword":
        return <ResetPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <>
      <Head>
        <title>
          Erotische Anzeigen für Sexkontakte und Onlyfans Accounts in der
          Schweiz - Die besten Sex & Erotik Anzeigen der Schweiz: Für jeden
          Geschmack! onlyfriend.ch ▷ Das Schweizer Sex & Erotik Inserate Portal.
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Entdecken Sie auf unserer Webseite erotische Anzeigen für Sexkontake und Onlyfans Accounts in der Schweiz. Treffen Sie heiße Girls in Ihrer Nähe und erleben Sie prickelnde Abenteuer. Ohne Anmeldung können Sie direkt mit den Girls in Kontakt kommen."
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sex in Zürich, Blowjob in Zürich, Escort in Zürich, Gangbang in Zürich, Girlfriend Sex in Zürich, Striptease in Zürich, Sex in Aargau, Blowjob in Aargau, Escort in Aargau, Gangbang in Aargau, Girlfriend Sex in Aargau, Striptease in Aargau, Sex in Luzern, Blowjob in Luzern, Escort in Luzern, Gangbang in Luzern, Girlfriend Sex in Luzern, Striptease in Bern, Sex in Bern, Blowjob in Bern, Escort in Bern, Gangbang in Bern, Girlfriend Sex in Bern, Striptease in Bern, Sex in Basel, Blowjob in Basel, Escort in Basel, Gangbang in Basel, Girlfriend Sex in Basel, Striptease in Basel, Junge Frauen, Sexy Latinas, Escort, Sexy Studentin, Milf, Sextreffen, Webcam, Sexchat, Sexting, Cam2Cam, Erotik-Kleinanzeigen, Sexkontakte, Begleitservice, Callgirls, Escortservice, Erotische Massagen, Fetisch-Anzeigen, BDSM-Kontakte, Sexpartys, Swinger-Kontakte, Erotikjobs, Erotik-Shops, Webcam-Shows, Adult-Dating, Dominas, Bordell-Inserate, Stripper-Inserate, TS-Inserate, Onlyfans, Onlyfriends,"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="login">
        <div className="login__content">
          <div className="login__left">
            <Image
              src={"/assets/logo.png"}
              width={500}
              height={500}
              alt="logo"
              className="logo login--logo"
              loading="lazy"
            />
          </div>
          <div className="page--login">
            {renderBody()}

            <div className="button-group button-group--inline">
              {body === "Login" ? (
                <>
                  <a
                    href="#0"
                    className="link"
                    onClick={() => toggleBody("ForgotPassword")}
                  >
                    {t("login__passwordButton")}
                  </a>
                  <a
                    href="#0"
                    className="lineButton"
                    style={{ textAlign: "center" }}
                    onClick={() => toggleBody("Signup")}
                  >
                    {t("login__registerButton")}
                  </a>
                </>
              ) : (
                <a
                  href="#0"
                  className="lineButton button--active"
                  onClick={() => toggleBody("Login")}
                >
                  {t("login__logOnButton")}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
