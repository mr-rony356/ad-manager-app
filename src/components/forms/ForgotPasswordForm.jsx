import React, { useState } from "react";
import { useApi } from "@contexts/APIContext";
import { useTranslation } from "next-i18next";

const ForgotPasswordForm = () => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [err, setErr] = useState("");
  const [suc, setSuc] = useState(false);

  const forgotPassword = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;

    const res = await api.forgotPassword(name);
    if (res.err) setErr(res.err);
    else setSuc(true);
  };

  return (
    <form onSubmit={forgotPassword}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3 style={{ textAlign: "center" }} className="form__title">
          {t("forgotPassword__title")}
        </h3>

        {!suc ? (
          <>
            <div className="inputBox">
              <span className="form__label" htmlFor="name">
                Email
              </span>
              <input
                className="form__input"
                id="name"
                type="text"
                name="name"
                required
              />
            </div>

            {err && typeof err === "string" && <p>{err}</p>}

            <button
              style={{ marginTop: "1.5em", justifySelf: "flex-end" }}
              className="button"
              type="submit"
            >
              {t("forgotPassword__button")}
            </button>
          </>
        ) : (
          <p>{t("forgotPassword__success")}</p>
        )}
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
