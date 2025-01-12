import React, { useState } from "react";
import PopUp from "@components/alerts/PopUp";
import { useApi } from "@contexts/APIContext";
import { useTranslation } from "next-i18next";

const SignupForm = ({ setBody }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const [err, setErr] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [displayModal, setDisplayModal] = useState("");
  const [email, setEmail] = useState("");

  const doSignup = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const password2 = event.target.password2.value;

    setEmail(email);

    const res = await api.doSignup(name, email, password, password2);
    console.log("signup", res);
    if (res.err) setErr(res.err);
    else setDisplayModal("register");
  };

  const closeHandler = (e) => {
    setDisplayModal("");
    setBody("Login");
  };

  return (
    <>
      <form className="form form--signup" onSubmit={doSignup}>
        <h3 className="form__title">{t("signup__title")}</h3>
        <div className="inputBox">
          <span className="form__label" htmlFor="name">
            {t("signup__userName")}
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
          <span className="form__label" htmlFor="email">
            Email
          </span>
          <input
            className="form__input"
            id="email"
            type="email"
            name="email"
            required
          />
        </div>

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

        {err && (
          <p className="text-red-600">
            {err === "The email is already taken" ? t("signup__error") : err}
          </p>
        )}
        <div className="form__agbCheckbox">
          <input
            className="agbCheckbox"
            onChange={() => setDisabled(!disabled)}
            type="checkbox"
            id="agbCheckbox"
            aria-label=" "
            required
          />
          <label htmlFor="agbCheckbox">
            Ich bestätige, die AGB gelesen zu haben und akzeptiere diese. Zudem
            bestätige ich, dass ich über 18 Jahre alt bin.
          </label>
        </div>
        <button
          disabled={disabled}
          className="button form--button"
          type="submit"
        >
          {t("signUp__button")}
        </button>
      </form>
      <PopUp
        isOpen={displayModal === "register"}
        onClose={() => closeHandler()}
        title={"Registrierung erfolgreich"}
        message={
          <>
            Eine E-Mail wurde an <strong>{email}</strong> gesendet. Sie enthält
            einen Link, den Sie anklicken müssen, um Ihr Benutzerkonto zu
            bestätigen. Checken Sie gleich Ihre Mailbox und schon kann es
            losgehen.
          </>
        }
      />
    </>
  );
};

export default SignupForm;
