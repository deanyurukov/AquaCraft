import ChatbotIcon from "./ChatbotIcon";

const ChatMessage = ({ chat }) => {
    return (
        !chat.hideInChat && (
            <article data-role={chat.role} data-error={chat.isError || undefined}>
                {chat.role === "model" && <ChatbotIcon />}
                <p>{chat.text}</p>
            </article>
        )
    );
};

export default ChatMessage;