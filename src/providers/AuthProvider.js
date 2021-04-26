import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../redux/actions/auth.actions';

export const AuthProvider = (props) => {
  const [userData, setUserData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();

  const handleSignin = (user) => {
    dispatch(login(userData, 'EMAIL_PWD'));
  };

  const handleSignup = () => {
    console.log('handleSignin!!!!');
    dispatch(register(userData, 'EMAIL_PWD'));
  };

  const handleSignout = () => {
    // dispatch(register(userData, 'EMAIL_PWD'));
  };

  return (
    <firebaseAuth.Provider
      value={{
        handleSignup,
        handleSignin,
        handleSignout,
        userData,
        setUserData,
      }}
    >
      {props.children}
    </firebaseAuth.Provider>
  );
};

export const firebaseAuth = React.createContext();
