import axios from 'axios';
import { apiURI } from '../env';
import { AUTHORIZATION_KEY, REFRESH_KEY } from '../utils/const';

export const checkAuthTokens = async () => {
  if (
    (await localStorage.getItem(AUTHORIZATION_KEY)) !== null &&
    (await localStorage.getItem(REFRESH_KEY)) !== null
  ) {
    return true;
  } else {
    return false;
  }
};

export const getReqHeaders = async () => {
  return {
    'content-type': 'application/json',
    Authorization: `Bearer ${await localStorage.getItem(AUTHORIZATION_KEY)}`,
    refresh: `refresh ${await localStorage.getItem(REFRESH_KEY)}`,
  };
};

export const getResetUserData = async (userD) => {
  let userData = null;
  await axios.post(`${apiURI}auth/reset-password`, userD).then((result) => {
    const res = result.data;
    if (res.results) {
      userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      };
    }
  });

  return userData;
};

export const setUserpassword = async (userD) => {
  let response = false;
  await axios.post(`${apiURI}auth/set-password`, userD).then((result) => {
    const res = result.data;
    response = res.results;
  });
  return response;
};

export const sendResetEmail = async (email) => {
  let userData = null;
  await axios
    .post(`${apiURI}auth/forgot-password`, {
      email: email,
    })
    .then((result) => {
      const res = result.data;
      if (res.results) {
        userData = {
          name: res.data.reset.name,
          email: res.data.reset.email,
        };
      }
    });

  return userData;
};

export const configUser = async (user, filter) => {
  await axios
    .post(
      `${apiURI}dashboard/user/hotel-filter`,
      { user, filter },
      {
        headers: await getReqHeaders(),
      }
    )
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((err) => {
      //console.log(err);
    });
};

export const forceLogOut = async () => {
  await localStorage.removeItem(AUTHORIZATION_KEY);
  await localStorage.removeItem(REFRESH_KEY);
};
