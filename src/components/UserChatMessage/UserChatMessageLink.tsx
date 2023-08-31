import React from 'react';
import ConditionallyRender from 'react-conditionally-render';

import { callIfExists } from '../Chat/chatUtils';

import Useralt from '../../assets/icons/user-alt';

import './UserChatMessageLink.css';
import { ICustomComponents } from '../../interfaces/IConfig';

interface IUserChatMessageProps {
  message: string;
  customComponents: ICustomComponents;
}

const UserChatMessage = ({
  message,
  customComponents,
}: IUserChatMessageProps) => {
  return (
    <div className="react-chatbot-kit-user-chat-message-container2">
      <ConditionallyRender
        condition={!!customComponents.userChatMessage}
        show={callIfExists(customComponents.userChatMessage, {
          message,
        })}
        elseShow={
          <div className="react-chatbot-kit-user-chat-message2">
            {message}
            <div className="react-chatbot-kit-user-chat-message-arrow2"></div>
          </div>
        }
      />
      <ConditionallyRender
        condition={!!customComponents.userAvatar}
        show={callIfExists(customComponents.userAvatar)}
        elseShow={
          <div className="react-chatbot-kit-user-avatar2">
            <div className="react-chatbot-kit-user-avatar-container2">
              <Useralt className="react-chatbot-kit-user-avatar-icon2" />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default UserChatMessage;
