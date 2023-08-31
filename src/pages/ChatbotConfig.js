import React, { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot/Chatbot.tsx';
import config from '../chatbot/config.js';
import ActionProvider from '../chatbot/ActionProvider.js';
import MessageParser from '../chatbot/MessageParser.js';
import '../App.css';
import PageHeader from '../componentss/pageheader/pageheader.js';
import { ConfigProvider } from 'antd';
import ContentToDisplay from '../componentss/pageheader/content.js';
import { createChatBotMessage } from '../components/Chat/chatUtils.ts';
import Options from '../componentss/Options/Options.jsx';
import Header from '../profile/Header.js';
import useToken from '../profile/useToken.js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function ChatConf() {
  const [current, setCurrent] = useState(0);
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
  const [prompt, setprompt] = useState('null');

  const [render, setRender] = useState(true);
  const [trigger1, setTrigger1] = useState('');
  const [trigger2, setTrigger2] = useState('');
  const { idd } = useParams();
  const colorBrightness = (color) => {
    const rgb = parseInt(color.slice(1), 16); // Convert hex to decimal
    const r = (rgb >> 16) & 0xff; // Extract red
    const g = (rgb >> 8) & 0xff; // Extract green
    const b = (rgb >> 0) & 0xff; // Extract blue
    return 0.299 * r + 0.587 * g + 0.114 * b; // Calculate brightness
  };

  // Callback function to update the chatButtonColor state
  const handleColorChange = (color) => {
    setChatButtonColor(color);
    const textColor = colorBrightness(color) > 180 ? '#000' : '#fff';
    setOptionTextColor(textColor);
  };
  const handleChatMessageColorChange = (color) => {
    setChatMessageColor(color);
    const textColor = colorBrightness(color) > 180 ? '#000' : '#fff';
    setChatMessageTextColor(textColor);
  };
  const handleHeaderColorChange = (color) => {
    setChatHeaderColor(color);
    const textColor = colorBrightness(color) > 180 ? '#000' : '#fff';
    setChatHeaderMessColor(textColor);
  };
  const handleNameChange = (event) => {
    setBotName(event.target.value);
    capitalizeFirstLetter(event.target.value);
  };
  const handleWelChange = (event) => {
    setWelMess(event.target.value);
    setRender((prev) => !prev);
  };
  function capitalizeFirstLetter(name) {
    if (typeof name !== 'string' || name.length === 0) {
      return name; // Return the same input if it's not a non-empty string
    }
    const firstLetter = name.charAt(0).toUpperCase();
    setfirstbotletter(firstLetter);
  }
  const handleChatIconColorChange = (color) => {
    setchatIconColor(color);
  };

  const sendDataToServer = () => {
    const dataToSend = {
      current,
      chatButtonColor,
      chatHeaderColor,
      chatMessageColor,
      chatMessageTextColor,
      chatHeaderMessColor,
      OptionTextColor,
      botName,
      firstbotletter,
      chatIconColor,
      WelMess,
    };
    const isAuthenticated = localStorage.getItem('token'); // Assuming your token key is 'token'

    axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${isAuthenticated}`, // Include the access token in the Authorization header
      },
      url: `/saveChatbot/${idd}`,
      data: JSON.stringify(dataToSend),
    })
      .then((response) => {
        console.log(response);
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
    console.log('idd', idd);
    axios({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${isAuthenticated}`, // Include the access token in the Authorization header
      },
      url: `/getprompt/${idd}`,
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
    console.log(chatMessageColor);
  }, [chatMessageColor]);
  useEffect(() => {
    if (current === 3) {
      sendDataToServer();
    }
  }, [current]);

  const { removeToken } = useToken();

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
          style={{
            display: 'flex',
            justifyContent: 'flex-end', // This aligns items to the right
            alignItems: 'center', // This vertically centers the items
            width: '100%',
            marginTop: '1rem',
            marginRight: '1rem', // Adjust this value as needed
            position: 'absolute', // Position the div absolutely
            top: 0, // Position from the top
            right: 0, // Position from the right
          }}
        >
          <button
            class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={sendDataToServer}
          >
            Save
          </button>
          <Header token={removeToken} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              // position: 'absolute',
              // top: '100px',
              marginBottom: '12rem',
              // top: '100px',
              marginTop: '3rem',
              width: '73%',
            }}
          >
            <PageHeader current={current} setCurrent={setCurrent} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="content-container">
            <ContentToDisplay
              current={current}
              onColorChange={handleColorChange}
              onHeaderColorChange={handleHeaderColorChange}
              onChatMessageColorChange={handleChatMessageColorChange}
              onChatIconColorChange={handleChatIconColorChange}
              onNameChange={handleNameChange}
              onWelChange={handleWelChange}
            />
          </div>

          <div className="chatbot-container" style={{ marginRight: '150px' }}>
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
                  currentStep={current}
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
                  currentStep={current}
                />
              </>
            )}
          </div>
        </div>
      </>
    </ConfigProvider>
  );
}
