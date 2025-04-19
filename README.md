# Nutrition Dashboard

A full-stack web application that helps users track their nutrition, calculate BMI, and get personalized health suggestions based on their meal plans.

## Features

- BMI Calculator
- Meal Plan Tracker
- Nutrition Analysis Dashboard
- Personalized Health Suggestions
- Visual Nutrition Data Representation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nutriapp
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/nutriapp
PORT=5000
```

## Running the Application

1. Start MongoDB service

2. Start the application:
```bash
npm start
```

This will start both the frontend (port 3000) and backend (port 5000) servers.

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your height and weight to calculate your BMI
3. Input your meal plan details (calories, protein, carbs, fat) for each meal
4. Click "Analyze Meal Plan" to get nutrition analysis and health suggestions

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Recharts
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose

## License

MIT 