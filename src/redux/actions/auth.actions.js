import * as ACTION_TYPES from '../actions/types';
import { apiURI } from '../../env';
import axios from 'axios';
import { AUTHORIZATION_KEY, REFRESH_KEY } from '../../utils/const';
import { getReqHeaders } from '../../services/auth.service';

const storeAuthTokens = async (key, token) => {
  let identifier = null;
  if (key === AUTHORIZATION_KEY) {
    identifier = 'Bearer ';
  }
  if (key === REFRESH_KEY) {
    identifier = 'refresh ';
  }
  await localStorage.setItem(key, identifier + token);
};

export const register = (user) => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.REGISTER_PROGRESS });
  await axios
    .post(`${apiURI}auth/register`, user)
    .then((res) => {
      const data = res.data.data;
      dispatch({
        type: ACTION_TYPES.REGISTER_USER,
        payload: data.user,
      });
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.REGISTER_FAILED,
        payload: err,
      });
    });
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

export const login = (user) => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
  await axios
    .post(`${apiURI}auth/login`, user)
    .then((result) => {
      const res = result.data;
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: res.data.user,
      });
      console.log(res);
      if (res.results === true) {
        storeAuthTokens(AUTHORIZATION_KEY, res.data.token);
        storeAuthTokens(REFRESH_KEY, res.data.user.tokens.refresh);
        dispatch({
          type: ACTION_TYPES.ISLOGGEDIN_TRUE,
          payload: res.results,
        });
      } else {
        dispatch({
          type: ACTION_TYPES.ISLOGGEDIN_FALSE,
          payload: res.data.message,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILED,
        payload: err,
      });
      dispatch({
        type: ACTION_TYPES.ISLOGGEDIN_FALSE,
        payload: err,
      });
    });
};

export const refresh = () => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
  await axios
    .get(`${apiURI}auth/refresh`, {
      headers: await getReqHeaders(),
    })
    .then((result) => {
      const res = result.data;
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: res.data.user,
      });
      console.log(res);
      if (res.results === true) {
        storeAuthTokens(AUTHORIZATION_KEY, res.data.token);
        storeAuthTokens(REFRESH_KEY, res.data.user.tokens.refresh);
        dispatch({
          type: ACTION_TYPES.ISLOGGEDIN_TRUE,
          payload: res.results,
        });
      } else {
        dispatch({
          type: ACTION_TYPES.ISLOGGEDIN_FALSE,
          payload: res.data.message,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.LOGIN_FAILED,
        payload: err,
      });
      dispatch({
        type: ACTION_TYPES.ISLOGGEDIN_FALSE,
        payload: err,
      });
    });
};

export const configUser = (user, properties, markets) => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.ISLOADING_TRUE });
  await axios
    .post(`${apiURI}dashboard/users/config`, { user, properties, markets })
    .then((res) => {
      // dispatch({
      //   type: ACTION_TYPES.LOGIN_USER,
      //   payload: res,
      // });
      dispatch({ type: ACTION_TYPES.ISLOGGEDIN_FALSE });
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      // dispatch({
      //   type: ACTION_TYPES.LOGIN_FAILED,
      //   payload: err,
      // });
    });
};
