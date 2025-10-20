import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../Modal/AuthModal';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
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
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          English Learning
        </Link>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/teachers" className="nav-link">Teachers</Link>
          {currentUser && (
            <Link to="/favorites" className="nav-link">Favorites</Link>
          )}
        </nav>

        <div className="auth-section">
          {currentUser ? (
            <div className="user-menu">
              <span className="user-email">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => openAuthModal('login')}>Login</button>
              <button className="signup-btn" onClick={() => openAuthModal('signup')}>Sign Up</button>
            </div>
          )}
        </div>

        <button 
          className="menu-toggle"
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
