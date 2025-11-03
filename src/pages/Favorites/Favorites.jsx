import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTeachers } from "../../services/teachersService";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import styles from "./Favorites.module.css";
import pageStyles from "../Teachers/Teachers.module.css";

const Favorites = () => {
  const favoriteIds = useSelector((state) => state.favorites.items) || [];
  const [favoriteTeachers, setFavoriteTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFavoriteTeachers = async () => {
      try {
        setLoading(true);
        setError("");

        if (favoriteIds.length === 0) {
          setFavoriteTeachers([]);
          return;
        }

        const allTeachers = await getAllTeachers();
        const favorites = allTeachers.filter((teacher) =>
          favoriteIds.includes(teacher.id)
        );
        setFavoriteTeachers(favorites);
      } catch (e) {
        setError("Не вдалося завантажити обраних викладачів");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteTeachers();
  }, [favoriteIds]);

  if (loading) {
    return (
      <div className={pageStyles.teachersPage}>
        <div className={styles["loading-indicator"]}>Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={pageStyles.teachersPage}>
        <div className={styles["error-message"]}>{error}</div>
      </div>
    );
  }

  return (
    <div className={pageStyles.teachersPage}>
      {favoriteTeachers.length === 0 ? (
        <div className={styles["empty-favorites"]}>
          <div className={styles["empty-icon"]}>💔</div>
          <h2>У вас поки немає обраних викладачів</h2>
          <p>
            Додайте викладачів до обраного, натиснувши на сердечко на їх картці
          </p>
          <a href="/teachers" className={styles["browse-teachers-btn"]}>
            Переглянути викладачів
          </a>
        </div>
      ) : (
        <>
          <div className={styles["favorites-count"]}>
            <p>У вас {favoriteTeachers.length} обраних викладачів</p>
          </div>

          <div className={pageStyles.teachersList}>
            {favoriteTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;
