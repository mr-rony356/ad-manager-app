import React from "react";
import AdminLinks from "@components/admin/AdminLinks";
import ApiController, { API_ADDRESS } from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
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
  const messages = await api.fetchMessages(auth.token, 30);
  const groupedMessages = messages?.reduce((groups, message) => {
    const groupId = [message.from[0].name, message.to[0].name]
      ?.sort()
      .join("-");
    groups[groupId] = groups[groupId] || [];
    groups[groupId].push(message);
    return groups;
  }, {});
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      messages,
      groupedMessages,
    },
  };
}

const Messages = ({ user, messages, groupedMessages }) => {
  const { t } = useTranslation("common");
  const userIcon = "/assets/user-icon.png";

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
        {user ? (
          <h1 className="adminPage__activeUser">Hallo {user.name}</h1>
        ) : (
          ""
        )}
        <div className="adminPage__content">
          <AdminLinks user={user} />
          <div className="adminPage__contentComponents">
            <h1 className="title messages--title">
              {t("admin__messagesTitle")}
            </h1>
            <div className="messages">
              <div className="message">
                {messages && messages.length === 0 ? (
                  <p>{t("admin__messagesText")}</p>
                ) : (
                  groupedMessages &&
                  Object.keys(groupedMessages).length > 0 &&
                  Object.keys(groupedMessages).map((group, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: `/admin/messages/${
                          groupedMessages[group][0].from[0].name === user.name
                            ? groupedMessages[group][0].to[0]._id
                            : groupedMessages[group][0].from[0]._id
                        }`,
                      }}
                    >
                      <div className="card ">
                        <div className="messages__flex">
                          <Image
                            src={
                              groupedMessages[group][0].from[0].name ===
                              user.name
                                ? groupedMessages[group][0].to[0].image
                                  ? API_ADDRESS +
                                    groupedMessages[group][0].to[0].image
                                  : userIcon
                                : groupedMessages[group][0].from[0].image
                                  ? API_ADDRESS +
                                    groupedMessages[group][0].from[0].image
                                  : userIcon
                            }
                            width={500}
                            height={500}
                            alt="user-icon"
                            className={
                              groupedMessages[group][0].from[0].name ===
                              user.name
                                ? groupedMessages[group][0].to[0].image
                                  ? "messages__userImage"
                                  : "messages__userIcon"
                                : groupedMessages[group][0].from[0].image
                                  ? "messages__userImage"
                                  : "messages__userIcon"
                            }
                            loading="lazy"
                          />
                          <div>
                            <span className="message__time">
                              {new Intl.DateTimeFormat("de-CH", {
                                hour: "numeric",
                                minute: "numeric",
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              }).format(groupedMessages[group][0].timestamp)}
                            </span>
                            <h2 className="message__title">
                              {groupedMessages[group][0].from[0].name ===
                              user.name
                                ? groupedMessages[group][0].to[0].name
                                : groupedMessages[group][0].from[0].name}
                            </h2>
                            <p className="message__message">
                              {groupedMessages[group][0].message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
