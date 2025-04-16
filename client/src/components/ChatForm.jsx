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

        // Update chat history with the user's message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        // Delay 600 ms before showing "Thinking..." and generating response
        setTimeout(() => {
            // Add a "Thinking..." placeholder for the bot's response
            setChatHistory((history) => [...history, { role: "model", text: t("chatbot.thinking"), isThinking: true }]);

            // Call the function to generate the bot's response
            // generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);

            //? Without previous details
            generateBotResponse([...chatHistory, { role: "user", text: `Answer only in the language this text is. Also, do not repeat what is says but think of a sensible response: ${userMessage}` }]);
        }, 300);
    };

    return (
        <form onSubmit={handleFormSubmit} className="chat-form">
            <textarea ref={inputRef} placeholder={`${t("chatbot.message")}...`} className="message-input" required />
            <button type="submit" id="send-message" className="material-symbols-rounded">
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </form>
    );
};
export default ChatForm;