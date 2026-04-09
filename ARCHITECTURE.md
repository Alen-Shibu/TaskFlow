# ARCHITECTURE.md — Task Manager App

---

## 1. System Overview

This is a full-stack Task Management application built with the MERN stack (MongoDB, Express, React, Node.js). The backend is a REST API built with Express and Node.js, handling authentication, task CRUD, and role-based access control. The frontend is a React (Vite) single-page application that communicates with the backend via Axios. MongoDB stores all persistent data (users and tasks), accessed through Mongoose. The two projects live in separate repositories and are connected over HTTP — the frontend sends requests to `http://localhost:5000` in development, with credentials (cookies) included on every request.

---

## 2. Folder Structure

### Backend (`/backend`)

```
backend/
├── controllers/
│   ├── auth.controllers.js     # register, login, logout handlers
│   └── task.controllers.js     # CRUD + assign task handlers
├── middleware/
│   ├── auth.middleware.js      # protectRoute — verifies JWT from cookie
│   └── role.middleware.js      # requireRole — checks role from JWT payload
├── models/
│   ├── user.model.js           # Mongoose User schema
│   └── task.model.js           # Mongoose Task schema
├── routes/
│   ├── auth.routes.js          # /api/auth/*
│   └── task.routes.js          # /api/task/*
├── lib/
│   └── utils.js                # generateToken helper
├── .env                        # secrets (not committed)
├── .env.example                # sample env file
└── server.js                   # Express app entry point
```

