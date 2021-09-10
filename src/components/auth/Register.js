import React, { useState, useContext, useEffect } from 'react';
import { Badge, Card, Col, Container, FormLabel, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import style from '../../styles/login.module.css';
import { firebaseAuth } from '../../providers/AuthProvider';
import * as Yup from 'yup';
import logo from '../../assets/imgs/logo/logo.jpg';
import { useDispatch, useSelector } from 'react-redux';
import {
  configUser,
  register,
  setSelectedUser,
} from '../../redux/actions/auth.actions';
import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Select,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  fetchHotelsList,
  fetchMarkets,
} from '../../redux/actions/cluster.actions';
import { LoadingOverlay } from '../UI/LoadingOverlay';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm';
import { STRIPE_SECRET } from '../../env';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const promise = loadStripe(STRIPE_SECRET);

export const Register = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const getClusterDataSet = useSelector((state) => state.clusterDataSet);
  const { loading, err, hotelList, markets } = getClusterDataSet;

  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, selectedUser, isLoggedIn } = auth;

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();
  const [selectedProperty, setSelectedProperty] = useState([]);
  const [selectedPropertyIndx, setSelectedPropertyIndx] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState();
  const [selectedMarketIndx, setSelectedMarketIndx] = useState();
  const [selectedMarkets, setSelectedMarkets] = useState([]);

  const [cost, setCost] = useState(0);

  const [newUser, setNewUser] = useState();

  useEffect(() => {
    async function getMarkets() {
      await dispatch(fetchMarkets());
    }
    getMarkets();
  }, [dispatch]);

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleMarketChange = (event) => {
    if (event.target.value >= 0) {
      const newMarket = markets[event.target.value];
      setSelectedMarket(newMarket.id);
      setSelectedMarketIndx(event.target.value);

      if (selectedMarkets.length > 0) {
        let isAvailable = selectedMarkets.find((e) => e.id === newMarket.id);

        if (isAvailable === undefined) {
          setSelectedMarkets((arr) => [...arr, newMarket]);
        }
      } else {
        setSelectedMarkets((arr) => [...arr, newMarket]);
      }
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  // const getClasses = (e) => {
  //   console.log(`btn-class => ${e.target.className}`);
  // };

  useEffect(() => {
    if (selectedUser !== null && selectedUser !== undefined) {
      setActiveStep(1);
    }
  }, [dispatch, selectedUser]);

  useEffect(() => {
    async function getHotelList() {
      await dispatch(fetchHotelsList(selectedMarket));
    }
    if (selectedMarket !== undefined) {
      getHotelList();
    }
  }, [dispatch, selectedMarket]);

  const RegisterForm = () => {
    const [formError, setformError] = useState(null);

    const [userData, setUserData] = useState();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
      e.preventDefault();
      userData.role = 'user';
      try {
        if (
          userData.name &&
          userData.email &&
          userData.password &&
          userData.password2 &&
          userData.role
        ) {
          if (userData.password.length >= 6) {
            if (userData.password === userData.password2) {
              dispatch(await register(userData));
              handleNext();
            } else {
              setformError('Password Confirmation Failed');
            }
          } else {
            setformError('Password should be at least 6 characters');
          }
        } else {
          setformError('Please fill out the Form');
        }
      } catch (error) {
        setformError('Please fill out the Form');
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setUserData((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <div className={style.form_signin}>
        {/* <img
          className="mb-4 mx-auto d-block"
          src={logo}
          alt=""
          width="72"
          height="57"
        /> */}
        {formError !== null ? (
          <Alert severity="error">{formError}</Alert>
        ) : (
          <></>
        )}
        <Form onSubmit={handleSubmit}>
          <FormGroup controlId="formName" className="my-3">
            <InputLabel htmlFor="grouped-native-select">Name</InputLabel>
            <Form.Control type="text" name="name" onChange={handleChange} />
          </FormGroup>

          <FormGroup controlId="formEmail" className="mb-3">
            <InputLabel htmlFor="grouped-native-select">Email</InputLabel>
            <Form.Control type="email" name="email" onChange={handleChange} />
          </FormGroup>

          <FormGroup controlId="formPassword" className="mb-2">
            <InputLabel htmlFor="grouped-native-select">Password</InputLabel>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup controlId="formC_Password" className="mb-3">
            <InputLabel htmlFor="grouped-native-select">
              Confirm Password
            </InputLabel>
            <Form.Control
              type="password"
              name="password2"
              onChange={handleChange}
            />
          </FormGroup>

          {/* <FormGroup className="mb-3">
            <FormControl>
              <InputLabel htmlFor="grouped-native-select">User Role</InputLabel>
              <Select
                native
                defaultValue=""
                name="role"
                id="grouped-native-select"
                onChange={handleChange}
              >
                <option value=""></option>
                {isLoggedIn ? (
                  ((<option value="admin">Admin</option>),
                  (<option value="manager">Manager</option>))
                ) : (
                  <></>
                )}
                <option value="user">User</option>
              </Select>
            </FormControl>
          </FormGroup> */}

          <Button
            variant="primary"
            type="submit"
            // onClick={(e) => e.preventDefault()}
            className={'w-100 btn btn-lg btn-primary'}
          >
            Register
          </Button>
        </Form>
      </div>
    );
  };

  function getSteps() {
    return ['Create Account', 'Configure Account', 'Complete Account'];
  }

  const handlePropertyChange = (event) => {
    const newHotel = hotelList[event.target.value];
    setSelectedPropertyIndx(event.target.value);
    if (selectedProperty.length > 0) {
      let isAvailable = selectedProperty.find((e) => e.id === newHotel.id);

      if (isAvailable === undefined) {
        setSelectedProperty((arr) => [...arr, newHotel]);
      } else {
      }
    } else {
      setSelectedProperty((arr) => [...arr, newHotel]);
    }
  };

  const removeSelectedProperty = (id) => {
    let updatedArr = [...selectedProperty];

    updatedArr = updatedArr.filter(function (item) {
      return item.id !== id;
    });
    setSelectedProperty(updatedArr);
  };

  const removeSelectedMarket = (id) => {
    let updatedArr = [...selectedMarkets];

    updatedArr = updatedArr.filter(function (item) {
      return item.id !== id;
    });

    setSelectedMarkets(updatedArr);
  };

  const handleConfigureSubmit = async (e) => {
    e.preventDefault();
    setNewUser(selectedUser);
    setActiveStep(2);
  };

  useEffect(() => {
    const handleCost = () => {
      if (selectedProperty.length > 0) {
        setCost(parseFloat(selectedProperty.length * 119.0).toFixed(2));
      } else {
        setCost(0);
      }
    };
    handleCost();
  }, [selectedProperty]);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Container>
            <RegisterForm />
          </Container>
        );
      case 1:
        return (
          <Container>
            <Form onSubmit={handleConfigureSubmit}>
              <FormGroup className={classes.formControl + ' my-5'}>
                <FormLabel htmlFor="grouped-native-select">
                  Select Destinations
                </FormLabel>
                <FormControl className={classes.formControl + ' mb-5'}>
                  <InputLabel htmlFor="grouped-native-select">
                    Destination
                  </InputLabel>
                  <Select
                    native
                    defaultValue=""
                    id="grouped-native-select"
                    onChange={handleMarketChange}
                    value={selectedMarketIndx}
                  >
                    <option value={-100}>None</option>
                    {markets.length > 0 ? (
                      markets.map((d, index) => {
                        return <option value={index}>{d.name}</option>;
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                  <Box component="span" m={1}>
                    {selectedMarkets.length > 0 ? (
                      selectedMarkets.map((h, ind) => (
                        <Badge
                          variant="secondary"
                          className="mx-1 pe-auto"
                          style={{ fontSize: 12 }}
                        >
                          {h.name} &nbsp;
                          <i
                            class="fas fa-times-circle"
                            onClick={() => removeSelectedMarket(h.id)}
                          ></i>
                        </Badge>
                      ))
                    ) : (
                      <></>
                    )}
                  </Box>
                </FormControl>
                <FormLabel htmlFor="grouped-native-select">
                  Select Properties
                </FormLabel>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="grouped-native-select">Hotel</InputLabel>
                  <Select
                    native
                    defaultValue=""
                    id="grouped-native-select"
                    onChange={handlePropertyChange}
                    value={selectedPropertyIndx}
                  >
                    {hotelList.length > 0 ? (
                      hotelList.map((h, index) => {
                        return <option value={index}>{h.name}</option>;
                      })
                    ) : (
                      <></>
                    )}
                  </Select>
                  <FormLabel className="mt-5" htmlFor="grouped-native-select">
                    Selected Properties
                  </FormLabel>
                  <Box component="span" m={1}>
                    {selectedProperty.length > 0 ? (
                      (selectedProperty.length + ' Properties',
                      selectedProperty.map((h, ind) => (
                        <Badge
                          variant="secondary"
                          className="mx-1 pe-auto"
                          style={{ fontSize: 12 }}
                        >
                          {h.name} &nbsp;
                          <i
                            class="fas fa-times-circle"
                            onClick={() => removeSelectedProperty(h.id)}
                          ></i>
                        </Badge>
                      )))
                    ) : (
                      <></>
                    )}
                  </Box>
                </FormControl>

                <p className="my-2">
                  Please Note that you will charge USD 119.00 monthly for each
                  Property you have selected
                </p>

                <Button
                  variant="primary"
                  type="submit"
                  className={'btn btn-md btn-primary my-5'}
                >
                  Proceed Monthly Subscription of $ {cost}
                </Button>
              </FormGroup>
            </Form>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Form>
              {' '}
              <Card className="container my-5">
                <Card.Body>
                  <Card.Title>
                    <Row>
                      <Col md={6}>Subscription Details</Col>
                      <Col md={3}></Col>
                      <Col md={3}>
                        <Button
                          variant="primary"
                          type="submit"
                          onClick={(e) => setActiveStep(1)}
                          className={'btn btn-sm btn-primary'}
                        >
                          Edit
                        </Button>
                      </Col>
                    </Row>
                  </Card.Title>
                  <Card.Text>
                    {selectedProperty.map((h, ind) => (
                      <Row>
                        <Col md={6}>{h.name}</Col>
                        <Col md={3}>$119.00</Col>
                        <Col md={3}>Monthly Subscription</Col>
                      </Row>
                    ))}
                  </Card.Text>
                  <hr></hr>
                  <Card.Subtitle className="mb-2 text-muted">
                    <Row>
                      <Col md={6}>Total</Col>
                      <Col md={3}>
                        $
                        {parseFloat(selectedProperty.length * 119.0).toFixed(2)}
                      </Col>
                      <Col md={3}>Monthly Subscription</Col>
                    </Row>
                  </Card.Subtitle>
                </Card.Body>
              </Card>
              <Elements stripe={promise}>
                <CheckoutForm
                  cost={cost}
                  selectedProperty={selectedProperty}
                  selectedMarkets={selectedMarkets}
                />
              </Elements>
              {/* <Button
                variant="primary"
                type="submit"
                onClick={(e) => props.history.push('/')}
                className={'btn btn-md btn-primary my-5'}
              >
                Finish
              </Button> */}
            </Form>
          </Container>
        );
      default:
        return 'Unknown step';
    }
  }

  const HorizontalLinearStepper = () => {
    return (
      <div className={classes.root}>
        <>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};

              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&apos;re finished
                </Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>{getStepContent(activeStep)}</div>
            )}
          </div>
        </>
      </div>
    );
  };

  return (
    <>
      <Container className={style.form_container_flex}>
        {loading || auth_loading ? (
          <LoadingOverlay show={loading || auth_loading} />
        ) : (
          <HorizontalLinearStepper />
        )}
      </Container>
    </>
  );
};
