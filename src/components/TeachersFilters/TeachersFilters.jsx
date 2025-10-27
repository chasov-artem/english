import React from "react";
import styles from "./TeachersFilters.module.css";

const TeachersFilters = ({ filters, onFilterChange }) => {
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
  ];

  const levels = [
    "A1 Beginner",
    "A2 Elementary",
    "B1 Intermediate",
    "B2 Upper-Intermediate",
    "C1 Advanced",
    "C2 Proficiency",
  ];

  const priceRanges = [
    { label: "All prices", value: "all" },
    { label: "Under $20", value: "0-20" },
    { label: "$20 - $30", value: "20-30" },
    { label: "Over $30", value: "30+" },
  ];

  const handleLanguageChange = (language) => {
    onFilterChange({ ...filters, selectedLanguage: language });
  };

  const handleLevelChange = (level) => {
    onFilterChange({ ...filters, selectedLevel: level });
  };

  const handlePriceChange = (priceRange) => {
    onFilterChange({ ...filters, priceRange });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <span className={styles.filterLabelText}>Languages</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={`${styles.filterSelect} ${styles.filterControl}`}
            value={filters.selectedLanguage || ""}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="">Select language</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <span className={styles.filterLabelText}>Level of knowledge</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={`${styles.filterSelect} ${styles.filterControl}`}
            value={filters.selectedLevel || ""}
            onChange={(e) => handleLevelChange(e.target.value)}
          >
            <option value="">Select level</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>
          <span className={styles.filterLabelText}>Price</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            className={`${styles.filterSelect} ${styles.filterControl}`}
            value={filters.priceRange || "all"}
            onChange={(e) => handlePriceChange(e.target.value)}
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <span className={styles.selectArrow} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default TeachersFilters;
