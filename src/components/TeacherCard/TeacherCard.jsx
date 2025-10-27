import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectFavorites } from "../../store";
import { toggleFavorite } from "../../store/favoritesSlice";
import LogInModal from "../Modal/LogInModal";
import BookingModal from "../Modal/BookingModal";
import { FaHeart, FaRegHeart, FaStar, FaDesktop } from "react-icons/fa";
import styles from "./TeacherCard.module.css";

const TeacherCard = ({ teacher }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const currentUser = useSelector(selectCurrentUser);
  const favorites = useSelector(selectFavorites);
  const dispatch = useDispatch();

  const isFavorite = (id) => favorites.includes(id);

  const handleFavoriteClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    dispatch(toggleFavorite(teacher.id));
  };

  const handleBookLesson = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setShowBookingModal(true);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={styles.starFilled} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className={styles.starHalf} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.starEmpty} />);
    }

    return stars;
  };

  return (
    <>
      <div className={styles.teacherCard}>
        <div className={styles.cardHeader}>
          <div className={styles.avatarContainer}>
            <img
              src={teacher.avatar_url}
              alt={`${teacher.name} ${teacher.surname}`}
              className={styles.teacherAvatar}
            />
            <div className={styles.onlineIndicator}></div>
          </div>

          <div className={styles.teacherInfo}>
            <h3 className={styles.teacherName}>
              {teacher.name} {teacher.surname}
            </h3>

            <div className={styles.teacherStats}>
              <div className={styles.statItem}>
                <FaDesktop className={styles.statIcon} />
                <span>Lessons online</span>
              </div>
              <div className={styles.statItem}>
                <span>Lessons done: {teacher.lessons_done}</span>
              </div>
              <div className={styles.statItem}>
                <FaStar className={styles.starIcon} />
                <span>Rating: {teacher.rating}</span>
              </div>
              <div className={styles.statItem}>
                <span>
                  Price / 1 hour:{" "}
                  <span className={styles.priceValue}>
                    ${teacher.price_per_hour}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <button
            className={styles.favoriteBtn}
            onClick={handleFavoriteClick}
            title={
              isFavorite(teacher.id)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite(teacher.id) ? (
              <FaHeart className={styles.heartFilled} />
            ) : (
              <FaRegHeart className={styles.heartOutline} />
            )}
          </button>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.languagesInfo}>
            <span className={styles.speaksLabel}>Speaks: </span>
            <span className={styles.languages}>
              {teacher.languages.join(", ")}
            </span>
          </div>

          <div className={styles.lessonInfo}>
            <p>{teacher.lesson_info}</p>
          </div>

          <div className={styles.conditions}>
            <p>{teacher.conditions}</p>
          </div>

          <button
            className={styles.readMoreBtn}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Read more
          </button>

          <div className={styles.skillTags}>
            {teacher.levels.map((level) => (
              <span key={level} className={styles.skillTag}>
                #{level}
              </span>
            ))}
          </div>
        </div>
      </div>

      <LogInModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        teacher={teacher}
      />
    </>
  );
};

export default TeacherCard;
