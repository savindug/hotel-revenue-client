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
    Authorization: await localStorage.getItem(AUTHORIZATION_KEY),
    refresh: await localStorage.getItem(REFRESH_KEY),
  };
};
