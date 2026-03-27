const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes    = require("./routes/authRoutes");
const resumeRoutes  = require("./routes/resumeRoutes");
const salaryRoutes  = require("./routes/salaryRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

// ✅ CORS must come FIRST — before any routes
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB error:", err));

// ✅ Routes
app.use("/api/auth",    authRoutes);
app.use("/api/resume",  resumeRoutes);
app.use("/api/salary",  salaryRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
    res.send("✅ API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});