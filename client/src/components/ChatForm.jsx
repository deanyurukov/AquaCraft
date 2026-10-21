import { useRef } from "react";
import { useTranslation } from "react-i18next";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();
    const { t } = useTranslation();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        setTimeout(() => {
            setChatHistory((history) => [...history, { role: "model", text: t("chatbot.thinking"), isThinking: true }]);

            generateBotResponse([...chatHistory, { role: "user", text: `Answer only in the language this text is. Also, do not repeat what is says but think of a sensible response: ${userMessage}` }]);
        }, 300);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <textarea
                ref={inputRef}
                placeholder={`${t("chatbot.message")}...`}
                aria-label={t("chatbot.message")}
                required
            />
            <button type="submit" aria-label={t("chatbot.send")}>
                <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
            </button>
        </form>
    );
};

export default ChatForm;