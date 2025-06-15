# 💸 MoneyMate – Your Smart Expense & Income Tracker

**MoneyMate** is a modern, full-stack personal finance tracker that helps users manage their income and expenses, visualize financial data, and make better money decisions. Built for speed, clarity, and security.

---

## 🚀 Features

- ✅ Add, edit, and delete **expenses** and **income**
- 📊 View real-time **financial summaries** with visual charts
- 📅 Access a detailed **transaction history**
- 🔒 Secure **Firebase authentication**
- 🧭 Intuitive sidebar navigation
- 🌗 Optional **Dark/Light mode**

---

## 🧰 Tech Stack

| Category  | Tech Used                         |
|-----------|-----------------------------------|
| Frontend  | React.js, Chart.js                |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB                           |
| Auth      | Firebase Authentication           |
| Styling   | CSS, Tailwind (optional)          |
| Tools     | dotenv, concurrently (dev)        |

---

## 📁 Folder Structure

Money-Mate-Main/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ └── utils/
│
├── server/ # Node + Express backend
│ ├── controllers/
│ ├── models/
│ └── routes/
│
├── .env # Environment variables
├── package.json # Project metadata and scripts
└── README.md # Project overview

## 🔧 Getting Started

### ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) & npm
- MongoDB Atlas (or local MongoDB setup)
- Firebase project (for authentication)

---

### 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/omkarawaregithub/Money-Mate-Main.git
cd Money-Mate-Main

##Install dependencies

npm install
cd client && npm install
cd ../server && npm install

Configure environment variables

Create a .env file in the root of your project and add:

env
Copy
Edit
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_MONGO_URI=your_mongodb_connection_string
▶️ Run the App
bash
Copy
Edit

# In the root directory:
npm run dev
This runs both frontend and backend together using concurrently.
Visit: http://localhost:3000

🧪 Example Use Cases
✅ Track daily, monthly, and yearly expenses

✅ Visualize income vs. expenses in bar and pie charts

✅ Log recurring transactions

✅ Use financial insights to budget smarter

✅ Access historical expense history for analysis

