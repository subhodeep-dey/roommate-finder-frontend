import axios from 'axios';

const verifyEmail = async (emailToken) => {
  try {
    const response = await axios.post('https://roommate-finder-theta.vercel.app/auth/verify-email', {
      emailToken: emailToken
    });

    // Handle the response here
    console.log(response.data);
  } catch (error) {
    // Handle errors here
    console.error(error);
  }
};

const postRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

export { verifyEmail, postRequest };
