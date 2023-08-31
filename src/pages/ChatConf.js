import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatConf from './ChatbotConfig.js';
import '../chatbot/main.css'; // Import the CSS module

export default function ChatConfig() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token'); // Assuming your token key is 'token'

  useEffect(() => {
    // If the user is not authenticated, navigate to the login page
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <ChatConf />;
    </>
  );
}
