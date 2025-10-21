import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroLeft}>
            <h1>
              Unlock your potential with the best{" "}
              <span className={styles.highlight}>language</span> tutors
            </h1>
            <p className={styles.heroSubtitle}>
              Embark on an Exciting Language Journey with Expert Language
              Tutors: Elevate your language proficiency to new heights by
              connecting with highly qualified and experienced tutors.
            </p>
            <Link
              to="/teachers"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Get started
            </Link>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImage}>
              <div className={styles.character}>👨‍💻</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>32,000 +</div>
            <div className={styles.statLabel}>Experienced tutors</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>300,000 +</div>
            <div className={styles.statLabel}>5-star tutor reviews</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>120 +</div>
            <div className={styles.statLabel}>Subjects taught</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>200 +</div>
            <div className={styles.statLabel}>Tutor nationalities</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
