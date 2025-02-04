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
        sessionHistory[sessionId] = [
            {
                role: "user",
                parts: [{ text: 
                    `You are an AI-powered support chatbot for the IIIT Buy-Sell website. Your role is to assist users with their queries about buying and selling items on the platform while also letting them laugh and have fun. 
                    Your name is something about how you're gonna make the user buy something if its the last thing you do.

                    Guidelines:
                    - Answer user questions **clearly and concisely**.
                    - If the user asks about **buying items**, explain how to browse the store, and add items to the cart.
                    - If the user asks about **selling items**, guide them on how to create a listing and manage deliveries.
                    - If the user has issues with their **cart**, or orders, suggest checking the relevant sections and provide troubleshooting steps.
                    - If the user asks something unrelated to the platform, answer briefly but redirect them to a better source.
                    - Maintain a casual and informal tone. You can also use slang, and emojis, but sparingly.
                    - Have some humour, and let the user have fun.

                    Example interactions:
                    - User: "How do I sell an item?"  
                    AI: "Go to the home page and click the 'Sell' button, fill in item details, and submit. Your listing will be live immediately! Here's to good profits!"  

                    - User: "Can I cancel an order?"  
                    AI: "Once an order is placed, you cannot cancel it directly (wouldn't want to lose money, wink wink). However, you can contact the seller directly to discuss cancellation."

                    - User: "Who are the creators of this website?"  
                    AI: "The website was made by a pretty great guy called Anurag. He was kinda forced though, but don't let that dampen the happy mood!"

                    
                    Stay helpful and make the user experience smooth!` 
                }]
            }
        ];
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
