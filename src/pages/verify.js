import React, { useEffect } from "react";
import { useApi } from "@contexts/APIContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function Verify() {
  const { api } = useApi();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) api.verifyUser(id);
  }, [api, id]);

  const handleLogin = () => {
    router.push("/login");
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
      <div className="verify-message">
        <h1>Herzlichen Glückwunsch!</h1>
        <p>
          Deine Registrierung war erfolgreich und deine E-Mail-Adresse wurde
          verifiziert. Du kannst jetzt mit deinem neuen Konto auf alle
          Funktionen und Inhalte unserer Webseite zugreifen.
        </p>
        <button className="button form--button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </>
  );
}

export default Verify;
