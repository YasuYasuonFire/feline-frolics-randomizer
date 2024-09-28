import axios from 'axios';

const API_KEY = 'live_YOUR_API_KEY_HERE'; // Replace with your actual API key
const BASE_URL = 'https://api.thecatapi.com/v1';

export const getRandomCat = async (mood = '') => {
  try {
    let params = {};
    
    switch(mood) {
      case 'kitten':
        params.category_ids = 15;
        break;
      case 'cute':
        params.breed_ids = 'beng,ragd,sibe';
        break;
      case 'strong':
        params.breed_ids = 'mcoo,sava,bsho';
        break;
      case 'all':
      default:
        break;
    }

    const response = await axios.get(`${BASE_URL}/images/search`, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: params,
    });
    
    // Instead of returning the entire response data, return only the necessary information
    return {
      id: response.data[0].id,
      url: response.data[0].url,
    };
  } catch (error) {
    console.error('Failed to fetch cat image:', error);
    throw error;
  }
};

export const getCatBreeds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/breeds`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cat breeds:', error);
    throw error;
  }
};