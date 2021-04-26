import React, { useContext, useState } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import style from '../../styles/login.module.css';
import { firebaseAuth } from '../../providers/AuthProvider';
import { useDispatch } from 'react-redux';
import { customLogin } from '../../redux/actions/auth.actions';
import logo from '../../assets/imgs/logo/logo.jpg';

export const Login = (props) => {
  const { handleSignin, userData, setUserData } = useContext(firebaseAuth);
  const dispatch = useDispatch();
  const [formError, setformError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // await handleSignin();
    if (
      userData.email === 'ratebuckets' &&
      userData.password === 'b0EPPj@N&j9b'
    ) {
      const result = await dispatch(
        customLogin(userData.email, userData.password)
      );
      // if (result) {
      //   props.history.push('/clusters');
      // }
    } else {
      setformError('* Invaild Credentials');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(userData);
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container className={style.form_container_flex}>
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
              value={userData.email}
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={userData.password}
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
    </Container>
  );
};
