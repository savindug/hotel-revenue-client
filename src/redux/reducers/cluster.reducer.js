import * as ACTION_TYPES from '../actions/types';

const initialState = {
  clusterData: [],
  hotels: [],
  loading: true,
  cluster1: [],
  cluster2: [],
  cluster3: [],
  cluster4: [],
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

    case ACTION_TYPES.GET_HOTELS:
      return {
        ...state,
        hotels: action.payload,
        loading: false,
      };

    case ACTION_TYPES.GET_HOTELS_PROGRESS:
      return {
        ...state,
        loading: true,
      };

    case ACTION_TYPES.GET_HOTELS_FAILED:
      return {
        ...state,
        loading: false,
        err: action.payload,
      };

    case ACTION_TYPES.SET_CLUSTER_1:
      return {
        ...state,
        cluster1: action.payload,
        loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_2:
      return {
        ...state,
        cluster2: action.payload,
        loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_3:
      return {
        ...state,
        cluster3: action.payload,
        loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_4:
      return {
        ...state,
        cluster4: action.payload,
        loading: false,
      };

    default:
      return state;
  }
};

export default clusterDataReducer;
