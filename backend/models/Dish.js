const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  'Dish Name': {
    type: String,
    required: true
  },
  Ingredients: {
    type: String,
    required: true
  },
  'Cooking Method': {
    type: String,
    required: true
  },
  'Serving Size': {
    type: String,
    required: true
  },
  'Preparation Time': {
    type: String,
    required: true
  },
  'Cooking Time': {
    type: String,
    required: true
  },
  'Total Time': {
    type: String,
    required: true
  },
  'Difficulty Level': {
    type: String,
    required: true
  },
  'Cuisine Type': {
    type: String,
    required: true
  },
  'Dietary Restrictions': {
    type: String,
    required: true
  },
  'Nutritional Information': {
    type: String,
    required: true
  },
  'Health Benefits': {
    type: String,
    required: true
  },
  'Tips and Variations': {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Dish', dishSchema); 