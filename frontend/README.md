# 🧠 Task Manager Frontend

A modern, responsive frontend for a full-stack Task Manager application built with **React**, designed to interact with a secure REST API backend.

---

## 🚀 Features

* 🔐 User Authentication (Login / Register)
* 📋 View all tasks
* ➕ Create new tasks
* ✏️ Update existing tasks
* 🗑️ Delete tasks
* 🎯 Filter tasks (status, priority)
* ⚡ Fast state management with Zustand
* 🌐 API integration using Axios

---

## 🛠️ Tech Stack

* **React (Vite)**
* **Zustand** – Global state management
* **Axios** – API communication
* **React Router** – Navigation
* **CSS** – Styling

---

## 📁 Project Structure

```
src/
│
├── components/       # Reusable UI components
├── pages/            # Page-level components (Dashboard, Login, etc.)
├── store/            # Zustand stores (authStore, taskStore)
├── services/         # API calls (Axios setup)
├── utils/            # Helper functions
├── App.jsx           # Main app component
└── main.jsx          # Entry point
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```
git clone <your-frontend-repo-url>
cd <project-folder>
```

---

### 2. Install dependencies

```
npm install
```

---

### 3. Configure environment variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Start development server

```
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 🔌 API Integration

This frontend connects to backend endpoints like:

| Method | Endpoint   | Description     |
| ------ | ---------- | --------------- |
| GET    | /tasks     | Get all tasks   |
| POST   | /tasks     | Create task     |
| GET    | /tasks/:id | Get single task |
| PUT    | /tasks/:id | Update task     |
| DELETE | /tasks/:id | Delete task     |

---

## 🧠 State Management (Zustand)

Example task store:

```
fetchTasks → GET /tasks  
createTask → POST /tasks  
updateTask → PUT /tasks/:id  
deleteTask → DELETE /tasks/:id  
```

Handles:

* loading states
* API calls
* global task data

---

## 🔐 Authentication Flow

1. User logs in
2. Backend returns JWT (stored in cookies or localStorage)
3. Axios sends credentials with every request
4. Protected routes check authentication

---

## ⚠️ Common Issues

### ❌ Tasks not loading

* Check backend is running
* Verify API URL in `.env`

### ❌ 401 Unauthorized

* User not logged in
* Token missing/expired

### ❌ 404 Errors

* Incorrect API route
* Backend route mismatch

---

## 📌 Future Improvements

* ✅ Drag & drop task board
* 📅 Calendar integration
* 🔔 Notifications
* 📊 Analytics dashboard
* 🌙 Dark mode

---

## 🤝 Contributing

Feel free to fork this repo and submit pull requests.

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 💡 Author

Built as part of a full-stack MERN learning project.
