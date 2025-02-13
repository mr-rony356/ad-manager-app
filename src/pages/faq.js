import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import Script from "next/script";
import Head from "next/head";


const FAQPage = () => {
  const { t } = useTranslation("faq");
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

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
      <h1 className="text-3xl font-bold text-center mb-8">{t("title")}</h1>
      <div className="space-y-4">
        {t("questions", { returnObjects: true }).map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() => toggleAnswer(index)}
              className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 focus:outline-none flex justify-between items-center"
            >
              <span className="font-semibold text-lg text-gray-800">{item.q}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="px-4 py-3 bg-white text-lg text-gray-700">{item.a}</div>
            )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common","faq"])),
    },
  };
}

export default FAQPage;
