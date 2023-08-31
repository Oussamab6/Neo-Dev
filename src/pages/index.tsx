import { useState, useMemo, useEffect, useRef } from 'react';
import { useChat2 } from '../hooks/use-chat';
import { ChatMessage } from '../components/ChatMessage';
import { appConfig } from '../config.browser';
import Welcome from '../components/Welcome';
import '../static/styles/style.css'; // Import the CSS file
import axios from 'axios';
import { fetchEventSource } from '@fortaine/fetch-event-source';
import { log } from 'console';
import { SendOutlined, DeleteOutlined } from '@ant-design/icons';

import React from 'react';
import happy from '../static/styles/happy.png';
import { useNavigate } from 'react-router-dom';

const API_PATH = 'http://127.0.0.1:5000/get';
const API_PATH_PROMPT = 'http://127.0.0.1:5000/getPrompt';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion: string;
}
export default function ChatNeo() {
  /**
   * A custom hook to handle the chat state and logic
   */
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<
    'idle' | 'waiting' | 'loading' | 'generate' | 'ready' | 'Completed'
  >('idle');
  const [emotion, setEmotion] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [createChat, setcreateChat] = useState<string | null>(null);
  const [createChatstate, setcreateChatstate] = useState(null);

  const [serious, setserious] = useState<true | false>(false);
  const [nserious, setnserious] = useState<true | false>(false);
  const [endofchat, setendofchat] = useState<true | false>(false);

  // Lets us cancel the stream
  const abortController = useMemo(() => new AbortController(), []);
  const [chatstate, setchatstate] = useState<'serious' | 'notserious'>(
    'notserious'
  );

  const [togenerate, settogenerate] = useState<boolean | null>(null);
  const [togeneratecon, settogeneratecon] = useState<0 | 1 | 2 | 3>(0);
  const [prompt, setprompt] = useState<string | null>(null);

  /**
   * Cancels the current chat and adds the current chat to the history
   */
  function cancel() {
    setState('idle');
    abortController.abort();
    if (currentChat) {
      const newHistory = [
        ...chatHistory,
        { role: 'user', content: currentChat, emotion: 'neutre' } as const,
      ];

      setChatHistory(newHistory);
      setCurrentChat('');
      setserious(false);
    }
  }

  /**
   * Clears the chat history
   */

  function clear() {
    console.log('clear');
    setChatHistory([]);
    setCurrentQuestionIndex(0);
    setState('idle');
    setserious(false);
  }

  // Usage example:

  /**
   * Sends a new message to the AI function and streams the response
   */
  const sendMessage = (message: string, chatHistory: Array<ChatMessage>) => {
    // setState("waiting");
    let chatContent = '';
    const newHistory = [
      ...chatHistory,
      { role: 'user', content: message, emotion: 'neutre' } as const,
    ];

    setChatHistory(newHistory);
    const body = JSON.stringify({
      message: newHistory[newHistory.length - 1],
    });
    // Make a POST request to the Flask endpoint
    const parsedBody = JSON.parse(body);
    const mess = parsedBody.message.content;
    const fetchData = async () => {
      try {
        const response = await fetch(API_PATH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        const res = await response.json();
        const creattt = res.createChat;
        // Handle the result returned by Flask

        /* setCurrentChat(res.response);
        setEmotion(res.emotion);*/
        if (res.createChat !== 'create' && !serious) {
          // When it's done, we add the message to the history
          // and reset the current chat
          setserious(false);
          setChatHistory((curr) => [
            ...curr,
            {
              role: 'assistant',
              content: res.response,
              emotion: res.emotion,
            },
          ]);
          setCurrentChat(null);
          setState('idle');
        } else {
          setserious(true);
          console.log(res.createChat);
          console.log(res.emotion);
          console.log(state);
          setcreateChat(res.createChat);
          if (currentQuestionIndex < appConfig.chatbotQuestions.length) {
            console.log(currentQuestionIndex);
            setChatHistory((curr) => [
              ...curr,
              {
                role: 'assistant',
                content: appConfig.chatbotQuestions[currentQuestionIndex],
                emotion: 'happy',
              },
            ]);
            setCurrentChat(null);
            setState('waiting');
          }
        }

        return creattt;
      } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
      }
    };
    // Call the fetchData function
    fetchData();
  };
  const generatePrompt = (message: string, chatHistory: Array<ChatMessage>) => {
    const newHistory = [
      ...chatHistory,
      { role: 'user', content: message, emotion: 'neutre' } as const,
    ];

    setChatHistory(newHistory);
    const getLast10UserMessages = (): { [key: string]: string } => {
      // Filter the chatHistory to get only the messages where the role is 'user'
      const userMessages = newHistory.filter(
        (message) => message.role === 'user'
      );

      // Get the last 10 messages from the userMessages array
      const last10UserMessages = userMessages.slice(-8);

      // Create an object with key-value pairs for each message
      const messagesObject: { [key: string]: string } = {};
      last10UserMessages.forEach((message, index) => {
        messagesObject[`message_${index + 1}`] = message.content;
      });

      return messagesObject;
    };

    const last10UserMessagesJSON = getLast10UserMessages();

    const body2 = JSON.stringify({
      messages: last10UserMessagesJSON,
    });
    const body2_Parse = JSON.parse(body2);
    const message_1 = body2_Parse.messages.message_1;
    const message_2 = body2_Parse.messages.message_2;
    const message_3 = body2_Parse.messages.message_3;
    const message_4 = body2_Parse.messages.message_4;
    const message_5 = body2_Parse.messages.message_5;
    const message_6 = body2_Parse.messages.message_6;
    const message_7 = body2_Parse.messages.message_7;
    const message_8 = body2_Parse.messages.message_8;
    const result = `Act as ${message_1} ${message_2} responses writing style: ${message_4} Particular keywords: ${message_3}. Present arguments: ${message_5}. Specific references or sources: ${message_6}. Specific guidelines or instructions: ${message_7}. Particular structure or format: ${message_8}.`;

    const body = JSON.stringify({
      messages: result,
    });
    console.log(body);
    const fetchData = async () => {
      try {
        const response = await fetch(API_PATH_PROMPT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        });
        setState('ready');
        const res = await response.json();
        console.log(res.result);
        setChatHistory((curr) => [
          ...curr,
          {
            role: 'assistant',
            content: res.result,
            emotion: 'happy',
          },
        ]);
        setCurrentChat(null);
        setState('idle');
        setprompt(res.result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  };

  // The content of the box where the user is typing
  const [message, setMessage] = useState<string>('');

  // This hook is responsible for managing the chat and communicating with the
  // backend

  // This is the message that is currently being generated by the AI
  const currentMessage = useMemo(() => {
    return {
      content: currentChat ?? '',
      role: 'assistant',
      emotion: emotion ?? 'happy',
    } as const;
  }, [currentChat, emotion]);

  const divStyle: React.CSSProperties = {
    backgroundImage: `url(${happy})`,
  };
  const [idd, setidd] = useState<string | null>(null);

  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const goConfig = (param: string) => {
    const isAuthenticated = localStorage.getItem('token'); // Assuming your token key is 'token'

    axios({
      method: 'POST',
      url: '/insertChatbot',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${isAuthenticated}`, // Include the access token in the Authorization header
        // Set the Content-Type header manually
      },
      data: JSON.stringify({ param }),
    })
      .then((response) => {
        const insertedId = response.data.inserted_id;
        setidd(insertedId);
        console.log('response', insertedId);
        navigate(`/chatConfig/${insertedId}`);
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
    console.log('createChat', createChat);
    createChat === 'create'
      ? setCurrentQuestionIndex(() => currentQuestionIndex + 1)
      : null;
  }, [createChat]);

  // This is a ref to the bottom of the chat history. We use it to scroll
  // to the bottom when a new message is added.
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // This is a ref to the input box. We use it to focus the input box when the
  // user clicks on the "Send" button.
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = () => {
    inputRef.current?.focus();
    scrollToBottom();
  };

  useEffect(() => {
    focusInput();
  }, [chatHistory]);

  useEffect(() => {
    console.log('heheheh' + currentQuestionIndex);
  }, [togeneratecon]);

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <main
          className="bg-gradient-to-b from-white to-gray-400 from-60% md:rounded-lg md:shadow-md p-6 w-2/3 h-screen flex flex-col"
          style={{ width: '900px' }}
        >
          <section className="overflow-y-auto flex-grow mb-4 pb-8">
            <div className="flex flex-col space-y-4">
              {chatHistory.length === 0 ? (
                <>
                  <div className="msg left-msg">
                    <div className="msg-img" style={divStyle}></div>
                    <Welcome />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appConfig.userQuestions.map((phrase) => (
                      <button
                        key={phrase}
                        onClick={() => {
                          sendMessage(phrase, chatHistory);
                          setCurrentQuestionIndex(currentQuestionIndex);
                        }}
                        className="bg-gray-100 border-gray-300 border-2 rounded-lg p-4"
                      >
                        {phrase}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                chatHistory.map((chat, i) => (
                  <ChatMessage key={i} message={chat} prompgen={togenerate} />
                ))
              )}

              {currentChat ? (
                <ChatMessage message={currentMessage} prompgen={togenerate} />
              ) : null}
            </div>
            <div ref={bottomRef} />
          </section>
          <div className="flex items-center justify-center h-20">
            {state === 'idle' ? null : (
              <>
                {state === 'waiting' ? (
                  <div>
                    {appConfig.userSuggestions[currentQuestionIndex - 1]?.map(
                      (phrase) => (
                        <button
                          key={phrase}
                          onClick={() => {
                            settogeneratecon(1);
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                            sendMessage(phrase, chatHistory);

                            if (
                              currentQuestionIndex ===
                              appConfig.chatbotQuestions.length
                            ) {
                              setCurrentChat(
                                'Please waite for the PROMPT to be generated! \n Thank you for your patience '
                              );
                              setendofchat(true);
                              setState('generate');
                              generatePrompt(phrase, chatHistory);
                              settogenerate(true);
                              setState('Completed');
                            }
                            // console.log(currentQuestionIndex); // Move to the next question after clicking a button
                          }}
                          className="bg-gray-100 border-gray-300 border-2 rounded-lg p-4"
                        >
                          {phrase}
                        </button>
                      )
                    )}
                  </div>
                ) : state === 'generate' ? (
                  <button
                    className="bg-gray-100 text-gray-900 py-2 px-4 my-8"
                    onClick={cancel}
                  >
                    Stop generating
                  </button>
                ) : null}
              </>
            )}
          </div>
          {togenerate === true ? (
            <div>
              <button
                className="bg-gray-100 text-gray-900 py-2 px-4 my-8"
                onClick={() => goConfig(prompt)}
              >
                Go To Configurations
              </button>
            </div>
          ) : null}
          <form
            className="flex"
            onSubmit={(e) => {
              e.preventDefault();

              sendMessage(message, chatHistory);
              setMessage('');
            }}
          >
            <section
              className="bg-gray-100 rounded-lg p-2"
              style={{ borderRadius: 50, width: '100%', display: 'flex' }}
            >
              {chatHistory.length > 0 ? (
                <DeleteOutlined
                  rev="some_value"
                  type="button"
                  style={{
                    color: '#6F6C6B',
                    fontSize: 25,
                    marginRight: 10,
                    marginLeft: 5,
                    marginTop: 7,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    clear();
                    setMessage('');
                  }}
                />
              ) : null}
              <input
                type="text"
                ref={inputRef}
                className="w-full rounded-l-lg p-2 outline-none"
                placeholder={state == 'idle' ? 'Type your message...' : '...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={state !== 'idle'}
                style={{ borderRadius: 50 }}
              />
            </section>

            {state === 'idle' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
              >
                <button className=" text-white font-bold py-2 px-4 rounded-r-lg">
                  <SendOutlined
                    rev="some_value"
                    type="submit"
                    style={{ color: 'white', fontSize: 25 }}
                  />
                </button>
              </div>
            ) : null}
          </form>
        </main>
      </div>
    </>
  );
}
