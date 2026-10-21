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
        chatBodyRef.current?.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [chatHistory]);

    return (
        <div id="chatbot" className={showChatbot ? "is-open" : ""}>
            <button
                type="button"
                onClick={() => setShowChatbot((prev) => !prev)}
                aria-label={showChatbot ? t("chatbot.close") : t("chatbot.title")}
                aria-expanded={showChatbot}
            >
                <ChatbotIcon />
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            <section aria-label={t("chatbot.title")}>
                <header>
                    <div>
                        <ChatbotIcon />
                        <h2>{t("chatbot.title")}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowChatbot(false)}
                        aria-label={t("chatbot.close")}
                    >
                        <i className="fa-solid fa-angle-down" aria-hidden="true"></i>
                    </button>
                </header>
                
                <main ref={chatBodyRef}>
                    <ChatMessage
                        chat={{
                            role: "model",
                            text: `${t("chatbot.cheers.0")} 👋\n${t("chatbot.cheers.1")}`
                        }}
                    />

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </main>
                
                <footer>
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </footer>
            </section>
        </div>
    );
};

export default Chatbot;