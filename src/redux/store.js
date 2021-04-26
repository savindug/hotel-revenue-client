import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

// const getAuthToken = localStorage.getItem('token')
//   ? JSON.parse(localStorage.getItem('token'))
//   : [];

const initialState = {
  auth: {
    user: {
      username: null,
      password: null,
    },
    isLoggedIn: false,
  },
};

const middleware = [thunk];

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
