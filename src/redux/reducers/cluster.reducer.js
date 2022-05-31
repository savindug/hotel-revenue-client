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
  quary: null,
  reqHotel: [],
  hotelList: [],
  markets: [],
  ratingCluster: {
    clusterData: [],
    cluster1: [],
    cluster2: [],
    cluster3: [],
    cluster4: [],
    reqHotel: [],
  },
  refreshDates: {
    destinationId: null,
    dates: [],
  },
  report_len: 0,
  comparison_report: {},
};

const clusterDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.GET_CLUSTER:
      return {
        ...state,
        clusterData: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_CLUSTER_PROGRESS:
      return {
        ...state,
        //loading: true,
      };

    case ACTION_TYPES.GET_CLUSTER_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };

    case ACTION_TYPES.GET_HOTELS:
      return {
        ...state,
        hotels: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_HOTELS_PROGRESS:
      return {
        ...state,
        //loading: true,
      };

    case ACTION_TYPES.GET_HOTELS_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };

    case ACTION_TYPES.GET_MARKETS:
      return {
        ...state,
        markets: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_MARKETS_PROGRESS:
      return {
        ...state,
        //loading: true,
      };

    case ACTION_TYPES.GET_MARKETS_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };

    case ACTION_TYPES.SET_CLUSTER_1:
      return {
        ...state,
        cluster1: action.payload,
        //loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_2:
      return {
        ...state,
        cluster2: action.payload,
        //loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_3:
      return {
        ...state,
        cluster3: action.payload,
        //loading: false,
      };
    case ACTION_TYPES.SET_CLUSTER_4:
      return {
        ...state,
        cluster4: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.SET_QUARY:
      return {
        ...state,
        quary: action.payload,
      };

    case ACTION_TYPES.SET_REQ_HOTEL:
      return {
        ...state,
        reqHotel: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_HOTELSLIST:
      return {
        ...state,
        hotelList: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_HOTELSLIST_PROGRESS:
      return {
        ...state,
        //loading: true,
      };

    case ACTION_TYPES.GET_HOTELSLIST_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };

    case ACTION_TYPES.GET_REFRESH_DATES:
      return {
        ...state,
        refreshDates: action.payload,
        //loading: false,
      };

    case ACTION_TYPES.GET_REFRESH_DATES_PROGRESS:
      return {
        ...state,
        //loading: true,
      };

    case ACTION_TYPES.GET_REFRESH_DATES_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };
    case ACTION_TYPES.SET_REPORT_LEN:
      return {
        ...state,
        report_len: action.payload,
      };
    case ACTION_TYPES.SET_RATING_CLUSTER:
      return {
        ...state,
        ratingCluster: action.payload,
      };
    case ACTION_TYPES.GET_COMP_REPORT:
      return {
        ...state,
        comparison_report: action.payload,
        //loading: false,
      };
    case ACTION_TYPES.GET_COMP_REPORT_PROGRESS:
      return {
        ...state,
        //loading: true,
      };
    case ACTION_TYPES.GET_COMP_REPORT_FAILED:
      return {
        ...state,
        //loading: false,
        err: action.payload,
      };
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default clusterDataReducer;
