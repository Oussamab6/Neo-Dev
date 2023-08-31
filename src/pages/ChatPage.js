import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatNeo from './index.tsx';

export default function ChatPage() {
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
      <ChatNeo />;
    </>
  );
}
