import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

export const AlertModel = ({ text, varient }) => {
  const [visibleAlert, setVisibleAlert] = useState(false);

  useEffect(() => {
    const handleVisible = () => {
      setVisibleAlert(true);
      setTimeout(() => {
        setVisibleAlert(false);
      }, 5000);
    };
    handleVisible();
  }, []);

  return (
    <Alert show={visibleAlert} variant={varient} dismissible>
      <Alert.Link className="text-decoration-none">{text}</Alert.Link>
    </Alert>
  );
};
