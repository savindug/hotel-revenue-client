import React from 'react';
import { useSelector } from 'react-redux';

import { Redirect, Route } from 'react-router';
import { LoadingOverlay } from '../components/UI/LoadingOverlay';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = useSelector((state) => state.auth);
  const { auth_loading, isLoggedIn } = auth;
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth_loading) {
          <LoadingOverlay show={auth_loading} />;
        } else {
          if (!isLoggedIn) {
            return <Redirect to="/login" />;
          } else {
            return <Component {...props} />;
          }
        }
      }}
    />
  );
};

export default PrivateRoute;
