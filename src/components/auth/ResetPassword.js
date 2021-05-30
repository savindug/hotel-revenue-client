import React, { useState, useContext, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import style from '../../styles/login.module.css';
import {
  getResetUserData,
  setUserpassword,
  forceLogOut,
} from '../../services/auth.service';

export const ResetPassword = ({ props }) => {
  const [userD, setUserD] = useState({
    _id: null,
    name: null,
    email: null,
  });

  const [resetLink, setResetLink] = useState(null);

  const [c_pwd, setCpwd] = useState(null);
  const [formError, setformError] = useState(null);

  const [userData, setUserData] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password.length >= 6) {
      if (userData.password === c_pwd) {
        console.log('userData', userData);
        await setUserpassword(userData);
        await forceLogOut();
        props.history.push('/');
      } else {
        setformError('*Password Confirmation Failed');
      }
    } else {
      setformError('*Password should be at least 6 characters');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // const getClasses = (e) => {
  //   console.log(`btn-class => ${e.target.className}`);
  // };

  useEffect(() => {
    const getUserToken = async () => {
      let search = window.location.search;
      let params = new URLSearchParams(search);
      const token = params.get('token');
      const _id = params.get('_id');
      setResetLink(params.get('token'));
      console.log(resetLink);
      await getResetUserData({
        _id: _id,
        reset_link: token,
      })
        .then((res) => {
          if (res != null) {
            console.log(res);
            setUserD(res);
            setUserData({
              _id: res._id,
              reset_link: resetLink,
            });
          }
        })
        .catch((err) => console.log(err));
    };

    getUserToken();
  }, []);

  return (
    <Container className={style.form_container_flex}>
      {' '}
      {userD._id != null && userD.name != null && userD.email != null ? (
        <div className={style.form_signin}>
          <img
            className="mb-4 mx-auto d-block"
            src="https://res.cloudinary.com/ratebuckets/image/upload/v1622351600/logo_ibwvbs.jpg"
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
            <Form.Label>Hello {userD.name},</Form.Label>
            <Form.Label className="text-muted">
              Please Fill following form to reset your account password.
            </Form.Label>
            <Form.Group className="mt-3" controlId="formPassword">
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formC_Password">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setCpwd(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              // onClick={(e) => getClasses(e)}
              className={'w-100 btn btn-lg btn-primary'}
            >
              Reset Password
            </Button>
          </Form>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
};
