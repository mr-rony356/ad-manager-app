import React, { useState } from "react";
import AdminLinks from "@components/admin/AdminLinks";
import { Textfield } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getServerSideProps({ params, req, locale }) {
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
  const id = params.id;
  const messages = await api.fetchMessagesWithUser(auth.token, id);
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      messages,
    },
  };
}

const Chat = ({ user, messages }) => {
  const { api } = useApi();
  const router = useRouter();
  const { id } = router.query;
  const [replyMessage, setReplyMessage] = useState("");
  const arrow = "/assets/arrow.png";

  const handleReplySubmit = () => {
    api.sendMessage(replyMessage, id).then(() => {
      api.fetchMessagesWithUser(user.token, id).then((res) => {
        setReplyMessage("");
        router.replace(router.asPath);
      });
    });
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
            <Image
              src={arrow}
              width={500}
              height={500}
              alt="arrow"
              className="adDetail__backArrow"
              loading="lazy"
              onClick={() => router.push("/admin/messages")}
            />
            <h2 className="chat__title">
              Chat with{" "}
              {messages && messages.length > 0
                ? messages[0].from[0].name === user.name
                  ? messages[0].to[0].name
                  : messages[0].from[0].name
                : ""}
            </h2>
            <div className="chat">
              {messages &&
                messages.length > 0 &&
                messages.map((message, index) => (
                  <p
                    key={index}
                    className={
                      message.from[0].name === user.name
                        ? "chat__myMessage"
                        : "chat__partnerMessage"
                    }
                  >
                    {message.message}
                  </p>
                ))}
            </div>
            <div className="chat__response">
              <div className="popup-content">
                <Textfield
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Enter your reply here"
                />
                <button className="button" onClick={handleReplySubmit}>
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
