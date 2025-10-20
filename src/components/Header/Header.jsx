import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store";
import { logoutThunk } from "../../store/authSlice";
import AuthModal from "../Modal/AuthModal";
import styles from "./Header.module.css";
import { LuLogIn } from "react-icons/lu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.logoCircle}></div>
          </div>
          <span>LearnLingo</span>
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/teachers" className={styles.navLink}>
            Teachers
          </Link>

          {/* Favorites auth */}
          {currentUser && (
            <Link to="/favorites" className={styles.navLink}>
              Favorites
            </Link>
          )}
        </nav>

        <div className={styles.authSection}>
          {currentUser ? (
            <div className={styles.userMenu}>
              <span className={styles.userEmail}>{currentUser.email}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                className={styles.loginBtn}
                onClick={() => openAuthModal("login")}
              >
                <LuLogIn className={styles.loginIcon} />
                Log in
              </button>
              <button
                className={styles.signupBtn}
                onClick={() => openAuthModal("signup")}
              >
                Registration
              </button>
            </div>
          )}
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        mode={authMode}
      />
    </header>
  );
};

export default Header;
