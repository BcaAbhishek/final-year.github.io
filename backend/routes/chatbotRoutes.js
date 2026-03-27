const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ reply: "Please send a message." });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // ✅ fixed: "gpt-4.1-mini" does not exist
            messages: [
                {
                    role: "system",
                    content: "You are a helpful AI career advisor specializing in tech jobs in India. Give concise, practical advice about resumes, salaries, job roles, and career growth."
                },
                { role: "user", content: message }
            ],
            max_tokens: 500
        });

        const reply = completion.choices[0].message.content;
        res.json({ reply });

    } catch (error) {
        console.error("Chatbot error:", error.message);

        // Return friendly message instead of crashing
        res.json({ reply: "Sorry, I'm having trouble connecting right now. Please try again in a moment." });
    }
});

module.exports = router;