🚀 AI Resume Analyzer & Job Insights Platform
<p align="center"> <img src="https://img.shields.io/badge/Full%20Stack-Project-blue?style=for-the-badge" /> <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" /> <img src="https://img.shields.io/badge/Made%20With-JavaScript-yellow?style=for-the-badge" /> <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" /> <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" /> </p>

🌐 Live Demo


🚀 Frontend: https://finalyear-project-github-io.vercel.app

⚙️ Backend: https://finalyear-project-github-io.onrender.com

🎥 Preview
<p align="center"> <img src="https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif" width="600"/> </p>
✨ Features

🔥 Upload Resume (PDF)
🧠 Smart AI-like Resume Analysis
💼 Job Role Prediction
💰 Salary Estimation
📍 Best Cities Recommendation
📈 Personalized Improvement Tips
📊 Interactive Charts (Chart.js)
🔐 Secure JWT Authentication
👤 User Profile + Avatar
📜 Resume Analysis History

🧠 How It Works
flowchart LR
A[Upload Resume] --> B[PDF Parsing]
B --> C[Skill Detection Engine]
C --> D[AI Logic Processing]
D --> E[Results Generation]
E --> F[Display UI Cards]

🛠️ Tech Stack
💻 Frontend
HTML
CSS
JavaScript
Chart.js
⚙️ Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer
pdf-parse


⚙️ Setup Instructions
🔹 Clone Repo
git clone https://github.com/your-username/your-repo.git
cd your-repo

🔹 Backend Setup
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

Run server:

nodemon server.js
🔹 Frontend

Open:

frontend/index.html
🚀 Deployment

✔ Backend deployed on Render
✔ Frontend deployed on Vercel

🔐 Authentication Flow
sequenceDiagram
User->>Frontend: Login/Register
Frontend->>Backend: Send Credentials
Backend->>Frontend: JWT Token
Frontend->>Backend: Authenticated Requests
Backend->>Database: Save User Data

📊 Screenshots
<img width="1909" height="929" alt="Screenshot 2026-03-21 151942" src="https://github.com/user-attachments/assets/4d860014-b135-4696-91b7-2e6e35e17ab0" />
<img width="1896" height="933" alt="Screenshot 2026-03-21 152025" src="https://github.com/user-attachments/assets/2b0bcc8b-cb00-4247-903a-3f3f546db249" />


💡 Future Enhancements

🚀 Resume Score (out of 100)
📄 Download PDF Report
🤖 Real AI Model Integration
📊 Advanced Analytics Dashboard
🌍 Multi-language Support

👨‍💻 Author

Abhishek Kumar

⭐ Show Your Support

If you like this project:

👉 Give it a ⭐ on GitHub
👉 Share with your friends

🔥 Fun Fact

This project simulates AI behavior using custom logic — no paid APIs used 😎
