import * as ACTION_TYPES from '../actions/types';
import { apiURI, INTERNAL_SERVER_ERR } from '../../env';
import axios from 'axios';
import { AUTHORIZATION_KEY, REFRESH_KEY } from '../../utils/const';
import { getReqHeaders } from '../../services/auth.service';
import moment from 'moment';

const storeAuthTokens = async (key, token) => {
  await localStorage.setItem(key, token);
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
      //console.log(res);
    })
    .catch((err) => {
      //console.log(err);
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
    .then(async (result) => {
      const res = result.data;
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: res.data.user,
      });

      // console.log(res);
      if (res.results === true) {
        await dispatch(
          getUserReports({
            _id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            application: res.data.user.application,
            role: res.data.user.role,
          })
        );

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
        payload: INTERNAL_SERVER_ERR,
      });
      dispatch({
        type: ACTION_TYPES.ISLOGGEDIN_FALSE,
        payload: INTERNAL_SERVER_ERR,
      });
    });
};

export const refresh = () => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOGIN_PROGRESS });
  await axios
    .get(`${apiURI}auth/refresh`, {
      headers: await getReqHeaders(),
    })
    .then(async (result) => {
      const res = result.data;
      dispatch({
        type: ACTION_TYPES.LOGIN_USER,
        payload: res.data.user,
      });

      // console.log(res);
      if (res.results === true) {
        await dispatch(
          getUserReports({
            _id: res.data.user._id,
            name: res.data.user.name,
            email: res.data.user.email,
            application: res.data.user.application,
            role: res.data.user.role,
          })
        );
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
        payload: INTERNAL_SERVER_ERR,
      });
      dispatch({
        type: ACTION_TYPES.ISLOGGEDIN_FALSE,
        payload: INTERNAL_SERVER_ERR,
      });
    });
};

export const configUser = (user, properties, markets) => async (dispatch) => {
  await axios
    .post(
      `${apiURI}dashboard/users/config`,
      { user, properties, markets },
      {
        headers: await getReqHeaders(),
      }
    )
    .then((res) => {
      //console.log(res);
      dispatch({
        type: ACTION_TYPES.REGISTER_USER,
        payload: null,
      });
    })
    .catch((err) => {
      //console.log(err);
    });
};

export const fetchUserList = () => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.GET_USERS_LIST_PROGRESS });

  await axios
    .get(`${apiURI}dashboard/users`, {
      headers: await getReqHeaders(),
    })
    .then((result) => {
      const res = result.data;

      if (res.results) {
        dispatch({
          type: ACTION_TYPES.GET_USERS_LIST,
          payload: res.data,
        });
      } else {
        dispatch({
          type: ACTION_TYPES.GET_USERS_LIST_FAILED,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      //console.log(err);
      // dispatch({
      //   type: ACTION_TYPES.LOGIN_FAILED,
      //   payload: err,
      // });
    });
};

export const getUserReports = (user) => async (dispatch) => {
  dispatch({
    type: ACTION_TYPES.GET_USER_REPORTS_PROGRESS,
    payload: null,
  });
  await axios
    .post(
      `${apiURI}auth/reports_by_user`,
      { user },
      {
        headers: await getReqHeaders(),
      }
    )
    .then((result) => {
      const res = result.data;

      const today = moment(new Date());
      const user_reports = res.data.sort(function (a, b) {
        var distancea = Math.abs(moment(a.report_date).diff(today, 'days'));
        var distanceb = Math.abs(moment(b.report_date).diff(today, 'days'));

        return distancea - distanceb;
      });

      dispatch({
        type: ACTION_TYPES.GET_USER_REPORTS,
        payload: user_reports,
      });
    })
    .catch((err) => {
      dispatch({
        type: ACTION_TYPES.GET_USER_REPORTS_FAILED,
        payload: err,
      });
    });
};

export const setSelectedUser = (user) => async (dispatch) => {
  dispatch({
    type: ACTION_TYPES.REGISTER_USER,
    payload: user,
  });
};

export const setAuthLoading = (state) => async (dispatch) => {
  if (state) {
    dispatch({ type: ACTION_TYPES.ISLOADING_TRUE });
  } else {
    dispatch({ type: ACTION_TYPES.ISLOADING_FALSE });
  }
};

export const logOut = () => async (dispatch) => {
  await localStorage.removeItem(AUTHORIZATION_KEY);
  await localStorage.removeItem(REFRESH_KEY);
  dispatch({
    type: ACTION_TYPES.ISLOGGEDIN_FALSE,
    payload: null,
  });
};
