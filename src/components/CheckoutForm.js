import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import style from '../styles/stripeCheckout.module.css';
import { useHistory } from 'react-router';
import { configUser, setAuthLoading } from '../redux/actions/auth.actions';
import { useDispatch, useSelector } from 'react-redux';
import { apiURI } from '../env';
import { ButtonBase, Card, CardContent, TextField } from '@material-ui/core';
import CardInput from './CardInput';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
export default function CheckoutForm({
  cost,
  selectedProperty,
  selectedMarkets,
}) {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { user, auth_loading, auth_err, selectedUser } = auth;

  const history = useHistory();
  // State
  const [email, setEmail] = useState(selectedUser ? selectedUser.email : '');

  const handleSubmitPay = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await axios.post(`${apiURI}payment/pay`, {
      email: email,
      quantity: selectedProperty.length,
    });

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Money is in the bank!');
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

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
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      const res = await axios.post(`${apiURI}payment/sub`, {
        payment_method: result.paymentMethod.id,
        email: email,
        quantity: selectedProperty.length,
      });
      // eslint-disable-next-line camelcase
      const { client_secret, customer_id, status } = res.data;

      // console.log('client_secret: ' + client_secret);
      // console.log('customer_id: ' + customer_id);

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(async function (result) {
          if (result.error) {
            // console.log('There was an issue!');
            // console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            // console.log('You got the money! ' + JSON.stringify(result));
            // Show a success message to your customer
            await dispatch(
              configUser(selectedUser._id, selectedProperty, selectedMarkets)
            );
            history.push('/');
          }
        });
      } else {
        console.log('You got the money! ' + JSON.stringify(result));
        // No additional information was needed
        // Show a success message to your customer
        await dispatch(
          configUser(selectedUser._id, selectedProperty, selectedMarkets)
        );
        history.push('/');
      }
    }
  };

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }
    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      );
    }
  }, []);

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   window
  //     .fetch(`${apiURI}payment/create-checkout-session`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         quantity: selectedProperty.length,
  //         email: selectedUser.email,
  //       }),
  //     })
  //     .then((res) => {
  //       console.log(`res: ${JSON.stringify(res)}`);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setClientSecret(data.clientSecret);
  //       console.log(`clientSecret: ${JSON.stringify(data)}`);
  //     });
  // }, []);

  const cardStyle = {
    // style: {
    //   base: {
    //     color: '#32325d',
    //     fontFamily: 'Arial, sans-serif',
    //     fontSmoothing: 'antialiased',
    //     fontSize: '16px',
    //     '::placeholder': {
    //       color: '#32325d',
    //     },
    //   },
    //   invalid: {
    //     color: '#fa755a',
    //     iconColor: '#fa755a',
    //   },
    // },
  };

  const handleChange = async (event) => {
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
    }
  };

  return (
    <Card>
      <CardContent>
        <Row className="container my-3">
          <Col>
            <TextField
              label="Username"
              id="outlined-email-input"
              margin="normal"
              variant="outlined"
              type="email"
              required
              value={selectedUser ? selectedUser.name : ''}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              disabled
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            className="btn btn-primary  w-100"
            onClick={handleSubmitSub}
          >
            Subscribe
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="btn btn-secondary my-2  w-100"
            onClick={(e) => history.push('/')}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>

    // <form id="payment-form" onSubmit={handleSubmit}>
    //   <CardElement
    //     id="card-element"
    //     options={cardStyle}
    //     onChange={handleChange}
    //   />
    //   <button
    //     className="btn btn-primary my-2 w-100"
    //     disabled={processing || disabled || succeeded}
    //     id="submit"
    //   >
    //     <span id="button-text">
    //       {processing ? (
    //         <div className="spinner" id="spinner"></div>
    //       ) : (
    //         'Pay now'
    //       )}
    //     </span>
    //   </button>
    //   {/* Show any error that happens when processing the payment */}
    //   {error && (
    //     <div className="card-error" role="alert">
    //       {error}
    //     </div>
    //   )}
    //   {/* Show a success message upon completion */}
    // </form>
  );
}
