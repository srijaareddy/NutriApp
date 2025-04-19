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

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!foodItem || !quantity) return;

    const nutritionValues = {
      calories: Math.round(quantity * 2),
      protein: Math.round(quantity * 0.1),
      carbs: Math.round(quantity * 0.3),
      fat: Math.round(quantity * 0.1)
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
    const analysis = {
      totalCalories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      suggestions: []
    };

    allMeals.forEach(meal => {
      analysis.totalCalories += meal.calories || 0;
      analysis.protein += meal.protein || 0;
      analysis.carbs += meal.carbs || 0;
      analysis.fat += meal.fat || 0;
    });

    // Generate suggestions
    if (analysis.totalCalories < 1500) {
      analysis.suggestions.push('Consider increasing your calorie intake for better energy levels');
    } else if (analysis.totalCalories > 2500) {
      analysis.suggestions.push('Consider reducing your calorie intake for better weight management');
    }

    if (analysis.protein < 50) {
      analysis.suggestions.push('Increase protein intake for better muscle maintenance');
    }

    setNutritionAnalysis(analysis);
  };

  const COLORS = ['#2B6777', '#89B6C1', '#52AB98', '#C8D8E4'];

  const pieData = nutritionAnalysis ? [
    { name: 'Protein', value: nutritionAnalysis.protein },
    { name: 'Carbs', value: nutritionAnalysis.carbs },
    { name: 'Fat', value: nutritionAnalysis.fat }
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
                              secondary={`${item.quantity} ${item.unit} | Calories: ${item.calories} | Protein: ${item.protein}g | Carbs: ${item.carbs}g | Fat: ${item.fat}g`}
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
                          <ListItemText primary={`Total Calories: ${nutritionAnalysis.totalCalories} kcal`} />
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
                          Suggestions
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



// import React from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Container,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Box,
//   Grid,
// } from '@mui/material';

// const Nutrition = () => {
//   const userData = {
//     name: 'Srija Reddy Bobbala',
//     age: 21,
//     weight: 55,
//     height: 160,
//     diet: 'Vegetarian',
//     ingredients: [
//       {
//         foodItem: 'Rice',
//         quantity: 100,
//         unit: 'g',
//         calories: 130,
//         protein: 2.7,
//         carbs: 28.2,
//         fat: 0.3,
//       },
//       {
//         foodItem: 'Dal',
//         quantity: 100,
//         unit: 'g',
//         calories: 116,
//         protein: 9.0,
//         carbs: 20.0,
//         fat: 0.4,
//       },
//       {
//         foodItem: 'Vegetable Curry',
//         quantity: 150,
//         unit: 'g',
//         calories: 90,
//         protein: 2.0,
//         carbs: 12.0,
//         fat: 3.0,
//       },
//     ],
//   };

//   // Calculate BMI
//   const bmi = (userData.weight / ((userData.height / 100) ** 2)).toFixed(2);

//   const getBmiStatus = (bmi) => {
//     if (bmi < 18.5) return 'Underweight';
//     if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
//     if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
//     return 'Obesity';
//   };

//   return (
//     <>
//       {/* Navbar */}
//       <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #6a11cb, #2575fc)' }}>
//         <Toolbar>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Nutritional Dashboard
//           </Typography>
//           <Typography variant="body1">Welcome, {userData.name}</Typography>
//         </Toolbar>
//       </AppBar>

//       {/* Main Container */}
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Grid container spacing={4}>
//           {/* User Info and BMI */}
//           <Grid item xs={12}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//               <Typography variant="h5" gutterBottom>User Details</Typography>
//               <Typography>Name: {userData.name}</Typography>
//               <Typography>Age: {userData.age}</Typography>
//               <Typography>Weight: {userData.weight} kg</Typography>
//               <Typography>Height: {userData.height} cm</Typography>
//               <Typography>BMI: {bmi} ({getBmiStatus(bmi)})</Typography>
//             </Paper>
//           </Grid>

//           {/* Nutrition List */}
//           <Grid item xs={12}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//               <Typography variant="h5" gutterBottom>Dietary Intake</Typography>
//               <List>
//                 {userData.ingredients.map((item, index) => (
//                   <React.Fragment key={index}>
//                     <ListItem>
//                       <ListItemText
//                         primary={item.foodItem}
//                         secondary={`${item.quantity} ${item.unit} | Calories: ${item.calories} | Protein: ${item.protein}g | Carbs: ${item.carbs}g | Fat: ${item.fat}g`}
//                       />
//                     </ListItem>
//                     {index < userData.ingredients.length - 1 && <Divider />}
//                   </React.Fragment>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           {/* Placeholder for Pie Chart */}
//           <Grid item xs={12}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3, textAlign: 'center' }}>
//               <Typography variant="h5">Nutrition Chart</Typography>
//               <Typography sx={{ mt: 2, color: 'text.secondary' }}>
//                 (Pie chart will be displayed here.)
//               </Typography>
//             </Paper>
//           </Grid>

//           {/* Recommendations */}
//           <Grid item xs={12}>
//             <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
//               <Typography variant="h5" gutterBottom>Recommendations</Typography>
//               <Typography sx={{ mt: 1 }}>
//                 Based on your BMI of {bmi}, you fall under the category: <strong>{getBmiStatus(bmi)}</strong>.
//                 Maintain a balanced diet with adequate intake of proteins, carbs, and fats. Stay hydrated and do regular exercise!
//               </Typography>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Footer */}
//       <Box component="footer" sx={{ background: 'linear-gradient(to right, #2575fc, #6a11cb)', p: 2, mt: 4 }}>
//         <Typography align="center" color="white">
//           © 2025 Nutritional Profile Project. Built by Srija Reddy Bobbala.
//         </Typography>
//       </Box>
//     </>
//   );
// };

// export default Nutrition;
