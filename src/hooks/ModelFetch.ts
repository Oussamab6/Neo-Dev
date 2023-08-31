import { fetchEventSource } from '@fortaine/fetch-event-source';
import { useState, useMemo } from 'react';
//import { appConfig } from '../../config.browser';
//import { log } from 'console';
const API_PATH = 'http://127.0.0.1:5000/get';

/**
 * A custom hook to handle the chat state and logic
 */
export function useChat() {
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage2[]>([]);
  const [state, setState] = useState<'idle' | 'waiting' | 'loading'>('idle');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const [serious, setserious] = useState<true | false>(false);

  // Lets us cancel the stream
  const abortController = useMemo(() => new AbortController(), []);

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

  /**
   * Sends a new message to the AI function and streams the response
   */
  const sendMessage = (message: string, chatHistory: Array<ChatMessage2>) => {
    // setState("waiting");
    let chatContent = '';
    const newHistory = [
      ...chatHistory,
      { role: 'user', content: message, emotion: 'neutre' } as const,
    ];

    setChatHistory(newHistory);
    const body = JSON.stringify({
      // Only send the most recent messages. This is also
      // done in the serverless function, but we do it here
      // to avoid sending too much data
      message: newHistory[newHistory.length - 1],
    });
    // This is like an EventSource, but allows things like
    // POST requests and headers
    /* fetchEventSource(API_PATH, {
      headers: {
        'Content-Type' : 'application/json'
        },
      body,
      method: "POST",
      onclose: () => {
        setState("idle");
      },
      onmessage: (event) => {
        switch (event.event) {
          case "delta": {
            // This is a new word or chunk from the AI
            setState("loading");
            const message = JSON.parse(event.data);
            if (message?.role === "assistant") {
              chatContent = "";
              return;
            }
            if (message.content) {
              chatContent += message.content;
              setCurrentChat(chatContent);
            }
            break;
          }
          case "open": {
            // The stream has opened and we should recieve
            // a delta event soon. This is normally almost instant.
            setCurrentChat("...");
            break;
          }
          case "done": {
            // When it's done, we add the message to the history
            // and reset the current chat
            setChatHistory((curr) => [
              ...curr,
              { role: "assistant", content: chatContent } as const,
            ]);
            setCurrentChat(null);
            setState("idle");
            
          }
          default:
            break;
        }
      },
       

    });*/

    // Make a POST request to the Flask endpoint
    console.log(body);
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
        return res;
      } catch (error) {
        // Handle any errors that occur during the request
        console.error(error);
      }
    };
    return fetchData().then((res) => {
      // You can use 'res' here if needed
      // ... (existing code)

      // Return the response object
      return res;
    });
    // Call the fetchData function
  };

  return {
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
  };
}
