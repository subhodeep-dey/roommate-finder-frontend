import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { postRequest } from './authRequests.js';

const VerifyEmail = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailToken = searchParams.get('emailToken');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!emailToken) {
          throw new Error('Email token not found');
        }

        const baseUrl = 'https://roommate-finder-theta.vercel.app';
        const response = await postRequest(`${baseUrl}/auth/verify-email`, {
          emailToken: emailToken
        });

        setIsLoading(false);

        if (response.error) {
          setError(response.error);
        } else {
          // Handle success, e.g., redirect to a success page or show a success message
          console.log('Email verified successfully');
        }
      } catch (error) {
        setIsLoading(false);
        setError(error.message);
      }
    };

    verifyEmail();
  }, [emailToken]);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && error && <p>Error: {error}</p>}
      {!isLoading && !error && <p>Email verified successfully!</p>}
    </div>
  );
};

export default VerifyEmail;
