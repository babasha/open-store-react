import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const GooglePayWrapper = styled.div`
  display: block;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  width: 100%;  // Обертка занимает 100% ширины экрана

  button {
    width: 100%;  // Кнопка занимает 100% ширины
    /* height: 50px; */
    max-width: 100%; // Максимальная ширина 100% экрана
    /* background-color: #000; */
    /* color: #fff; */
    /* border: none; */
    /* border-radius: 5px; */
    /* font-size: 16px; */
    /* cursor: pointer; */

    &:hover {
      background-color: #333;
    }

    &:active {
      background-color: #555;
    }
  }

  @media (max-width: 768px) {
    button {
      /* height: 45px;  // Меньшая высота для мобильных устройств */
      font-size: 14px; // Меньший шрифт для мобильных устройств
      display: block
    }
  }

  @media (max-width: 480px) {
    button {
      /* height: 40px;  // Еще меньше высота для маленьких экранов */
      font-size: 12px; // Меньший шрифт для небольших экранов
      padding: 0 10px;  // Добавляем внутренние отступы для мобильных устройств
    }
  }

  
`;

const GooglePayButton = ({ totalPrice }) => {
  const googlePayButtonRef = useRef(null);

  useEffect(() => {
    if (window.google) {
      initGooglePay();
    }
  }, []);

  const initGooglePay = () => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST', // Замените на 'PRODUCTION' для рабочей среды
    });

    const button = paymentsClient.createButton({
      onClick: onGooglePaymentButtonClicked,
    });

    // Добавляем кнопку только если она еще не была добавлена
    if (googlePayButtonRef.current && googlePayButtonRef.current.childElementCount === 0) {
      googlePayButtonRef.current.appendChild(button);
    }
  };

  const onGooglePaymentButtonClicked = () => {
    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST',
    });

    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentDataRequest.transactionInfo = getTransactionInfo();

    paymentsClient
      .loadPaymentData(paymentDataRequest)
      .then(function (paymentData) {
        // Обработка платежных данных
        processPayment(paymentData);
      })
      .catch(function (err) {
        console.error('Error loading payment data', err);
      });
  };

  const getGooglePaymentDataRequest = () => {
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [getBaseCardPaymentMethod()],
      merchantInfo: {
        merchantId: 'YOUR_MERCHANT_ID', // Замените на ваш merchantId
        merchantName: 'Enndel.com',
      },
      transactionInfo: getTransactionInfo(),
    };
    return paymentDataRequest;
  };

  const getBaseCardPaymentMethod = () => {
    return {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: getTokenizationSpecification(),
    };
  };

  const getTokenizationSpecification = () => {
    return {
      type: 'PAYMENT_GATEWAY',
      parameters: {
        gateway: 'example', // Замените на вашего платежного провайдера
        gatewayMerchantId: 'exampleGatewayMerchantId',
      },
    };
  };

  const getTransactionInfo = () => {
    return {
      currencyCode: 'GEL',
      totalPriceStatus: 'FINAL',
      totalPrice: totalPrice.toFixed(2),
    };
  };

  const processPayment = (paymentData) => {
    // Отправка paymentData на ваш сервер для обработки
    fetch('https://ваш-сервер.ком/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        console.log('Payment processed successfully', response);
      })
      .catch((error) => {
        console.error('Error processing payment', error);
      });
  };

  return <GooglePayWrapper ref={googlePayButtonRef}></GooglePayWrapper>;
};

export default GooglePayButton;
