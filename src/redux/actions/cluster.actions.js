import axios from 'axios';
import { Exception } from 'sass';
import { apiURI, DATA_ERR } from '../../env';
import { getReqHeaders } from '../../services/auth.service';
import { refresh } from './auth.actions';
import * as ACTION_TYPES from './types';

let cluster_date_loading = true;
let hotel_date_loading = true;
let hotel_list_loading = true;
let markets_loading = true;
let refresh_dates_loading = true;
let comp_report_loading = true;

const check_loading = () => {
  if (
    cluster_date_loading === false &&
    hotel_date_loading === false &&
    hotel_list_loading === false &&
    markets_loading === false &&
    refresh_dates_loading === false &&
    comp_report_loading === false
  ) {
    return false;
  } else {
    return true;
  }
};

export const fetchClusterData =
  (destID, date, range, property, refreshDate) => async (dispatch) => {
    cluster_date_loading = true;
    dispatch({ type: ACTION_TYPES.GET_CLUSTER_PROGRESS });
    let cl1 = [];
    let cl2 = [];
    let cl3 = [];
    let cl4 = [];

    let rating_cl1 = [];
    let rating_cl2 = [];
    let rating_cl3 = [];
    let rating_cl4 = [];

    await axios(
      `${apiURI}app/cluster/report/${property}/${destID}/${date}/${refreshDate}?range=${range}`,
      {
        headers: await getReqHeaders(),
      }
    )
      .then((res) => {
        let clusterData = res.data.data.cluster_report;
        let reqHotelData = res.data.data.property_report;
        let rating_cluster_report = res.data.data.rating_cluster_report;

        dispatch({
          type: ACTION_TYPES.SET_RATING_CLUSTER,
          payload: {
            clusterData: [],
            cluster1: [],
            cluster2: [],
            cluster3: [],
            cluster4: [],
            reqHotel: [],
          },
        });

        try {
          rating_cluster_report[0].clusters.map((day, index) => {
            day.map((cl, el) => {
              if (el === 0) {
                rating_cl1.push(cl);
              }
              if (el === 1) {
                rating_cl2.push(cl);
              }
              if (el === 2) {
                rating_cl3.push(cl);
              }
              if (el === 3) {
                rating_cl4.push(cl);
              }
            });
          });

          dispatch({
            type: ACTION_TYPES.SET_RATING_CLUSTER,
            payload: {
              min_rating: rating_cluster_report[0].min_rating,
              max_rating: rating_cluster_report[0].max_rating,
              clusterData: rating_cluster_report[0].clusters,
              cluster1: rating_cl1,
              cluster2: rating_cl2,
              cluster3: rating_cl3,
              cluster4: rating_cl4,
              reqHotel: rating_cluster_report[0].property_report,
            },
          });
        } catch (e) {}

        dispatch({
          type: ACTION_TYPES.SET_QUARY,
          payload: res.data.quary,
        });
        dispatch({
          type: ACTION_TYPES.SET_REQ_HOTEL,
          payload: reqHotelData,
        });

        if (clusterData.length > 0) {
          dispatch({
            type: ACTION_TYPES.SET_REPORT_LEN,
            payload: clusterData.length,
          });

          clusterData.map((day, index) => {
            day.map((cl, el) => {
              if (el === 0) {
                cl1.push(cl);
              }
              if (el === 1) {
                cl2.push(cl);
              }
              if (el === 2) {
                cl3.push(cl);
              }
              if (el === 3) {
                cl4.push(cl);
              }
            });
          });
          dispatch({
            type: ACTION_TYPES.GET_CLUSTER,
            payload: clusterData,
          });
          dispatch({
            type: ACTION_TYPES.SET_CLUSTER_1,
            payload: setOutliers(cl1, 2),
          });
          dispatch({
            type: ACTION_TYPES.SET_CLUSTER_2,
            payload: setOutliers(cl2, 3),
          });
          dispatch({
            type: ACTION_TYPES.SET_CLUSTER_3,
            payload: setOutliers(cl3, 4),
          });
          dispatch({
            type: ACTION_TYPES.SET_CLUSTER_4,
            payload: setOutliers(cl4, 5),
          });
        }
      })
      .catch(async (err) => {
        dispatch(handleErr(DATA_ERR));
      });

    cluster_date_loading = false;

    dispatch({
      type: ACTION_TYPES.SET_LOADING,
      payload: check_loading(),
    });
  };

export const fetchHotelData =
  (destID, date, range, property, refreshDate) => async (dispatch) => {
    hotel_date_loading = true;
    dispatch({ type: ACTION_TYPES.GET_HOTELS_PROGRESS });

    await axios(
      `${apiURI}app/hotels/report/${property}/${destID}/${date}/${refreshDate}?range=${range}`,
      {
        headers: await getReqHeaders(),
      }
    )
      .then((res) => {
        let hotelDataSet = res.data.data.hotels_report;
        dispatch({
          type: ACTION_TYPES.GET_HOTELS,
          payload: hotelDataSet,
        });
      })
      .catch(async (err) => {
        dispatch(handleErr(DATA_ERR));
      });

    hotel_date_loading = false;

    dispatch({
      type: ACTION_TYPES.SET_LOADING,
      payload: check_loading(),
    });
  };

