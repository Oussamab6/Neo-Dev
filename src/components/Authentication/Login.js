import { useState } from 'react';
import { loginFields } from './constants/formFields.js';
import FormAction from './FormAction.js';
import FormExtra from './FromExtra.js';
import Input from './Input.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Login(props) {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  const [showError, setShowError] = useState(false); // State to manage error alert

  const [loginState, setLoginState] = useState(fieldsState);

  const handleChange = (e) => {
    setLoginState({ ...loginState, [e.target.id]: e.target.value });
  };

  const handleSubmit = (event) => {
    axios({
      method: 'POST',
      url: '/login',
      data: {
        email: loginState['email-address'],
        password: loginState['password'],
      },
    })
      .then((response) => {
        props.setToken(response.data.access_token);

        navigate('/cardPage');
      })
      .catch((error) => {
        setShowError(true); // Set the error state to show the alert
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    event.preventDefault();
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {showError && ( // Conditionally render the alert
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Invalid credentials
              </h3>
            </div>
          </div>
        </div>
      )}

      <div className="-space-y-px">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={loginState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}
      </div>

      <FormExtra />
      <FormAction handleSubmit={handleSubmit} text="Login" />
    </form>
  );
}
