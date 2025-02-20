import React from "react";
import Blog from "@components/home/Blog";
import { useApi } from "@contexts/APIContext";
import ApiController from "@utils/API";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Script from "next/script";
export async function getServerSideProps({ req, locale }) {
  // Initialize the API helper class
  const api = new ApiController();
  // Authenticate the user
  const auth = req.cookies.Auth ? JSON.parse(req.cookies.Auth) : "";
  const user = await api.checkAuth(auth.token);
  // Fetch all props server side
  const blogs = await api.fetchBlogs();
  // Return all props to the page
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
      user,
      blogs,
    },
  };
}

const BlogList = ({ user, blogs }) => {
  const { api } = useApi();
  const router = useRouter();

  const deleteHandler = (event, id) => {
    event.preventDefault();
    api.deleteBlog(id);
    router.reload();
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Blogs | Onlyfriend.ch</title>
        <meta
          name="description"
          content="Finden Sie erotische Anzeigen und Sextreffen in der Schweiz. Entdecken Sie diskrete Kontakte in Zürich, Bern oder Basel – unkompliziert auf Onlyfriend.ch!"
        />
        <meta
          name="keywords"
          content="erotische Anzeigen, erotik anzeigen schweiz, erotik anzeigen zürich, erotik anzeigen bern, erotik anzeigen basel, erotik anzeigen sex, erotik anzeigen sextreffen, erotik anzeigen Schweiz, erotik anzeigen Zürich, erotik anzeigen Bern, erotik anzeigen Basel, erotik anzeigen sex, erotik anzeigen sextreffen, erotik anzeigen Schweiz, erotik anzeigen Zürich, erotik anzeigen Bern, erotik anzeigen Basel"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Blogs | Onlyfriend.ch" />
        <meta
          property="og:description"
          content="Finden Sie erotische Anzeigen und Sextreffen in der Schweiz. Entdecken Sie diskrete Kontakte in Zürich, Bern oder Basel – unkompliziert auf Onlyfriend.ch!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://onlyfriend.ch/ad-price" />

        <link rel="canonical" href="https://onlyfriend.ch/ad-price" />

        <Script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Preise für Erotische Anzeigen",
              "description": "Erotische Anzeigen und Sextreffen in der Schweiz",
              "url": "https://onlyfriend.ch/ad-price",
              "mainEntity": {
                "@type": "Product",
                "name": "Erotische Anzeigen",
                "description": "Anzeigenoptionen für erotische Kontakte in der Schweiz",
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "CHF",
                  "availability": "https://schema.org/InStock"
                } 
              }
            }
          `}
        </Script>
      </Head>
      <div className="page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5em",
          }}
        >
          <h1 className="page__title">Blogs</h1>
          {user && user.email === "cyrill.mueller@onlyfriend.ch" && (
            <Link
              href="/blog"
              className="button"
              style={{ alignSelf: "flex-end" }}
            >
              Create
            </Link>
          )}
        </div>
        <div className="blogs">
          {blogs &&
            blogs.map((blog) => (
              <Blog
                key={blog._id}
                blog={blog}
                api={api}
                user={user}
                deleteHandler={deleteHandler}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default BlogList;
