import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store";
import { logoutThunk } from "../../store/authSlice";
import LogInModal from "../Modal/LogInModal";
import SignUpModal from "../Modal/SignUpModal";
import styles from "./Header.module.css";
import { LuLogIn } from "react-icons/lu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logInModalOpen, setLogInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
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

  const openLogInModal = () => {
    setLogInModalOpen(true);
  };

  const closeLogInModal = () => {
    setLogInModalOpen(false);
  };

  const openSignUpModal = () => {
    setSignUpModalOpen(true);
  };

  const closeSignUpModal = () => {
    setSignUpModalOpen(false);
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
              <button className={styles.loginBtn} onClick={openLogInModal}>
                <LuLogIn className={styles.loginIcon} />
                Log in
              </button>
              <button className={styles.signupBtn} onClick={openSignUpModal}>
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

      <LogInModal
        isOpen={logInModalOpen}
        onClose={closeLogInModal}
        onSwitchToSignUp={openSignUpModal}
      />
      <SignUpModal
        isOpen={signUpModalOpen}
        onClose={closeSignUpModal}
        onSwitchToLogIn={openLogInModal}
      />
    </header>
  );
};

export default Header;
