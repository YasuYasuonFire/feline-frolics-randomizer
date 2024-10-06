import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRandomCat } from '../api/catApi';
import CatImage from '../components/CatImage';
import { useSwipeable } from 'react-swipeable';
import { Button } from "@/components/ui/button"
import FavoriteButton from '../components/FavoriteButton';
import { toggleFavorite } from '../utils/supabaseUtils';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [catDataList, setCatDataList] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);

  const fetchCats = useCallback(async () => {
    const cats = await Promise.all([getRandomCat(selectedMood), getRandomCat(selectedMood)]);
    console.log('Fetched cats:', cats);
    setKey(prevKey => prevKey + 1);
    setCatDataList(cats);
  }, [selectedMood]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fetchCats();
    }, 10000); // 10秒ごとに画像を更新
  }, [fetchCats]);

  const handleImageError = useCallback(() => {
    setRetryCount((prevCount) => prevCount + 1);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: fetchCats,
    onSwipedRight: fetchCats,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    fetchCats();
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectedMood, retryCount, fetchCats, resetTimer]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  const handleFavoriteToggle = async (catId) => {
    const newFavorites = { ...favorites };
    newFavorites[catId] = !newFavorites[catId];
    setFavorites(newFavorites);
    await toggleFavorite(catId, newFavorites[catId]);
    fetchCats();
    resetTimer(); // お気に入りボタンを押した後にタイマーをリセット
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Neko Snap
      </h1>

      <div {...handlers} className="w-full max-w-md mx-auto mb-4 rounded-lg overflow-hidden shadow-lg touch-pan-y">
        {catDataList.length === 0 ? (
          <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-xl text-gray-600">読み込み中...</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={key}
              className="flex justify-between"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {catDataList.map((catData, index) => (
                <div key={index} className="relative w-1/2 p-2">
                  {catData && catData.url ? (
                    <CatImage imageUrl={catData.url} onError={handleImageError} />
                  ) : (
                    <div className="w-full h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                      <p className="text-xl text-gray-600">画像が見つかりません</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      isFavorite={favorites[catData.id] || false}
                      onClick={() => handleFavoriteToggle(catData.id)}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
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