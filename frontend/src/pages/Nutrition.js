import React, { useState, useEffect } from 'react';
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
  Chip,
  Autocomplete,
  CircularProgress,
  Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';

import foodData from '../foodData.json';

const mealTypeIcons = {
  Breakfast: <BrunchDiningIcon />,
  Lunch: <LunchDiningIcon />,
  Dinner: <DinnerDiningIcon />,
  Snacks: <FastfoodIcon />,
  Juices: <EmojiFoodBeverageIcon />
};

const THEME_COLORS = {
  primary: '#006D77',    // Dark turquoise
  secondary: '#083D3F',  // Deeper turquoise
  accent: '#E29578',     // Coral accent
  card1: 'linear-gradient(135deg, rgba(0, 109, 119, 0.95) 0%, rgba(8, 61, 63, 0.95) 100%)',
  card2: 'linear-gradient(135deg, rgba(8, 61, 63, 0.95) 0%, rgba(0, 109, 119, 0.95) 100%)',
  card3: 'linear-gradient(135deg, rgba(0, 91, 99, 0.95) 0%, rgba(8, 61, 63, 0.95) 100%)',
  card4: 'linear-gradient(135deg, rgba(226, 149, 120, 0.95) 0%, rgba(198, 130, 105, 0.95) 100%)',
  mealCard: 'linear-gradient(135deg, rgba(0, 109, 119, 0.9) 0%, rgba(8, 61, 63, 0.9) 100%)',
  text: '#E0E0E0',       // Light gray for text
  subtext: '#B0B0B0'     // Slightly darker gray for secondary text
};

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
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = foodData.map(food => food["Dish Name"]);
    setFoodOptions(options);
  }, []);

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

  const handleFoodSelect = (event, newValue) => {
    setSelectedFood(newValue);
    if (newValue) {
      const food = foodData.find(f => f["Dish Name"] === newValue);
      if (food) {
        setFoodItem(food["Dish Name"]);
      }
    }
  };

  const analyzeFoodNutrition = async () => {
    if (!selectedFood) {
      setError("Please select a food item");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/calculate-dish-nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishName: selectedFood
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }

      const data = await response.json();
      
      const nutritionValues = {
        calories: data.nutrition.calories,
        protein: data.nutrition.protein,
        carbs: data.nutrition.carbohydrates,
        fat: data.nutrition.fat,
        fiber: data.nutrition.fiber,
        ingredients: data.ingredients 
      };

      setMeals(prev => ({
        ...prev,
        [mealType]: [...prev[mealType], { 
          foodItem: data.dishName, 
          quantity: 1, 
          unit: 'serving',
          ...nutritionValues
        }]
      }));

      analyzeMealPlan([...Object.values(meals).flat(), { 
        foodItem: data.dishName, 
        quantity: 1, 
        unit: 'serving',
        ...nutritionValues
      }]);

      setSelectedFood(null);
      setFoodItem('');
    } catch (error) {
      console.error('Error analyzing food:', error);
      setError('Failed to analyze food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodItem || !quantity) return;

    if (foodOptions.includes(foodItem)) {
      analyzeFoodNutrition();
      return;
    }

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

    const suggestions = generateRecommendations(analysis, bmiResult.bmi);

    setNutritionAnalysis({
      ...analysis,
      suggestions
    });
  };

  const renderNutritionChart = (nutrition) => {
    if (!nutrition) return null;

    const data = [
      { name: 'Protein', value: nutrition.protein },
      { name: 'Carbs', value: nutrition.carbs },
      { name: 'Fat', value: nutrition.fat },
      { name: 'Fiber', value: nutrition.fiber }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx={200}
            cy={150}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '(30,30,30,0.9)',
      pt: 4,
      pb: 6,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08,
        zIndex: -1
      }
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: THEME_COLORS.text, 
            textAlign: 'center', 
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          <LocalDiningIcon sx={{ fontSize: 40, mr: 2, color: THEME_COLORS.accent }} />
          Nutrition Analysis
        </Typography>

        <Grid container spacing={4}>
          {/* BMI Calculator Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: THEME_COLORS.card1,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: THEME_COLORS.accent, mr: 2 }}>
                  <CalculateIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color={THEME_COLORS.text}>
                  BMI Calculator
                </Typography>
              </Box>
              
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root, & .MuiOutlinedInput-input': {
                        color: THEME_COLORS.text
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root, & .MuiOutlinedInput-input': {
                        color: THEME_COLORS.text
                      }
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={calculateBMI}
                  fullWidth
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    py: 1.5,
                    background: THEME_COLORS.accent,
                    '&:hover': {
                      background: THEME_COLORS.primary
                    }
                  }}
                  startIcon={<CalculateIcon />}
                >
                  Calculate BMI
                </Button>
                
                {bmiResult && (
                  <Box sx={{ 
                    mt: 3,
                    p: 3,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                      {bmiResult.bmi}
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
                      sx={{ 
                        width: '100%',
                        py: 2,
                        fontSize: '1.1rem'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Meal Planner Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                borderRadius: 3,
                background: THEME_COLORS.card2,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: THEME_COLORS.secondary, mr: 2 }}>
                  <RestaurantIcon />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color={THEME_COLORS.text}>
                  Meal Planner
                </Typography>
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Select Meal</InputLabel>
                <Select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  label="Select Meal"
                  sx={{ 
                    borderRadius: 2,
                    '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
                  }}
                >
                  {Object.keys(meals).map((meal) => (
                    <MenuItem value={meal} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {mealTypeIcons[meal]}
                      {meal}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                options={foodOptions}
                value={selectedFood}
                onChange={handleFoodSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Food Database"
                    margin="normal"
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <RestaurantIcon color="primary" />
                    {option}
                  </li>
                )}
              />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      label="Unit"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value="grams">grams</MenuItem>
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="pieces">pieces</MenuItem>
                      <MenuItem value="serving">serving</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                onClick={handleAddFood}
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  py: 1.5,
                  background: THEME_COLORS.secondary,
                  '&:hover': {
                    background: THEME_COLORS.primary
                  }
                }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Add Food
              </Button>

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Meal List and Analysis */}
          <Grid item xs={12}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                borderRadius: 3,
                background: THEME_COLORS.card3,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight="bold" color={THEME_COLORS.text}>
                Your Meal Plan
              </Typography>
              
              <Grid container spacing={3}>
                {Object.entries(meals).map(([type, items]) => (
                  <Grid item xs={12} md={6} key={type}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                        background: THEME_COLORS.mealCard
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: THEME_COLORS.secondary, mr: 2 }}>
                            {mealTypeIcons[type]}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold" color={THEME_COLORS.text}>
                            {type}
                          </Typography>
                        </Box>
                        
                        <List>
                          {items.map((item, index) => (
                            <React.Fragment key={index}>
                              <ListItem
                                secondaryAction={
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => handleDeleteFood(type, index)}
                                    sx={{ color: THEME_COLORS.accent }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText
                                  primary={item.foodItem}
                                  secondary={`${item.quantity} ${item.unit} - ${item.calories} kcal`}
                                />
                              </ListItem>
                              {index < items.length - 1 && <Divider />}
                            </React.Fragment>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Nutrition Analysis */}
              {nutritionAnalysis && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" gutterBottom fontWeight="bold" color={THEME_COLORS.text}>
                    Nutrition Analysis
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card 
                        elevation={2}
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.9)'
                        }}
                      >
                        {renderNutritionChart(nutritionAnalysis)}
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card 
                        elevation={2}
                        sx={{ 
                          p: 3,
                          borderRadius: 2,
                          background: THEME_COLORS.card4,
                          color: THEME_COLORS.text
                        }}
                      >
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Daily Totals
                        </Typography>
                        
                        <List>
                          <ListItem>
                            <ListItemText 
                              primary="Calories"
                              secondary={`${nutritionAnalysis.calories} kcal`}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemText 
                              primary="Protein"
                              secondary={`${nutritionAnalysis.protein}g`}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemText 
                              primary="Carbs"
                              secondary={`${nutritionAnalysis.carbs}g`}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemText 
                              primary="Fat"
                              secondary={`${nutritionAnalysis.fat}g`}
                            />
                          </ListItem>
                          <Divider />
                          <ListItem>
                            <ListItemText 
                              primary="Fiber"
                              secondary={`${nutritionAnalysis.fiber}g`}
                            />
                          </ListItem>
                        </List>
                      </Card>

                      {nutritionAnalysis.suggestions && (
                        <Card 
                          elevation={2}
                          sx={{ 
                            mt: 3,
                            p: 3,
                            borderRadius: 2,
                            background: THEME_COLORS.mealCard
                          }}
                        >
                          <Typography variant="h6" gutterBottom fontWeight="bold">
                            Recommendations
                          </Typography>
                          
                          <List>
                            {nutritionAnalysis.suggestions.map((suggestion, index) => (
                              <ListItem key={index}>
                                <ListItemText primary={suggestion} />
                              </ListItem>
                            ))}
                          </List>
                        </Card>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Nutrition;
