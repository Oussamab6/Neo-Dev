import React, { useState, useRef, useEffect, SetStateAction } from 'react';
import ConditionallyRender from 'react-conditionally-render';

import UserChatMessage from '../UserChatMessage/UserChatMessageLink';
import ChatbotMessage from '../ChatbotMessage/ChatbotMessageLink';

import {
  botMessage,
  userMessage,
  customMessage,
  createChatMessage,
} from './chatUtils';

// import NewIcon from '../../assets/icons/paper-plane.svg';

import PaperPlaneIcon from '../../assets/icons/paper-plane';

import './chatLink.css';
import {
  ICustomComponents,
  ICustomMessage,
  ICustomStyles,
  IAvatarStyles,
} from '../../interfaces/IConfig';
import { IMessage } from '../../interfaces/IMessages';
import { string } from 'prop-types';

interface IChatProps {
  setState: React.Dispatch<SetStateAction<any>>;
  widgetRegistry: any;
  prompt: string;
  messageParser: any;
  actionProvider: any;
  customComponents: ICustomComponents;
  botName: string;
  avatarIcon: IAvatarStyles;
  customStyles: ICustomStyles;
  headerText: string;
  customMessages: ICustomMessage;
  placeholderText: string;
  validator: (input: string) => Boolean;
  state: any;
  setMessageContainerRef: React.Dispatch<SetStateAction<any>>;
  disableScrollToBottom: boolean;
  messageHistory: IMessage[] | string;
  parse?: (message: string) => void;
  actions?: object;
}

