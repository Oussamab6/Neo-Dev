import React, { useMemo, useState } from 'react';
import { Button, ColorPicker, theme } from 'antd';

const ChatbotColor = ({ onColorChangee, text }) => {
  const { token } = theme.useToken();
  const [color, setColor] = useState('#ffffff'); // Set the default color to white

  const bgColor = useMemo(
    () => (typeof color === 'string' ? color : '#ffffff'),
    [color]
  );

  const handleChangeColor = (newColor) => {
    setColor(newColor.toHexString());
    onColorChangee(newColor.toHexString()); // Call onColorChangee with the updated color
  };

  // Calculate the contrast color based on background brightness
  const textColor = colorBrightness(bgColor) > 180 ? '#000' : '#fff';

  const btnStyle = {
    backgroundColor: bgColor,
    border: '1px solid #D4A362',
    height: '60px',
    fontWeight: 'bold',
    color: textColor, // Set the calculated text color
  };

  return (
    <ColorPicker value={color} onChange={handleChangeColor}>
      <Button type="primary" style={btnStyle}>
        {text}
      </Button>
    </ColorPicker>
  );
};

// Function to calculate color brightness
const colorBrightness = (color) => {
  const rgb = parseInt(color.slice(1), 16); // Convert hex to decimal
  const r = (rgb >> 16) & 0xff; // Extract red
  const g = (rgb >> 8) & 0xff; // Extract green
  const b = (rgb >> 0) & 0xff; // Extract blue
  return 0.299 * r + 0.587 * g + 0.114 * b; // Calculate brightness
};

export default ChatbotColor;
