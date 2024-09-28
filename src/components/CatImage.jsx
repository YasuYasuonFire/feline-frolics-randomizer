import React, { useState } from 'react';

const CatImage = ({ imageUrl }) => {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <div className="w-full h-0 pb-[100%] relative overflow-hidden rounded-lg shadow-lg bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">画像が利用できません</p>
      </div>
    );
  }

  return (
    <div className="w-full h-0 pb-[100%] relative overflow-hidden rounded-lg shadow-lg">
      <img
        src={imageUrl}
        alt="ランダムな猫の画像"
        className="absolute top-0 left-0 w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default CatImage;