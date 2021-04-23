import * as ACTION_TYPES from '../actions/types';

const initialState = {
  loading: true,
  token: null,
  user: null,
  err: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default authReducer;
