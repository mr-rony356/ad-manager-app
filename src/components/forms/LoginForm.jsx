import { useState } from "react";
import { useApi } from "@contexts/APIContext";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LoginForm = () => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [err, setErr] = useState("");
  const router = useRouter();

  const doLogin = async (event) => {
    event.preventDefault();

    const res = await api.doLogin(
      event.target.name.value,
      event.target.password.value,
    );

    if (res.err) setErr(res.err);
    else router.push("/admin");
  };

  return (
    <form className="form form--login" onSubmit={doLogin}>
      <h3 className="form__title">{t("login")}</h3>
      <div className="inputBox">
        <span className="form__label" htmlFor="name">
          {t("login__userName")}
        </span>
        <input
          className="form__input"
          id="name"
          type="text"
          name="name"
          required
        />
      </div>

      <div className="inputBox">
        <span className="form__label" htmlFor="name">
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

      {err && <p style={{ textAlign: "center" }}>{t("login__error")}</p>}

      <button className="button form--button" type="submit">
        {t("login__button")}
      </button>
    </form>
  );
};

export default LoginForm;
