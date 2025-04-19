import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';

function Nutrition() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const [mealType, setMealType] = useState('Breakfast');
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('grams');
  const [meals, setMeals] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
    Juices: []
  });
  const [nutritionAnalysis, setNutritionAnalysis] = useState(null);

  const calculateBMI = () => {
    if (!height || !weight) return;
    
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    setBmiResult({ bmi: bmi.toFixed(2), category });
  };

  const generateRecommendations = (totalNutrition, bmi) => {
    const suggestions = [];
    const {
      calories,
      protein,
      carbs,
      fat,
      fiber
    } = totalNutrition;

    const bmiValue = parseFloat(bmi);
    const weightKg = parseFloat(weight);
    
    // Base recommendations on BMI category
    if (bmiValue < 18.5) {
      if (calories < 2000) suggestions.push("Increase daily calorie intake to at least 2000-2500 calories for healthy weight gain");
      if (protein < 1.6 * weightKg) suggestions.push(`Increase protein intake to at least ${Math.round(1.6 * weightKg)}g daily to support muscle growth`);
      if (fat < 50) suggestions.push("Include more healthy fats in your diet for energy and nutrient absorption");
      if (carbs < 225) suggestions.push("Increase complex carbohydrate intake to support weight gain");
    } else if (bmiValue < 25) {
      if (calories < 1800) suggestions.push("Consider increasing calorie intake for maintaining healthy weight");
      if (calories > 2500) suggestions.push("Consider moderating calorie intake to maintain current weight");
      if (protein < 1.2 * weightKg) suggestions.push(`Aim for at least ${Math.round(1.2 * weightKg)}g of protein daily for muscle maintenance`);
      if (carbs > 300) suggestions.push("Consider moderating carbohydrate intake");
    } else {
      if (calories > 2000) suggestions.push("Reduce daily calorie intake to 1500-1800 calories for weight management");
      if (fat > 70) suggestions.push("Reduce fat intake, especially from saturated and trans fats");
      if (carbs > 200) suggestions.push("Reduce refined carbohydrates and focus on complex carbs");
      if (protein < weightKg) suggestions.push(`Increase protein intake to at least ${Math.round(weightKg)}g to preserve muscle mass during weight loss`);
    }

    // Universal recommendations based on nutrition
    if (fiber < 25) {
      suggestions.push("Increase fiber intake through fruits, vegetables, and whole grains for better digestive health");
    }

    if (fat < 0.25 * calories / 9) {
      suggestions.push("Increase healthy fat intake to support hormone function and nutrient absorption");
    }

    return suggestions;
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodItem || !quantity) return;

    const nutritionValues = {
      calories: Math.round(quantity * 2),
      protein: Math.round(quantity * 0.1),
      carbs: Math.round(quantity * 0.3),
      fat: Math.round(quantity * 0.1),
      fiber: Math.round(quantity * 0.05)
    };

    setMeals(prev => ({
      ...prev,
      [mealType]: [...prev[mealType], { 
        foodItem, 
        quantity, 
        unit,
        ...nutritionValues
      }]
    }));

    analyzeMealPlan([...Object.values(meals).flat(), { 
      foodItem, 
      quantity, 
      unit,
      ...nutritionValues
    }]);

    setFoodItem('');
    setQuantity('');
  };

  const handleDeleteFood = (mealType, index) => {
    setMeals(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index)
    }));
    
    const updatedMeals = Object.values(meals)
      .flat()
      .filter((_, i) => i !== index);
    analyzeMealPlan(updatedMeals);
  };

  const analyzeMealPlan = (allMeals) => {
    if (!bmiResult) {
      alert('Please calculate your BMI first for personalized recommendations.');
      return;
    }

    const analysis = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    };

    allMeals.forEach(meal => {
      analysis.calories += meal.calories || 0;
      analysis.protein += meal.protein || 0;
      analysis.carbs += meal.carbs || 0;
      analysis.fat += meal.fat || 0;
      analysis.fiber += meal.fiber || 0;
    });

    // Generate dynamic recommendations
    const suggestions = generateRecommendations(analysis, bmiResult.bmi);

    setNutritionAnalysis({
      ...analysis,
      suggestions
    });
  };

  const COLORS = ['#2B6777', '#89B6C1', '#52AB98', '#C8D8E4'];

  const pieData = nutritionAnalysis ? [
    { name: 'Protein', value: nutritionAnalysis.protein },
    { name: 'Carbs', value: nutritionAnalysis.carbs },
    { name: 'Fat', value: nutritionAnalysis.fat },
    { name: 'Fiber', value: nutritionAnalysis.fiber }
  ] : [];

  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg,rgb(65, 72, 78) 0%,rgb(50, 84, 93) 100%)',
      pt: 4,
      pb: 6
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: '#fff', 
            textAlign: 'center', 
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Nutrition Analysis
        </Typography>

        <Grid container spacing={4}>
          {/* BMI Calculator Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalculateIcon color="primary" />
                BMI Calculator
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  margin="normal"
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateBMI}
                  fullWidth
                  sx={{ mt: 2 }}
                  startIcon={<CalculateIcon />}
                >
                  Calculate BMI
                </Button>
                {bmiResult && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Your BMI: {bmiResult.bmi}
                    </Typography>
                    <Chip
                      label={bmiResult.category}
                      color={
                        bmiResult.category === 'Normal weight'
                          ? 'success'
                          : bmiResult.category === 'Underweight'
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Diet Plan Card */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RestaurantIcon color="primary" />
                Diet Plan for the Day
              </Typography>
              <Box component="form" onSubmit={handleAddFood} sx={{ mt: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Meal Type</InputLabel>
                  <Select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    label="Meal Type"
                  >
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                    <MenuItem value="Juices">Juices</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Food Item"
                  value={foodItem}
                  onChange={(e) => setFoodItem(e.target.value)}
                  margin="normal"
                />
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel>Unit</InputLabel>
                      <Select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        label="Unit"
                      >
                        <MenuItem value="grams">grams</MenuItem>
                        <MenuItem value="ml">ml</MenuItem>
                        <MenuItem value="pieces">pieces</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  Add Food Item
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Meal List */}
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalDiningIcon color="primary" />
                Today's Meals
              </Typography>
              {Object.entries(meals).map(([type, items]) => (
                items.length > 0 && (
                  <Box key={type} sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {type}
                    </Typography>
                    <List>
                      {items.map((item, index) => (
                        <React.Fragment key={index}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteFood(type, index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={item.foodItem}
                              secondary={`${item.quantity} ${item.unit} | Calories: ${item.calories} | Protein: ${item.protein}g | Carbs: ${item.carbs}g | Fat: ${item.fat}g | Fiber: ${item.fiber}g`}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      ))}
                    </List>
                  </Box>
                )
              ))}
            </Paper>
          </Grid>

          {/* Nutrition Analysis */}
          {nutritionAnalysis && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Nutrition Analysis
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Daily Totals
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText primary={`Total Calories: ${nutritionAnalysis.calories} kcal`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={`Protein: ${nutritionAnalysis.protein}g`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={`Carbohydrates: ${nutritionAnalysis.carbs}g`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={`Fat: ${nutritionAnalysis.fat}g`} />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary={`Fiber: ${nutritionAnalysis.fiber}g`} />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ width: '100%', height: 300 }}>
                      <PieChart width={400} height={300}>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </Box>
                  </Grid>
                  {nutritionAnalysis.suggestions.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          Personalized Recommendations
                        </Typography>
                        {nutritionAnalysis.suggestions.map((suggestion, index) => (
                          <Alert severity="info" key={index} sx={{ mb: 1 }}>
                            {suggestion}
                          </Alert>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default Nutrition;
