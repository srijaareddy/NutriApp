const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutriapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// In-memory user storage (replace with a database in production)
const users = [];

// Middleware to verify JWT token
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

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// BMI Calculation endpoint
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

// Meal Plan Analysis endpoint
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

  // Dynamic Suggestions
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


// Signup route
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

  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    name,
    height,
    weight
  };

  users.push(user);

  // Generate token
  const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '24h' });

  // Return user data (excluding password) and token
  const { password: _, ...userData } = user;
  res.status(201).json({ user: userData, token });
});

// Login route
app.post('/api/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '24h' });

  // Return user data (excluding password) and token
  const { password: _, ...userData } = user;
  res.json({ user: userData, token });
});

// Protected route example
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, ...userData } = user;
  res.json(userData);
});

// Update user profile
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

  // Update user data
  Object.assign(user, req.body);

  const { password, ...userData } = user;
  res.json(userData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 