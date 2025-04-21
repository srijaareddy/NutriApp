# NutriApp - Nutrition Analysis and Diet Planning

A comprehensive nutrition tracking and analysis application that helps users track their diet, calculate BMI, and get personalized recommendations based on their nutritional intake.

## Features

- **BMI Calculator**: Calculate your Body Mass Index and understand what it means for your health
- **Food Database**: Access a database of foods with detailed nutritional information
- **Ingredient Analysis**: Analyze the nutritional content of foods based on their ingredients
- **Meal Planning**: Create daily meal plans and track your nutritional intake
- **Personalized Recommendations**: Get tailored diet recommendations based on your BMI and nutritional goals

## Implementation Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone https://github.com/srijaareddy/NutriApp.git
cd NutriApp
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the backend directory with the following content:

```
MONGODB_URI=mongodb://localhost:27017/nutriapp
JWT_SECRET=your-secret-key
PORT=5000
```

### Step 4: Import Data

The application uses two main data sources:
1. **Ingredients Database**: Contains nutritional information for various ingredients
2. **Foods Database**: Contains recipes and ingredients for various dishes

To import this data into MongoDB:

```bash
cd backend
node importData.js
```

This script will:
- Read the ingredient data from `frontend/src/database.json`
- Read the food data from `frontend/src/foodData.json`
- Transform the data to match our MongoDB schemas
- Import the data into MongoDB

### Step 5: Start the Backend Server

```bash
cd backend
node server.js
```

The server will start on port 5000 (or the port specified in your .env file).

### Step 6: Start the Frontend Application

```bash
cd frontend
npm start
```

The application will start on port 3000.

## How to Use the Application

### 1. Calculate Your BMI

- Enter your height (in cm) and weight (in kg)
- Click "Calculate BMI" to see your BMI and category

### 2. Add Foods to Your Meal Plan

You can add foods in two ways:

#### Option 1: Select from the Database
- Select a meal type (Breakfast, Lunch, Dinner, etc.)
- Use the autocomplete dropdown to select a food from the database
- Click "Add Food Item" to add it to your meal plan

#### Option 2: Manual Entry
- Select a meal type
- Enter the food name, quantity, and unit manually
- Click "Add Food Item" to add it to your meal plan

### 3. View Nutrition Analysis

After adding foods to your meal plan, the application will:
- Calculate the total nutritional content (calories, protein, carbs, fat, fiber)
- Display a pie chart showing the distribution of macronutrients
- Provide personalized recommendations based on your BMI and nutritional intake

### 4. Get Personalized Recommendations

The application provides recommendations based on:
- Your BMI category (Underweight, Normal weight, Overweight, Obese)
- Your total nutritional intake
- Your specific nutritional goals

## Technical Implementation Details

### Backend Architecture

- **Express.js**: Web server framework
- **MongoDB**: Database for storing food and ingredient data
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication

### Frontend Architecture

- **React**: UI library
- **Material-UI**: Component library
- **Recharts**: Charting library

### Data Flow

1. User selects a food from the database
2. Frontend sends a request to the backend API
3. Backend:
   - Finds the food in the database
   - Extracts ingredients from the food
   - Parses each ingredient to get name and quantity
   - Converts quantities to grams
   - Looks up nutritional information for each ingredient
   - Calculates total nutritional content
   - Generates personalized recommendations
4. Frontend displays the results to the user

## Customization

### Adding More Foods

To add more foods to the database:
1. Edit the `frontend/src/foodData.json` file
2. Add new food items following the existing format
3. Run the import script again to update the database

### Adding More Ingredients

To add more ingredients to the database:
1. Edit the `frontend/src/database.json` file
2. Add new ingredients following the existing format
3. Run the import script again to update the database

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in the .env file

2. **Data Import Error**
   - Ensure the data files exist and are properly formatted
   - Check file paths in the importData.js script

3. **API Connection Error**
   - Ensure the backend server is running
   - Check the API URL in the frontend code

## License

This project is licensed under the MIT License - see the LICENSE file for details. 