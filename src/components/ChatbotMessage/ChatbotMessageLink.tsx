import React, { useEffect, useState } from 'react';
import ConditionallyRender from 'react-conditionally-render';

import ChatbotMessageAvatar from './ChatBotMessageAvatar/ChatbotMessageAvatar';
import Loader from '../Loader/Loader';

import './ChatbotMessageLink.css';
import { callIfExists } from '../Chat/chatUtils';
import {
  ICustomComponents,
  ICustomStyles,
  IAvatarStyles,
} from '../../interfaces/IConfig';

interface IChatbotMessageProps {
  message: string;
  withAvatar?: boolean;
  loading?: boolean;
  messages: any[];
  delay?: number;
  id: number;
  setState?: React.Dispatch<React.SetStateAction<any>>;
  customComponents?: ICustomComponents;
  customStyles: { backgroundColor: string; color: string };
  avatarIcon: { backgroundColor: string; textt: string };
}
const ChatbotMessage = ({
  message,
  withAvatar = true,
  loading,
  messages,
  customComponents,
  setState,
  customStyles,
  avatarIcon,
  delay,
  id,
}: IChatbotMessageProps) => {
  const [show, toggleShow] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    const disableLoading = (
      messages: any[],
      setState: React.Dispatch<React.SetStateAction<any>>
    ) => {
      let defaultDisableTime = 750;
      if (delay) defaultDisableTime += delay;

      timeoutId = setTimeout(() => {
        const newMessages = [...messages];
        const message = newMessages.find((message) => message.id === id);

        if (!message) return;
        message.loading = false;
        message.delay = undefined;

        setState((state: any) => {
          const freshMessages = state.messages;
          const messageIdx = freshMessages.findIndex(
            (message: any) => message.id === id
          );
          freshMessages[messageIdx] = message;

          return { ...state, messages: freshMessages };
        });
      }, defaultDisableTime);
    };

    disableLoading(messages, setState);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [delay, id]);

  useEffect(() => {
    if (delay) {
      setTimeout(() => toggleShow(true), delay);
    } else {
      toggleShow(true);
    }
  }, [delay]);

  const chatBoxCustomStyles = { backgroundColor: '', color: '' };
  const arrowCustomStyles = { borderRightColor: '' };
  const avatarIconn = { backgroundColor: '', textt: '' };

  if (customStyles) {
    chatBoxCustomStyles.backgroundColor = customStyles.backgroundColor;
    chatBoxCustomStyles.color = customStyles.color;
    arrowCustomStyles.borderRightColor = customStyles.backgroundColor;
    // avatarIcon.text = avatarletter.text;
    //avatarIcon.backgroundColor = avatarletter.avatarIcon.backgroundColor;
  }
  if (avatarIcon) {
    avatarIconn.textt = avatarIcon.textt;
    avatarIconn.backgroundColor = avatarIcon.backgroundColor;
  }

  return (
    <ConditionallyRender
      condition={show}
      show={
        <div className="react-chatbot-kit-chat-bot-message-container2">
          <ConditionallyRender
            condition={withAvatar}
            show={
              <ConditionallyRender
                condition={!!customComponents?.botAvatar}
                show={callIfExists(customComponents?.botAvatar)}
                elseShow={
                  <ChatbotMessageAvatar
                    param={avatarIconn.textt}
                    iconeColor={avatarIconn.backgroundColor}
                  />
                }
              />
            }
          />

          <ConditionallyRender
            condition={!!customComponents?.botChatMessage}
            show={callIfExists(customComponents?.botChatMessage, {
              message,
              loader: <Loader />,
            })}
            elseShow={
              <div
                className="react-chatbot-kit-chat-bot-message2"
                style={chatBoxCustomStyles}
              >
                <ConditionallyRender
                  condition={loading}
                  show={<Loader />}
                  elseShow={<span>{message}</span>}
                />
                <ConditionallyRender
                  condition={withAvatar}
                  show={
                    <div
                      className="react-chatbot-kit-chat-bot-message-arrow2"
                      style={arrowCustomStyles}
                    ></div>
                  }
                />
              </div>
            }
          />
        </div>
      }
    />
  );
};

export default ChatbotMessage;
