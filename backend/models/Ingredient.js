const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  Ingredient: {
    type: String,
    required: true,
    unique: true
  },
  'Quantity Standard (g)': {
    type: Number,
    default: 100
  },
  'Protein (g)': {
    type: Number,
    required: true
  },
  'Fat (g)': {
    type: Number,
    required: true
  },
  'Fibre (g)': {
    type: Number,
    required: true
  },
  'Carbohydrates (g)': {
    type: Number,
    required: true
  },
  'Energy (kcal)': {
    type: Number,
    required: true
  },
  'Calories (kcal)': {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema); 