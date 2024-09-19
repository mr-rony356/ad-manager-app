import React, { useState } from "react";
import { useApi } from "@contexts/APIContext";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router"; // Use useRouter for Next.js
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ["common", "resetPassword"],
        null,
        ["en", "de"],
      )),
    },
  };
}

const ResetPasswordForm = () => {
  const { t } = useTranslation();
  const { api } = useApi();
  const [err, setErr] = useState("");
  const [suc, setSuc] = useState(false);

  const router = useRouter(); // useRouter hook from Next.js
  const { token, id } = router.query; // Get query params directly

  const resetPassword = async (event) => {
    event.preventDefault();
    const password = event.target.password.value;
    const password2 = event.target.password2.value;

    // Ensure that token and id are present before making API call
    if (!token || !id) {
      setErr("Missing token or user ID");
      return;
    }

    const res = await api.resetPassword(token, id, password, password2);
    if (res.err) setErr(res.err);
    else setSuc(true);
  };

  return (
    <form className="form form--resetPassword" onSubmit={resetPassword}>
      <h3 className="form__title">{t("forgotPassword__title")}</h3>

      {!suc ? (
        <>
          <div className="inputBox">
            <span className="form__label" htmlFor="password">
              {t("login__password")}
            </span>
            <input
              className="form__input"
              id="password"
              type="password"
              name="password"
              required
            />
          </div>

          <div className="inputBox">
            <span className="form__label" htmlFor="password-2">
              {t("signUp__confirmPassword")}
            </span>
            <input
              className="form__input"
              id="password2"
              type="password"
              name="password2"
              required
            />
          </div>

          {err && typeof err === "string" && <p>{err}</p>}

          <button
            style={{ marginTop: "1em" }}
            className="button form--button"
            type="submit"
          >
            {t("forgotPassword__button")}
          </button>
        </>
      ) : (
        <p>{t("resetPassword__success")}</p>
      )}
    </form>
  );
};

export default ResetPasswordForm;
