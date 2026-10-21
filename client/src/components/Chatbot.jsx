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
        const updateHistory = (text, isError = false) => {
            setChatHistory((prev) => [...prev.filter((msg) => !msg.isThinking), { role: "model", text, isError }]);
        };
        
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: history }),
        };

        try {
            const response = await fetch(import.meta.env.VITE_CHATBOT_URL, requestOptions);
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error.message || "Something went wrong!");
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    useEffect(() => {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    return (
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
                <span title={t("chatbot.title")}><ChatbotIcon /></span>
                <span className="material-symbols-rounded"><i className="fa-solid fa-xmark"></i></span>
            </button>
            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        <ChatbotIcon />
                        <h2 className="logo-text">{t("chatbot.title")}</h2>
                    </div>
                    <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
                        <i className="fa-solid fa-angle-down"></i>
                    </button>
                </div>
                
                <div ref={chatBodyRef} className="chat-body">
                    <div className="message bot-message">
                        <ChatbotIcon />
                        <p className="message-text">
                            {t("chatbot.cheers.0")} 👋 <br /> {t("chatbot.cheers.1")}
                        </p>
                    </div>

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>
                
                <div className="chat-footer">
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </div>
    );
};
export default Chatbot;