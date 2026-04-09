# Task Manager

Full-stack Task Manager app built with React, NestJS, and MongoDB.

## Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Running Locally

### 1. Clone the repository
```
git clone https://github.com/Alen-Shibu/TaskFlow.git
cd TaskFlow
```

### 2. Setup backend
```
cd backend
npm install
```
Create a `.env` file in `/backend`:
```
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
PORT=5000
```
```
npm run start:dev
```
Backend runs at `http://localhost:5000`

### 3. Setup frontend
```
cd ../frontend
npm install
```
Create a `.env` file in `/frontend`:
```
VITE_API_URL=http://localhost:5000/api
```
```
npm run dev
```
Frontend runs at `http://localhost:5173`

## That's it
Open `http://localhost:5173` in your browser.