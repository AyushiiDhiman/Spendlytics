# Spendlytics 💰

An AI-powered full-stack expense management application built using the MERN stack.

## 🚀 Project Status

Core app is complete and working end-to-end: auth, expense tracking, analytics, and AI features.

## ✨ Features

- JWT Authentication (signup / login, protected routes)
- Add / delete expenses
- Expense dashboard with running total
- Monthly expense bar chart
- Category-wise pie chart (Travel, Food, Shopping, Bills, Entertainment, Others)
- AI-suggested expense category (via OpenAI, with a keyword-based fallback if no API key is set)
- AI-generated spending insight ("Your biggest category is Food, spending rose 12% this month...")
- MongoDB integration via Mongoose
- REST API with proper auth middleware

## 🛠️ Tech Stack

**Frontend:** React, Vite, React Router, Axios, Recharts
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, OpenAI SDK

## 📂 Project Structure

```
ai-expense-manager/
├── client/
│   ├── src/
│   │   ├── components/   # ExpenseForm, ExpenseList, ExpenseChart, AIInsights
│   │   ├── pages/         # Login, Signup, Dashboard
│   │   ├── context/        # AuthContext
│   │   ├── routes/         # ProtectedRoute
│   │   └── services/       # api.js (axios instance)
│   └── ...
├── server/
│   ├── models/        # User, Expense
│   ├── controllers/   # auth, expense, ai
│   ├── routes/        # auth, expense, ai
│   ├── middleware/    # JWT auth middleware
│   └── config/        # MongoDB connection
```

## ⚙️ Installation

### Clone Repository
```
git clone https://github.com/AyushiiDhiman/ai-expense-manager.git
cd ai-expense-manager
```

### Server Setup
```
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev
```

### Client Setup
```
cd client
npm install
cp .env.example .env   # only needed if your API isn't on localhost:5000
npm run dev
```

## 🔐 Environment Variables

**`server/.env`**
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_string
PORT=5000
OPENAI_API_KEY=your_openai_api_key_optional
CLIENT_URL=http://localhost:5173
```

> `OPENAI_API_KEY` is optional. Without it, AI categorization falls back to keyword matching and AI insights fall back to a rule-based summary — so the app is fully usable without an API key, but richer with one.

**`client/.env`** (optional)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📌 Possible Next Steps

- OCR receipt scanner
- Budget alerts
- PDF / CSV export of expense history
- Group expense management

## 👩‍💻 Authors

- Ayushi Dhiman
- Tanya Agarwal