Controllers hold all business logic. Middleware is kept separate so it can be composed per-route. Models are the single source of truth for data shape.

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx           # Login form page
│   │   ├── Register.jsx        # Register form page
│   │   └── TaskPage.jsx        # Main dashboard
│   ├── components/
│   │   ├── TaskCard.jsx        # Individual task display
│   │   └── TaskModal.jsx       # Create / edit task form modal
│   ├── store/
│   │   ├── useAuthStore.js     # Zustand store — auth state + actions
│   │   └── useTaskStore.js     # Zustand store — task state + actions
│   ├── styles/
│   │   ├── auth.css            # Login / Register page styles
│   │   └── TaskPage.css        # Dashboard styles
│   └── App.jsx                 # Route definitions + auth guard
└── .env.local                  # VITE_API_URL (not committed)
```

Global state lives in Zustand stores rather than prop-drilling or Context. This keeps components clean — they just call store actions and read state.

---

## 3. Database Schema

### User

```js
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },        // bcrypt hash, never plaintext
  role:     { type: String, enum: ['admin', 'member'], default: 'member' }
}, { timestamps: true });
```

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Display name shown in the UI |
| `email` | String | Unique identifier used for login; normalised to lowercase |
| `password` | String | bcrypt hash (cost factor 10) — plaintext is never stored |
| `role` | String | `'admin'` or `'member'` — drives RBAC logic |
| `timestamps` | Auto | `createdAt` / `updatedAt` added by Mongoose |

### Task

```js
const taskSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  status:      { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate:     { type: Date },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
```

| Field | Type | Purpose |
|---|---|---|
| `title` | String | Short label for the task |
| `description` | String | Optional longer detail |
| `status` | String | Current state — `todo`, `in-progress`, or `done` |
| `priority` | String | Urgency level — `low`, `medium`, or `high` |
| `dueDate` | Date | Optional deadline |
| `userId` | ObjectId | Reference to the user who created the task |
| `assignedTo` | ObjectId | Reference to the user the task is assigned to (admin feature) |
| `timestamps` | Auto | `createdAt` / `updatedAt` |

---

## 4. API Endpoints

### Auth — `/api/auth`

| Method | Path | Auth | Request Body | Response |
|---|---|---|---|---|
| POST | `/register` | None | `{ name, email, password }` | `{ _id, name, email }` + sets JWT cookie |
| POST | `/login` | None | `{ email, password }` | `{ _id, name, email }` + sets JWT cookie |
| POST | `/logout` | None | — | `{ message }` + clears cookie |
| GET | `/me` | Required | — | `{ _id, name, email, role }` |

### Tasks — `/api/task`

All task routes require authentication (`protectRoute` middleware).

| Method | Path | Role | Request Body | Response |
|---|---|---|---|---|
| GET | `/` | Any | — | Array of tasks (admin: all; member: own + assigned) |
| POST | `/` | Any | `{ title, description, status, priority, dueDate }` | Created task object |
| GET | `/:id` | Any | — | Single task (scoped to `userId`) |
| PUT | `/:id` | Any | Any task fields to update | Updated task object |
| DELETE | `/:id` | Any | — | `{ message: 'Task deleted' }` |
| PUT | `/:id/assign` | Admin only | `{ userId }` | Updated task with `assignedTo` set |

---

## 5. Auth Flow

### Registration
1. Client sends `POST /api/auth/register` with `{ name, email, password }`.
2. Backend validates fields and checks for duplicate email.
3. Password is hashed with `bcrypt` (cost factor 10).
4. A new `User` document is saved with `role: 'member'` by default.
5. `generateToken` signs a JWT containing `{ id, role }` and sets it as an `httpOnly` cookie (`maxAge: 7d`).
6. Response returns the public user object (no password, no token in body).

### Login
1. Client sends `POST /api/auth/login` with `{ email, password }`.
2. Backend looks up the user by normalised email and compares the password with `bcrypt.compare`.
3. On success, `generateToken` sets a fresh JWT cookie.
4. Response returns the public user object.

### Protected Routes
1. Every protected request automatically sends the `jwt` cookie (Axios `withCredentials: true`).
2. `protectRoute` middleware extracts and verifies the token using `jsonwebtoken`.
3. The decoded payload (`{ id, role }`) is attached to `req.user`.
4. If the token is missing or invalid, the middleware returns `401 Unauthorized`.

### Auth State on the Frontend
On app load, `App.jsx` calls `checkAuth()` which hits `GET /api/auth/me`. If the cookie is valid, the user is hydrated into the Zustand store and the app renders normally. If it fails, `user` is set to `null` and React Router redirects to `/login`.

### Token Storage
The JWT is stored exclusively in an `httpOnly` cookie — it is never stored in `localStorage` or accessible via JavaScript. This prevents XSS-based token theft.

---

## 6. Role-Based Access Control (RBAC)

### How role is embedded in the JWT

When `generateToken` is called, the payload includes both `id` and `role`:

```js
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});
```

This means `req.user.role` is available in every downstream middleware and controller after `protectRoute` runs — without an extra database query per request.

### How RolesGuard works

A `requireRole` middleware factory accepts one or more allowed roles and returns an Express middleware:

```js
// usage on a route
router.put('/:id/assign', protectRoute, requireRole('admin'), assignTask);
```

Inside `requireRole`, if `req.user.role` is not in the allowed list, it returns `403 Forbidden` — never `404`. This distinction matters: a `404` would silently hide the existence of a resource, while a `403` correctly communicates "you are authenticated but not authorised".

### Dual enforcement (JWT + DB)

The role is read from the JWT on every request for speed (no extra DB query). However, the role is also stored on the `User` document in MongoDB. This means:

- If a user's role needs to be changed (e.g. promoting a member to admin), the DB is updated and a fresh login re-issues a token with the new role.
- The DB is the authoritative source; the JWT is a short-lived cached copy.

### Task scoping by role

In `getTasks`, the query is branched by role:
- **Admin** → `Task.find()` — sees all tasks in the system.
- **Member** → `Task.find({ $or: [{ userId }, { assignedTo }] })` — sees only tasks they created or were assigned.

---

## 7. AI Tools Used

| Tool | Used For | What I Reviewed / Changed |
|---|---|---|
| **GitHub Copilot** | Boilerplate for Mongoose schemas, Express route scaffolding, Zustand store structure | Reviewed all generated field types and adjusted enums to match exact requirements; rewrote RBAC logic which Copilot got partially wrong |
| **ChatGPT** | Clarifying JWT `httpOnly` cookie flow, understanding `bcrypt` cost factor tradeoffs, RBAC architecture discussion | Used explanations to inform my own implementation — did not paste generated code directly |
| **Claude** | Reviewing task controller logic, asking about the `$or` query for member task scoping, explaining Mongoose `findOneAndUpdate` options | Verified the advice against Mongoose docs before using; adjusted the `assignTask` controller after comparing two approaches |

All AI-generated code was read line-by-line before committing. If I could not explain a line, I either removed it or rewrote it until I could.

---

## 8. Decisions & Trade-offs

**Cookie-based auth over localStorage** — `httpOnly` cookies are not accessible to JavaScript, which removes the XSS attack surface for token theft. The trade-off is that `withCredentials: true` must be set on every Axios request and CORS must be configured correctly on the backend. I considered this a worthwhile trade.

**Zustand over Redux or Context** — Zustand has minimal boilerplate, co-locates state and async actions in one file, and does not require a Provider wrapper. For an app of this size, Redux would have been over-engineering. Context would have caused unnecessary re-renders.

**Role in JWT payload** — Embedding `role` in the token avoids a DB lookup on every protected request. The downside is that a role change does not take effect until the user re-logs in. For this app's scope that is acceptable; in production I would either shorten token expiry or implement token revocation.

**Separate repos for frontend and backend** — Keeps concerns cleanly separated and makes independent deployment straightforward. The trade-off is slightly more setup friction locally (two terminals, two `npm install` commands). A Docker Compose file would solve this.

**What I would improve with more time:**
- Add input validation on the backend using `express-validator` or `joi` — currently validation is minimal.
- Write unit tests for the auth middleware and task controllers.
- Add a Docker Compose file so the whole stack starts with one command.
- Implement token refresh so long-lived sessions do not require re-login.
- The `updateTask` and `deleteTask` controllers currently only match `userId`, not `assignedTo` — an admin editing a task they did not create would get a 404. I would fix this by branching the query on role, the same way `getTasks` does.