import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import Navbar from "../components/Navbar";

export default function SupportChat() {
    const [sessionId, setSessionId] = useState("");
    const [messages, setMessages] = useState([
        { role: "model", content: "Ay, how's it going 😎" } // Predefined bot message
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post("/api/chat/send", { sessionId, message: input });

            const data = response.data;
            console.log(response.data);
            const botMessage = { role: "model", content: data.message };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-800 text-white">
            <Navbar />

            <div className="flex flex-col items-center justify-center h-full">
                {/* Chat Container - Takes up 75% of the screen width */}
                <div className="w-3/4 max-w-3xl bg-gray-900 rounded-lg shadow-lg flex flex-col h-[85vh]">

                    {/* Chat Header */}
                    <div className="p-4 bg-gray-900 text-2xl font-bold text-center rounded-t-lg">
                        Support Chat
                    </div>

                    {/* Messages Section */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`p-3 rounded-lg max-w-[75%] ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="text-gray-400">Typing...</div>}
                    </div>

                    {/* Input Section */}
                    <div className="p-4 flex items-center border-t border-gray-700">
                        <input
                            type="text"
                            className="flex-1 p-2 bg-gray-800 text-white rounded-lg focus:outline-none"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage} className="ml-2 p-2 bg-blue-600 text-white rounded-lg">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
