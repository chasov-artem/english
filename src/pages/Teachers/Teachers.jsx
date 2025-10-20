import React, { useEffect, useState } from "react";
import {
  getTeachersPaginated,
  getAllTeachers,
  filterTeachers,
} from "../../services/teachersService";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import TeachersFilters from "../../components/TeachersFilters/TeachersFilters";

const PAGE_SIZE = 4;

const Teachers = () => {
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [displayedTeachers, setDisplayedTeachers] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    languages: [],
    levels: [],
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
    const filtered = filterTeachers(allTeachers, filters);
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
    <div className="teachers">
      <h1>Наші викладачі</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <TeachersFilters filters={filters} onFilterChange={handleFilterChange} />

      <div className="teachers-results">
        <p>Знайдено викладачів: {filteredTeachers.length}</p>
      </div>

      <div className="teachers-grid" style={{ display: "grid", gap: 16 }}>
        {displayedTeachers.map((t) => (
          <TeacherCard key={t.id} teacher={t} />
        ))}
      </div>

      {displayedTeachers.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666", marginTop: "2rem" }}>
          Викладачів не знайдено за обраними фільтрами
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <button onClick={loadMoreTeachers} disabled={loading || !lastKey}>
          {loading
            ? "Завантаження..."
            : lastKey
            ? "Завантажити ще"
            : "Більше немає"}
        </button>
      </div>
    </div>
  );
};

export default Teachers;