export const fetchHotelsList = (destID) => async (dispatch) => {
  hotel_list_loading = true;
  dispatch({ type: ACTION_TYPES.GET_HOTELSLIST_PROGRESS });

  await axios
    .get(`${apiURI}app/hotels/${destID}`, {
      headers: await getReqHeaders(),
    })
    .then((res) => {
      dispatch({
        type: ACTION_TYPES.GET_HOTELSLIST,
        payload: res.data.data,
      });
    })
    .catch(async (err) => {
      dispatch(handleErr(DATA_ERR));
    });

  hotel_list_loading = false;

  dispatch({
    type: ACTION_TYPES.SET_LOADING,
    payload: check_loading(),
  });
};

export const fetchMarkets = () => async (dispatch) => {
  markets_loading = false;
  dispatch({ type: ACTION_TYPES.GET_MARKETS_PROGRESS });

  await axios
    .get(`${apiURI}app/markets`, {
      headers: await getReqHeaders(),
    })
    .then((res) => {
      dispatch({
        type: ACTION_TYPES.GET_MARKETS,
        payload: res.data.data,
      });
    })
    .catch(async (err) => {
      dispatch(handleErr(DATA_ERR));
    });
  markets_loading = false;

  dispatch({
    type: ACTION_TYPES.SET_LOADING,
    payload: check_loading(),
  });
};

export const fetchRefreshDates = (destID) => async (dispatch) => {
  refresh_dates_loading = true;
  dispatch({ type: ACTION_TYPES.GET_REFRESH_DATES_PROGRESS });

  await axios
    .get(`${apiURI}app/refresh-dates/${destID}`, {
      headers: await getReqHeaders(),
    })
    .then((res) => {
      dispatch({
        type: ACTION_TYPES.GET_REFRESH_DATES,
        payload: res.data.data,
      });
    })
    .catch(async (err) => {
      dispatch(handleErr(DATA_ERR));
    });

  refresh_dates_loading = false;

  dispatch({
    type: ACTION_TYPES.SET_LOADING,
    payload: check_loading(),
  });
};

export const handleErr = (err) => async (dispatch) => {
  if (err.message !== undefined) {
    if (err.message == 'Request failed with status code 401') {
      dispatch({ type: ACTION_TYPES.ISLOGGEDIN_FALSE });
      await refresh();
    } else {
      dispatch({
        type: ACTION_TYPES.GET_REFRESH_DATES_FAILED,
        payload: DATA_ERR,
      });
    }
  }
};

const setOutliers = (cluster, star) => {
  if (cluster.length > 0) {
    cluster.map((day, index) => {
      day.stars2 = day.unwanted.filter((e) => Math.floor(e.stars) === 2);
      day.stars3 = day.unwanted.filter((e) => Math.floor(e.stars) === 3);
      day.stars4 = day.unwanted.filter((e) => Math.floor(e.stars) === 4);
      day.stars5 = day.unwanted.filter((e) => Math.floor(e.stars) === 5);
      day.outliers_up = day.unwanted.filter((e) => Math.floor(e.stars) > star);
      day.outliers_down = day.unwanted.filter(
        (e) => Math.floor(e.stars) < star
      );
      // console.log(` ${star} outlier Up => ${day.unwanted.filter(e => e.stars < star).length}`)
      // console.log(` ${star} outlier Down => ${day.unwanted.filter(e => e.stars > star).length}`)
    });
  }

  return cluster;
};

export const fetchCompReport =
  (destID, date, range, property, refreshDate) => async (dispatch) => {
    let cl1 = [];
    let cl2 = [];
    let cl3 = [];
    let cl4 = [];

    comp_report_loading = true;
    dispatch({ type: ACTION_TYPES.GET_COMP_REPORT_PROGRESS });

    await axios(
      `${apiURI}app/cluster/report/${property}/${destID}/${date}/${refreshDate}?range=${range}`,
      {
        headers: await getReqHeaders(),
      }
    )
      .then((res) => {
        let clusterData = res.data.data.cluster_report;
        let reqHotelData = res.data.data.property_report;
        let rating_cluster_report = res.data.data.rating_cluster_report;

        if (clusterData.length > 0) {
          clusterData.map((day, index) => {
            day.map((cl, el) => {
              if (el === 0) {
                cl1.push(cl);
              }
              if (el === 1) {
                cl2.push(cl);
              }
              if (el === 2) {
                cl3.push(cl);
              }
              if (el === 3) {
                cl4.push(cl);
              }
            });
          });
        }

        dispatch({
          type: ACTION_TYPES.GET_COMP_REPORT,
          payload: {
            clusterData: clusterData,
            cluster1: setOutliers(cl1, 2),
            cluster2: setOutliers(cl2, 3),
            cluster3: setOutliers(cl3, 4),
            cluster4: setOutliers(cl4, 5),

            reqHotelData: reqHotelData,
            rating_cluster_report: rating_cluster_report,
          },
        });
      })
      .catch(async (err) => {
        dispatch(handleErr(DATA_ERR));
      });

    comp_report_loading = false;

    dispatch({
      type: ACTION_TYPES.SET_LOADING,
      payload: check_loading(),
    });
  };
