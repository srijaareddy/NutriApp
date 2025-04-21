const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
    unique: true
  },
  ingredients: {
    type: String,
    required: true
  },
  cookingMethod: {
    type: String,
    required: true
  },
  recipeSteps: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Food', foodSchema); 