import React from 'react';

interface ChatbotMessageAvatarProps {
  param: string;
  iconeColor: string;
}

const ChatbotMessageAvatar: React.FC<ChatbotMessageAvatarProps> = ({
  param,
  iconeColor,
}) => {
  return (
    <div className="react-chatbot-kit-chat-bot-avatar">
      <div
        className="react-chatbot-kit-chat-bot-avatar-container"
        style={{ backgroundColor: iconeColor }}
      >
        <p className="react-chatbot-kit-chat-bot-avatar-letter">{param}</p>
      </div>
    </div>
  );
};

export default ChatbotMessageAvatar;
