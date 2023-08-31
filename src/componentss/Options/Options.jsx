import React, { useEffect } from 'react';

import './Options.css';
const Options = (props) => {
  useEffect(() => {
    console.log('param', props.param);
  });
  const options = [
    {
      text: 'Javascript',
      handler: props.actionProvider.handleJavascriptQuiz,
      id: 1,
    },
    { text: 'Python', handler: () => {}, id: 2 },
    { text: 'Golang', handler: () => {}, id: 3 },
  ];
  const buttonsMarkup = options.map((option) => (
    <button
      key={option.id}
      onClick={option.handler}
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-3 border border-blue-500 hover:border-transparent rounded m-2"
      style={{ color: props.param }}
    >
      {option.text}
    </button>
  ));

  return <div className="options-container">{buttonsMarkup}</div>;
};

export default Options;
