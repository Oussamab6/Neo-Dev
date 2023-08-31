import React, { useState } from 'react';
import { signupFields } from './constants/formFields.js';
import FormAction from './FormAction.js';
import Input from './Input.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ''));

export default function Signup(props) {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const [signupState, setSignupState] = useState(fieldsState);
  const [passwordMismatch, setPasswordMismatch] = useState(false); // State to manage password mismatch alert
  const [emailexist, setemailexist] = useState(false); // State to manage password mismatch alert

  const handleChange = (e) =>
    setSignupState({ ...signupState, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (signupState.password !== signupState['confirm-password']) {
      setPasswordMismatch(true);
      return; // Exit the function if passwords don't match
    }

    setPasswordMismatch(false); // Reset the password mismatch alert

    createAccount();
  };

  //handle Signup API Integration here
  const createAccount = () => {
    axios({
      method: 'POST',
      url: '/savedata',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header manually
      },
      data: JSON.stringify(signupState),
    })
      .then((response) => {
        props.setToken(response.data.access_token);
        navigate('/chatPage');
      })
      .catch((error) => {
        if (error.response) {
          const responseData = error.response.data;
          if (responseData.message === 'Email already exists') {
            setemailexist(true);
          } else {
            console.log('Server Error:', responseData.error);
          }
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="">
        {fields.map((field) => (
          <Input
            key={field.id}
            handleChange={handleChange}
            value={signupState[field.id]}
            labelText={field.labelText}
            labelFor={field.labelFor}
            id={field.id}
            name={field.name}
            type={field.type}
            isRequired={field.isRequired}
            placeholder={field.placeholder}
          />
        ))}

        {passwordMismatch && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 112 0v1H5V9zm2 6a1 1 0 100 2 1 1 0 000-2zm6-2a1 1 0 10-2 0v1h2v-1zm-2-4a1 1 0 112 0v1h-2V9zm2 6a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Passwords do not match.
                </h3>
              </div>
            </div>
          </div>
        )}
        {emailexist && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM5 9a1 1 0 112 0v1H5V9zm2 6a1 1 0 100 2 1 1 0 000-2zm6-2a1 1 0 10-2 0v1h2v-1zm-2-4a1 1 0 112 0v1h-2V9zm2 6a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Email EXIST
                </h3>
              </div>
            </div>
          </div>
        )}

        <FormAction handleSubmit={handleSubmit} text="Signup" />
      </div>
    </form>
  );
}
