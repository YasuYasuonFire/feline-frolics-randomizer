import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { useSwipeable } from 'react-swipeable';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat', selectedMood, retryCount],
    queryFn: () => getRandomCat(selectedMood),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleImageError = useCallback(() => {
    setRetryCount((prevCount) => prevCount + 1);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: handleRefresh,
    onSwipedRight: handleRefresh,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      handleRefresh();
    }, 5000);

    return () => clearTimeout(timer);
  }, [handleRefresh]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Neko Snap
      </h1>

      <div {...handlers} className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">読み込み中...</p>
          </div>
        ) : isError ? (
          <div className="w-full h-64 md:h-96 bg-red-100 flex items-center justify-center">
            <p className="text-xl text-red-600">エラーが発生しました。再試行してください。</p>
          </div>
        ) : catData && catData.url ? (
          <CatImage imageUrl={catData.url} onError={handleImageError} />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">画像が見つかりません</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;