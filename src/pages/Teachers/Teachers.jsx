import React, { useEffect, useState } from "react";
import { getTeachersPaginated } from "../../services/teachersService";
import TeacherCard from "../../components/TeacherCard/TeacherCard";

const PAGE_SIZE = 4;

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [lastKey, setLastKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTeachers = async (initial = false) => {
    try {
      setLoading(true);
      setError("");

      const { teachers: chunk, lastKey: nextKey } = await getTeachersPaginated(
        PAGE_SIZE,
        initial ? null : lastKey
      );

      setTeachers((prev) => (initial ? chunk : [...prev, ...chunk]));
      setLastKey(nextKey);
    } catch (e) {
      setError("Не вдалося завантажити викладачів");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="teachers">
      <h1>Наші викладачі</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="teachers-grid" style={{ display: "grid", gap: 16 }}>
        {teachers.map((t) => (
          <TeacherCard key={t.id} teacher={t} />
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => loadTeachers(false)}
          disabled={loading || !lastKey}
        >
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
