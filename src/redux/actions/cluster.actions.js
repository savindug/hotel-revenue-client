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
        payload: cl1,
      });
      dispatch({
        type: ACTION_TYPES.SET_CLUSTER_2,
        payload: cl2,
      });
      dispatch({
        type: ACTION_TYPES.SET_CLUSTER_3,
        payload: cl3,
      });
      dispatch({
        type: ACTION_TYPES.SET_CLUSTER_4,
        payload: cl4,
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
    .then((res) => {
      let hotelDataSet = res.data.data;
      dispatch({
        type: ACTION_TYPES.GET_HOTELS,
        payload: hotelDataSet,
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

// const sortClusters = (clusterData) => {
//   let clusterArr = [];
//   clusterArr.push(clusterData.cluster1.mean);
//   clusterArr.push(clusterData.cluster2.mean);
//   clusterArr.push(clusterData.cluster3.mean);
//   clusterArr.push(clusterData.cluster4.mean);

//   clusterArr.sort((a, b) => a - b);
//   console.log(`clusterArr => ${clusterArr.length} => ${clusterArr}`);

//   clusterArr.map((e, i) => {
//     if (e === clusterData.cluster1.mean) {
//       clusterArr[i] = 'cluster1';
//       clusterData.cluster1.index = i;
//     }
//     if (e === clusterData.cluster2.mean) {
//       clusterArr[i] = 'cluster2';
//       clusterData.cluster2.index = i;
//     }
//     if (e === clusterData.cluster3.mean) {
//       clusterArr[i] = 'cluster3';
//       clusterData.cluster3.index = i;
//     }
//     if (e === clusterData.cluster4.mean) {
//       clusterArr[i] = 'cluster4';
//       clusterData.cluster4.index = i;
//     }
//   });

//   clusterData.sortClusters = clusterArr;
// };
