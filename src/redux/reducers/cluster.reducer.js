import * as ACTION_TYPES from '../actions/types';

const initialState = {
  clusterData: {},
  loading: true,
  err: null,
};

const clusterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_CLUSTER:
      return {
        ...state,
        clusterData: action.payload,
        loading: false,
      };

    case ACTION_TYPES.GET_CLUSTER_PROGRESS:
      return {
        ...state,
        loading: true,
      };

    case ACTION_TYPES.GET_CLUSTER_FAILED:
      return {
        ...state,
        loading: false,
        err: action.payload,
      };

    default:
      return state;
  }
};

export default clusterDataReducer;
