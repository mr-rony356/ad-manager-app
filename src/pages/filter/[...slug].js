import React, { useEffect, useState } from "react";
import FilterForm from "@components/forms/FilterForm";
import AdList from "@components/home/AdList";
import ApiController from "@utils/API";
import { generateMetaDesc2, generateMetaTitle2 } from "@utils/MetaGenerators";
import Cookies from "js-cookie";
import Head from "next/head";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ req, locale, params }) {
  // Initialize the API helper class
  const api = new ApiController();
  // Fetch the slug
  const { slug } = params;
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Parse the slug to form the initial filters
  const filters = slug.reduce(
    (acc, param, index) => {
      switch (param) {
        case "region":
          acc.regions = slug[index + 1].split(",").map((r) => parseInt(r));
          break;
        case "tag":
          acc.tags = slug[index + 1].split(",").map((t) => parseInt(t));
          break;
        case "offer":
          acc.offers = slug[index + 1].split(",").map((o) => parseInt(o));
          break;
        case "search":
          acc.search = slug[index + 1].replace(/[\s_-]+/g, " ");
          break;
        case "feature":
          acc.verified = slug[index + 1];
          break;
        case "type":
          acc.type = slug[index + 1].split(",").map((t) => parseInt(t));
          break;
        default:
          break;
      }
      return acc;
    },
    {
      regions: [],
      tags: [],
      offers: [],
      search: null,
      verified: false,
      type: 0,
    },
  );
  // Fetch all props server side
  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const ads = await api.filterAds(filters);
  const premiumAds = await api.fetchPremiumAds(0);
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      attributes,
      ads,
      premiumAds,
      filters,
    },
  };
}

