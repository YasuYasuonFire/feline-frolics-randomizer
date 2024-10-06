import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { useSwipeable } from 'react-swipeable';
import { Button } from "@/components/ui/button"
import FavoriteButton from '../components/FavoriteButton';
import { toggleFavorite, getFavoriteStatus } from '../utils/supabaseUtils';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [catDataList, setCatDataList] = useState([]); // 猫の画像リストを追加

  const { data: catData, refetch, isLoading, isError } = useQuery({
    queryKey: ['randomCat', selectedMood, retryCount],
    queryFn: () => getRandomCat(selectedMood),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 猫の画像を2つ取得するための新しい関数
  const fetchCats = useCallback(async () => {
    const cats = await Promise.all([getRandomCat(selectedMood), getRandomCat(selectedMood)]);
    console.log('Fetched cats:', cats); // デバッグ用
    setCatDataList(cats);
  }, [selectedMood]);

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
    fetchCats(); // 初回データ取得
  }, [selectedMood, retryCount]); // selectedMoodとretryCountが変わったときに再取得

  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    refetch();
  };

  useEffect(() => {
    if (catData && catData.id) {
      getFavoriteStatus(catData.id).then(setIsFavorite);
    }
  }, [catData]);

  const handleFavoriteToggle = async () => {
    if (catData && catData.id) {
      const success = await toggleFavorite(catData.id, isFavorite);
      if (success) {
        setIsFavorite(!isFavorite);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Neko Snap
      </h1>

      <div {...handlers} className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden shadow-lg touch-pan-y">
        {isLoading ? (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">読み込み中...</p>
          </div>
        ) : isError ? (
          <div className="w-full h-64 md:h-96 bg-red-100 flex items-center justify-center">
            <p className="text-xl text-red-600">エラーが発生しました。再試行してください。</p>
          </div>
        ) : catDataList.length > 0 ? ( // 画像リストがある場合
          <div className="flex justify-between">
            {catDataList.map((catData, index) => {
              console.log('Cat data:', catData); // デバッグ用
              return (
                <div key={index} className="relative w-1/2 p-2">
                  {catData && catData.url ? ( // catDataとurlの存在を確認
                    <CatImage imageUrl={catData.url} onError={handleImageError} />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                      <p className="text-xl text-gray-600">画像が見つかりません</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton isFavorite={isFavorite} onClick={() => handleFavoriteToggle(catData.id)} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">画像が見つかりません</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {['すべて', '子猫', 'かわいい', '強そう'].map((mood) => (
          <Button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            variant={selectedMood === mood ? "secondary" : "default"}
            className={`transition-all duration-200 ${
              selectedMood === mood
                ? 'bg-pink-500 text-white scale-105'
                : 'bg-pink-200 text-pink-800 hover:bg-pink-300'
            }`}
          >
            {mood}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Index;