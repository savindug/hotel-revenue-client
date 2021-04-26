import * as ACTION_TYPES from '../actions/types';
import * as AuthHandlers from '../../services/firebase/AuthHandlers';
import firebase from 'firebase';

export const register = (user, method) => async (dispatch) => {
  if (method === 'EMAIL_PWD') {
    console.log(`register(${method})`);
    await firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        await localStorage.setItem('token', token);
        // console.log(
        //   `signUpwithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
        // );
        dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
        dispatch({
          type: ACTION_TYPES.LOGIN_USER,
          payload: token,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILED,
          payload: err,
        });
      });
  } else if (method === 'GOOGLE') {
    console.log(`register(${method})`);
    await firebase
      .auth()
      .signInWithGoogle()
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        await localStorage.setItem('token', token);
        // console.log(
        //   `signUpwithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
        // );
        dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
        dispatch({
          type: ACTION_TYPES.LOGIN_USER,
          payload: token,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILED,
          payload: err,
        });
      });
  } else if (method === 'FACEBOOK') {
    console.log(`register(${method})`);
    await firebase
      .auth()
      .signInWithGoogle(user.email, user.password)
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        await localStorage.setItem('token', token);
        // console.log(
        //   `signUpwithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
        // );
        dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
        dispatch({
          type: ACTION_TYPES.LOGIN_USER,
          payload: token,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILED,
          payload: err,
        });
      });
  }
};

export const customLogin = (username, password) => async (dispatch) => {
  let user = {
    username: username,
    password: password,
  };
  dispatch({
    type: ACTION_TYPES.LOGIN_USER,
    payload: user,
  });

  return true;
};

export const login = (user, method) => async (dispatch) => {
  console.log(`login(${user}, ${method})`);
  if (method === 'EMAIL_PWD') {
    console.log(`login(${method})`);
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b;
        await localStorage.setItem('token', token);
        // console.log(
        //   `signInWithEmailPWD(${JSON.stringify(user)}),\ntoken => ${token}`
        // );
        dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
        dispatch({
          type: ACTION_TYPES.LOGIN_USER,
          payload: token.h,
        });
      })
      .catch((err) => {
        dispatch({
          type: ACTION_TYPES.LOGIN_FAILED,
          payload: err,
        });
      });
  }

  if (method === 'GOOGLE') {
    console.log(`login(${method})`);
    let sign_google = await AuthHandlers.signInWithGoogle(user);
    try {
      dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: sign_google,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILED,
        payload: sign_google,
      });
    }
  }

  if (method === 'FACEBOOK') {
    console.log(`login(${method})`);
    const sign_fb = AuthHandlers.signInWithFacebook(user);
    try {
      dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: sign_fb,
      });
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILED,
        payload: sign_fb,
      });
    }
  }
};
