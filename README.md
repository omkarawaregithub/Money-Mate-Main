# 💸 MoneyMate – Your Smart Expense & Income Tracker

**MoneyMate** is a modern personal finance web application that empowers users to manage their expenses and income, track spending habits, and get insights to make smarter financial decisions. It's fast, secure, and designed with simplicity in mind.

---

## 🚀 Features

- ✅ Add, edit & delete **expenses** and **income**
- 📊 View real-time **financial summaries**
- 📅 Maintain a detailed **transaction history**
- 🧠 AI-powered budget suggestions *(coming soon)*
- 🔒 Firebase-powered authentication
- 🧭 Intuitive sidebar navigation
- 🌗 Light/Dark mode *(optional)*


## 🧰 Tech Stack

| Frontend | Backend | Database | Auth | Tools |
|----------|---------|----------|------|-------|
| React.js | Node.js | MongoDB  | Firebase | Express, Chart.js, dotenv |

---

## 📦 Folder Structure
Money-Mate-Main/
│
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ └── utils/
│
├── server/ # Node + Express backend (if applicable)
│ ├── models/
│ ├── routes/
│ └── controllers/
│
├── .env # Environment variables
├── package.json
└── README.md

## 🔧 Getting Started

### ⚙️ Prerequisites

- Node.js & npm installed
- MongoDB Atlas or local MongoDB
- Firebase account and project

### 🛠️ Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/omkarawaregithub/Money-Mate-Main.git
cd Money-Mate-Main
Install dependencies

bash
Copy
Edit
npm install
Configure .env

Create a .env file in the root directory and add:

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
Start the project

bash
Copy
Edit
npm start
Visit http://localhost:3000 in your browser.

🧪 Example Use Cases
Track daily/monthly/yearly spending

Visualize income vs. expenses

Log recurring transactions
