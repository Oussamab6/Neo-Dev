import React, { useState } from 'react';
//import ChatbotForm from './ChatbotForm';
import '../static/style.css'; // Import the CSS file

const Welcome: React.FC = () => {
  const [name, setName] = useState('');

  const handleNameChange = (newName: string) => {
    setName(newName);
  };
  const divStyle: React.CSSProperties = {
    backgroundImage: `url(https://e7.pngegg.com/pngimages/498/917/png-clipart-computer-icons-desktop-chatbot-icon-blue-angle.png)`,
  };

  return (
    <div className="msg-bubble">
      <div className="msg-info">
        <div className="msg-info-name">NEO-DEV</div>
        <div className="msg-info-time" id="msgTime"></div>
      </div>

      <div className="msg-text">
        Hi, welcome to NEO-DEV ChatBot! Go ahead and send me a message. 😄
      </div>
    </div>
  );
};

export default Welcome;
