// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { SketchPicker } from 'react-color';

// interface ChatbotFormProps {
//   onNameChange: (name: string) => void;
// }

// const ChatbotForm: React.FC<ChatbotFormProps> = ({ onNameChange }) => {
//   const [name, setName] = useState('');
//   const [color, setColor] = useState('');

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     // Handle the form submission
//     console.log('Name:', name);
//     console.log('Color:', color);
//   };

//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const newName = e.target.value;
//     setName(newName);
//     onNameChange(newName); // Notify the parent component about the name change
//   };

//   const handleColorChange = (color: any) => {
//     setColor(color.hex);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Chatbot Name:
//         <input type="text" value={name} onChange={handleNameChange} />
//       </label>
//       <br />
//       <label>
//         Chatbot Color:
//         <SketchPicker color={color} onChange={handleColorChange} />
//       </label>
//       <br />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default ChatbotForm;