function HomePage({
  user,
  attributes,
  ads,
  premiumAds,
  filters: initialFilters,
}) {
  const { t } = useTranslation("common");
  const [filters, setFilters] = useState(initialFilters);
  const [isCookiesPopupOpen, setIsCookiesPopupOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeType, setActiveType] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsFilterVisible(!window.matchMedia("(max-width: 820px)").matches);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!Cookies.get("cookiesPopupShown")) {
      setIsCookiesPopupOpen(true);
      Cookies.set("cookiesPopupShown", true);
    }
  }, [isCookiesPopupOpen]);

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const offers =
    initialFilters.offers.map(
      (o) => attributes.find((a) => a.name === "offers")?.values[o],
    ) ?? [];
  // if (!offers.length)
  //   offers = attributes.find((a) => a.name === "offers")?.values;

  const locations =
    initialFilters.regions.map(
      (r) => attributes.find((a) => a.name === "regions")?.values[r],
    ) ?? [];

  const tags =
    initialFilters.tags.map(
      (o) => attributes.find((a) => a.name === "tags")?.values[o],
    ) ?? [];

  return (
    <>
      <Head>
        <title>
          {generateMetaTitle2({
            locations: locations?.join(", "),
            tags: tags?.join(", "),
            offers: offers.join(", "),
          })}
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content={generateMetaDesc2({
            locations: locations.join(", "),
            tags: tags,
            offers: offers.join(", "),
          })}
        />
        <meta
          name="keywords"
          content={generateMetaDesc2({
            locations: locations.join(", "),
            tags: tags,
            offers: offers.join(", "),
          })}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="page page--home">
        <h1 className="home__title">
          {locations.length < 1 && !offers.length && !tags.length
            ? t("home__title", {
                region: initialFilters.regions
                  .map(
                    (r) =>
                      attributes.find((a) => a.name === "regions")?.values[r],
                  )
                  .join(", "),
              })
            : null}

          {!tags.length && locations.length > 0
            ? `Sex und Erotik Inserate in 
          ${locations.join(" , ")} `
            : null}
          {tags.length && locations.length < 1
            ? `${tags[0]} - ganze Schweiz`
            : null}
          {tags.length && locations.length > 0 && offers.length < 1
            ? `${tags[0]} in ${locations.join(" , ")}`
            : null}
          {tags.length < 1 && locations.length < 1 && offers.length > 0
            ? ` ${offers[0]} - ganze Schweiz`
            : null}
          {tags.length < 1 && locations.length > 0 && offers.length > 0
            ? ` ${offers[0]} in ${locations.join(" , ")}`
            : null}
          {tags.length > 0 && locations.length > 0 && offers.length > 0
            ? ` ${tags[0]} / ${offers[0]} in ${locations.join(" , ")}`
            : null}
        </h1>
        <div className="home__content">
          <div className="home__left">
            {isFilterVisible && (
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                attributes={attributes}
              />
            )}
          </div>
          <div className="home__right">
            <div className="button--inline">
              {attributes &&
                attributes.length > 0 &&
                attributes
                  .find((attribute) => attribute.name === "types")
                  .values.map((value) => (
                    <button
                      key={value.id}
                      className={
                        activeType === value.id ? "button" : "button inactive"
                      }
                      onClick={() => setActiveType(value.id)}
                    >
                      {value.name} {t("home__ad")}
                    </button>
                  ))}
              <Image
                src={"/assets/filter.png"}
                width={500}
                height={500}
                alt="filter"
                className="filter"
                onClick={toggleFilter}
              />
            </div>
            <AdList
              user={user}
              className="home__ads"
              ads={ads}
              premiumAds={premiumAds}
              attributes={attributes}
            />
          </div>
        </div>
        <div>
          <br />
          <br />
          <h3>
            Sextreffen in der Schweiz: die besten Sexinserate und Kontakte auf
            onlyfriend.ch - Onlyfriends
          </h3>
          <p>
            Onlyfriends ist ein Erotikportal, wo frei arbeitende Frauen ein
            Inserat erstellen und mit Kunden in Kontakt treten. Onlyfriends
            verfügt auch eine Verlinkung zu Onlyfans. Wenn man unter der Rubrik
            Onlyfans Inserate sucht, erscheinen Inserate, die eine direkte
            Verlinkung zu Ihrem Onlyfans Account haben. Onlyfriends bezieht sich
            somit auf Sex und Erotik Inserate und auch auf Onlyfans Inserate.
            Onlyfriends überprüft jedes Inserat nach Ihrer Echtheit und bei
            doppelter Überprüfung werden die Inserate noch verifiziert. Hierbei
            will Onlyfriends vermeiden, dass gefälschte Inserate erstellt
            werden. Du möchtest heisse Sextreffen in der Schweiz erleben? Bei
            uns findest du die besten Sexkontakte und Erotikanzeigen. Egal,
            welche Wünsche oder Neigungen du ausleben möchtest – bei
            onlyfriend.ch (Onlyfriends) ist für jeden Geschmack etwas dabei.
            Wähle aus verschiedenen Kategorien deine Vorliebe und finde private
            Sexkontakte.
          </p>
          <br />
          <br />
          <h3>Sexinserate für jeden Geschmack</h3>
          <p>
            Onlyfriends verfügt über ein breites Angebot an Services: Escort
            Service, Sextreffen, Erotik Massagen, Sex Beziehungen, Onlyfans
            Benutzer, Sexpartys, Callgirls, Erotikjobs und vieles mehr! Suchst
            du nach Escort Service in Zürich, Sextreffen in Aargau, Erotik
            Massage in Winterthur oder Sugar Babe treffen. Vielleicht suchst du
            nach einem Seriösen Begleitservice oder eine langfristige
            Sexbeziehung in der Schweiz. Onlyfriends verfügt auch über Adult
            Dating, Fetisch-Anzeigen und BDSM-Kontakte.
            <br />
            <br />
            Für sie, Erotikjobs <br /> Du wünschst dir einen dominanten Mann mit
            grossem Schwanz und Sixpack? Auf onlyfriend.ch - Onlyfriends findest
            du garantiert den passenden Sexpartner.
          </p>
          <br />
          <br />
          <h3>Sex und Escort in der Schweiz</h3>
          <p>
            Von Zürich über Aargau bis hin zu Zug – bei uns findest du
            Sexanzeigen von willigen Frauen in der gesamten Schweiz. So kannst
            du dich ganz nach deinen Wünschen befriedigen lassen – sowohl bei
            dir zu Hause als auch bei einem Sexpartner in deiner Nähe. Sexy
            Girls lassen deine Erotikträume wahr werden. In unserem Schweizer
            Sexforum kannst du dich ausserdem mit anderen Mitgliedern
            austauschen und erfährst alles über die besten Sexclubs und Escorts
            in deiner Region. Bestelle die schärfsten Sexpartner zu dir nach
            Hause oder besuche sie ganz privat für geilen Sex in der Schweiz.
          </p>
        </div>
      </div>
    </>
  );
}

export default HomePage;
