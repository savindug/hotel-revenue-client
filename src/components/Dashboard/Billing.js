import { Card, Popover, TextField } from '@material-ui/core';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import { Box } from '@mui/system';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiURI, STRIPE_SECRET } from '../../env';
import { getReqHeaders } from '../../services/auth.service';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm';
import CardInput from '../CardInput';

export const Billing = () => {
  const auth = useSelector((state) => state.auth);
  const { user, reports } = auth;
  const [paymentMethods, setPaymentMethods] = useState(null);
  const stripePromise = loadStripe(STRIPE_SECRET);

  useEffect(() => {
    const getSubscriptionData = async (cus_id) => {
      let response = false;
      await axios
        .post(
          `http://localhost:5000/api/app/payment/customer-payment-methods`,
          { customer_id: cus_id },
          {
            headers: await getReqHeaders(),
          }
        )
        .then((result) => {
          const res = result.data;
          if (res.results) {
            const paymet_method = res.data[0];
            setPaymentMethods(paymet_method);
          }
        });
    };

    getSubscriptionData(user.subscription.renavalAt);
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'payment-method-update' : undefined;

  function PaymentMethodActionModal(props) {
    const [cardName, setCardName] = useState(null);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Payment Method
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Elements stripe={stripePromise}>
            <Card>
              <CardContent>
                <Row className="container my-5">
                  <Col>
                    <TextField
                      label="Name on the Card"
                      id="outlined-email-input"
                      margin="normal"
                      variant="outlined"
                      type="email"
                      required
                      value={''}
                      onChange={(e) => setCardName(e.target.value)}
                      fullWidth
                      disabled
                    />
                  </Col>
                </Row>

                <CardInput />
                <div className="container my-3">
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn btn-primary mt-5  w-100"
                    // onClick={handleSubmitSub}
                    onClick={props.onHide}
                  >
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Elements>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <div className="container">
        <PaymentMethodActionModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <div className="row">
          <div className="col-md-5">
            <Card>
              <CardActionArea>
                <CardContent>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Subscription Plan{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button className="btn btn-sm  btn-outline-primary">
                        Update
                      </button>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <Typography variant="body2" color="text.secondary">
                    <div class="page-header">
                      <div class="float-left">
                        <span class="badge badge-pill badge-success py-1">
                          Standard
                        </span>
                      </div>
                      <div class="float-right ">
                        <span className="text-dark font-weight-normal py-1">
                          {' '}
                          Property Subscription
                        </span>
                      </div>
                      <div class="clearfix"></div>
                      <br />
                      <div className="text-dark font-weight-normal my-1">
                        {' '}
                        Monthly Billing for subscribed properties{' '}
                      </div>
                    </div>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <br />
            <Card>
              <CardActionArea>
                <CardContent>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Payment Method{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button
                        aria-describedby={id}
                        className="btn btn-sm  btn-outline-primary"
                        onClick={handleClick}
                      >
                        Update
                      </button>

                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                      >
                        <>
                          <button
                            className="btn text-primary"
                            onClick={() => {
                              setModalShow(true);
                              setAnchorEl(null);
                            }}
                          >
                            Update Payment Method
                          </button>
                          <Divider />
                          <button
                            className="btn text-danger"
                            // onClick={() => {
                            //   setModalShow(true);
                            //   setAnchorEl(null);
                            // }}
                          >
                            Remove Payment Method
                          </button>
                        </>
                      </Popover>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <Typography variant="body2" color="text.secondary">
                    {paymentMethods != null ? (
                      <div class="page-header">
                        <div class="float-left">
                          <span class="badge badge-pill badge-light py-1">
                            Credit Card
                          </span>
                          <br />
                          <span class="badge badge-pill badge-light py-1">
                            Brand
                          </span>
                          <br />
                          <span class="badge badge-pill badge-light py-1">
                            Expires on
                          </span>
                        </div>
                        <div class="float-right ">
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            **** **** **** {paymentMethods.no}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 text-capitalize">
                            {' '}
                            {paymentMethods.brand}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            {paymentMethods.expiry}
                          </span>
                        </div>
                        <div class="clearfix"></div>
                      </div>
                    ) : (
                      <div className="text-dark font-weight-normal my-1">
                        {' '}
                        No associated payment methods{' '}
                      </div>
                    )}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-6">
            <Card>
              <CardActionArea>
                <CardContent>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Property Subscriptions{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button className="btn btn-sm  btn-outline-primary">
                        Update
                      </button>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <ListGroup as="ol" numbered>
                    {user.application.properties.length > 0 ? (
                      user.application.properties.map((prop, index) => (
                        <ListGroup.Item as="li">
                          <span>{prop.name}</span>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <></>
                    )}
                  </ListGroup>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
