// components/SkeletonLoader.js
import React from "react";
import styles from "./SkeletonLoader.module.css"; // optional CSS module for styling

const SkeletonLoader = () => {
  return (
    <div className={styles.skeletonContainer}>
        <h1 style={{ color: "white" }}>
            Loading Ads Please Wait
        </h1>
      <div className={styles.skeletonContent}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className={styles.skeletonAd}></div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
