import React, { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot/ChatbotLink.tsx';
import config from '../chatbot/config.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import MessageParser from '../chatbot/MessageParser.js';
import '../App.css';

import { ConfigProvider } from 'antd';
import { createChatBotMessage } from '../components/Chat/chatUtils.ts';
import Options from '../componentss/Options/Options.jsx';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ChatLink() {
  const [chatButtonColor, setChatButtonColor] = useState('#ffffff');
  const [chatHeaderColor, setChatHeaderColor] = useState('#ffffff');
  const [chatMessageColor, setChatMessageColor] = useState('#f2f0f0');
  const [chatMessageTextColor, setChatMessageTextColor] = useState('black');
  const [chatHeaderMessColor, setChatHeaderMessColor] = useState('#ffffff');
  const [OptionTextColor, setOptionTextColor] = useState('#000000');
  const [botName, setBotName] = useState('');
  const [firstbotletter, setfirstbotletter] = useState('B');
  const [chatIconColor, setchatIconColor] = useState('#f2f0f0');
  const [WelMess, setWelMess] = useState('Hello. What do you want to learn!');
  const [render, setRender] = useState(true);
  const [trigger1, setTrigger1] = useState('');
  const [trigger2, setTrigger2] = useState('');
  const [prompt, setprompt] = useState('null');

  const { chatbotsId } = useParams();
  const sendDataToServer = () => {
    axios({
      method: 'GET',
      url: `/chatboturl/${chatbotsId}`,
    })
      .then((response) => {
        setBotName(response.data.data.botName);
        setChatButtonColor(response.data.data.chatButtonColor);
        setChatHeaderColor(response.data.data.chatHeaderColor);
        setChatHeaderMessColor(response.data.data.chatHeaderMessColor);
        setChatMessageColor(response.data.data.chatMessageColor);
        setChatMessageTextColor(response.data.data.chatMessageTextColor);
        setchatIconColor(response.data.data.chatIconColor);
        setfirstbotletter(response.data.data.firstbotletter);
        setOptionTextColor(response.data.data.OptionTextColor);
        setWelMess(response.data.data.WelMess);
        setRender((prev) => !prev);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  const getprompt = () => {
    const isAuthenticated = localStorage.getItem('token'); // Assuming your token key is 'token'
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${isAuthenticated}`, // Include the access token in the Authorization header
      },
      url: `/getprompt/${chatbotsId}`,
    })
      .then((response) => {
        const promptFromResponse = response.data.prompt; // Assuming the response structure is { "prompt": "your_prompt_value" }
        setprompt(promptFromResponse);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  useEffect(() => {
    getprompt(); // Call the getprompt function when the component mounts
  }, []);
  useEffect(() => {
    setTrigger1('');
  }, [render]);
  useEffect(() => {
    setTrigger2('');
  }, [render]);
  useEffect(() => {
    sendDataToServer();
  }, [chatbotsId]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F86F03',
        },
      }}
    >
      <>
        <div
          className="chatbot-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            marginTop: '15rem',
          }}
        >
          {render ? (
            <>
              {trigger2}
              <Chatbot
                config={{
                  ...config,
                  customStyles: {
                    ...config.customStyles,
                    botcolor: { backgroundColor: chatButtonColor },
                    headercolor: {
                      backgroundColor: chatHeaderColor,
                      color: chatHeaderMessColor,
                    },
                    botMessageBox: {
                      backgroundColor: chatMessageColor,
                      color: chatMessageTextColor,
                    },
                  },
                  avatarIcon: {
                    avatarIconn: {
                      backgroundColor: chatIconColor,
                      textt: firstbotletter,
                    },
                  },
                  botName: botName,
                  initialMessages: [
                    createChatBotMessage(WelMess, {
                      widget: 'options',
                    }),
                  ],
                  widgets: [
                    {
                      widgetName: 'options',
                      widgetFunc: (props) => (
                        <Options {...props} param={OptionTextColor} />
                      ),
                    },
                  ],
                }}
                actionProvider={ActionProvider}
                prompt={prompt}
                messageParser={MessageParser}
              />
            </>
          ) : (
            <>
              {' '}
              {trigger1}
              <Chatbot
                config={{
                  ...config,
                  customStyles: {
                    ...config.customStyles,
                    botcolor: { backgroundColor: chatButtonColor },
                    headercolor: {
                      backgroundColor: chatHeaderColor,
                      color: chatHeaderMessColor,
                    },
                    botMessageBox: {
                      backgroundColor: chatMessageColor,
                      color: chatMessageTextColor,
                    },
                  },
                  avatarIcon: {
                    avatarIconn: {
                      backgroundColor: chatIconColor,
                      textt: firstbotletter,
                    },
                  },
                  botName: botName,
                  initialMessages: [
                    createChatBotMessage(WelMess, {
                      widget: 'options',
                    }),
                  ],
                  widgets: [
                    {
                      widgetName: 'options',
                      widgetFunc: (props) => (
                        <Options {...props} param={OptionTextColor} />
                      ),
                    },
                  ],
                }}
                actionProvider={ActionProvider}
                prompt={prompt}
                messageParser={MessageParser}
              />
            </>
          )}
        </div>
      </>
    </ConfigProvider>
  );
}
