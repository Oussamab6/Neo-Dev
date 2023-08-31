import {
  FunctionComponent,
  DetailedHTMLProps,
  TableHTMLAttributes,
  useState,
  useEffect,
} from 'react';
import { ReactMarkdownProps } from 'react-markdown/lib/complex-types';

import { TypeAnimation } from 'react-type-animation';
import React from 'react';
import userImage from '../static/styles/user.png';
import sad from '../static/styles/sad.png';
import happy from '../static/styles/happy.png';
import cry from '../static/styles/cry.png';
import love from '../static/styles/love.png';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion: string;
}
interface Props {
  message: ChatMessage;
  prompgen: boolean;
}

// This lets us style any markdown tables that are rendered
const CustomTable: FunctionComponent<
  Omit<
    DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
    'ref'
  > &
    ReactMarkdownProps
> = ({ children, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table {...props} className="w-full text-left border-collapse table-auto">
        {children}
      </table>
    </div>
  );
};
const divStyle: React.CSSProperties = {
  backgroundImage: `url(${userImage})`,
};
// const MyComponent = () => {
//   const { emotion } = useChat2();
//   console.log(emotion);
//   let backgroundImageUrl = '';

//   if (emotion) {
//     backgroundImageUrl = 'url(../static/styles/' + emotion + '.png)';
//   }
//   const emotionImageUrl = `../static/styles/${emotion}.png`;

//   const divStyle_bot: React.CSSProperties = {
//     backgroundImage: `url(${emotionImageUrl})`,
//   };
//   // Rest of your component code

//   return (
//     // JSX content using the divStyle_bot
//     divStyle_bot
//   );
// };

/**
 * This component renders a single chat message. It is rendered according to
 * whether it isa  message from the assistant or the user.
 */
export function a() {
  const [allow, setallow] = useState<boolean>(true);
  return { allow, setallow };
}

export const ChatMessage: React.FC<React.PropsWithChildren<Props>> = ({
  message,
  prompgen,
}) => {
  const [botimage, setbotimage] = useState<string | null>(`url(${happy})`);

  const { allow, setallow } = a();

  // const emotionImageUrl = `../static/styles/${emotion}.png`;

  const divStyle_bot: React.CSSProperties = {
    backgroundImage: botimage,
  };
  useEffect(() => {
    if (message.emotion === 'sad') {
      setbotimage(`url(${sad})`);
    } else if (message.emotion === 'happy') {
      setbotimage(`url(${happy})`);
    } else if (message.emotion === 'love') {
      setbotimage(`url(${love})`);
    } else if (message.emotion === 'cry') {
      setbotimage(`url(${cry})`);
    }
    console.log('llalla', message.emotion);
  }, [message.emotion]);

  return message.role === 'user' ? (
    <div className="msg right-msg">
      <div className="msg-img" style={divStyle}></div>

      <div className="msg-bubble">
        <div className="msg-info">
          <div className="msg-info-name">YOU</div>
        </div>

        <div className="msg-text">{message.content}</div>
      </div>
    </div>
  ) : (
    <div className="msg left-msg">
      <div className="msg-img" style={divStyle_bot}></div>
      <div className="msg-bubble">
        <div className="msg-info">
          <div className="msg-info-name">NEO-DEV</div>
          <div className="msg-info-time" id="msgTime"></div>
        </div>

        <div className="msg-text">
          <TypeAnimation
            sequence={[message.content, () => setallow(true)]}
            speed={70}
            cursor={false}
            style={{ fontSize: '20', display: 'inline-block' }}
          />
        </div>
      </div>
    </div>
  );
};
