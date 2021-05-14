import React, { useContext, useEffect, useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import style from '../../styles/login.module.css';
import { firebaseAuth } from '../../providers/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import { customLogin, login, refresh } from '../../redux/actions/auth.actions';
import logo from '../../assets/imgs/logo/logo.jpg';
import { LoadingOverlay } from '../UI/LoadingOverlay';
import { checkAuthTokens } from '../../services/auth.service';

export const Login = (props) => {
  const USERNAME = 'ratebuckets';
  const PASSWORD = 'b0EPPj@N&j9b';

  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, isLoggedIn } = auth;

  const [userData, setUserData] = useState();
  const dispatch = useDispatch();
  const [formError, setformError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.email && userData.password) {
        const result = await dispatch(login(userData));
        //console.log(result);
        // if (result) {
        //   props.history.push('/');
        // }
      } else {
        setformError('Please fill out the Form');
      }
    } catch (error) {
      setformError('Please fill out the Form');
    }
  };

  useEffect(() => {
    async function refreshLogin() {
      if (await checkAuthTokens()) {
        dispatch(await refresh());
      }
    }
    if (isLoggedIn) {
      props.history.push('/');
    } else {
      refreshLogin();
    }
    if (auth_err !== null && auth_err !== undefined) {
      setformError(auth_err);
    }
  }, [isLoggedIn, auth_err]);

  // useEffect(() => {
  //   dispatch(customLogin(USERNAME, PASSWORD));
  // }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log(userData);
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className={style.form_container_flex}>
      {auth_loading ? (
        <LoadingOverlay show={auth_loading} />
      ) : (
        <div className={style.form_signin}>
          <img
            className="mb-4 mx-auto d-block"
            src={logo}
            alt=""
            width="72"
            height="57"
          />
          {formError !== null ? (
            <Alert variant={'danger'}>
              <Alert.Link href="">{formError}</Alert.Link>
            </Alert>
          ) : (
            <></>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter Username"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              // onClick={(e) => getClasses(e)}
              className={'w-100 btn btn-lg btn-primary'}
            >
              Login
            </Button>

            {/* <Form.Group className="mt-3 text-center">
          <Link className="text-decoration-none" to="/register">
            A New User?
          </Link>
        </Form.Group> */}
          </Form>
        </div>
      )}
    </Container>
  );
};
