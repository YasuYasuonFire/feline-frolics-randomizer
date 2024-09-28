import React from 'react';

const CatImage = ({ imageUrl }) => {
  return (
    <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-lg shadow-lg">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Random cat"
          className="w-full h-full object-cover absolute top-0 left-0"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </div>
  );
};

export default CatImage;