import React from "react";
import "./TeachersFilters.css";

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
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const priceRanges = [
    { label: "All prices", value: "all" },
    { label: "Under $20", value: "0-20" },
    { label: "$20 - $30", value: "20-30" },
    { label: "Over $30", value: "30+" },
  ];

  const handleLanguageChange = (language) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];
    onFilterChange({ ...filters, languages: newLanguages });
  };

  const handleLevelChange = (level) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter((l) => l !== level)
      : [...filters.levels, level];
    onFilterChange({ ...filters, levels: newLevels });
  };

  const handlePriceChange = (priceRange) => {
    onFilterChange({ ...filters, priceRange });
  };

  const clearFilters = () => {
    onFilterChange({
      languages: [],
      levels: [],
      priceRange: "all",
    });
  };

  const hasActiveFilters =
    filters.languages.length > 0 ||
    filters.levels.length > 0 ||
    filters.priceRange !== "all";

  return (
    <div className="teachers-filters">
      <div className="filters-header">
        <h3>Фільтри</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Очистити фільтри
          </button>
        )}
      </div>

      <div className="filter-section">
        <h4>Мови</h4>
        <div className="filter-options">
          {languages.map((language) => (
            <label key={language} className="filter-option">
              <input
                type="checkbox"
                checked={filters.languages.includes(language)}
                onChange={() => handleLanguageChange(language)}
              />
              <span>{language}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Рівень</h4>
        <div className="filter-options">
          {levels.map((level) => (
            <label key={level} className="filter-option">
              <input
                type="checkbox"
                checked={filters.levels.includes(level)}
                onChange={() => handleLevelChange(level)}
              />
              <span>{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Ціна за годину</h4>
        <div className="filter-options">
          {priceRanges.map((range) => (
            <label key={range.value} className="filter-option">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceChange(range.value)}
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachersFilters;
