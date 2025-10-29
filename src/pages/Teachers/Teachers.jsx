import React, { useEffect, useState } from "react";
import {
  getTeachersPaginated,
  getAllTeachers,
  filterTeachers,
} from "../../services/teachersService";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import TeachersFilters from "../../components/TeachersFilters/TeachersFilters";
import styles from "./Teachers.module.css";

const PAGE_SIZE = 4;

const Teachers = () => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    selectedLanguage: "English",
    selectedLevel: "A1 Beginner",
    priceRange: "all",
  });

  const loadAllTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const teachers = await getAllTeachers();
      setAllTeachers(teachers);
    } catch (e) {
      setError("Не вдалося завантажити викладачів");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTeachers];

    // Filter by language
    if (filters.selectedLanguage) {
      filtered = filtered.filter((teacher) =>
        teacher.languages.some((lang) =>
          lang.toLowerCase().includes(filters.selectedLanguage.toLowerCase())
        )
      );
    }

    // Filter by level
    if (filters.selectedLevel) {
      filtered = filtered.filter((teacher) =>
        teacher.levels.some((level) =>
          level.toLowerCase().includes(filters.selectedLevel.toLowerCase())
        )
      );
    }

    // Filter by price
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((teacher) => {
        const price = teacher.price_per_hour;
        switch (filters.priceRange) {
          case "0-20":
            return price < 20;
          case "20-30":
            return price >= 20 && price <= 30;
          case "30+":
            return price > 30;
          default:
            return true;
        }
      });
    }

    setFilteredTeachers(filtered);
    setDisplayedTeachers(filtered.slice(0, PAGE_SIZE));
    setLastKey(filtered.length > PAGE_SIZE ? PAGE_SIZE - 1 : null);
  };

  const loadMoreTeachers = () => {
    const currentCount = displayedTeachers.length;
    const nextBatch = filteredTeachers.slice(
      currentCount,
      currentCount + PAGE_SIZE
    );
    setDisplayedTeachers((prev) => [...prev, ...nextBatch]);
    setLastKey(
      currentCount + PAGE_SIZE < filteredTeachers.length
        ? currentCount + PAGE_SIZE - 1
        : null
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    loadAllTeachers();
  }, []);

  useEffect(() => {
    if (allTeachers.length > 0) {
      applyFilters();
    }
  }, [allTeachers, filters]);

  return (
    <div className={styles.teachersPage}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <TeachersFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className={styles.teachersList}>
        {displayedTeachers.map((t) => (
          <TeacherCard key={t.id} teacher={t} />
        ))}
      </div>

      {displayedTeachers.length === 0 && !loading && (
        <p className={styles.noResults}>
          No teachers found with the selected filters
        </p>
      )}

      {displayedTeachers.length > 0 && lastKey && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreBtn}
            onClick={loadMoreTeachers}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Teachers;
