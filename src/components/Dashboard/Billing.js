import { Card, Popover, TextField } from '@material-ui/core';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import AdjustOutlinedIcon from '@mui/icons-material/AdjustOutlined';
import { Box } from '@mui/system';
import { Button, Col, ListGroup, Modal, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { apiURI, STRIPE_SECRET } from '../../env';
import { getReqHeaders } from '../../services/auth.service';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm';
import CardInput from '../CardInput';
import countryList from 'react-select-country-list';
import ReactSelect from 'react-select';
import { event } from 'jquery';

export const Billing = () => {
  const auth = useSelector((state) => state.auth);
  const { user, reports } = auth;
  const [paymentMethods, setPaymentMethods] = useState([]);
  const stripePromise = loadStripe(STRIPE_SECRET);

  const [customerDetails, setCustomerDetails] = useState(null);

  const [fetchCustomerData, setFetchCustomerData] = useState(true);

  useEffect(() => {
    const getSubscriptionData = async (cus_id) => {
      await axios
        .post(
          `${apiURI}app/payment/customer-payment-methods`,
          { customer_id: cus_id },
          {
            headers: await getReqHeaders(),
          }
        )
        .then((result) => {
          const res = result.data;
          if (res.results) {
            const paymet_method = res.data;
            setPaymentMethods(paymet_method);
          }
        });
    };

    const getCustomerDetails = async (cus_id) => {
      await axios
        .post(
          `${apiURI}app/payment/getCustomer`,
          { customer_id: cus_id },
          {
            headers: await getReqHeaders(),
          }
        )
        .then((result) => {
          const res = result.data;
          if (res.results) {
            const customer = res.data;
            setCustomerDetails(customer);
          }
        });
    };

    if (
      user.subscription.renavalAt != undefined &&
      user.subscription.renavalAt != null &&
      fetchCustomerData
    ) {
      getSubscriptionData(user.subscription.renavalAt);
      getCustomerDetails(user.subscription.renavalAt);
      setFetchCustomerData(false);
    }
  }, [fetchCustomerData]);

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

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmitSub = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      const result = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          email: user.email,
          name: cardName,
        },
      });

      if (result.error) {
        // console.log(result.error.message);
      } else {
        await axios
          .post(
            `${apiURI}app/payment/updateCustomerPaymentMethod`,
            {
              payment_method: result.paymentMethod.id,
              cus_id: user.subscription.renavalAt,
            },
            {
              headers: await getReqHeaders(),
            }
          )
          .then((result) => {
            const res = result.data;
          });
      }
      props.onHide();
      setFetchCustomerData(true);
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            ${apiURI}app/yment Method
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <CardContent>
              <Row className="container my-5">
                <Col>
                  <TextField
                    label="Name on the Card"
                    id="outlined-email-input"
                    margin="normal"
                    variant="outlined"
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Email"
                    id="outlined-email-input"
                    margin="normal"
                    variant="outlined"
                    type="email"
                    required
                    value={user.email}
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
                  onClick={handleSubmitSub}
                  // onClick={props.onHide}
                >
                  Update Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function BillingDetailsModal(props) {
    const [userData, setUserData] = useState(props.customerDetails);

    const countryOptions = useMemo(() => countryList().getData(), []);

    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
      // console.log(`selectedCountry: ${selectedCountry}`);
      if (userData.address != null) {
        setSelectedCountry(countryList().getLabel(userData.address.country));
      }
    }, []);

    const handleCountryChange = (value) => {
      setSelectedCountry(value);
      setUserData({
        ...userData,
        address: {
          ...userData.address,
          country: value.value,
        },
      });
    };

    const resetForm = () => {
      setUserData(props.customerDetails);
      if (userData.address != null) {
        setSelectedCountry(countryList().getLabel(userData.address.country));
      } else {
        setSelectedCountry('');
      }
    };

    function handleInputsChange(evt) {
      const value = evt.target.value;
      const key = evt.target.name;

      if (String(key).includes('address')) {
        let address = {
          ...userData.address,
          [key.split('-')[1]]: value,
        };
        setUserData({
          ...userData,
          address: address,
        });
      } else {
        setUserData({
          ...userData,
          [evt.target.name]: value,
        });
      }
    }

    const handleUpdateBillingDetails = async (event) => {
      event.preventDefault();
      if (userData != null && userData != undefined) {
        await axios
          .post(
            `${apiURI}app/payment/updateCustomerBilling`,
            {
              ...userData,
              cus_id: user.subscription.renavalAt,
            },
            {
              headers: await getReqHeaders(),
            }
          )
          .then((result) => {
            const res = result.data;
            console.log(res);
          });
      }
      props.onHide();
      setFetchCustomerData(true);
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update Billing Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <CardContent>
              <form onSubmit={handleUpdateBillingDetails}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputName4">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputName4"
                      name="name"
                      value={userData.name}
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail4"
                      name="email"
                      value={userData.email}
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputCity">Phone No</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="inputCity"
                      name="phone"
                      pattern="[+]{1}[0-9]{11,14}"
                      value={userData.phone}
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputCity">Country</label>
                    <ReactSelect
                      id="inputState"
                      name="address-country"
                      placeholder={selectedCountry}
                      options={countryOptions}
                      onChange={(value) => handleCountryChange(value)}
                    ></ReactSelect>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">Address Line 1</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      name="address-line1"
                      value={
                        userData.address != undefined &&
                        userData.address != null
                          ? userData.address.line1
                          : ''
                      }
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress2">Address Line 2</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress2"
                      name="address-line2"
                      value={
                        userData.address != undefined &&
                        userData.address != null
                          ? userData.address.line2
                          : ''
                      }
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label htmlFor="inputCity">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputCity"
                      name="address-city"
                      value={
                        userData.address != undefined &&
                        userData.address != null
                          ? userData.address.city
                          : ''
                      }
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-4">
                    <label htmlFor="inputState">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputState"
                      name="address-state"
                      value={
                        userData.address != undefined &&
                        userData.address != null
                          ? userData.address.state
                          : ''
                      }
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                  <div className="form-group col-md-2">
                    <label htmlFor="inputZip">Zip</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputZip"
                      name="address-postal_code"
                      value={
                        userData.address != undefined &&
                        userData.address != null
                          ? userData.address.postal_code
                          : ''
                      }
                      onChange={handleInputsChange}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Update
                </button>
              </form>
            </CardContent>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-warning" onClick={resetForm}>
            Rest
          </Button>
          <Button className="btn btn-danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function PaymentMethodRemoveModal(props) {
    const [open, setOpen] = useState(false);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({});

    const handleRemovePaymentMethod = async (pm) => {
      setSelectedPaymentMethod(pm);
      handleClickOpen();
    };

    const removeSelectedPaymentMethod = async () => {
      await axios
        .post(
          `${apiURI}app/payment/removePaymentMethod`,
          {
            payment_method: selectedPaymentMethod.id,
            cus_id: user.subscription.renavalAt,
          },
          {
            headers: await getReqHeaders(),
          }
        )
        .then((result) => {
          handleClose();
        });

      props.onHide();
      setFetchCustomerData(true);
    };

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const ConfirmDialog = () => {
      return (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Remove Paymenth Method?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to Remove Payment Method **** **** ****{' '}
              {selectedPaymentMethod.no} from your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="btn btn-outline-primary" onClick={handleClose}>
              No
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={removeSelectedPaymentMethod}
              autoFocus
            >
              Yes
            </button>
          </DialogActions>
        </Dialog>
      );
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <ConfirmDialog />
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Remove Payment Method
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Typography
            variant="body2"
            color="text.secondary"
            className="container"
          >
            {paymentMethods.length > 0 ? (
              paymentMethods.map((pm) => (
                <div class="page-header">
                  <div class="float-left">
                    <span class="badge badge-pill badge-light py-1">
                      Credit Card
                    </span>
                    <br />
                    <span class="badge badge-pill badge-light py-1">Brand</span>
                    <br />
                    <span class="badge badge-pill badge-light py-1">
                      Expires on
                    </span>
                  </div>
                  <div class="float-right ">
                    <span className="text-dark font-weight-normal py-1 ">
                      {' '}
                      **** **** **** {pm.no}
                    </span>
                    <br />
                    <span className="text-dark font-weight-normal py-1 text-capitalize">
                      {' '}
                      {pm.brand}
                    </span>
                    <br />
                    <span className="text-dark font-weight-normal py-1 ">
                      {' '}
                      {pm.expiry}
                    </span>
                    <br />
                    <button
                      className="btn text-danger"
                      onClick={() => {
                        handleRemovePaymentMethod(pm);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <div class="clearfix"></div>

                  <hr />
                </div>
              ))
            ) : (
              <div className="text-dark font-weight-normal my-1">
                {' '}
                No associated Payment methods Available{' '}
              </div>
            )}
          </Typography>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-danger" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const [paymentModalShow, setPaymentModalShow] = useState(false);
  const [billingModalShow, setBillingModalShow] = useState(false);
  const [paymentRemoveModalShow, setPaymentRemoveModalShow] = useState(false);

  return (
    <div>
      <div className="container">
        <Elements stripe={stripePromise}>
          <PaymentMethodActionModal
            show={paymentModalShow}
            onHide={() => setPaymentModalShow(false)}
          />{' '}
        </Elements>
        <PaymentMethodRemoveModal
          show={paymentRemoveModalShow}
          onHide={() => setPaymentRemoveModalShow(false)}
        />
        {customerDetails != null ? (
          <BillingDetailsModal
            show={billingModalShow}
            customerDetails={customerDetails}
            onHide={() => setBillingModalShow(false)}
          />
        ) : (
          <></>
        )}
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
                              setPaymentModalShow(true);
                              setAnchorEl(null);
                            }}
                          >
                            ${apiURI}app/yment Method
                          </button>
                          <Divider />
                          <button
                            className="btn text-danger"
                            onClick={() => {
                              setPaymentRemoveModalShow(true);
                              setAnchorEl(null);
                            }}
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
                    {paymentMethods.length > 0 ? (
                      paymentMethods.map((pm) => (
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
                              **** **** **** {pm.no}
                            </span>
                            <br />
                            <span className="text-dark font-weight-normal py-1 text-capitalize">
                              {' '}
                              {pm.brand}
                            </span>
                            <br />
                            <span className="text-dark font-weight-normal py-1 ">
                              {' '}
                              {pm.expiry}
                            </span>
                          </div>
                          <div class="clearfix"></div>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <div className="text-dark font-weight-normal my-1">
                        {' '}
                        No associated Payment methods Available{' '}
                      </div>
                    )}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <br />
            <Card>
              <CardActionArea>
                <CardContent style={{ cursor: 'pointer' }}>
                  <div class="page-header">
                    <div class="float-left">
                      <Typography gutterBottom variant="h5">
                        Billing Details{' '}
                      </Typography>
                    </div>
                    <div class="float-right">
                      <button
                        className="btn btn-sm  btn-outline-primary"
                        onClick={() => {
                          setBillingModalShow(true);
                          setAnchorEl(null);
                        }}
                      >
                        Update
                      </button>
                    </div>
                    <div class="clearfix"></div>
                  </div>
                  <Divider className="my-2" />
                  <Typography variant="body2" color="text.secondary">
                    {customerDetails != null ? (
                      <div class="page-header">
                        <div class="float-left">
                          <span class="badge badge-pill badge-light py-1">
                            Name
                          </span>
                          <br />
                          <span class="badge badge-pill badge-light py-1">
                            Email
                          </span>
                          <br />
                          <span class="badge badge-pill badge-light py-1">
                            Phone
                          </span>
                          <br />
                          <span class="badge badge-pill badge-light py-1">
                            Address
                          </span>
                        </div>
                        <div class="float-right  text-right">
                          <span className="text-dark font-weight-normal py-1">
                            {' '}
                            {customerDetails.name != null
                              ? customerDetails.name
                              : '-'}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            {customerDetails.email != null
                              ? customerDetails.email
                              : '-'}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            {customerDetails.phone != null
                              ? customerDetails.phone
                              : '-'}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            {customerDetails.address != null
                              ? `${customerDetails.address.line1} ${customerDetails.address.line2}`
                              : '-'}
                          </span>
                          <br />
                          <span className="text-dark font-weight-normal py-1 ">
                            {' '}
                            {customerDetails.address != null
                              ? `${customerDetails.address.city} ${customerDetails.address.state} ${customerDetails.address.postal_code} ${customerDetails.address.country}`
                              : '-'}
                          </span>
                        </div>
                        <div class="clearfix"></div>
                      </div>
                    ) : (
                      <div className="text-dark font-weight-normal my-1">
                        {' '}
                        No associated Billing Details Available{' '}
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
