import React from 'react';

const CatImage = ({ imageUrl, onError }) => {
  console.log('CatImage rendering with URL:', imageUrl); // デバッグ用

  return (
    <img
      src={imageUrl}
      alt="猫の画像"
      onError={onError}
      className="w-full h-auto object-cover"
      style={{ maxHeight: '400px' }}
    />
  );
};

export default CatImage;