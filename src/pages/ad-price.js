import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import Script from "next/script";

const AdPricePage = () => {
  const { t } = useTranslation("ad-price");

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Preise für Erotische Anzeigen | Onlyfriend.ch</title>
        <meta
          name="description"
          content="Finden Sie erotische Anzeigen und Sextreffen in der Schweiz. Entdecken Sie diskrete Kontakte in Zürich, Bern oder Basel – unkompliziert auf Onlyfriend.ch!"
        />
        <meta
          name="keywords"
          content="erotische Anzeigen, Sextreffen, Schweiz, Zürich, Bern, Basel, diskrete Kontakte, Escort, erotische Massagen, Anzeigenpreise"
        />
        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Preise für Erotische Anzeigen in der Schweiz | Onlyfriend.ch"
        />
        <meta
          property="og:description"
          content="Finden Sie erotische Anzeigen und Sextreffen in der Schweiz. Entdecken Sie diskrete Kontakte in Zürich, Bern oder Basel – unkompliziert auf Onlyfriend.ch!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://onlyfriend.ch/ad-price" />

        <link rel="canonical" href="https://onlyfriend.ch/ad-price" />

        <Script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Preise für Erotische Anzeigen",
              "description": "Erotische Anzeigen und Sextreffen in der Schweiz",
              "url": "https://onlyfriend.ch/ad-price",
              "mainEntity": {
                "@type": "Product",
                "name": "Erotische Anzeigen",
                "description": "Anzeigenoptionen für erotische Kontakte in der Schweiz",
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "CHF",
                  "availability": "https://schema.org/InStock"
                } 
              }
            }
          `}
        </Script>
      </Head>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p className="text-lg text-gray-800 mb-4">{t("intro")}</p>
        <p className="text-base text-gray-700 mb-8">{t("details")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("options_title")}</h2>
        <p className="text-lg  mb-4">{t("option_description")}</p>
        <ul className="space-y-2 mb-8 max-w-xl">
          {t("options", { returnObjects: true }).map((option, index) => (
            <li key={index} className="flex justify-between text-gray-800">
              <span className="font-medium">{option.duration}</span>
              <span className="text-gray-600">{option.price}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-4">{t("why_free_title")}</h2>
        <p className="text-base text-gray-700 mb-8">{t("why_free")}</p>

        <h2 className="text-2xl font-semibold mb-4">{t("benefits_title")}</h2>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          {t("benefits", { returnObjects: true }).map((benefit, index) => (
            <li key={index} className="text-gray-700">
              {benefit}
            </li>
          ))}
        </ul>

        <div className="bg-gray-100 p-6 rounded-lg text-center mb-8">
          <h3 className="text-xl font-semibold mb-2">{t("cta_title")}</h3>
          <p className="text-base text-gray-800 mb-4">{t("cta_text")}</p>
          <a
            href="/ad?type=free"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            {t("cta_link")}
          </a>
        </div>

        <p className="text-base text-gray-600 mb-4">{t("support")}</p>
        <p className="text-sm text-gray-500">{t("footer")}</p>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "ad-price"])),
    },
  };
}

export default AdPricePage;
