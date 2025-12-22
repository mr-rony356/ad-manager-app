import { useState, useEffect, useRef } from "react";
import { Dropdown, Textfield } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Cookies from "js-cookie"; // Import the js-cookie library
import { FaRegUser } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { TbWorld } from "react-icons/tb";
const NavBar = ({ user }) => {
  const { t } = useTranslation("common");
  const { api } = useApi();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);
  const languageDropdownRef = useRef(null);

  const toggleLanguage = (value) => {
    router.push(router.pathname, router.asPath, { locale: value });
    setIsLanguageDropdownOpen(false);
  };

  const doLogout = () => {
    api.doLogout();
  };

  const encodeFilterValue = (value) => {
    return encodeURIComponent(
      value
        .replace(/[\s_-]+/g, "-")
        .replace(/\//g, "-")
        .replace(/&/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, ""),
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const encodedSearch = encodeFilterValue(searchQuery.trim());
      router.push(`/filter/search/${encodedSearch}`);
      setIsSearchOverlayOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    if (isSearchOverlayOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOverlayOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLanguageDropdownOpen]);

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
    <header className="bg-[#1a1a1a]">
      <nav className="nav" id="nav">
        <div className="nav__logoSupport">
          <Link href="/" passHref>
            <Image
              src={"/assets/logo.png"}
              width={500}
              height={500}
              alt="logo"
              className="logo h-16"
              loading="lazy"
            />
          </Link>
          <Link href="/support" passHref className="nav__support">
            Support
          </Link>
          <Link href="/blogs" passHref className="nav__support">
            Blogs
          </Link>
        </div>
        <div className="flex gap-4 items-center text-white  md:hidden">
          <div className="relative" ref={languageDropdownRef}>
            <div
              className="cursor-pointer"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
              <TbWorld size={24} />
            </div>
            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-gray-300 rounded-md shadow-lg z-50 min-w-[50px] text-xs">
                <button
                  onClick={() => toggleLanguage("de")}
                  className={`w-full text-left px-4 py-1 text-white hover:bg-gray-700 first:rounded-t-md ${
                    router.locale === "de" ? "bg-gray-700" : ""
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => toggleLanguage("en")}
                  className={`w-full text-left px-4 py-1 text-white hover:bg-gray-700 ${
                    router.locale === "en" ? "bg-gray-700" : ""
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => toggleLanguage("es")}
                  className={`w-full text-left px-4 py-1 text-white hover:bg-gray-700 last:rounded-b-md ${
                    router.locale === "es" ? "bg-gray-700" : ""
                  }`}
                >
                  ES
                </button>
              </div>
            )}
          </div>
          <Link href="/ad?type=free" passHref>
            <CiSquarePlus size={24} className="cursor-pointer" />
          </Link>
          <div
            className="cursor-pointer"
            onClick={() => setIsSearchOverlayOpen(true)}
          >
            <CiSearch size={24} />
          </div>
          <Link
            href={loggedIn ? "/admin" : "/login"}
            passHref
            className="cursor-pointer"
          >
            <FaRegUser size={20} />
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
              href="/support"
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
                href="/support"
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

            <li className="free-mobile-menu !py-12 flex">
              <div className="flex justify-between items-center">
                <Link
                  href="/ad?type=free"
                  passHref
                  className="button "
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("navBar__adButton")}
                </Link>
                <span className="freeBtn-mobile">{t("FreeButton")}</span>

                <div className="w-[70px]">
                  <Image
                    src="/FINAL/24.png"
                    alt="upvote"
                    width={200}
                    height={100}
                  />
                </div>
              </div>
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
                    <p className="adModal__credits">{user?.credits || 0}</p>
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
      {isSearchOverlayOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => {
            setIsSearchOverlayOpen(false);
            setSearchQuery("");
          }}
        >
          <div
            className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="inputBox">
                <input
                  ref={searchInputRef}
                  type="text"
                  id="nav-search"
                  className="p-[8px] rounded-md form__input--textfield border border-sky-500 text-base !tracking-wider w-full"
                  name="nav-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("searchInput")}
                />
              </div>
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOverlayOpen(false);
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 text-white border border-gray-300 rounded-md hover:bg-gray-700"
                >
                  {t("close")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                >
                  {t("searchInput")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
