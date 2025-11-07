import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Teachers from './pages/Teachers/Teachers';
import Favorites from './pages/Favorites/Favorites';
import PrivateRoute from './routes/PrivateRoute';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.appRoot}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              }
            />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App
