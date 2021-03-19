import { combineReducers } from 'redux';
import clusterDataReducer from './cluster.reducer';

export default combineReducers({
  clusterDataSet: clusterDataReducer,
});
