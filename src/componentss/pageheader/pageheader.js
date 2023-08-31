import React, { useState } from 'react';
import { Divider, Steps } from 'antd';
import StepsForm from './content.js';
const PageHeader = ({ current, setCurrent }) => {
  const onChange = (value) => {
    console.log('onChange:', value);
    setCurrent(value);
  };
  const description = 'This is a description.';

  return (
    <>
      <Steps
        current={current}
        onChange={onChange}
        items={[
          {
            title: 'Name',
            description: 'Write your Chatbot name',
          },
          {
            title: 'Welcoming Message',
            description: 'Write your Welcoming Message',
          },
          {
            title: 'Chatbot Theme',
            description: 'Choose your Chatbot Colors',
          },
          {
            title: 'Finish',
          },
        ]}
      />
    </>
  );
};

export default PageHeader;
