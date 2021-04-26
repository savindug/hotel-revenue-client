import * as ACTION_TYPES from '../actions/types';

const initialState = {
  user: null,
  loading: true,
  err: null,
  isLoggedIn: false,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGISTER_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case ACTION_TYPES.LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        isLoggedIn: true,
      };
    case ACTION_TYPES.LOGOUT_USER:
      return {
        ...state,
        user: null,
        loading: false,
      };
    case ACTION_TYPES.LOGIN_PROGRESS:
      return {
        ...state,
        user: null,
        loading: true,
      };
    case ACTION_TYPES.REGISTER_PROGRESS:
      return {
        ...state,
        user: null,
        loading: true,
      };
    case ACTION_TYPES.LOGOUT_PROGRESS:
      return {
        ...state,
        loading: true,
      };
    case ACTION_TYPES.LOGIN_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        err: action.payload,
      };
    case ACTION_TYPES.REGISTER_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        err: action.payload,
      };
    case ACTION_TYPES.LOGOUT_FAILED:
      return {
        ...state,
        user: null,
        loading: false,
        err: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
