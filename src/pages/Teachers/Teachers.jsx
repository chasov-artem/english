import React, { useEffect, useState, useCallback } from "react";
import { getTeachersPaginated } from "../../services/teachersService";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import TeachersFilters from "../../components/TeachersFilters/TeachersFilters";
import styles from "./Teachers.module.css";

const PAGE_SIZE = 4;

const Teachers = () => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    selectedLanguage: "English",
    selectedLevel: "A1 Beginner",
    priceRange: "all",
  });

  const fetchTeachersPage = useCallback(
    async (cursorKey = null, append = false) => {
      if (append) {
        setIsFetchingMore(true);
      } else {
        setIsInitialLoading(true);
      }

      try {
        setError("");
        const { teachers, lastKey, hasMore: moreAvailable } =
          await getTeachersPaginated(PAGE_SIZE, cursorKey);

        setHasMore(moreAvailable);
        setCursor(lastKey);

        setAllTeachers((prev) => {
          if (!append) {
            return teachers;
          }

          const existingIds = new Set(prev.map((teacher) => teacher.id));
          const merged = [...prev];

          teachers.forEach((teacher) => {
            if (!existingIds.has(teacher.id)) {
              merged.push(teacher);
            }
          });

          return merged;
        });
      } catch (e) {
        setError("Не вдалося завантажити викладачів");
        console.error(e);
      } finally {
        if (append) {
          setIsFetchingMore(false);
        } else {
          setIsInitialLoading(false);
        }
      }
    },
    []
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  useEffect(() => {
    fetchTeachersPage();
  }, [fetchTeachersPage]);

  useEffect(() => {
    if (allTeachers.length === 0) {
      setFilteredTeachers([]);
      setDisplayedTeachers([]);
      return;
    }

    const filtered = allTeachers.filter((teacher) => {
      const matchesLanguage = filters.selectedLanguage
        ? teacher.languages.some((lang) =>
            lang.toLowerCase().includes(filters.selectedLanguage.toLowerCase())
          )
        : true;

      const matchesLevel = filters.selectedLevel
        ? teacher.levels.some((level) =>
            level.toLowerCase().includes(filters.selectedLevel.toLowerCase())
          )
        : true;

      const matchesPrice = (() => {
        if (filters.priceRange === "all") return true;
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
      })();

      return matchesLanguage && matchesLevel && matchesPrice;
    });

    setFilteredTeachers(filtered);

    const visibleCount = page * PAGE_SIZE;
    setDisplayedTeachers(filtered.slice(0, visibleCount));

    if (
      filtered.length < visibleCount &&
      hasMore &&
      cursor &&
      !isInitialLoading &&
      !isFetchingMore
    ) {
      fetchTeachersPage(cursor, true);
    }
  }, [
    allTeachers,
    filters,
    page,
    hasMore,
    cursor,
    isInitialLoading,
    isFetchingMore,
    fetchTeachersPage,
  ]);

  const handleLoadMore = useCallback(async () => {
    const nextPage = page + 1;
    const requiredCount = nextPage * PAGE_SIZE;

    if (filteredTeachers.length >= requiredCount) {
      setPage(nextPage);
      return;
    }

    if (hasMore && cursor && !isFetchingMore) {
      await fetchTeachersPage(cursor, true);
    }

    setPage(nextPage);
  }, [
    page,
    filteredTeachers.length,
    hasMore,
    cursor,
    isFetchingMore,
    fetchTeachersPage,
  ]);

  const canShowLoadMore =
    displayedTeachers.length > 0 &&
    (displayedTeachers.length < filteredTeachers.length || hasMore);

  return (
    <div className={styles.teachersPage}>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <TeachersFilters filters={filters} onFilterChange={handleFilterChange} />

      {isInitialLoading && (
        <p className={styles.loadingMessage}>Завантаження викладачів...</p>
      )}

      <div className={styles.teachersList}>
        {displayedTeachers.map((t) => (
          <TeacherCard
            key={t.id}
            teacher={t}
            selectedLevel={filters.selectedLevel}
          />
        ))}
      </div>

      {displayedTeachers.length === 0 && !isInitialLoading && (
        <p className={styles.noResults}>
          No teachers found with the selected filters
        </p>
      )}

      {canShowLoadMore && (
        <div className={styles.loadMoreContainer}>
          <button
            className={styles.loadMoreBtn}
            onClick={handleLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Teachers;
