import { PayPalButtons } from '@paypal/react-paypal-js';
import React from 'react';

const REACT_API_BASE_URL = 'http://localhost:3003/api/v1';

const PayPalmentButton = ({ cart }) => {
  const createOrder = async () => {
    try {
      const response = await fetch(`${REACT_API_BASE_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      const orderData = await response.json();

      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error(`Could not initiate PayPal Checkout...<br><br>${error}`);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const response = await fetch(`${REACT_API_BASE_URL}/orders/${data.orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const orderData = await response.json();
      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === 'INSTRUMENT_DECLINED') {
        return actions.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else if (!orderData.purchase_units) {
        throw new Error(JSON.stringify(orderData));
      } else {
        const transaction =
          orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
          orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
        console.log(
          `Transaction ${transaction.status}: ${transaction.id}<br><br>See console for all available details`
        );
        console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));
      }
    } catch (error) {
      console.error(`Sorry, your transaction could not be processed...<br><br>${error}`);
    }
  };

  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
};

export default PayPalmentButton;
