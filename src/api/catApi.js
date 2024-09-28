import axios from 'axios';

const API_KEY = 'live_YOUR_API_KEY_HERE'; // Replace with your actual API key
const BASE_URL = 'https://api.thecatapi.com/v1';

export const getRandomCat = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/images/search`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });
    return response.data[0];
  } catch (error) {
    console.error('Error fetching cat image:', error);
    throw error;
  }
};