import React from 'react';

import Chat from '../Chat/ChatLink';

import ChatbotError from '../ChatbotError/ChatbotError';

import IConfig from '../../interfaces/IConfig';

import {
  getCustomStyles,
  getCustomComponents,
  getBotName,
  getCustomMessages,
  isConstructor,
  getavatarIcon,
} from './utils';

import useChatbot from '../../hooks/useChatbot';
import { IMessage } from '../../interfaces/IMessages';
import { createChatBotMessage } from '../Chat/chatUtils';

interface IChatbotProps {
  actionProvider: any;
  prompt: any;
  messageParser: any;
  config: IConfig;
  headerText?: string;
  placeholderText?: string;
  saveMessages?: (ref: any) => any;
  messageHistory?: IMessage[] | string;
  validator?: (input: string) => Boolean;
  runInitialMessagesWithHistory?: Boolean;
  disableScrollToBottom?: boolean;
}

const Chatbot = ({
  actionProvider,
  messageParser,
  config,
  headerText,
  placeholderText,
  saveMessages,
  messageHistory,
  runInitialMessagesWithHistory,
  disableScrollToBottom,
  validator,
  ...rest
}: IChatbotProps) => {
  const {
    configurationError,
    invalidPropsError,
    ActionProvider,
    Prompt,
    MessageParser,
    widgetRegistry,
    actionProv,
    messagePars,
    state,
    setState,
    setMessageContainerRef,
  } = useChatbot({
    config,
    actionProvider,
    prompt,
    messageParser,
    messageHistory,
    saveMessages,
    runInitialMessagesWithHistory,
    ...rest,
  });

  if (configurationError) {
    return <ChatbotError message={configurationError} />;
  }

  if (invalidPropsError.length) {
    return <ChatbotError message={invalidPropsError} />;
  }

  const customStyles = getCustomStyles(config);
  const customComponents = getCustomComponents(config);
  const botName = getBotName(config);
  const firstletter = getavatarIcon(config);
  const customMessages = getCustomMessages(config);

  if (isConstructor(ActionProvider) && isConstructor(MessageParser)) {
    return (
      <Chat
        state={state}
        setState={setState}
        widgetRegistry={widgetRegistry}
        actionProvider={actionProv}
        prompt={Prompt}
        messageParser={messagePars}
        customMessages={customMessages}
        customComponents={{ ...customComponents }}
        botName={botName}
        avatarIcon={{ ...firstletter }}
        customStyles={{ ...customStyles }}
        headerText={headerText}
        placeholderText={placeholderText}
        setMessageContainerRef={setMessageContainerRef}
        validator={validator}
        messageHistory={messageHistory}
        disableScrollToBottom={disableScrollToBottom}
      />
    );
  } else {
    return (
      <ActionProvider
        setState={setState}
        createChatBotMessage={createChatBotMessage}
      >
        <MessageParser>
          <Chat
            state={state}
            setState={setState}
            widgetRegistry={widgetRegistry}
            actionProvider={ActionProvider}
            prompt={Prompt}
            messageParser={MessageParser}
            customMessages={customMessages}
            customComponents={{ ...customComponents }}
            botName={botName}
            avatarIcon={{ ...firstletter }}
            customStyles={{ ...customStyles }}
            headerText={headerText}
            placeholderText={placeholderText}
            setMessageContainerRef={setMessageContainerRef}
            validator={validator}
            messageHistory={messageHistory}
            disableScrollToBottom={disableScrollToBottom}
          />
        </MessageParser>
      </ActionProvider>
    );
  }
};

export default Chatbot;
