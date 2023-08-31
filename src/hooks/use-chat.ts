import { fetchEventSource } from '@fortaine/fetch-event-source';
import { useState, useMemo } from 'react';
import { appConfig } from '../config.browser';
import { log } from 'console';
import { useChat } from '../hooks/ModelFetch';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion: string;
}

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat2() {
  const {
    sendMessage,
    currentChat,
    chatHistory,
    cancel,
    clear,
    state,
    setState,
    setCurrentQuestionIndex,
    currentQuestionIndex,
    setserious,
    serious,
    setCurrentChat,
    setChatHistory,
  } = useChat();

  const [emotion, setEmotion] = useState<string | null>(null);
  const [createChat, setcreateChat] = useState<string | null>(null);
  const [createChatstate, setcreateChatstate] = useState(null);
  const [nserious, setnserious] = useState<true | false>(false);

  // Lets us cancel the stream
  const [chatstate, setchatstate] = useState<'serious' | 'notserious'>(
    'notserious'
  );
  /**
   * Cancels the current chat and adds the current chat to the history
   */

  /**
   * Sends a new message to the AI function and streams the response
   */
  const sendMessage2 = async (
    message: string,
    chatHistory: Array<ChatMessage>
  ) => {
    try {
      // Call the sendMessage function and wait for the response using 'await'
      const response = await sendMessage(message, chatHistory);

      // Use the 'response' here if needed
      console.log(response);

      const creattt = response.createChat;
      const emo = response.emotion;
      // Handle the result returned by Flask
      setCurrentChat(response.response);

      if (response.createChat !== 'create' && !serious) {
        // When it's done, we add the message to the history
        // and reset the current chat
        setserious(false);
        setChatHistory((curr) => [
          ...curr,
          {
            role: 'assistant',
            content: response.response,
            emotion: response.emotion,
          },
        ]);
        setCurrentChat(null);
        setState('idle');
      } else {
        setEmotion((emotion) => (emotion = response.emotion));
        setserious(true);
        console.log(response.createChat);
        console.log(response.emotion);
        console.log(state);
        console.log(' zez ' + ' ' + emotion);

        setcreateChat(response.createChat);
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
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };

  // Usage: Example of calling sendMessage2 inside an async function

  // Usage:
  return {
    sendMessage2,
    currentChat,
    chatHistory,
    cancel,
    clear,
    state,
    setState,
    setCurrentQuestionIndex,
    currentQuestionIndex,
    setserious,
    serious,
    setCurrentChat,
    setChatHistory,
    emotion,
    createChat,
    createChatstate,
  };
}

// Call the fetchData function
