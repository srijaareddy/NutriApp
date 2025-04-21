import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import './styles.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Nutrition from './pages/Nutrition';
import Footer from './components/Footer';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <div className="main-content">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to <span className="highlight">Nutrition Tracker</span></h1>
            <p className="hero-description">
              Track your nutrition, calculate your BMI, and get personalized diet recommendations
              to achieve your health and fitness goals.
            </p>
            <div className="hero-buttons">
              <Link to="/nutrition" className="button primary pulse">Check Nutrition</Link>
              <Link to="/signup" className="button secondary">Create Account</Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="https://resources.finalsite.net/images/f_auto,q_auto/v1660247326/rossramscom/xfgwm1bvuh238sg6i3gm/eat-right1.jpg" alt="Eat Right" className="rounded-image" />
          </div>
        </div>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Our <span className="highlight">Features</span></h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-calculator"></i>
              </div>
              <h3 className="feature-title">BMI Calculator</h3>
              <p className="feature-description">
                Calculate your Body Mass Index and understand what it means for your health and fitness journey.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3 className="feature-title">Diet Planning</h3>
              <p className="feature-description">
                Create daily meal plans and analyze total nutritional content to meet your dietary goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3 className="feature-title">Personalized Recommendations</h3>
              <p className="feature-description">
                Get tailored diet recommendations based on your BMI and nutrition goals for optimal results.
              </p>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="testimonial-section">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"This nutrition tracker has completely changed how I plan my meals. The BMI calculator and personalized recommendations are spot on!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Fitness Enthusiast</p>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a nutritionist, I recommend this tool to all my clients. The interface is intuitive and the analysis is comprehensive."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar"></div>
                <div className="author-info">
                  <h4>Dr. Michael Chen</h4>
                  <p>Certified Nutritionist</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <div className="app">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🥗</span> 
            Nutrition Tracker
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/nutrition" className="nav-link">Nutrition</Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link">Signup</Link>
              </>
            )}
          </div>
        </nav>

        <main className="main-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;