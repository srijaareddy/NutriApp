import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0
  });
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      calculateBMI();
    }
  }, [user]);

  const calculateBMI = () => {
    if (user.height && user.weight) {
      const heightInM = user.height / 100;
      const bmiValue = (user.weight / (heightInM * heightInM)).toFixed(2);
      setBmi(bmiValue);
      generateRecommendations(bmiValue, nutritionData);
    }
  };

  const generateRecommendations = (bmiValue, nutrition) => {
    const recs = [];
    const { calories, protein, carbs, fat, fiber } = nutrition;
  
    // Dynamic target values based on BMI
    const calorieGoal = bmiValue < 18.5 ? 2500 : bmiValue < 25 ? 2000 : 1500;
    const proteinGoal = 0.8 * (user.weight || 60);  // protein based on weight
    const fatMax = bmiValue >= 25 ? 60 : 80;
    const carbsMax = bmiValue >= 25 ? 200 : 300;
    const fiberMin = 25;
  
    if (calories < calorieGoal) recs.push(`You're consuming fewer calories (${calories}). Try reaching ~${calorieGoal} kcal.`);
    if (calories > calorieGoal + 200) recs.push(`Your intake is quite high (${calories} kcal). Aim for ~${calorieGoal} kcal.`);
  
    if (protein < proteinGoal) recs.push(`Increase protein to at least ${Math.round(proteinGoal)}g for your weight (${user.weight}kg).`);
  
    if (carbs > carbsMax) recs.push(`Reduce carbs to under ${carbsMax}g to manage weight.`);
    if (fat > fatMax) recs.push(`Try to limit fat to below ${fatMax}g for better metabolic health.`);
  
    if (fiber < fiberMin) recs.push("Increase fiber (target 25g+) to support digestion.");
  
    if (recs.length === 0) {
      recs.push("Great job! Your current intake matches your BMI and health goals.");
    }
  
    setRecommendations(recs);
  };
  

  const handleNutritionUpdate = (e) => {
    const { name, value } = e.target;
    const updatedNutrition = {
      ...nutritionData,
      [name]: parseFloat(value) || 0
    };
    setNutritionData(updatedNutrition);
    if (bmi) {
      generateRecommendations(bmi, updatedNutrition);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name.charAt(0)}
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Your Stats</h3>
          <div className="stat-item">
            <span>Weight</span>
            <span>{user.weight} kg</span>
          </div>
          <div className="stat-item">
            <span>Height</span>
            <span>{user.height} cm</span>
          </div>
          <div className="stat-item">
            <span>BMI</span>
            <span>{bmi}</span>
          </div>
          <div className="stat-item">
            <span>Status</span>
            <span>{
              bmi < 18.5 ? 'Underweight' :
              bmi < 25 ? 'Normal' :
              bmi < 30 ? 'Overweight' : 'Obese'
            }</span>
          </div>
        </div>

        <div className="nutrition-input-card">
          <h3>Today's Nutrition</h3>
          <div className="nutrition-inputs">
            <div className="input-group">
              <label>Calories</label>
              <input
                type="number"
                name="calories"
                value={nutritionData.calories}
                onChange={handleNutritionUpdate}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label>Protein (g)</label>
              <input
                type="number"
                name="protein"
                value={nutritionData.protein}
                onChange={handleNutritionUpdate}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label>Carbs (g)</label>
              <input
                type="number"
                name="carbs"
                value={nutritionData.carbs}
                onChange={handleNutritionUpdate}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label>Fat (g)</label>
              <input
                type="number"
                name="fat"
                value={nutritionData.fat}
                onChange={handleNutritionUpdate}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label>Fiber (g)</label>
              <input
                type="number"
                name="fiber"
                value={nutritionData.fiber}
                onChange={handleNutritionUpdate}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-card">
        <h3>Personalized Recommendations</h3>
        <ul className="recommendations-list">
          {recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile; 