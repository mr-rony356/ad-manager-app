import React, { useState } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import { Radio } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Head from "next/head";
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
  const prices = await api.fetchPrices(auth.token, "chf");
  // Return all props to the page
  return {
    props: {
      user,
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      initPrices: prices,
    },
  };
}

const CreditForm = ({ user, initPrices }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [prices, setPrices] = useState(initPrices);
  const [currency, setCurrency] = useState("chf");
  const [payment, setPayment] = useState();
  const [selectedPrice, setSelectedPrice] = useState();

  const fetchPrices = (currency) => {
    api.fetchPrices(undefined, currency).then((res) => {
      setPrices(res);
    });
  };

  const doCredit = (event) => {
    event.preventDefault();

    switch (payment) {
      case "twint":
        api.doPaymentViaTwint(selectedPrice).then((res) => {
          if (res.url) window.location.href = res.url;
        });
        break;
      case "creditcard":
        api.doPayment(selectedPrice.id).then((res) => {
          if (res.url) window.location.href = res.url;
        });
        break;
      default:
        break;
    }
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
            <form
              className="form form--credit"
              onSubmit={(event) => doCredit(event)}
            >
              <div className="form__section--credit card">
                <div className="form__sectionsCredit">
                  <div className="form__sectionsCreditTitleSpace">
                    <h2 className="form__section-title">
                      {t("creditForm__titleCredit")}
                    </h2>
                    <p className="credits">
                      {t("credits")} {user && user.credits}
                    </p>
                  </div>
                  <div className="form__choices">
                    <Radio
                      className="form_radioButton"
                      id={"rb-1-1"}
                      name="rb-1"
                      checked={currency === "chf"}
                      onChange={() => {
                        setCurrency("chf");
                        fetchPrices("chf");
                      }}
                      label={<p>CHF</p>}
                      required={true}
                    />
                    <Radio
                      id={"rb-1-2"}
                      name="rb-1"
                      checked={currency === "eur"}
                      onChange={() => {
                        setCurrency("eur");
                        fetchPrices("eur");
                      }}
                      label={<p>EUR</p>}
                      required={true}
                    />
                  </div>
                </div>
                <div className="form__sectionsCredit">
                  <h3 className="form__section-subtitle">
                    {t("creditForm__subtitleCredit")}
                  </h3>
                  <div className="form__card card--credit form__choices">
                    {prices &&
                      prices.length > 0 &&
                      prices
                        .sort((a, b) =>
                          a.unit_amount > b.unit_amount ? 1 : -1,
                        )
                        .map((price, i) => (
                          <Radio
                            key={i}
                            id={"rb-2-" + i}
                            name="rb-2"
                            checked={price === selectedPrice}
                            onChange={() => setSelectedPrice(price)}
                            label={
                              <>
                                <p>{price.nickname}</p>
                                <p>
                                  {currency.toUpperCase() +
                                    " " +
                                    price.unit_amount / 100 +
                                    ".-"}
                                </p>
                              </>
                            }
                            required={true}
                          />
                        ))}
                  </div>
                </div>
                <div className="form__choices">
                  <Radio
                    id={"rb-3-1"}
                    name="rb-3-1"
                    className="form__radioButton"
                    label={<p>Twint</p>}
                    checked={payment === "twint"}
                    onChange={() => setPayment("twint")}
                  />

                  <Radio
                    id={"rb-3-2"}
                    name="rb-3-2"
                    className="form__radioButton"
                    label={<p>Kreditkarte</p>}
                    checked={payment === "creditcard"}
                    onChange={() => setPayment("creditcard")}
                  />
                </div>
                <button
                  type="submit"
                  className="button credit--button"
                  disabled={!payment}
                >
                  {t("creditForm__creditButton")}
                </button>
              </div>

              <div className="form__sectionsCredit card">
                <h2 className="form__section-title">
                  {t("creditForm__titleCoupon")}
                </h2>
                <p>{t("creditForm__textCoupon")}</p>

                <input
                  className="form__input"
                  placeholder="Gutschein Code"
                ></input>
                <button className="button credit--button">
                  {t("creditForm__couponButton")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditForm;
