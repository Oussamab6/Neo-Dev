import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Header from './profile/Header.js';
import useToken from './profile/useToken.js';
import SignupPage from './pages/Signup.js';
import LoginPage from './pages/Login.js';
import ChatConfig from './pages/ChatConf.js';
import ChatPage from './pages/ChatPage.js';
import ChatLinkPage from './pages/ChatLinkPage.js';
import CardPage from './pages/Cards.js';
function App() {
  const { removeToken } = useToken();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/logout" element={<Header token={removeToken} />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chatConfig/:idd" element={<ChatConfig />} />
        <Route path="/chatPage" element={<ChatPage />} />
        <Route path="/chatLinkPage/:chatbotsId" element={<ChatLinkPage />} />
        <Route path="/cardPage" element={<CardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
