import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles.css';
import Nutrition from './pages/Nutrition';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Nutrition Tracker</h1>
            <p className="hero-description">
              Track your nutrition, calculate your BMI, and get personalized diet recommendations
            </p>
            <div className="hero-buttons">
              <Link to="/nutrition" className="button primary">Check Nutrition</Link>
              <button className="button secondary">Create Account</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://resources.finalsite.net/images/f_auto,q_auto/v1660247326/rossramscom/xfgwm1bvuh238sg6i3gm/eat-right1.jpg" alt="Eat Right" />
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Our Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">BMI Calculator</h3>
              <p className="feature-description">
                Calculate your Body Mass Index and understand what it means for your health
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Diet Planning</h3>
              <p className="feature-description">
                Create daily meal plans and analyze total nutritional content
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">Personalized Recommendations</h3>
              <p className="feature-description">
                Get tailored diet recommendations based on your BMI and nutrition goals
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Nutrition Tracker</Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/nutrition" className="nav-link">Nutrition</Link>
          <Link to="/Login" className="nav-link">Login</Link>
          <Link to="/Signup" className="nav-link">Signup</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nutrition" element={<Nutrition />} />
      </Routes>
    </Router>
  );
}

export default App; 