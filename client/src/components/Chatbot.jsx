import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./ChatbotIcon";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { companyInfo } from "../configs/chatbot-config";
import { useTranslation } from "react-i18next";

const Chatbot = () => {
    const chatBodyRef = useRef();
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        {
            hideInChat: true,
            role: "model",
            text: companyInfo,
        },
    ]);
    const { t } = useTranslation();

    const generateBotResponse = async (history) => {
        // Helper function to update chat history
        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => [...prev.filter((msg) => !msg.isThinking), { role: "model", text, isError }]);
        };
        
        // Format chat history for API request
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history }),
        };

        try {
            // Make the API call to get the bot's response
            const response = await fetch(import.meta.env.VITE_CHATBOT_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error.message || "Something went wrong!");
            // Clean and update chat history with bot's response
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            // Update chat history with the error message
            updateHistory(error.message, true);
        }
    };

    useEffect(() => {
        // Auto-scroll whenever chat history updates
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    return (
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
                <span title={t("chatbot.title")}><ChatbotIcon /></span>
                <span className="material-symbols-rounded"><i className="fa-solid fa-xmark"></i></span>
            </button>
            <div className="chatbot-popup">
                {/* Chatbot Header */}
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">{t("chatbot.title")}</h2>
                    </div>
                    <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
                        <i className="fa-solid fa-angle-down"></i>
                    </button>
                </div>
                {/* Chatbot Body */}
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            {t("chatbot.cheers.0")} 👋 <br /> {t("chatbot.cheers.1")}
                        </p>
                    </div>
                    {/* Render the chat history dynamically */}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>
                {/* Chatbot Footer */}
                <div className="chat-footer">
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </div>
    );
};
export default Chatbot;