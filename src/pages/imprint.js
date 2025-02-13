import React from "react";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
    },
  };
}

function Imprint() {
  return (
    <>
      <Head>
        <title>Impressum | Onlyfriend.ch</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Find erotic ads and sex meetings in Switzerland. Discover discreet contacts in Zurich, Bern or Basel – easily on Onlyfriend.ch!"
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sex in Zürich, Blowjob in Zürich, Escort in Zürich, Gangbang in Zürich, Girlfriend Sex in Zürich, Striptease in Zürich, Sex in Aargau, Blowjob in Aargau, Escort in Aargau, Gangbang in Aargau, Girlfriend Sex in Aargau, Striptease in Aargau, Sex in Luzern, Blowjob in Luzern, Escort in Luzern, Gangbang in Luzern, Girlfriend Sex in Luzern, Striptease in Bern, Sex in Bern, Blowjob in Bern, Escort in Bern, Gangbang in Bern, Girlfriend Sex in Bern, Striptease in Bern, Sex in Basel, Blowjob in Basel, Escort in Basel, Gangbang in Basel, Girlfriend Sex in Basel, Striptease in Basel, Junge Frauen, Sexy Latinas, Escort, Sexy Studentin, Milf, Sextreffen, Webcam, Sexchat, Sexting, Cam2Cam, Erotik-Kleinanzeigen, Sexkontakte, Begleitservice, Callgirls, Escortservice, Erotische Massagen, Fetisch-Anzeigen, BDSM-Kontakte, Sexpartys, Swinger-Kontakte, Erotikjobs, Erotik-Shops, Webcam-Shows, Adult-Dating, Dominas, Bordell-Inserate, Stripper-Inserate, TS-Inserate, Onlyfans, Onlyfriends,"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="info page">
        <h1>Impressum</h1>
        <div>
          <h3>Vision Digital Consulting klg</h3>
          <p>Schützenstrasse 23</p>
          <p>8953 Dietikon</p>
        </div>
        <p>
          E-Mail:{" "}
          <a
            href="mailto:support@onlyfriend.ch"
            className="text-sky-400 !underline"
          >
            support@onlyfriend.ch
          </a>
        </p>

        <p>
          Die Vision Digital Consulting klg ist eingetragen im Handelsregister
          des Kantons Zürich.{" "}
        </p>
        <div>
          <h3>Streitschlichtung:</h3> Die Europäische Kommission stellt eine
          Plattform zur Online-Streitbeilegung für Verbraucher und
          Verbraucherinnen im Europäischen Wirtschaftsraum (EWR) bereit:
          https://ec.europa.eu/consumers/odr/ Wir sind nicht bereit oder
          verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </div>
      </div>
    </>
  );
}

export default Imprint;
