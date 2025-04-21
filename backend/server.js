const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const Ingredient = require('./models/Ingredient');
const Dish = require('./models/Dish');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutritionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const users = [];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/api/calculate-dish-nutrition', async (req, res) => {
  try {
    const { dishName } = req.body;
    
    const dish = await Dish.findOne({ 
      'Dish Name': { $regex: new RegExp(dishName, 'i') } 
    });
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const ingredientsList = dish.Ingredients.split(',').map(ing => {
      const match = ing.trim().match(/(.*?)\s*\(([^)]+)\)/);
      if (match) {
        return {
          name: match[1].trim(),
          quantity: match[2].trim()
        };
      }
      return { name: ing.trim(), quantity: '1' };
    });

    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0
    };

    for (const ing of ingredientsList) {
      const ingredient = await Ingredient.findOne({ 
        Ingredient: { $regex: new RegExp(ing.name, 'i') } 
      });
      
      if (ingredient) {
        let quantity = 1;
        const quantityStr = ing.quantity.toLowerCase();
        
        if (quantityStr.includes('g')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]);
        } else if (quantityStr.includes('cup')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 240; // 1 cup = 240g
        } else if (quantityStr.includes('tbsp')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 15; // 1 tbsp = 15g
        } else if (quantityStr.includes('tsp')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 5; // 1 tsp = 5g
        } else if (quantityStr.includes('piece')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 30; // 1 piece = 30g
        } else if (quantityStr.includes('cloves')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 3; // 1 clove = 3g
        } else if (quantityStr.includes('inch')) {
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]) * 15; // 1 inch = 15g
        } else if (quantityStr.includes('to taste')) {
          quantity = 5; // Small amount
        } else {
          // Try to extract any number
          const match = quantityStr.match(/(\d+(\.\d+)?)/);
          if (match) quantity = parseFloat(match[1]);
        }
        
        // Add to total nutrition (assuming nutritional values are per 100g)
        const standardQuantity = ingredient['Quantity Standard (g)'] || 100;
        const ratio = quantity / standardQuantity;
        
        totalNutrition.calories += (ingredient['Calories (kcal)'] || 0) * ratio;
        totalNutrition.protein += (ingredient['Protein (g)'] || 0) * ratio;
        totalNutrition.carbohydrates += (ingredient['Carbohydrates (g)'] || 0) * ratio;
        totalNutrition.fat += (ingredient['Fat (g)'] || 0) * ratio;
        totalNutrition.fiber += (ingredient['Fibre (g)'] || 0) * ratio;
      } else {
        console.log(`Ingredient not found: ${ing.name}`);
      }
    }

    // Round the values
    Object.keys(totalNutrition).forEach(key => {
      totalNutrition[key] = Math.round(totalNutrition[key]);
    });

    // Generate dynamic recommendations based on BMI and nutrition
    const recommendations = generateDynamicRecommendations(totalNutrition, req.body.bmiCategory || 'Normal weight');

    res.json({
      dishName: dish['Dish Name'],
      ingredients: ingredientsList,
      nutrition: totalNutrition,
      recommendations
    });

  } catch (error) {
    console.error('Error calculating dish nutrition:', error);
    res.status(500).json({ message: 'Error calculating nutritional values' });
  }
});

app.post('/api/calculate-bmi', (req, res) => {
  const { height, weight } = req.body;
  if (!height || !weight) {
    return res.status(400).json({ error: 'Height and weight are required' });
  }

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';

  res.json({ bmi: bmi.toFixed(2), category });
});

app.post('/api/analyze-meal-plan', (req, res) => {
  const { meals, bmiCategory } = req.body;
  if (!meals || !Array.isArray(meals)) {
    return res.status(400).json({ error: 'Valid meal plan is required' });
  }

  const analysis = {
    totalCalories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    suggestions: []
  };

  meals.forEach(meal => {
    analysis.totalCalories += meal.calories || 0;
    analysis.protein += meal.protein || 0;
    analysis.carbs += meal.carbs || 0;
    analysis.fat += meal.fat || 0;
  });

  if (bmiCategory === 'Underweight') {
    if (analysis.totalCalories < 2000) {
      analysis.suggestions.push('Increase your calorie intake to reach a healthy weight.');
    }
    if (analysis.protein < 60) {
      analysis.suggestions.push('Add more protein-rich foods to support muscle growth.');
    }
  }

  if (bmiCategory === 'Normal weight') {
    if (analysis.totalCalories < 1800) {
      analysis.suggestions.push('You can slightly increase calories to maintain energy.');
    } else if (analysis.totalCalories > 2500) {
      analysis.suggestions.push('Watch your calorie intake to maintain your current weight.');
    }
  }

  if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    if (analysis.totalCalories > 2200) {
      analysis.suggestions.push('Try reducing calorie-dense foods to support weight loss.');
    }
    if (analysis.fat > 70) {
      analysis.suggestions.push('Reduce high-fat meals for better heart health.');
    }
    if (analysis.carbs > 300) {
      analysis.suggestions.push('Consider lowering carbs to manage weight effectively.');
    }
  }

  if (analysis.protein < 50) {
    analysis.suggestions.push('Boost your protein intake for overall wellness.');
  }

  res.json(analysis);
});

