import axios from 'axios';

const API_KEY = import.meta.env.VITE_CAT_API_KEY;
const BASE_URL = 'https://api.thecatapi.com/v1';

export const getRandomCat = async (breedIds = '') => {
  try {
    let params = {
      has_breeds: 1, // breeds情報を含む画像のみを取得
    };
    
    if (breedIds) {
      params.breed_ids = breedIds;
    }

    console.log('API Request params:', params);

    const response = await axios.get(`${BASE_URL}/images/search`, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: params,
    });
    
    if (response.data && response.data.length > 0) {
      console.log('API Response:', response.data[0]);
      return {
        id: response.data[0].id,
        url: response.data[0].url,
        breeds: response.data[0].breeds,
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

export const getCatBreedsByImageId = async (imageId) => {
  try {
    const response = await axios.get(`${BASE_URL}/images/${imageId}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });
    
    console.log('API Response for image breeds:', response.data);
    
    if (response.data && response.data.breeds) {
      return response.data.breeds;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch cat breeds for image:', error);
    throw error;
  }
};