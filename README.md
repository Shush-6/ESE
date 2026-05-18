# 🏢 AI-Powered Employee Performance Analytics System

> B.Tech 4th Sem | ESE Examination | AI Driven Full Stack Development (AI308B)

A full-stack MERN application that analyzes employee performance and provides AI-powered recommendations using OpenRouter API.

---

## 📁 Folder Structure (Q9: Code Quality)

```
employee-analytics/
├── backend/                      # Node.js + Express API
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── employeeController.js # Q2: Employee CRUD logic
│   │   ├── aiController.js       # Q5: AI recommendation logic
│   │   └── authController.js     # Q6: Auth logic
│   ├── middleware/
│   │   ├── auth.js               # Q6: JWT protect middleware
│   │   └── errorHandler.js       # Q2: Error handling
│   ├── models/
│   │   ├── Employee.js           # Q3: Employee schema
│   │   └── User.js               # Q6: User schema (bcrypt)
│   ├── routes/
│   │   ├── employeeRoutes.js     # Q2: /api/employees
│   │   ├── aiRoutes.js           # Q5: /api/ai
│   │   └── authRoutes.js         # Q6: /api/auth
│   ├── .env.example
│   └── server.js                 # App entry point
│
├── frontend/                     # React + Vite
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js  # Q4: Axios setup + interceptors
│       ├── components/
│       │   ├── EmployeeForm.jsx  # Q1: Registration form
│       │   ├── Navbar.jsx        # Navigation
│       │   └── ProtectedRoute.jsx # Q6: Route protection
│       ├── context/
│       │   └── AuthContext.jsx   # Q6: JWT context
│       ├── pages/
│       │   ├── EmployeeList.jsx  # Q1: List + Search/Filter
│       │   ├── Analytics.jsx     # Rankings dashboard
│       │   ├── AIRecommendations.jsx # Q1 Q5: AI display
│       │   └── Login.jsx         # Q6: Login + Signup
│       ├── App.jsx               # Routes
│       └── main.jsx              # Entry
│
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- OpenRouter API key (free at openrouter.ai)

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/employee-analytics.git
cd employee-analytics
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and OpenRouter API key
npm run dev
```

### 3. Frontend Setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173  
API runs at: http://localhost:5000

---

## 🔌 API Endpoints (Q2)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register HR/Admin user |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/employees` | Add employee |
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/search?department=Development` | Search/filter |
| GET | `/api/employees/analytics` | Stats & rankings |
| GET | `/api/employees/:id` | Single employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### AI (Q5)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/recommend` | AI recommendation for employee |
| POST | `/api/ai/rank` | Rank multiple employees with AI |

---

## 📋 Sample API Requests (Postman / Thunder Client)

### Signup
```json
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@company.com",
  "password": "admin123"
}
// Returns: { token: "eyJ..." }
```

### Add Employee
```json
POST /api/employees
Authorization: Bearer <token>
{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3,
  "designation": "Senior Developer"
}
```

### AI Recommendation
```json
POST /api/ai/recommend
Authorization: Bearer <token>
{
  "employeeId": "<mongodb_id_here>"
}
```

---

## 🧪 Test Cases (Q3, Q4, Q6)

| Test | Expected |
|------|----------|
| Insert valid employee | 201 Created |
| Duplicate email | 400 - "Duplicate value for field: email" |
| Missing performanceScore | 400 - "Performance score is required" |
| Search by department | Filtered employee list |
| Login valid | JWT token returned |
| Login invalid password | 401 Unauthorized |
| Access route without token | 401 Access denied |
| Password in DB | Bcrypt hashed (not plain text) |

---

## 🚀 Deployment on Render (Q8)

### Backend (Web Service)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variables from `.env`

### Frontend (Static Site)
1. New Static Site on Render
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🔐 Security Features (Q6)

- JWT authentication with 7-day expiry
- Bcrypt password hashing (12 salt rounds)
- Protected routes (frontend + backend)
- Role-based access control (admin/hr/viewer)
- Token sent in Authorization header

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| AI | OpenRouter API (GPT-3.5) |
| HTTP | Axios |
| Deployment | Render.com |
"# ESE" 