app.post('/api/analyze-food', async (req, res) => {
  try {
    const { dishName } = req.body;
    
    const food = await Food.findOne({ 
      dishName: { $regex: new RegExp(dishName, 'i') } 
    });
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }

    const ingredientsList = food.ingredients.split(',').map(i => i.trim());
    
    const nutrition = await calculateNutrition(ingredientsList);
    
    const bmiCategory = req.body.bmiCategory || 'Normal weight';
    
    const recommendations = generateRecommendations(nutrition, bmiCategory);
    
    res.json({
      dishName: food.dishName,
      nutrition,
      recommendations,
      ingredients: ingredientsList
    });
  } catch (error) {
    console.error('Error analyzing food:', error);
    res.status(500).json({ error: 'Error analyzing food' });
  }
});

app.post('/api/analyze-meals', async (req, res) => {
  try {
    const { meals, bmiCategory } = req.body;
    
    if (!Array.isArray(meals)) {
      return res.status(400).json({ error: 'Meals must be an array' });
    }

    let totalNutrition = {
      protein: 0,
      fat: 0,
      fibre: 0,
      carbohydrates: 0,
      energy: 0,
      calories: 0
    };

    const mealDetails = [];

    for (const meal of meals) {
      const food = await Food.findOne({ 
        dishName: { $regex: new RegExp(meal.dishName, 'i') } 
      });

      if (food) {
        const ingredientsList = food.ingredients.split(',').map(i => i.trim());
        const nutrition = await calculateNutrition(ingredientsList);
        
        Object.keys(totalNutrition).forEach(key => {
          totalNutrition[key] += nutrition[key];
        });

        mealDetails.push({
          dishName: food.dishName,
          nutrition,
          ingredients: ingredientsList
        });
      }
    }

    const recommendations = generateRecommendations(totalNutrition, bmiCategory);

    res.json({
      totalNutrition,
      mealDetails,
      recommendations
    });
  } catch (error) {
    console.error('Error analyzing meals:', error);
    res.status(500).json({ error: 'Error analyzing meals' });
  }
});

function generateRecommendations(nutrition, bmiCategory) {
  const recommendations = [];

  if (nutrition.protein < 50) {
    recommendations.push('Consider adding more protein-rich foods to your diet.');
  } else if (nutrition.protein > 100) {
    recommendations.push('Your protein intake is quite high. Make sure this aligns with your fitness goals.');
  }

  if (nutrition.fat > 70) {
    recommendations.push('Your fat intake is high. Consider reducing high-fat foods.');
  }

  if (nutrition.carbohydrates > 300) {
    recommendations.push('Your carbohydrate intake is high. Consider balancing with more protein and healthy fats.');
  }

  if (bmiCategory === 'Underweight') {
    if (nutrition.calories < 2000) {
      recommendations.push('Increase your calorie intake to reach a healthy weight.');
    }
  } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    if (nutrition.calories > 2200) {
      recommendations.push('Consider reducing your calorie intake to support weight loss.');
    }
  }

  return recommendations;
}

function generateDynamicRecommendations(nutrition, bmiCategory) {
  const recommendations = [];
  const { calories, protein, carbohydrates, fat, fiber } = nutrition;
  
  if (bmiCategory === 'Underweight') {
    if (calories < 500) {
      recommendations.push('This dish is relatively low in calories. Consider adding more calorie-dense ingredients for weight gain.');
    }
    if (protein < 20) {
      recommendations.push('This dish is low in protein. Consider adding more protein-rich ingredients for muscle growth.');
    }
  } else if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') {
    if (calories > 800) {
      recommendations.push('This dish is high in calories. Consider reducing portion size or choosing lower-calorie alternatives.');
    }
    if (fat > 30) {
      recommendations.push('This dish is high in fat. Consider reducing oil or choosing leaner protein sources.');
    }
  }
  
  if (protein < 10) {
    recommendations.push('This dish is low in protein. Consider adding protein-rich ingredients like meat, fish, eggs, or legumes.');
  }
  
  if (carbohydrates > 50) {
    recommendations.push('This dish is high in carbohydrates. If you\'re watching your carb intake, consider reducing rice or bread portions.');
  }
  
  if (fiber < 5) {
    recommendations.push('This dish is low in fiber. Consider adding more vegetables or whole grains for better digestive health.');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('This dish appears to be nutritionally balanced. Enjoy it as part of a varied diet.');
  }
  
  return recommendations;
}

app.post('/api/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('height').isFloat({ min: 0 }),
  body('weight').isFloat({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, height, weight } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    height,
    weight
  };

  users.push(user);

  const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '24h' });

  const { password: _, ...userData } = user;
  res.status(201).json({ user: userData, token });
});

app.post('/api/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '24h' });

  const { password: _, ...userData } = user;
  res.json({ user: userData, token });
});

app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userData } = user;
  res.json(userData);
});

app.put('/api/profile', authenticateToken, [
  body('height').optional().isFloat({ min: 0 }),
  body('weight').optional().isFloat({ min: 0 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  Object.assign(user, req.body);

  const { password, ...userData } = user;
  res.json(userData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 