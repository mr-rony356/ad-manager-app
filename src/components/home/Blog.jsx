import React, { useEffect, useState } from "react";
import { API_ADDRESS } from "@utils/API";
import Image from "next/image";
import Link from "next/link";

const Blog = ({ blog, user, deleteHandler }) => {
  const [pastTime, setPastTime] = useState("");
  const deleteIcon = "/assets/delete.png";
  const creationDate = blog.timestamp;

  const currentDate = new Date();
  const timeDifference = currentDate - new Date(creationDate);

  const seconds = Math.floor((timeDifference / 1000) % 60);
  const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  useEffect(() => {
    let pastTime = "";
    if (days) {
      pastTime += "vor " + days + (days === 1 ? " Tag" : " Tagen");
    } else if (hours) {
      pastTime += "vor " + hours + (hours === 1 ? " Stunde" : " Stunden");
    } else if (minutes) {
      pastTime += "vor " + minutes + (minutes === 1 ? " Minute" : " Minuten");
    } else {
      pastTime += "vor " + seconds + (seconds === 1 ? " Sekunde" : " Sekunden");
    }
    setPastTime(pastTime);
  }, [hours, minutes, days, seconds]);

  const blogSlug = blog.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <Link
      href={`/blog/${blog._id}/${blogSlug}`}
      as={`/blog/${blog._id}/${blogSlug}`}
      className="blog"
    >
      <div style={{ position: "relative", width: "100%" }}>
        {blog.images && blog.images.length > 0 && (
          <Image
            src={`${API_ADDRESS + blog.images[0]}`}
            width={500}
            height={500}
            alt="Blog"
            className="ad__image"
            loading="lazy"
            unoptimized={true}
          />
        )}
      </div>
      {user && user.email === "cyrill.mueller@onlyfriend.ch" && (
        <button
          onClick={(event) => deleteHandler(event, blog._id)}
          style={{
            selfAlign: "flex-end",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.2em",
            position: "absolute",
            right: "10%",
          }}
        >
          <Image
            src={deleteIcon}
            width={500}
            height={500}
            alt="delete"
            className="delete-icon"
            loading="lazy"
          />
        </button>
      )}

      <div className="ad__content">
        <div
          className="ad__titleTime"
          style={{ marginBottom: "1em", alignItems: "center" }}
        >
          <h1 className="blog__title">{blog.title}</h1>
          <p className="ad__time">{pastTime}</p>
        </div>
        <pre className="ad__text">
          {blog.text.length > 200
            ? blog.text.substring(0, 200) + "..."
            : blog.text}
        </pre>
      </div>
    </Link>
  );
};

export default Blog;
