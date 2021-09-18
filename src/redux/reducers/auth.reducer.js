import * as ACTION_TYPES from '../actions/types';

const initialState = {
  user: null,
  selectedUser: null,
  auth_loading: true,
  auth_err: null,
  isLoggedIn: false,
  reports: [],
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGISTER_USER:
      return {
        ...state,
        selectedUser: action.payload,
        auth_loading: false,
      };
    case ACTION_TYPES.LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        auth_loading: false,
      };
    case ACTION_TYPES.LOGOUT_USER:
      return {
        ...state,
        user: null,
        auth_loading: false,
      };
    case ACTION_TYPES.LOGIN_PROGRESS:
      return {
        ...state,
        user: null,
        auth_loading: true,
      };
    case ACTION_TYPES.REGISTER_PROGRESS:
      return {
        ...state,
        auth_loading: true,
      };
    case ACTION_TYPES.LOGOUT_PROGRESS:
      return {
        ...state,
        auth_loading: true,
      };
    case ACTION_TYPES.LOGIN_FAILED:
      return {
        ...state,
        user: null,
        auth_loading: false,
        auth_err: action.payload,
      };
    case ACTION_TYPES.REGISTER_FAILED:
      return {
        ...state,
        auth_loading: false,
        auth_err: action.payload,
      };
    case ACTION_TYPES.LOGOUT_FAILED:
      return {
        ...state,
        user: null,
        auth_loading: false,
        auth_err: action.payload,
      };
    case ACTION_TYPES.ISLOGGEDIN_TRUE:
      return {
        ...state,
        auth_loading: false,
        isLoggedIn: true,
      };
    case ACTION_TYPES.ISLOGGEDIN_FALSE:
      return {
        ...state,
        auth_loading: false,
        isLoggedIn: false,
        auth_err: action.payload,
      };
    case ACTION_TYPES.ISLOADING_TRUE:
      return {
        ...state,
        auth_loading: true,
      };
    case ACTION_TYPES.ISLOADING_FALSE:
      return {
        ...state,
        auth_loading: false,
      };
    case ACTION_TYPES.GET_USER_REPORTS:
      return {
        ...state,
        reports: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
