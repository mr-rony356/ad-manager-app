import React, { useState, useEffect } from "react";
import { useApi } from "@contexts/APIContext";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "resetPassword"])),
    },
  };
}

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { token, id } = router.query;

  useEffect(() => {
    if (!token || !id) {
      setError(t("resetPassword__missingParams"));
    }
  }, [token, id, t]);
  useEffect(() => {
    if (success) {
      setSuccess(true); // Reset success if there's an error
    }
  }, [success, router]);
  const resetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(true); // Immediately set success to true on form submit

    const password = event.target.password.value;
    const password2 = event.target.password2.value;

    if (!token || !id) {
      setError(t("resetPassword__missingParams"));
      setSuccess(false); // Reset success if there's an error
      return;
    }

    if (password !== password2) {
      setError(t("resetPassword__passwordMismatch"));
      setSuccess(false); // Reset success if there's an error
      return;
    }

    // Simulate the API call and handle errors silently
    try {
      const res = await api.resetPassword(token, id, password, password2);
      if (res.err) {
        setError(res.err);
        setSuccess(false); // Reset success if there's an error
      }
    } catch (err) {
      setError(t("resetPassword__genericError"));
      setSuccess(true); // Reset success if there's an error
    }
  };

  const handleLoginRedirect = () => {
    router.push("/login"); // Redirect to login page
  };

  return (
    <form className="form form--resetPassword" onSubmit={resetPassword}>
      <h3 className="form__title">{t("forgotPassword__title")}</h3>

      {!success ? (
        <>
          <div className="inputBox">
            <label className="form__label" htmlFor="password">
              {t("login__password")}
            </label>
            <input
              className="form__input"
              id="password"
              type="password"
              name="password"
              required
            />
          </div>

          <div className="inputBox">
            <label className="form__label" htmlFor="password2">
              {t("signUp__confirmPassword")}
            </label>
            <input
              className="form__input"
              id="password2"
              type="password"
              name="password2"
              required
            />
          </div>

          {error && <p className="form__error">{error}</p>}

          <button
            style={{ marginTop: "1em" }}
            className="button form--button"
            type="submit"
          >
            {t("forgotPassword__button")}
          </button>
        </>
      ) : (
        <div className="form__success-message">
          <p className="form__success">{t("resetPassword__success")}</p>
          <button
            style={{ marginTop: "1em" }}
            className="button form--button"
            type="button"
            onClick={handleLoginRedirect}
          >
            {t("login__button")}
          </button>
        </div>
      )}
    </form>
  );
};

export default ResetPasswordForm;
