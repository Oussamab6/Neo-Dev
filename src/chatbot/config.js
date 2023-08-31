import React from 'react';
import { createChatBotMessage } from '../components/Chat/chatUtils.ts';

import Options from '../componentss/Options/Options.jsx';
import Quiz from '../componentss/Quiz/Quiz.jsx';

const config = {
  botName: 'Neo-Dev',
  avatarIcon: {
    avatarIconn: {
      backgroundColor: '#f2f0f0',
      textt: 'o',
    },
  },
  initialMessages: [
    createChatBotMessage(`Hello. What do you want to learn!`, {
      widget: 'options',
      color: '#ffffff',
    }),
  ],
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => <Options {...props} param="white" />,
    },
    {
      widgetName: 'javascriptQuiz',
      widgetFunc: (props) => <Quiz {...props} />,
      props: {
        questions: [
          {
            question: 'What is closure?',
            answer:
              "Closure is a way for a function to retain access to it's enclosing function scope after the execution of that function is finished.",
            id: 1,
          },
          {
            question: 'Explain prototypal inheritance',
            answer:
              'Prototypal inheritance is a link between an object and an object store that holds shared properties. If a property is not found on the host object, javascript will check the prototype object.',
            id: 2,
          },
        ],
      },
    },
  ],
  customComponents: {
    // Replaces the default header
    // chabotback: {
    //   backgroundColor: "red",
    // },
  },
  customStyles: {
    botMessageBox: {
      backgroundColor: '#f2f0f0',
      color: 'black',
    },
    chatButton: {
      backgroundColor: 'white',
    },
    botback: {
      backgroundColor: 'white',
    },
    headercolor: {
      backgroundColor: 'white',
      backgroundImage: 'linear-gradient(to right, #63eaec, #05888f)',
      color: 'black',
    },
  },
};

export default config;
