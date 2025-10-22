import React from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import headImage from "../../assets/head.png";
import headImage2x from "../../assets/head_2x.png";
import macImage from "../../assets/mac.png";
import macImage2x from "../../assets/mac_2x.png";

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
            <img
              src={headImage}
              srcSet={`${headImage} 1x, ${headImage2x} 2x`}
              alt="Head"
              className={styles.head}
            />
            <img
              src={macImage}
              srcSet={`${macImage} 1x, ${macImage2x} 2x`}
              alt="Mac"
              className={styles.mac}
            />
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>32,000 +</div>
            <div className={styles.statLabel}>
              Experienced<br></br> tutors
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>300,000 +</div>
            <div className={styles.statLabel}>
              5-star tutor<br></br> reviews
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>120 +</div>
            <div className={styles.statLabel}>
              Subjects<br></br> taught
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>200 +</div>
            <div className={styles.statLabel}>
              Tutor<br></br> nationalities
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
