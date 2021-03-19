import axios from 'axios';
import { apiURI } from '../../env';
import * as ACTION_TYPES from './types';

export const fetchClusterData = (destID, date) => async (dispatch) => {
  dispatch({ type: ACTION_TYPES.GET_CLUSTER_PROGRESS });

  await axios(`${apiURI}cluster/${destID}/${date}`)
    .then((res) => {
      let clusterData = res.data.data;
      //console.log('executed => ' + JSON.stringify(res));
      sortClusters(clusterData);
      let clusters = [];
      clusters.push(
        clusterData.cluster1,
        clusterData.cluster2,
        clusterData.cluster3,
        clusterData.cluster4
      );
      dispatch({
        type: ACTION_TYPES.GET_CLUSTER,
        payload: clusters,
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

const sortClusters = (clusterData) => {
  let clusterArr = [];
  clusterArr.push(clusterData.cluster1.mean);
  clusterArr.push(clusterData.cluster2.mean);
  clusterArr.push(clusterData.cluster3.mean);
  clusterArr.push(clusterData.cluster4.mean);

  clusterArr.sort((a, b) => a - b);
  console.log(`clusterArr => ${clusterArr.length} => ${clusterArr}`);

  clusterArr.map((e, i) => {
    if (e === clusterData.cluster1.mean) {
      clusterArr[i] = 'cluster1';
      clusterData.cluster1.index = i;
    }
    if (e === clusterData.cluster2.mean) {
      clusterArr[i] = 'cluster2';
      clusterData.cluster2.index = i;
    }
    if (e === clusterData.cluster3.mean) {
      clusterArr[i] = 'cluster3';
      clusterData.cluster3.index = i;
    }
    if (e === clusterData.cluster4.mean) {
      clusterArr[i] = 'cluster4';
      clusterData.cluster4.index = i;
    }
  });

  clusterData.sortClusters = clusterArr;
};

// export const addTodo = (todo) => async (dispatch, getState) => {
//   dispatch({ type: ACTION_TYPES.ADD_TODO_PROGRESS });

//   dispatch({
//     type: ACTION_TYPES.ADD_TODO,
//     payload: todo,
//   });

//   localStorage.setItem('todos', JSON.stringify(getState().todos.todoList));
// };

// export const editTodo = (todo) => async (dispatch, getState) => {
//   dispatch({ type: ACTION_TYPES.SELECT_TODO_PROGRESS });

//   dispatch({
//     type: ACTION_TYPES.SELECT_TODO,
//     payload: todo,
//   });

//   localStorage.setItem('todos', JSON.stringify(getState().todos.todoList));
// };

export const removeTodo = (id) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.DELETE_TODO,
    payload: id,
  });

  //localStorage.setItem('todos', JSON.stringify(getState().todos.todoList));
};
