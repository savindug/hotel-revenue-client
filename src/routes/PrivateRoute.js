import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Redirect, Route } from 'react-router';
import { LoadingOverlay } from '../components/UI/LoadingOverlay';
import {
  fetchMarkets,
  fetchRefreshDates,
} from '../redux/actions/cluster.actions';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, isLoggedIn, reports } = auth;
  const dispatch = useDispatch();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, markets, refreshDates } = getClusterDataSet;

  useEffect(() => {
    async function getMarkets() {
      await dispatch(fetchMarkets());
    }
    if (isLoggedIn) {
      getMarkets();
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    const getUserData = async () => {
      if (isLoggedIn && user.application.destinations.length > 0) {
        //console.log(`fetchRefreshDates(user.application.destinations[0].id)`);
        await dispatch(fetchRefreshDates(user.application.destinations[0].id));
      } else if (isLoggedIn && markets.length > 0) {
        //console.log(`fetchRefreshDates(markets[0].id)`);
        await dispatch(fetchRefreshDates(markets[0].id));
      }
    };
    getUserData();
  }, [isLoggedIn, dispatch, user, markets]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth_loading) {
          <LoadingOverlay show={auth_loading} />;
        } else {
          if (!isLoggedIn) {
            return <Redirect to="/login" />;
          } else if (
            isLoggedIn &&
            markets.length > 0 &&
            refreshDates.dates.length > 0 &&
            reports.length > 0
          ) {
            return <Component {...props} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
