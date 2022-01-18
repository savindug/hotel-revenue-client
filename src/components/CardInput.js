import React from 'react';
import { CardElement } from '@stripe/react-stripe-js';
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      background: '#EEEEEE',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export default function CardInput() {
  return (
    <div className="bg-light p-3 container">
      <CardElement className="container " options={CARD_ELEMENT_OPTIONS} />
    </div>
  );
}
