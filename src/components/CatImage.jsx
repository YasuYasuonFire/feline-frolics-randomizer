import React from 'react';

const CatImage = ({ imageUrl }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Random cat"
          className="w-full h-auto rounded-lg shadow-lg mx-auto object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No image available</p>
        </div>
      )}
    </div>
  );
};

export default CatImage;