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

const getInitials = (name) => {
  let initials;
  const nameSplit = name.split(' ');
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

export const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  name = getInitials(name);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvas.height = size;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);

  context.fillStyle = `${color}50`;
  context.fillRect(0, 0, size, size);

  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.font = `${size / 2}px Roboto`;
  context.fillText(name, size / 2, size / 2);

  return canvas.toDataURL();
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
