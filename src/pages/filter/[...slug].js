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
import Pagination from "@components/home/Pagination";

export async function getServerSideProps({ req, locale, params }) {
  const api = new ApiController();
  const { slug } = params;
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);

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

  const lang = locale === "de" ? "de" : "en";
  const attributes = await api.fetchAttributes(lang);
  const ads = await api.filterAds(filters);
  const premiumAds = await api.fetchPremiumAds(0);

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
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [activeType, setActiveType] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const adsPerPage = 25; // Set the number of ads per page

  const indexOfFirstAd = (currentPage - 1) * adsPerPage;
  const indexOfLastAd = Math.min(indexOfFirstAd + adsPerPage, ads.length);
  const currentAds = ads.slice(indexOfFirstAd, indexOfLastAd);
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 300,
      left: 0,
      behavior: "smooth",
    });
  };
  const offers =
    initialFilters.offers.map(
      (o) => attributes.find((a) => a.name === "offers")?.values[o],
    ) ?? [];
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
        </h1>{" "}
        <div className="home__content">
          <div className="home__left">
              <FilterForm
                filters={filters}
                setFilters={setFilters}
                attributes={attributes}
              />
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
              {/* <Image
                src={"/assets/filter.png"}
                width={500}
                height={500}
                alt="filter"
                className="filter"
                onClick={toggleFilter}
              /> */}
            </div>
            <AdList
              user={user}
              className="home__ads"
              ads={currentAds}
              total={ads.length}
              premiumAds={premiumAds}
              attributes={attributes}
            />
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(ads.length/ adsPerPage)}
          onPageChange={paginate}
        />{" "}
        <div>
          <br />
          <br />
          <h3>
            Sextreffen in der Schweiz: Die besten Sexinserate und Kontakte auf
            onlyfriend.ch
          </h3>
          <br />
          <p>
            Du möchtest aufregende Sextreffen in der Schweiz erleben? Auf
            <strong> onlyfriend.ch</strong> findest du die besten Sexkontakte
            und Erotikanzeigen für jeden Geschmack. Egal, welche Wünsche,
            Fantasien oder Neigungen du ausleben möchtest – bei uns gibt es für
            alle etwas Passendes! Wähle aus verschiedenen Kategorien, entdecke
            private Sexkontakte und erlebe sinnliche Abenteuer.{" "}
          </p>
          <br />
          <br />
          <h3>
            onlyfriend.ch – Dein Erotikportal für diskrete Sextreffen und heisse
            Kontakte
          </h3>
          <br />
          <p>
            <strong> onlyfriend.ch</strong> ist dein Schweizer Erotikportal für
            unverbindliche Sextreffen, diskrete Sexkontakte und aufregende
            Inserate. Unsere Plattform bietet dir eine grosse Auswahl an
            Angeboten – von privaten Erotikanzeigen bis hin zu exklusiven
            Verlinkungen zu deinem Lieblings-<strong>OnlyFans</strong>-Account.
            Mit uns kannst du schnell und einfach heisse Begegnungen
            arrangieren, die genau deinen Vorlieben entsprechen.
            <br />
            <br />
            Um höchste Qualität zu gewährleisten, überprüft unser Team jedes
            Inserat auf Echtheit und Verifizierung, damit du dich auf eine
            sichere und seriöse Plattform verlassen kannst.
          </p>
          <br />
          <br />
          <h3>Vielfältige Sexinserate für jeden Geschmack</h3> <br />
          <br />
          <p>
            Ob Escort-Service, erotische Massagen, Casual-Dates oder aufregende
            Fetisch-Abenteuer – bei onlyfriend.ch findest du alles, was das Herz
            begehrt. Hier sind einige Highlights unseres Angebots:
            <br />
            <br />
            <ui>
              <li>
                <strong>Escort-Service </strong> : Finde diskrete Begleitungen
                in Städten wie Zürich,
              </li>
              <li>
                <strong>Erotik-Massagen </strong> : Entspanne dich bei
                sinnlichen Massagen in deiner Nähe.
              </li>
              <li>
                <strong>OnlyFans-Verlinkungen </strong> : Entdecke exklusive
                Inhalte von frei arbeitenden Frauen.
              </li>
              <li>
                <strong>Sextreffen & Abenteuer </strong> : Plane aufregende
                Begegnungen in der ganzen Schweiz.
              </li>
              <li>
                <strong>Fetisch & BDSM </strong> : Tauche ein in eine Welt
                voller Fantasien und spezieller Vorlieben.
              </li>
            </ui>
            <br />
            Unser breites Angebot umfasst auch Sexpartys, Callgirls,
            Sugar-Babe-Dates und vieles mehr. Finde jetzt deine Vorliebe und
            erlebe unvergleichliche Stunden.
          </p>
          <br />
          <h3>Für jeden das passende Abenteuer: unser Angebot </h3>
          <br />
          <strong>Für inh</strong>
          <p>
            Suchst du nach aufregendem Privatsex mit scharfen Girls, heißen
            MILFs oder erfahrenen Frauen? Möchtest du deine Fantasien bei
            Gangbangs, Gruppensex oder Fetisch-Treffen ausleben? Bei
            onlyfriend.ch findest du Frauen, die dir all das und mehr
            ermöglichen.{" "}
          </p>
          <br /> <strong>Für sie</strong>
          <p>
            Du wünschst dir einen starken, dominanten Mann mit Ausstrahlung? Ob
            sinnliche Dates, leidenschaftliche Abenteuer oder wilder Sex – auf
            onlyfriend.ch findest du garantiert den richtigen Partner, der deine
            Wünsche wahr werden lässt.
          </p>
          <br />
          <h3>Erotik und Abenteuer in deiner Nähe </h3>
          <br />
          <p>
            Von Zürich über Aargau bis hin zu Zug – bei uns findest du Inserate
            von sexhungrigen Frauen und Männern in der ganzen Schweiz. Bestelle
            dir deinen Wunsch- partner direkt nach Hause oder triff dich in
            einem privaten Umfeld für heiße Stunden.
            <br />
            <br />
            In unserem <strong> Schweizer Erotikforum</strong> kannst du dich
            ausserdem mit anderen Mitgliedern austauschen und alles über die
            besten Clubs und Events in deiner Re- gion erfahren. Von Bordellen
            über Swingerclubs bis hin zu Domina-Studios – entdecke jetzt die
            heissesten Locations für deine Fantasien.
            <br />
            <br />
            <strong>Deine Plattform für Erotik, Sex und Leidenschaft</strong>
            <br />
            Erlebe unverbindliche Abenteuer, entdecke spannende Inserate und
            geniesse aufregende Treffen – alles diskret und sicher. Besuche
            jetzt <strong> onlyfriend.ch</strong> und finde deinen perfekten
            Sexpartner. Deine Erotikträume warten nur darauf, wahr zu werden!{" "}
          </p>
          <br />
          <br />
          <h3>Keywords für dein Erotikabenteuer in der Schweiz </h3>
          <br />
          <p>
            Auf <strong> onlyfriend.ch</strong> findest du eine grosse Auswahl
            an Erotik-Kleinanzeigen und Sexinseraten für jede Vorliebe. Ob du
            nach Callgirls, Escortservice, eroti- schen Massagen,
            Fetisch-Anzeigen oder BDSM-Kontakten suchst – bei uns bist du
            richtig. Unsere Plattform bietet zusätzlich Inserate für Sexpartys,
            Swin- ger-Kontakte, Adult-Dating, Dominas, Webcam-Shows und mehr.{" "}
            <br />
            <br />
            Finde private <strong> Sexkontakte </strong> in Städten wie{" "}
            <strong> Zürich, Luzern, Aargau</strong> oder anderen Regionen der
            Schweiz. Lass dich von aufregenden{" "}
            <strong>Sexpartys, Stripper-Inse- raten,</strong> oder diskreten
            TS-Inseraten inspirieren. Onlyfriend.ch ist dein verlässlicher
            Begleiter für <strong> Bordell-Inserate, Erotikjobs</strong> und
            alle anderen erotischen Aben- teuer. <br />
            <br />
            Erlebe prickelnde Stunden, entdecke die besten{" "}
            <strong>Erotik-Shops</strong> und genieße eine diskrete Atmosphäre –
            sicher, einfach und aufregend. Starte noch heute und entdecke deine
            Fantasien auf <strong> onlyfriend.ch</strong> .{" "}
          </p>
          <br />
          <h3>Warum Onlyfriend.ch für erotische Kontakte?</h3>
          <p>
            „Onlyfriend.ch bietet Ihnen eine Plattform, die auf Diskretion und
            Sicherheit ausgelegt ist. Treffen Sie attraktive Kontakte ohne
            komplizierte Anmeldung. Unsere geprüften Anzeigen sorgen für ein
            hochwertiges Nutzererlebnis.“
          </p>
          <h4>Entdecken Sie:</h4>
          <ul>
            <li>Erotische Massagen in Zürich und Genf</li>
            <li>Escort-Services für jeden Anlass</li>
            <li>Swinger- und Fetisch-Kontakte in Ihrer Region</li>
          </ul>
          <h4>Sextreffen leicht gemacht – So funktioniert's</h4>
          <ol>
            <li>
              <strong>Stöbern Sie durch unsere Kategorien:</strong> Wählen Sie
              aus einer Vielzahl von Anzeigen, die nach Ihren Vorlieben und
              Ihrem Standort sortiert sind.
            </li>
            <li>
              <strong>Kontakt aufnehmen – direkt und diskret:</strong> Ohne
              Anmeldung können Sie direkt über unsere Plattform mit den
              Anbietern in Kontakt treten. Alle Anzeigen sind klar und
              transparent gestaltet.
            </li>
            <li>
              <strong>Treffen Sie Ihre Wahl:</strong> Entscheiden Sie sich für
              ein Treffen oder eine Interaktion Ihrer Wahl. Unsere geprüften
              Anzeigen sorgen dafür, dass Sie sich auf Qualität und Diskretion
              verlassen können.
            </li>
            <li>
              <strong>Erleben Sie prickelnde Abenteuer:</strong> Genießen Sie
              Ihre Erfahrung mit einer Person, die Ihre Wünsche teilt – alles in
              einem sicheren und anonymen Rahmen.
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}

export default HomePage;
