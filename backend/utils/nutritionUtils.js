const Ingredient = require('../models/Ingredient');

// Function to parse ingredient string and extract name and quantity
const parseIngredient = (ingredientStr) => {
  const regex = /([^(]+)\s*\(([^)]+)\)/;
  const match = ingredientStr.match(regex);
  
  if (!match) return null;
  
  return {
    name: match[1].trim(),
    quantity: match[2].trim()
  };
};

// Function to convert quantity to grams
const convertToGrams = (quantity) => {
  const value = parseFloat(quantity);
  const unit = quantity.toLowerCase().replace(/[0-9\s]/g, '');
  
  switch(unit) {
    case 'g':
      return value;
    case 'kg':
      return value * 1000;
    case 'ml':
      return value;
    case 'l':
      return value * 1000;
    case 'cup':
      return value * 240;
    case 'tbsp':
      return value * 15;
    case 'tsp':
      return value * 5;
    case 'piece':
      return value * 100; // Assuming average piece is 100g
    case 'clove':
      return value * 3; // Assuming average garlic clove is 3g
    case 'inch':
      return value * 15; // Assuming average inch of ginger is 15g
    default:
      return value;
  }
};

// Function to calculate nutritional values for a list of ingredients
const calculateNutrition = async (ingredientsList) => {
  let totalNutrition = {
    protein: 0,
    fat: 0,
    fibre: 0,
    carbohydrates: 0,
    energy: 0,
    calories: 0
  };

  for (const ingredientStr of ingredientsList) {
    const parsed = parseIngredient(ingredientStr);
    if (!parsed) continue;

    const ingredient = await Ingredient.findOne({ 
      name: { $regex: new RegExp(parsed.name, 'i') } 
    });

    if (ingredient) {
      const quantityInGrams = convertToGrams(parsed.quantity);
      const multiplier = quantityInGrams / 100; // Convert to per 100g basis

      totalNutrition.protein += ingredient.protein * multiplier;
      totalNutrition.fat += ingredient.fat * multiplier;
      totalNutrition.fibre += ingredient.fibre * multiplier;
      totalNutrition.carbohydrates += ingredient.carbohydrates * multiplier;
      totalNutrition.energy += ingredient.energy * multiplier;
      totalNutrition.calories += ingredient.calories * multiplier;
    }
  }

  // Round all values to 2 decimal places
  Object.keys(totalNutrition).forEach(key => {
    totalNutrition[key] = Math.round(totalNutrition[key] * 100) / 100;
  });

  return totalNutrition;
};

module.exports = {
  parseIngredient,
  convertToGrams,
  calculateNutrition
}; 