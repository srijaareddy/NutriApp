const mongoose = require('mongoose');
const Food = require('./models/Food');
const Ingredient = require('./models/Ingredient');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutriapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const foodDataPath = path.join(__dirname, '../frontend/src/foodData.json');
const foodData = JSON.parse(fs.readFileSync(foodDataPath, 'utf8'));

const transformedFoodData = foodData.map(food => ({
  dishName: food["Dish Name"],
  ingredients: food["Ingredients"],
  cookingMethod: food["Cooking Method"],
  recipeSteps: food["Recipe Steps"]
}));

const ingredientDataPath = path.join(__dirname, '../frontend/src/database.json');
const ingredientData = JSON.parse(fs.readFileSync(ingredientDataPath, 'utf8'));

const transformedIngredientData = ingredientData.map(ingredient => ({
  name: ingredient.name,
  quantity: ingredient["Quantity (100g)"],
  protein: ingredient["Protein (g)"],
  fat: ingredient["Fat (g)"],
  fibre: ingredient["Fibre (g)"],
  carbohydrates: ingredient["Carbohydrates (g)"],
  energy: ingredient["Energy (kJ)"],
  calories: ingredient["Calories (kcal)"],
  rep_type: ingredient.rep_type
}));

async function importData() {
  try {
    await Food.deleteMany({});
    await Ingredient.deleteMany({});

    await Food.insertMany(transformedFoodData);
    console.log('Food data imported successfully');

    await Ingredient.insertMany(transformedIngredientData);
    console.log('Ingredient data imported successfully');

    console.log('All data imported successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData(); 