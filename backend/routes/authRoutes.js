const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User    = require("../models/User");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ name + email included in JWT payload so frontend can decode it as fallback
function makeToken(user) {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
}

/* ── REGISTER ── */
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields are required" });
        if (await User.findOne({ email }))
            return res.status(409).json({ message: "User already exists" });
        const user = new User({ name, email, password: await bcrypt.hash(password, 10) });
        await user.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

/* ── LOGIN ── */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid credentials" });

        res.json({
            message: "Login successful",
            token: makeToken(user),
            user: { name: user.name, email: user.email }  // ✅ always returned
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

/* ── GOOGLE AUTH ── */
router.post("/google", async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { email, name } = ticket.getPayload();
        let user = await User.findOne({ email });
        if (!user) { user = new User({ name, email, password: "googleUser" }); await user.save(); }
        res.json({
            token: makeToken(user),
            user: { name: user.name, email: user.email }  // ✅ always returned
        });
    } catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({ message: "Google auth failed" });
    }
});

module.exports = router;