const Chat = ({
  state,
  setState,
  widgetRegistry,
  prompt,
  messageParser,
  parse,
  customComponents,
  actionProvider,
  botName,
  avatarIcon,
  customStyles,
  headerText,
  customMessages,
  placeholderText,
  validator,
  setMessageContainerRef,
  disableScrollToBottom,
  messageHistory,
  actions,
}: IChatProps) => {
  const { messages } = state;
  const chatContainerRef = useRef(null);

  const [input, setInputValue] = useState('');

  const scrollIntoView = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef?.current?.scrollHeight;
      }
    }, 50);
  };

  useEffect(() => {
    if (disableScrollToBottom) return;
    scrollIntoView();
  });

  useEffect(() => {
    setMessageContainerRef(chatContainerRef);
  }, [chatContainerRef.current]);

  const showAvatar = (messages: any[], index: number) => {
    if (index === 0) return true;

    const lastMessage = messages[index - 1];

    if (lastMessage.type === 'bot' && !lastMessage.widget) {
      return false;
    }
    return true;
  };

  const renderMessages = () => {
    return messages.map((messageObject: IMessage, index: number) => {
      if (botMessage(messageObject)) {
        return (
          <React.Fragment key={messageObject.id}>
            {renderChatbotMessage(messageObject, index)}
          </React.Fragment>
        );
      }

      if (userMessage(messageObject)) {
        return (
          <React.Fragment key={messageObject.id}>
            {renderUserMessage(messageObject)}
          </React.Fragment>
        );
      }

      if (customMessage(messageObject, customMessages)) {
        return (
          <React.Fragment key={messageObject.id}>
            {renderCustomMessage(messageObject)}
          </React.Fragment>
        );
      }
    });
  };

  const renderCustomMessage = (messageObject: IMessage) => {
    const customMessage = customMessages[messageObject.type];

    const props = {
      setState,
      state,
      scrollIntoView,
      actionProvider,
      payload: messageObject.payload,
      actions,
    };

    if (messageObject.widget) {
      const widget = widgetRegistry.getWidget(messageObject.widget, {
        ...state,
        scrollIntoView,
        payload: messageObject.payload,
        actions,
      });
      return (
        <>
          {customMessage(props)}
          {widget ? widget : null}
        </>
      );
    }

    return customMessage(props);
  };

  const renderUserMessage = (messageObject: IMessage) => {
    const widget = widgetRegistry.getWidget(messageObject.widget, {
      ...state,
      scrollIntoView,
      payload: messageObject.payload,
      actions,
    });
    return (
      <>
        <UserChatMessage
          message={messageObject.message}
          key={messageObject.id}
          customComponents={customComponents}
        />
        {widget ? widget : null}
      </>
    );
  };

  const renderChatbotMessage = (messageObject: IMessage, index: number) => {
    let withAvatar;
    if (messageObject.withAvatar) {
      withAvatar = messageObject.withAvatar;
    } else {
      withAvatar = showAvatar(messages, index);
    }

    const chatbotMessageProps = {
      ...messageObject,
      setState,
      state,
      customComponents,
      widgetRegistry,
      messages,
      actions,
    };

    if (messageObject.widget) {
      const widget = widgetRegistry.getWidget(chatbotMessageProps.widget, {
        ...state,
        scrollIntoView,
        payload: messageObject.payload,
        actions,
      });
      return (
        <>
          <ChatbotMessage
            customStyles={customStyles.botMessageBox}
            avatarIcon={avatarIcon.avatarIconn}
            withAvatar={withAvatar}
            {...chatbotMessageProps}
            key={messageObject.id}
          />
          <ConditionallyRender
            condition={!chatbotMessageProps.loading}
            show={widget ? widget : null}
          />
        </>
      );
    }

    return (
      <ChatbotMessage
        customStyles={customStyles.botMessageBox}
        avatarIcon={avatarIcon.avatarIconn}
        key={messageObject.id}
        withAvatar={withAvatar}
        {...chatbotMessageProps}
        customComponents={customComponents}
        messages={messages}
        setState={setState}
      />
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validator && typeof validator === 'function') {
      if (validator(input)) {
        handleValidMessage();
        if (parse) {
          return parse(input);
        }
        messageParser.parse(input);
      }
    } else {
      handleValidMessage();
      if (parse) {
        return parse(input);
      }
      messageParser.parse(input);
    }
  };

  const handleValidMessage = () => {
    setState((state: any) => ({
      ...state,
      messages: [...state.messages, createChatMessage(input, 'user')],
    }));

    scrollIntoView();
    setInputValue('');
  };

  const customButtonStyle = { backgroundColor: '' };
  if (customStyles && customStyles.chatButton) {
    customButtonStyle.backgroundColor = customStyles.chatButton.backgroundColor;
  }
  const custombotback = { backgroundColor: '' };
  if (customStyles && customStyles.botcolor) {
    custombotback.backgroundColor = customStyles.botcolor.backgroundColor;
  }

  let header = `Conversation with ${botName}`;
  if (headerText) {
    header = headerText;
  }

  const customHeaderStyle = {
    backgroundColor: '', // Initialize with an empty value
    backgroundImage: '',
    color: '', // Initialize with an empty value
  };
  if (customStyles.headercolor.backgroundColor !== '#ffffff') {
    customHeaderStyle.backgroundColor =
      customStyles.headercolor.backgroundColor;
    customHeaderStyle.color = customStyles.headercolor.color;
    customHeaderStyle.backgroundImage = 'none';
  } else {
    customHeaderStyle.backgroundImage =
      customStyles.headercolor.backgroundImage;
  }

  let placeholder = 'Write your message here';
  if (placeholderText) {
    placeholder = placeholderText;
  }

  return (
    <div className="react-chatbot-kit-chat-container2">
      <div className="react-chatbot-kit-chat-inner-container2">
        <ConditionallyRender
          condition={!!customComponents.header}
          show={
            customComponents.header && customComponents.header(actionProvider)
          }
          elseShow={
            <div
              className="react-chatbot-kit-chat-header2"
              style={customHeaderStyle}
            >
              {header}
            </div>
          }
        />

        <div
          className="react-chatbot-kit-chat-message-container2"
          style={custombotback}
          ref={chatContainerRef}
        >
          <ConditionallyRender
            condition={
              typeof messageHistory === 'string' && Boolean(messageHistory)
            }
            show={
              <div
                dangerouslySetInnerHTML={{ __html: messageHistory as string }}
              />
            }
          />

          {renderMessages()}
          <div style={{ paddingBottom: '15px' }} />
        </div>

        <div className="react-chatbot-kit-chat-input-container2">
          <form
            className="react-chatbot-kit-chat-input-form2"
            onSubmit={handleSubmit}
          >
            <input
              className="react-chatbot-kit-chat-input2"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button
              className="react-chatbot-kit-chat-btn-send2"
              style={customButtonStyle}
            >
              <PaperPlaneIcon className="react-chatbot-kit-chat-btn-send-icon2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
