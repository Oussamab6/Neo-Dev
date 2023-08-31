import React, { useState } from 'react';
import { SwatchesPicker } from 'react-color';
import { Input } from 'antd';
import ChatbotColor from '../chatbotconfiguration/ChatbotThemeColor.js';
import Appa from '../chatbotconfiguration/Chatbotcolorcontainer.js';
const { TextArea } = Input;

const ContentToDisplay = ({
  current,
  onColorChange,
  onHeaderColorChange,
  onChatMessageColorChange,
  onChatIconColorChange,
  onNameChange,
  onWelChange,
}) => {
  const [currentName, setCurrentName] = useState(''); // Initialize currentName state with an empty string
  const [currentWel, setCurrentWel] = useState('');
  // Render the color picker
  if (current === 2) {
    return (
      <div>
        <Appa
          onColorChangee={onColorChange}
          onHeaderColorChangee={onHeaderColorChange}
          onChatMessageColorChangee={onChatMessageColorChange}
          onChatIconColorChangee={onChatIconColorChange}
        />
        {/* <p>Pick a color:</p>
        <ChatbotColor onColorChangee={onColorChange} /> */}
      </div>
    );
  }

  if (current === 0) {
    // Render the color picker
    return (
      <div>
        <p>Choose a name: </p>
        <Input
          placeholder="Enter the Name here"
          style={{ width: '25rem' }}
          onChange={(e) => {
            setCurrentName(e.target.value); // Update the currentName state with the user input
            onNameChange(e); // Call the onNameChange callback to update botName in App.js
          }}
        />
      </div>
    );
  }
  if (current === 1) {
    // Render the color picker
    return (
      <div>
        <p>Write the Welcoming Message here : </p>
        <TextArea
          showCount
          maxLength={100}
          style={{ width: '25rem' }}
          onChange={(e) => {
            setCurrentWel(e.target.value); // Update the currentName state with the user input
            onWelChange(e); // Call the onNameChange callback to update botName in App.js
          }}
        />
      </div>
    );
  }
};

export default ContentToDisplay;
