import React, { useState, useEffect } from 'react';

const CatImage = ({ imageUrl, onError }) => {
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  useEffect(() => {
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  const handleImageError = () => {
    onError();
  };

  return (
    <div className="w-full h-0 pb-[100%] relative overflow-hidden rounded-lg shadow-lg">
      <img
        src={currentImageUrl}
        alt="ランダムな猫の画像"
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={handleImageError}
      />
    </div>
  );
};

export default CatImage;