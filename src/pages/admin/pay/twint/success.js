import React from "react";
import PopUp from "@components/alerts/PopUp";
import ApiController from "@utils/API";
import Head from "next/head";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ query, req, locale }) {
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
  const amount = query.amount;
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      amount,
    },
  };
}

function HomePage({ user, amount }) {
  const router = useRouter();

  const closeHandler = () => {
    router.push("/");
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

      <div className="page page--home">
        <PopUp
          isOpen={true}
          setDisplayModal={() => {}}
          title="Erfolg"
          onClose={() => closeHandler()}
          type={""}
          message={
            <p>
              Dir wurde erfolgreich <strong>{amount / 100} Credits</strong>{" "}
              zugeschrieben.
            </p>
          }
        />
      </div>
    </>
  );
}

export default HomePage;
