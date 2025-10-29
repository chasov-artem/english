import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectFavorites } from "../../store";
import { toggleFavorite } from "../../store/favoritesSlice";
import LogInModal from "../Modal/LogInModal";
import BookingModal from "../Modal/BookingModal";
import { FaStar } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";
import {
  FavoriteIconFilled,
  FavoriteIconOutline,
} from "../icons/FavoriteIcons";
import styles from "./TeacherCard.module.css";

const TeacherCard = ({ teacher, selectedLevel }) => {
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

  // Intentionally no-op: booking is opened from other triggers when needed

  return (
    <>
      <div className={styles.teacherCard}>
        <div className={styles.avatarContainer}>
          <img
            src={teacher.avatar_url}
            alt={`${teacher.name} ${teacher.surname}`}
            className={styles.teacherAvatar}
          />
          <div className={styles.onlineIndicator}></div>
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.headerRow}>
            <div className={styles.infoLeft}>
              <div className={styles.sectionLabel}>Languages</div>
              <h3 className={styles.teacherName}>
                {teacher.name} {teacher.surname}
              </h3>
            </div>
            <div className={styles.infoRight}>
              <div className={styles.teacherStats}>
                <div className={styles.statItem}>
                  <FiBookOpen className={styles.statIcon} />
                  <span>Lessons online</span>
                </div>
                <div className={styles.statItem}>
                  <span>Lessons done: {teacher.lessons_done}</span>
                </div>
                <div className={styles.statItem}>
                  <FaStar className={styles.starIcon} />
                  <span>Rating: {Number(teacher.rating).toFixed(1)}</span>
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
                  <FavoriteIconFilled className={styles.favoriteIconFilled} />
                ) : (
                  <FavoriteIconOutline className={styles.favoriteIconOutline} />
                )}
              </button>
            </div>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.languagesInfo}>
              <span className={styles.speaksLabel}>Speaks: </span>
              <span className={styles.languages}>
                {teacher.languages.join(", ")}
              </span>
            </div>

            <div className={styles.lessonInfo}>
              <span className={styles.infoLabel}>Lesson Info: </span>
              <span className={styles.infoText}>{teacher.lesson_info}</span>
            </div>

            <div className={styles.conditions}>
              <span className={styles.infoLabel}>Conditions: </span>
              <span className={styles.infoText}>{teacher.conditions}</span>
            </div>

            {!isExpanded && (
              <button
                className={styles.readMoreBtn}
                onClick={() => setIsExpanded(true)}
                aria-expanded={isExpanded}
              >
                Read more
              </button>
            )}

            {isExpanded && (
              <div className={styles.expandedSection}>
                {teacher.experience && (
                  <p className={styles.teacherDescription}>
                    {teacher.experience}
                  </p>
                )}

                {(() => {
                  const reviews = Array.isArray(teacher.reviews)
                    ? teacher.reviews
                    : teacher.reviews
                    ? Object.values(teacher.reviews)
                    : [];
                  const firstTwo = reviews.slice(0, 2);
                  if (firstTwo.length === 0) return null;
                  return (
                    <div className={styles.reviewsList}>
                      {firstTwo.map((r, idx) => (
                        <div key={idx} className={styles.reviewItem}>
                          <div className={styles.reviewHeader}>
                            <img
                              className={styles.reviewAvatar}
                              src={`https://i.pravatar.cc/40?u=${encodeURIComponent(
                                r.reviewer_name || "user"
                              )}`}
                              alt={r.reviewer_name}
                              width={40}
                              height={40}
                            />
                            <div className={styles.nameRatingWrap}>
                              <span className={styles.reviewerName}>
                                {r.reviewer_name}
                              </span>
                              <div className={styles.ratingWrap}>
                                <FaStar className={styles.starIcon} />
                                <span className={styles.reviewerRating}>
                                  {Number(r.reviewer_rating).toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.reviewComment}>
                            {r.comment}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                <button
                  type="button"
                  className={styles.bookBtn}
                  onClick={() => setShowBookingModal(true)}
                >
                  Book trial lesson
                </button>
              </div>
            )}

            {(() => {
              const levels = Array.isArray(teacher.levels)
                ? [...teacher.levels]
                : [];
              if (selectedLevel) {
                const idx = levels.findIndex(
                  (l) => l.toLowerCase() === selectedLevel.toLowerCase()
                );
                if (idx > 0) {
                  const [sel] = levels.splice(idx, 1);
                  levels.unshift(sel);
                }
              }
              return (
                <div className={styles.skillTags}>
                  {levels.map((level, i) => (
                    <span
                      key={level}
                      className={`${styles.skillTag} ${
                        selectedLevel &&
                        i === 0 &&
                        level.toLowerCase() === selectedLevel.toLowerCase()
                          ? styles.skillTagActive
                          : ""
                      }`}
                    >
                      #{level}
                    </span>
                  ))}
                </div>
              );
            })()}
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
