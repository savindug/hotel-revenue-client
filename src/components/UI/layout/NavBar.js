import React from 'react';
import { Navbar } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export const NavBar = () => {
  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, isLoggedIn } = auth;
  return (
    <Navbar>
      <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Signed in as: {isLoggedIn ? <a href="#login">user.name</a> : <></>}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
};
