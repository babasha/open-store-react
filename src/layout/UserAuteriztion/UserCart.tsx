import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoginFormComponent from './LoginFormComponent';
import ForgotPasswordComponent from './ForgotPasswordComponent';
import ResetPasswordComponent from './ResetPasswordComponent';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const LoginTitle = styled.h3`
  margin: 15px 0px 25px 5px;
  font-size: 22px;
`;

const LoginComponent: React.FC = () => {
  const { t } = useTranslation();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { token } = useParams<{ token: string }>();

  useEffect(() => {
    if (token) {
      setIsForgotPassword(false);
      setIsResetPassword(true);
    }
  }, [token]);

  return (
    <div>
      <LoginTitle>{t('titlelogin')}</LoginTitle>
      {!isResetPassword ? (
        !isForgotPassword ? (
          <LoginFormComponent setIsForgotPassword={setIsForgotPassword} />
        ) : (
          <ForgotPasswordComponent setIsForgotPassword={setIsForgotPassword} />
        )
      ) : (
        <ResetPasswordComponent />
      )}
    </div>
  );
};

export default LoginComponent;
