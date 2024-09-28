import axios from 'axios';

const API_KEY = import.meta.env.VITE_CAT_API_KEY;
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
    
    if (response.data && response.data.length > 0) {
      return {
        id: response.data[0].id,
        url: response.data[0].url,
      };
    } else {
      throw new Error('No cat image found');
    }
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