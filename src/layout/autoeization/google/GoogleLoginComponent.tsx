import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../AuthContext';

const GoogleLoginComponent: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    try {
      const response = await fetch("https://enddel.com/auth/google/callback", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      console.error('Error logging in with Google:', err);
      alert('Error logging in with Google');
    }
  };

  const handleFailure = () => {
    console.error('Google login failed');
    alert('Google login failed');
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google Client ID is not defined');
    return <div>Google Client ID is not defined</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleFailure}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
