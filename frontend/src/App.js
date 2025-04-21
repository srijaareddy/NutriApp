import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles.css';
import Nutrition from './pages/Nutrition';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';


function Home() {
  return (
    <div className="main-content">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Your Journey to Healthy Living Starts Here</h1>
          <p className="hero-description">
            Track your nutrition, discover personalized meal plans, and achieve your health goals with our comprehensive nutrition tracking platform.
          </p>
          <div className="hero-buttons">
            <Link to="/nutrition" className="button primary">Start Tracking</Link>
            <Link to="/Signup" className="button secondary">Join Now</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Healthy Food" />
        </div>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose NutriApp?</h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">🍎</div>
            <h3 className="feature-title">Smart Nutrition Tracking</h3>
            <p className="feature-description">
              Track your daily nutrition intake with our intelligent system that provides detailed insights and recommendations.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">🥗</div>
            <h3 className="feature-title">Personalized Meal Plans</h3>
            <p className="feature-description">
              Get customized meal plans based on your dietary preferences, goals, and nutritional needs.
            </p>
          </div>

          <div className="feature-card glass-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Progress Analytics</h3>
            <p className="feature-description">
              Visualize your progress with interactive charts and detailed analytics to stay motivated.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card glass-card">
            <div className="testimonial-content">
              <p>"NutriApp has completely transformed my approach to healthy eating. The personalized recommendations are spot-on!"</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Sarah" />
                <div>
                  <h4>Sarah M.</h4>
                  <p>Lost 15kg in 3 months</p>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonial-card glass-card">
            <div className="testimonial-content">
              <p>"The meal planning feature is incredible. It's like having a personal nutritionist in your pocket!"</p>
              <div className="testimonial-author">
                <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="John" />
                <div>
                  <h4>John D.</h4>
                  <p>Fitness Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <img src="https://img.icons8.com/color/48/000000/healthy-food.png" alt="NutriApp Logo" />
          NutriApp
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/nutrition" className="nav-link">Nutrition</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;