const axios = require("axios");
require("dotenv").config();

const sessionHistory = {}; // Stores session chat history

const sendChatMessage = async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure session history is properly structured
    if (!sessionHistory[sessionId]) {
        sessionHistory[sessionId] = [];
    }

    // Append user message
    sessionHistory[sessionId].push({ role: "user", parts: [{ text: message }] });

    try {
        // Correct the request structure
        const response = await axios.post(
            `${process.env.GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
            { contents: sessionHistory[sessionId] } // Ensure correct formatting
        );

        // Extract bot response correctly
        const botMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
                           "Sorry, I couldn't understand that.";

        // Append bot response to session history
        sessionHistory[sessionId].push({ role: "model", parts: [{ text: botMessage }] });

        res.status(200).json({ message: botMessage });
    } catch (error) {
        console.error("Error communicating with Gemini API:", error.response?.data || error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = sendChatMessage;
