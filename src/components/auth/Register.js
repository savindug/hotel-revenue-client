import React, { useState, useContext } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import style from '../../styles/login.module.css';
import { firebaseAuth } from '../../providers/AuthProvider';

export const Register = (props) => {
  const [c_pwd, setCpwd] = useState(null);
  const [formError, setformError] = useState(null);

  const { handleSignup, userData, setUserData } = useContext(firebaseAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password.length >= 6) {
      if (userData.password === c_pwd) {
        await handleSignup();
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
    console.log(userData);
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // const getClasses = (e) => {
  //   console.log(`btn-class => ${e.target.className}`);
  // };

  return (
    <Container className={style.form_container_flex}>
      <div className={style.form_signin}>
        <img
          className="mb-4 mx-auto d-block"
          src="/docs/5.0/assets/brand/bootstrap-logo.svg"
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
              type="email"
              name="email"
              placeholder="Enter email"
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
            Register
          </Button>

          <Form.Group className="mt-3 text-center">
            <Link className="text-decoration-none" to="/login">
              Already an User?
            </Link>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
};
