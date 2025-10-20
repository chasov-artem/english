import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import AuthModal from "../Modal/AuthModal";
import BookingModal from "../Modal/BookingModal";
import "./TeacherCard.css";

const TeacherCard = ({ teacher }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { currentUser } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavoriteClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    toggleFavorite(teacher.id);
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
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ☆
        </span>
      );
    }

    return stars;
  };

  return (
    <>
      <div className={`teacher-card ${isExpanded ? "expanded" : ""}`}>
        <div className="card-header">
          <img
            src={teacher.avatar_url}
            alt={`${teacher.name} ${teacher.surname}`}
            className="teacher-avatar"
          />
          <div className="teacher-info">
            <h3 className="teacher-name">
              {teacher.name} {teacher.surname}
            </h3>
            <div className="teacher-rating">
              <div className="stars">{renderStars(teacher.rating)}</div>
              <span className="rating-text">
                {teacher.rating} ({teacher.reviews} reviews)
              </span>
            </div>
          </div>
          <button
            className={`favorite-btn ${
              isFavorite(teacher.id) ? "favorited" : ""
            }`}
            onClick={handleFavoriteClick}
            title={
              isFavorite(teacher.id)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            {isFavorite(teacher.id) ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="card-content">
          <div className="teacher-details">
            <div className="detail-item">
              <strong>Languages:</strong> {teacher.languages.join(", ")}
            </div>
            <div className="detail-item">
              <strong>Levels:</strong> {teacher.levels.join(", ")}
            </div>
            <div className="detail-item">
              <strong>Price:</strong> ${teacher.price_per_hour}/hour
            </div>
            <div className="detail-item">
              <strong>Lessons completed:</strong> {teacher.lessons_done}
            </div>
          </div>

          <div className="card-actions">
            <button
              className="read-more-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
            <button className="book-lesson-btn" onClick={handleBookLesson}>
              Book trial lesson
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="expanded-content">
            <div className="additional-info">
              <h4>About the lessons:</h4>
              <p>{teacher.lesson_info}</p>

              <h4>Conditions:</h4>
              <p>{teacher.conditions}</p>

              <h4>Experience:</h4>
              <p>{teacher.experience}</p>
            </div>
          </div>
        )}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode="login"
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
