import { combineReducers } from 'redux';
import clusterDataReducer from './cluster.reducer';
import authReducer from './auth.reducer';

export default combineReducers({
  clusterDataSet: clusterDataReducer,
  auth: authReducer,
});
