import { useState } from "react";
import { Dropdown } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie"; // Import the js-cookie library
const NavBar = ({ user }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = (value) => {
    router.push(router.pathname, router.asPath, { locale: value });
  };

  const doLogout = () => {
    api.doLogout();
  };
  // Extract token and user data from the cookie
  const cookieValue = Cookies.get("Auth");
  let loggedIn = false;
  let userName = "";
  let token = "";

  if (cookieValue) {
    try {
      const parsedCookie = JSON.parse(cookieValue); // Parse the JSON string
      token = parsedCookie.token;
      userName = parsedCookie.user?.name || ""; // Extract the name
      loggedIn = !!token; // Check if the token exists
    } catch (error) {
      console.error("Failed to parse cookie:", error);
    }
  }
  return (
    <header>
      <nav className="nav" id="nav">
        <div className="nav__logoSupport">
          <Link href="/" passHref>
            <Image
              src={"/assets/logo.png"}
              width={500}
              height={500}
              alt="logo"
              className="logo h-24"
              loading="lazy"
            />
          </Link>
          <Link href="/pageSupport" passHref className="nav__support">
            Support
          </Link>
          <Link href="/blogs" passHref className="nav__support">
            Blogs
          </Link>
        </div>

        <label
          className="menu-button-container"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div
            className={`menu-button ${isMenuOpen ? "menu-button-transformed" : ""}`}
          ></div>
        </label>

        <ul className="menu">
          <li>
            <Link
              href="/pageSupport"
              passHref
              className="nav__supportMenu"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              passHref
              className="nav__supportMenu"
              onClick={() => setIsMenuOpen(false)}
            >
              Blogs
            </Link>
          </li>

          <li>
            <Link
              href="/ad?type=free"
              passHref
              className="button mainAdButton"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("navBar__adButton")}
            </Link>
            <span className="freeBtn">{t("FreeButton")}</span>
          </li>

          <li className="flex gap-3">
            <Link
              href={loggedIn ? "/admin" : "/login"}
              passHref
              className="nav__login"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src={
                  user && !user.err && user.image
                    ? API_ADDRESS + user.image
                    : "/assets/user-icon.png"
                }
                width={25}
                height={30}
                alt="user-icon"
                className="nav__userIcon"
                loading="lazy"
              />
              <p className="login__button">
                {loggedIn ? userName : t("navBar__SignUpButton")}
              </p>
            </Link>
            <div className="relative inline-block !text-white rounded-md cursor-pointer text-sm">
              <select
                className="bg-transparent border border-gray-300 rounded-md px-1  py-1  cursor-pointer text-white"
                id="lang"
                name="lang"
                value={router.locale}
                onChange={(event) => toggleLanguage(event.target.value)}
              >
                <option value="de" className="text-white">
                  DE
                </option>
                <option value="en" className="text-white">
                  EN
                </option>
                <option value="es" className="text-white">
                  ES
                </option>
              </select>
            </div>
          </li>
        </ul>
        {isMenuOpen && (
          <ul className="mobile_menu">
            <li>
              <Link
                href="/pageSupport"
                passHref
                className="nav__supportMenu"
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                passHref
                className="nav__supportMenu"
                onClick={() => setIsMenuOpen(false)}
              >
                Blogs
              </Link>
            </li>

            <li className="free-mobile-menu !py-12">
              <Link
                href="/ad?type=free"
                passHref
                className="button"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("navBar__adButton")}
              </Link>
              <span className="freeBtn-mobile">{t("FreeButton")}</span>
            </li>

            <li>
              <Link
                href={loggedIn ? "/admin" : "/login"}
                passHref
                className="nav__login"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src={
                    user && !user.err && user.image
                      ? API_ADDRESS + user.image
                      : "/assets/user-icon.png"
                  }
                  width={25}
                  height={30}
                  alt="user-icon"
                  className="nav__userIcon"
                  loading="lazy"
                />
                <p className="login__button">
                  {loggedIn ? userName : t("navBar__SignUpButton")}
                </p>
              </Link>
            </li>
            {loggedIn && isMenuOpen && (
              <>
                <li>
                  <Link
                    href="/admin/manager"
                    passHref
                    className="nav__supportMenu"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("admin__linkOfferManager")}
                  </Link>
                </li>
                <li>
                  <div className="admin__linksCreditDiv">
                    <Link
                      href="/admin/credits"
                      passHref
                      className="nav__supportMenu"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t("admin__linkCredits")}
                    </Link>
                    <p className="adModal__credits">{user.credits}</p>
                  </div>
                </li>
                <li>
                  <Link
                    href="/admin/messages"
                    passHref
                    className="nav__supportMenu"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("admin__linkMessages")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/favorites"
                    passHref
                    className="nav__supportMenu"
                    htmlFor="menu-toggle"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("admin__linkFavorites")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    passHref
                    className="nav__supportMenu"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("admin__linkSettings")}
                  </Link>
                </li>
                {user &&
                  !user.err &&
                  user.email === "cyrill.mueller@onlyfriend.ch" && (
                    <li>
                      <Link
                        href="/admin/verifications"
                        passHref
                        className="nav__supportMenu"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {t("admin__linkVerifications")}
                      </Link>
                    </li>
                  )}
                <li>
                  <Link href="/" passHref className="button" onClick={doLogout}>
                    {t("admin__linkLogout")}
                  </Link>
                </li>
              </>
            )}
            <li className="nav__languageLi">
              <Dropdown
                className="nav__language"
                id="lang"
                name="lang"
                value={router.locale}
                onChange={(event) => toggleLanguage(event.target.value)}
                options={[
                  <option key={0} value="de" style={{ color: "black" }}>
                    DE
                  </option>,
                  <option key={1} value="en" style={{ color: "black" }}>
                    EN
                  </option>,
                  <option key={2} value="es" style={{ color: "black" }}>
                    ES
                    </option>,
                ]}
              />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
