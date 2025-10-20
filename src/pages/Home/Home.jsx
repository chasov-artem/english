import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Вивчайте мови з професійними викладачами</h1>
          <p className="hero-subtitle">
            Персональні уроки онлайн з досвідченими викладачами з усього світу
          </p>
          <div className="hero-buttons">
            <Link to="/teachers" className="btn btn-primary">
              Знайти викладача
            </Link>
            <Link to="/teachers" className="btn btn-secondary">
              Безкоштовний пробний урок
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <span>🌍</span>
            <p>Онлайн навчання</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Чому обирають нас?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Професійні викладачі</h3>
              <p>Кваліфіковані викладачі з сертифікатами та досвідом роботи</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Онлайн навчання</h3>
              <p>Зручні уроки в комфортній домашній обстановці</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Персональний підхід</h3>
              <p>Індивідуальна програма навчання під ваші цілі</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Доступні ціни</h3>
              <p>Конкурентні тарифи від $15 за годину</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Готові почати навчання?</h2>
          <p>Оберіть свого ідеального викладача вже сьогодні</p>
          <Link to="/teachers" className="btn btn-primary btn-large">
            Переглянути викладачів
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
