import React, { useState } from "react";
import { Files, TextFieldLong, Textfield } from "@components/tags/Inputs";
import { useApi } from "@contexts/APIContext";
import { API_ADDRESS } from "@utils/API";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const BlogCreate = ({ editMode, blog }) => {
  const { api } = useApi();
  const router = useRouter();
  const [title, setTitle] = useState(editMode && blog ? blog.title : "");
  const [text, setText] = useState(editMode && blog ? blog.text : "");
  const [image, setImage] = useState(
    editMode && blog && blog.images && blog.images.length > 0
      ? `${blog.images[0]}`
      : null,
  );

  const uploadImage = (event) => {
    setImage(event.target.files[0]);
  };

  const deleteHandler = (event) => {
    event.preventDefault();
    setImage(null);
    blog.images = [];
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("blog", JSON.stringify({ title, text }));

    if (image) {
      if (typeof image === "string") {
        formData.append("oldImage", image);
      } else {
        formData.append("image", image);
      }
    }

    editMode ? api.updateBlog(blog._id, formData) : api.createBlog(formData);

    router.push("/blogs");
  };

  return (
    <>
      <Head>
        <title>Blog | Onlyfriend.ch</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Entdecken Sie auf unserer Webseite erotische Anzeigen für Sexkontake und Onlyfans Accounts in der Schweiz. Treffen Sie heiße Girls in Ihrer Nähe und erleben Sie prickelnde Abenteuer. Ohne Anmeldung können Sie direkt mit den Girls in Kontakt kommen."
        />
        <meta
          name="keywords"
          content="Erotische Anzeigen, Sex in Zürich, Blowjob in Zürich, Escort in Zürich, Gangbang in Zürich, Girlfriend Sex in Zürich, Striptease in Zürich, Sex in Aargau, Blowjob in Aargau, Escort in Aargau, Gangbang in Aargau, Girlfriend Sex in Aargau, Striptease in Aargau, Sex in Luzern, Blowjob in Luzern, Escort in Luzern, Gangbang in Luzern, Girlfriend Sex in Luzern, Striptease in Bern, Sex in Bern, Blowjob in Bern, Escort in Bern, Gangbang in Bern, Girlfriend Sex in Bern, Striptease in Bern, Sex in Basel, Blowjob in Basel, Escort in Basel, Gangbang in Basel, Girlfriend Sex in Basel, Striptease in Basel, Junge Frauen, Sexy Latinas, Escort, Sexy Studentin, Milf, Sextreffen, Webcam, Sexchat, Sexting, Cam2Cam, Erotik-Kleinanzeigen, Sexkontakte, Begleitservice, Callgirls, Escortservice, Erotische Massagen, Fetisch-Anzeigen, BDSM-Kontakte, Sexpartys, Swinger-Kontakte, Erotikjobs, Erotik-Shops, Webcam-Shows, Adult-Dating, Dominas, Bordell-Inserate, Stripper-Inserate, TS-Inserate, Onlyfans, Onlyfriends,"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <form className="form form--ad page" onSubmit={onSubmit}>
        <label>
          <h2 className="form__section-title" style={{ marginBottom: "0.5em" }}>
            {" "}
            Title:
          </h2>
          <Textfield
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          <h2 className="form__section-title" style={{ marginBottom: "0.5em" }}>
            Text:
          </h2>
          <TextFieldLong
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </label>
        <label>
          <h2 className="form__section-title" style={{ marginBottom: "0.5em" }}>
            Images:
          </h2>
          {blog && image && image.length < 1 ? (
            <>
              {blog.images && blog.images.length > 0 ? (
                <div className="image-container">
                  <Image
                    src={API_ADDRESS + blog.images[0]}
                    width={500}
                    height={500}
                    alt={blog.title}
                    className="blog-image"
                  />
                  <button
                    onClick={(event) => deleteHandler(event)}
                    className="delete-button"
                  >
                    <Image
                      src={"/assets/delete.png"}
                      width={500}
                      height={500}
                      alt="delete"
                      className="delete-icon"
                      loading="lazy"
                    />
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {image && (
                <div className="image-container">
                  <Image
                    key={image.lastModified}
                    id={"iv-3-1"}
                    name={"iv-3-1"}
                    src={
                      typeof image === "string"
                        ? `${API_ADDRESS}${image}`
                        : URL.createObjectURL(image)
                    }
                    width={500}
                    height={500}
                    alt={image.name}
                    style={{ marginBottom: "1em" }}
                    loading="lazy"
                  />
                  <button
                    onClick={(event) => deleteHandler(event)}
                    className="delete-button"
                  >
                    <Image
                      src={"/assets/delete.png"}
                      width={500}
                      height={500}
                      alt="delete"
                      className="delete-icon"
                      loading="lazy"
                    />
                  </button>
                </div>
              )}
            </>
          )}
          {!image && (
            <Files
              id="fu-4-1"
              name="fu-4-1"
              onChange={(e) => uploadImage(e)}
              accept="image/png, image/PNG, image/jpeg, image/JPEG, image/jpg, image/JPG, image/gif, image/GIF"
              multiple={false}
              required={true}
            />
          )}
        </label>
        <button className="button" type="submit" value="Create Blog Post">
          {editMode ? "Update" : "Submit"}
        </button>
      </form>
    </>
  );
};

export default BlogCreate;
