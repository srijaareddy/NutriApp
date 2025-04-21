import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const generateRecommendations = React.useCallback((bmiValue, nutrition) => {
    const recs = [];
    const { calories, protein, carbs, fat, fiber } = nutrition;
    const weight = user?.weight || 60;
    const height = user?.height || 170;
    const age = user?.age || 30;
    const gender = user?.gender || 'male';
    const activityLevel = user?.activityLevel || 'moderate';

    console.log("Generating recommendations with:", { bmiValue, nutrition, weight, height, age, gender, activityLevel });

    const bmr = gender === 'male' 
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    let calorieGoal = tdee;
    if (bmiValue < 18.5) {
      calorieGoal = tdee + 500; 
    } else if (bmiValue >= 25) {
      calorieGoal = tdee - 500;
    }

    console.log("Calculated goals:", { bmr, tdee, calorieGoal });

    // Protein needs based on activity level and goals
    const proteinMultiplier = bmiValue < 18.5 ? 2.2 : bmiValue >= 25 ? 1.6 : 1.8;
    const proteinGoal = weight * proteinMultiplier;

    // Fat needs (20-35% of total calories)
    const fatMin = (calorieGoal * 0.20) / 9; // 9 calories per gram of fat
    const fatMax = (calorieGoal * 0.35) / 9;

    // Carb needs (45-65% of total calories)
    const carbMin = (calorieGoal * 0.45) / 4; // 4 calories per gram of carbs
    const carbMax = (calorieGoal * 0.65) / 4;

    // Fiber needs (14g per 1000 calories)
    const fiberGoal = Math.round(calorieGoal / 1000 * 14);

    console.log("Nutritional goals:", { proteinGoal, fatMin, fatMax, carbMin, carbMax, fiberGoal });

    if (bmiValue < 18.5) {
      recs.push("You're underweight. Focus on nutrient-dense foods and strength training.");
      recs.push(`Aim for ${Math.round(calorieGoal)} calories daily to gain weight healthily.`);
    } else if (bmiValue >= 25) {
      recs.push("You're overweight. Focus on portion control and regular exercise.");
      recs.push(`Aim for ${Math.round(calorieGoal)} calories daily to lose weight safely.`);
    } else {
      recs.push(`Your BMI is in the normal range. Aim for ${Math.round(calorieGoal)} calories daily to maintain your weight.`);
    }

    const calorieDiff = Math.abs(calories - calorieGoal);
    if (calorieDiff > 200) {
      if (calories < calorieGoal) {
        recs.push(`You're consuming ${Math.round(calorieDiff)} fewer calories than recommended. Try to increase your intake gradually.`);
      } else {
        recs.push(`You're consuming ${Math.round(calorieDiff)} more calories than recommended. Consider reducing portion sizes.`);
      }
    } else {
      recs.push(`Your calorie intake is close to the recommended ${Math.round(calorieGoal)} calories.`);
    }

    if (protein < proteinGoal * 0.8) {
      recs.push(`Increase protein intake to ${Math.round(proteinGoal)}g daily. Good sources: lean meats, fish, eggs, legumes.`);
    } else if (protein > proteinGoal * 1.2) {
      recs.push(`Your protein intake is quite high. Consider balancing with more carbs and healthy fats.`);
    } else {
      recs.push(`Your protein intake is within the recommended range of ${Math.round(proteinGoal * 0.8)}-${Math.round(proteinGoal * 1.2)}g daily.`);
    }

    if (fat < fatMin) {
      recs.push(`Increase healthy fat intake to at least ${Math.round(fatMin)}g daily. Sources: avocados, nuts, olive oil.`);
    } else if (fat > fatMax) {
      recs.push(`Reduce fat intake to below ${Math.round(fatMax)}g daily. Focus on lean protein sources.`);
    } else {
      recs.push(`Your fat intake is within the recommended range of ${Math.round(fatMin)}-${Math.round(fatMax)}g daily.`);
    }

    if (carbs < carbMin) {
      recs.push(`Increase complex carbohydrate intake to at least ${Math.round(carbMin)}g daily. Sources: whole grains, fruits, vegetables.`);
    } else if (carbs > carbMax) {
      recs.push(`Reduce refined carbohydrate intake to below ${Math.round(carbMax)}g daily. Choose complex carbs over simple ones.`);
    } else {
      recs.push(`Your carbohydrate intake is within the recommended range of ${Math.round(carbMin)}-${Math.round(carbMax)}g daily.`);
    }

    if (fiber < fiberGoal * 0.8) {
      recs.push(`Increase fiber intake to ${fiberGoal}g daily. Sources: vegetables, fruits, whole grains, legumes.`);
    } else {
      recs.push(`Your fiber intake is good. Aim to maintain at least ${fiberGoal}g daily.`);
    }

    if (activityLevel === 'sedentary') {
      recs.push("Consider increasing physical activity. Aim for at least 150 minutes of moderate exercise weekly.");
    } else if (activityLevel === 'light') {
      recs.push("You're getting some exercise. Try to increase to moderate activity for better health benefits.");
    } else if (activityLevel === 'moderate') {
      recs.push("You're maintaining a good activity level. Keep up the good work!");
    } else if (activityLevel === 'active' || activityLevel === 'veryActive') {
      recs.push("You're very active! Make sure to fuel your body properly with adequate calories and nutrients.");
    }

    console.log("Generated recommendations:", recs);
    setRecommendations(recs);
  }, [user]);

  const calculateBMI = React.useCallback(() => {
    if (user?.height && user?.weight) {
      const heightInM = user.height / 100;
      const bmiValue = (user.weight / (heightInM * heightInM)).toFixed(2);
      console.log("Calculated BMI:", bmiValue);
      setBmi(bmiValue);
      
      if (nutritionData) {
        console.log("Generating recommendations with new BMI:", bmiValue);
        generateRecommendations(bmiValue, nutritionData);
      }
    } else {
      console.log("Missing height or weight, cannot calculate BMI");
    }
  }, [user, nutritionData, generateRecommendations]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("Loaded user data:", userData);
      setUser(userData);
    } else {
      console.log("No user data found in localStorage");
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      console.log("User data loaded, calculating BMI");
      calculateBMI();
    }
  }, [user, calculateBMI]);

  useEffect(() => {
    if (bmi && nutritionData) {
      console.log("Updating recommendations based on BMI and nutrition data");
      generateRecommendations(bmi, nutritionData);
    }
  }, [bmi, nutritionData, generateRecommendations]);

  const handleNutritionUpdate = (e) => {
    const { name, value } = e.target;
    const updatedNutrition = {
      ...nutritionData,
      [name]: parseFloat(value) || 0
    };
    setNutritionData(updatedNutrition);
    
    if (bmi) {
      console.log("Updating recommendations with new nutrition data:", updatedNutrition);
      generateRecommendations(bmi, updatedNutrition);
    } else {
      console.log("No BMI value available, cannot generate recommendations");
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
        {recommendations.length > 0 ? (
          <ul className="recommendations-list">
            {recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">{rec}</li>
            ))}
          </ul>
        ) : (
          <p className="no-recommendations">Enter your nutrition data to receive personalized recommendations.</p>
        )}
      </div>
    </div>
  );
}

export default Profile; 