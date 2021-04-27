import axios from 'axios';
import { apiURI } from '../../env';
import * as ACTION_TYPES from './types';

export const fetchClusterData = (destID, date, range, property) => async (
  dispatch
) => {
  dispatch({ type: ACTION_TYPES.GET_CLUSTER_PROGRESS });
  let cl1 = [];
  let cl2 = [];
  let cl3 = [];
  let cl4 = [];

  await axios(
    `${apiURI}cluster/report/${property}/${destID}/${date}?range=${range}`
  )
    .then((res) => {
      let clusterData = res.data.data;
      let reqHotelData = res.data.reqHotelData;
      dispatch({
        type: ACTION_TYPES.SET_QUARY,
        payload: res.data.quary,
      });
      dispatch({
        type: ACTION_TYPES.SET_REQ_HOTEL,
        payload: reqHotelData,
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
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.GET_CLUSTER_FAILED,
        payload: err,
      });
    });
};

export const fetchHotelData = (destID, date, range, property) => async (
  dispatch
) => {
  dispatch({ type: ACTION_TYPES.GET_HOTELS_PROGRESS });

  await axios(
    `${apiURI}hotels/report/${property}/${destID}/${date}?range=${range}`
  )
    // await axios(
    //   `http://localhost:5000/api/hotels/report/106399/1447930/2021-04-19?range=90`
    // )
    .then((res) => {
      //let hotelDataSet = res.data.data;
      dispatch({
        type: ACTION_TYPES.GET_HOTELS,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.GET_HOTELS_FAILED,
        payload: err,
      });
    });
};

export const fetchHotelsList = () => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.GET_HOTELSLIST_PROGRESS });

  await axios(`${apiURI}hotels`)
    .then((res) => {
      dispatch({
        type: ACTION_TYPES.GET_HOTELSLIST,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ACTION_TYPES.GET_HOTELSLIST_FAILED,
        payload: err,
      });
    });
};

const setOutliers = (cluster, star) => {
  cluster.map((day, index) => {
    day.stars2 = day.unwanted.filter((e) => e.stars === 2);
    day.stars3 = day.unwanted.filter((e) => e.stars === 3);
    day.stars4 = day.unwanted.filter((e) => e.stars === 4);
    day.stars5 = day.unwanted.filter((e) => e.stars === 5);
    day.outliers_up = day.unwanted.filter((e) => e.stars > star);
    day.outliers_down = day.unwanted.filter((e) => e.stars < star);
    // console.log(` ${star} outlier Up => ${day.unwanted.filter(e => e.stars < star).length}`)
    // console.log(` ${star} outlier Down => ${day.unwanted.filter(e => e.stars > star).length}`)
  });

  return cluster;
};
