import axios from 'axios';

const API_KEY = 'live_YOUR_API_KEY_HERE'; // 実際のAPIキーに置き換えてください
const BASE_URL = 'https://api.thecatapi.com/v1';

export const getRandomCat = async (mood = '') => {
  try {
    let params = {};
    
    switch(mood) {
      case 'kitten':
        params.category_ids = 15; // 子猫のカテゴリID
        break;
      case 'cute':
        params.breed_ids = 'beng,ragd,sibe'; // かわいい猫の品種ID（例：ベンガル、ラグドール、シベリアン）
        break;
      case 'strong':
        params.breed_ids = 'mcoo,sava,bsho'; // たくましい猫の品種ID（例：メインクーン、サバンナ、ブリティッシュショートヘア）
        break;
      case 'all':
      default:
        // パラメータなし（すべての猫）
        break;
    }

    const response = await axios.get(`${BASE_URL}/images/search`, {
      headers: {
        'x-api-key': API_KEY,
      },
      params: params,
    });
    return response.data[0];
  } catch (error) {
    console.error('猫の画像の取得に失敗しました:', error);
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
    console.error('猫の品種の取得に失敗しました:', error);
    throw error;
  }
};