🚀 AI Resume Analyzer & Job Insights Platform

A full-stack web application that analyzes resumes and provides job insights, salary predictions, and improvement suggestions using smart custom logic (AI-like system without paid APIs).

🌐 Live Demo
🔗 Frontend: https://finalyear-project-github-io.vercel.app
🔗 Backend: https://finalyear-project-github-io.onrender.com
📌 Features

✨ Upload Resume (PDF)
🧠 Smart Skill Detection (AI-like logic)
💼 Job Role Prediction
💰 Salary Estimation (based on skills & experience)
📍 Best Cities for Jobs
📈 Improvement Suggestions
📊 Salary vs Cities Chart
🔐 JWT Authentication (Login/Register)
👤 User Profile + Avatar
📜 History Saved in Database

🛠️ Tech Stack
Frontend
HTML
CSS
JavaScript
Chart.js
Backend
Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Multer (file upload)
pdf-parse (resume parsing)

📂 Project Structure
project/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── middleware/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── css/
│   └── js/

⚙️ Installation & Setup
🔹 1. Clone Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

🔹 2. Setup Backend
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

Run backend:

nodemon server.js

🔹 3. Run Frontend

Open:

frontend/index.html
🚀 Deployment
Backend deployed on Render
Frontend deployed on Vercel
🔐 Authentication Flow
User logs in / registers
JWT token stored in localStorage
Protected routes use token for verification
User-specific history stored in database
🧠 How It Works
Resume PDF is uploaded
Text is extracted using pdf-parse
Custom logic detects:
Skills
Experience
Education
System predicts:
Job roles
Salary range
Best cities
Results displayed as clean UI cards
📸 Screenshots

<img width="1909" height="929" alt="image" src="https://github.com/user-attachments/assets/61632d8a-dc36-41e9-acef-705ca0243f27" />
<img width="1896" height="933" alt="image" src="https://github.com/user-attachments/assets/d4d48969-cfa4-44b1-9a6c-67a3fa90660d" />



💡 Future Improvements
Resume score (out of 100)
Download analysis report (PDF)
Recruiter dashboard
Real-time job API integration
Advanced NLP model integration
👨‍💻 Author

Abhishek Kumar

⭐ Support

If you like this project, give it a ⭐ on GitHub!
